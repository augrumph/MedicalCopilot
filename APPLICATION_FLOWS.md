# Fluxos da Aplicação e Arquitetura Técnica

Este documento detalha os fluxos de interação do MedicalCopilot, com foco na arquitetura técnica, gerenciamento de estado e integração com a OpenAI API.

## 1. Visão Geral da Arquitetura

A aplicação segue uma arquitetura **Client-Side** (React + Vite) com gerenciamento de estado global via **Zustand**. A inteligência é provida por chamadas à **OpenAI API** (atualmente simuladas via `mockApi.ts` e `AIChatPanel.tsx`, mas projetadas para integração real).

*   **Frontend**: React, TypeScript, TailwindCSS, ShadcnUI.
*   **State Management**: Zustand (`appStore.ts`, `appointmentStore.ts`) com persistência local.
*   **AI Engine**: OpenAI API (`gpt-4-turbo` ou `gpt-3.5-turbo`) para processamento de linguagem natural.

---

## 2. Fluxos Detalhados

### Fluxo 1: Inicialização e Contexto (Medical vs Psychology)
**Objetivo**: Configurar a UI e a lógica de negócios com base na especialidade do profissional.

1.  **Ação do Usuário**: Login / Acesso à aplicação.
2.  **Processo Técnico**:
    *   O `appStore` carrega o `appContext` ('medical' ou 'psychology').
    *   O componente `AppSidebar` e `AppNavbar` consomem `getContextConfig(appContext)` para renderizar rótulos corretos (ex: "Pacientes" vs "Clientes").
    *   **Por que**: Permite reutilizar a mesma base de código para diferentes verticais de saúde, alterando apenas a configuração semântica.

---

### Fluxo 2: A Consulta em Tempo Real (Core Loop)
**Objetivo**: Assistir o médico *durante* o atendimento com transcrição e insights ativos.

#### Etapa 2.1: Captura e Transcrição
1.  **Ação**: Médico clica em "Iniciar Consulta" (`ConsultationPage.tsx`).
2.  **Estado**: `isListening` torna-se `true`.
3.  **Processo Técnico**:
    *   **Atual**: Um `setInterval` simula a chegada de texto (`mockTranscriptParts`).
    *   **Futuro (Real)**: Web Speech API ou integração com WebSocket para serviço de STT (Speech-to-Text) como OpenAI Whisper.
    *   O texto é acumulado no estado `currentConsultation.transcript` no `appStore`.

#### Etapa 2.2: Loop de Análise da IA (OpenAI Integration)
**Objetivo**: Analisar o texto conforme ele chega e gerar insights proativos.

1.  **Gatilho**: O `useEffect` em `AIChatPanel.tsx` detecta mudança no `transcript`.
2.  **Debounce**: Aguarda pausa na fala (ex: 1.5s) para não chamar a API excessivamente.
3.  **Chamada de API (Lógica de Integração)**:
    *   **Endpoint**: `POST https://api.openai.com/v1/chat/completions`
    *   **Modelo**: `gpt-4-turbo` (para maior precisão clínica).
    *   **System Prompt**:
        ```text
        Você é um assistente médico experiente. Analise o fragmento da consulta.
        Retorne um JSON com:
        - type: 'risk' | 'question' | 'diagnosis'
        - content: O insight curto e direto.
        - priority: 'high' | 'medium' | 'low'
        ```
    *   **User Prompt**: O fragmento recente da transcrição + Contexto do paciente (alergias, condições prévias).
4.  **Resposta e Renderização**:
    *   A resposta JSON é parseada.
    *   Novos itens são adicionados ao array `messages` do `AIChatPanel`.
    *   **UI**: Cards coloridos aparecem na lateral (Vermelho para riscos, Azul para perguntas).

---

### Fluxo 3: Geração de Nota Clínica (SOAP)
**Objetivo**: Transformar a conversa desestruturada em um documento médico formal.

1.  **Ação**: Médico clica em "Gerar Nota Clínica".
2.  **Processo Técnico**:
    *   O sistema captura todo o `currentConsultation.transcript`.
    *   **Chamada OpenAI**:
        *   **Prompt**: "Gere uma nota clínica no formato SOAP (Subjetivo, Objetivo, Avaliação, Plano) baseada na seguinte transcrição: [TRANSCRIPT]. O paciente é [DADOS_PACIENTE]."
    *   A API retorna o texto formatado em Markdown.
3.  **Resultado**:
    *   O texto é inserido no editor de notas (`doctorNotes` no `appStore`).
    *   O médico pode editar antes de salvar.
    *   **Por que**: Economiza cerca de 5-10 minutos por consulta de digitação manual.

---

### Fluxo 4: Apoio à Decisão (Diagnóstico e Prescrição)
**Objetivo**: Validar hipóteses e agilizar a prescrição.

#### 4.1 Hipóteses Diagnósticas
1.  **Gatilho**: Aba "Diagnóstico" é acessada ou transcrição atinge volume suficiente.
2.  **Processo**:
    *   A IA analisa os sintomas relatados (`transcript`).
    *   Cruza com dados do paciente (Idade, Sexo).
    *   Retorna lista de diagnósticos prováveis com % de confiança.
3.  **UI**: Exibição de cards com "Evidências Clínicas" (quais sintomas suportam a hipótese) e "Raciocínio" (explicação da IA).

#### 4.2 Prescrição Inteligente
1.  **Gatilho**: Diagnóstico selecionado ou sugerido.
2.  **Processo**:
    *   A IA sugere medicamentos baseados em protocolos padrão para aquele diagnóstico.
    *   **Verificação de Segurança**: A IA verifica automaticamente contra a lista de `allergies` e `medications` (uso contínuo) do paciente no `appStore`.
    *   **Alerta**: Se houver interação, um card de `AlertTriangle` é gerado.

---

### Fluxo 5: Agendamento e Timeline (AppointmentPage)
**Objetivo**: Gestão visual do fluxo de trabalho.

1.  **Carregamento**:
    *   Ao abrir a página, `AppointmentPage` busca agendamentos do `appointmentStore`.
    *   Filtra por data (`today`) e ordena por horário.
2.  **Visualização (Timeline)**:
    *   Lógica de comparação de horário (`isCurrent`) destaca o agendamento atual.
    *   Usa `framer-motion` para animar a entrada dos cards.
3.  **Ação**:
    *   Clicar em "Consultar" dispara `startConsultation(patient)` no `appStore`.
    *   Isso inicializa o estado da consulta e redireciona para `/consultation`.

---

## 3. Estrutura de Dados (Zustand Stores)

### `appStore`
Armazena o estado global da sessão clínica.
*   `user`: Dados do médico logado.
*   `patients`: Lista de pacientes (cache local).
*   `currentConsultation`:
    *   `transcript`: String (acumulativo).
    *   `aiSuggestions`: Objeto (perguntas, diagnósticos).
    *   `status`: 'in_progress' | 'finished'.

### `appointmentStore`
Armazena a agenda.
*   `appointments`: Lista de agendamentos.
    *   `status`: 'scheduled' | 'confirmed' | 'completed'.
    *   `patientId`: Link para o paciente no `appStore`.

## 4. Considerações de Segurança e Performance
*   **Dados Sensíveis**: Na implementação real, dados de pacientes (PII) devem ser anonimizados antes de enviar para a OpenAI, ou deve-se usar uma instância Enterprise com contrato de BAA (Business Associate Agreement).
*   **Latência**: O uso de `stream: true` na API da OpenAI é recomendado para que o texto apareça gradualmente, melhorando a percepção de velocidade.
