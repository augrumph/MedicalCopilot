# Plano de Modernização Frontend: Medical Copilot

Este documento descreve o roteiro estratégico para elevar o nível do frontend da aplicação, focando em **Estética Premium**, **Alta Performance** (para grandes volumes de dados) e **Experiência de Uso Fluida**.

**Objetivo:** Transformar a interface atual em uma ferramenta clínica de elite, onde a informação é densa mas legível, e as interações são imediatas e prazerosas.

---

## 1. Arquitetura e DX (Fundação)

Antes de embelezar, precisamos garantir que a casa aguente o peso.

### 1.1 Padronização de Imports e Estrutura
- **Feature-First Architecture:** Reforçar a organização por domínio e não por tipo técnico.
  - *Atual:* `src/components`, `src/pages`
  - *Proposto:* `src/features/consultation`, `src/features/patients` (onde cada pasta contém seus componentes, hooks, e stores específicos).
- **Barrel Exports:** Simplificar imports com `index.ts` em cada diretório de feature.
- **Strict Typing:** Ativar `noImplicitAny` e `strictNullChecks` se não estiverem rigorosos, garantindo robustez.

### 1.2 Tooling Performático
- **Bundle Analysis:** Instalar `rollup-plugin-visualizer` para garantir que não estamos enviando bibliotecas gigantes para o cliente.
- **Relatório de Linting:** Configurar regras estritas de acessibilidade (`eslint-plugin-jsx-a11y`) para garantir que o app seja "profissional" em todos os níveis.

---

## 2. Design System & UI "Premium" (Estética)

A diferença entre um app "bom" e um "excelente" está nos detalhes invisíveis.

### 2.1 "The Glass & Depth System"
Ao invés de designs chapados, utilizaremos um sistema de profundidade em camadas:
- **Level 0 (Background):** Cinza muito claro / Branco.
- **Level 1 (Cards):** Branco com sombra difusa suave (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.02)`).
- **Level 2 (Floating/Sticky):** Glassmorphism real (`backdrop-filter: blur(12px)`) para Headers e Sidebars, dando contexto de "camadas".
- **Level 3 (Interactive/Dropdowns):** Sombras mais fortes e bordas sutis.

### 2.2 Tipografia Clínica
- **Fonte:** Manter a `Manrope` ou migrar para `Inter` com `tracking-tight` (-0.025em) para títulos, dando um ar mais moderno e técnico.
- **Hierarquia:** Estabelecer tokens de texto semânticos (`text-clinical-value`, `text-clinical-label`) para padronizar como dados médicos são exibidos (ex: rótulos sempre em cinza médio, valores em preto forte).

### 2.3 Micro-interações e Motion (Framer Motion)
Nada deve "aparecer do nada". Tudo deve ter entrada e saída.
- **Page Transitions:** Suave fade-in + slide-up ao navegar entre rotas.
- **List Items:** `AnimatePresence` ao adicionar/remover itens de listas (diagnósticos, remédios).
- **Hover States:** Botões não apenas mudam de cor, mas têm uma escala sutil (`scale-105`) e feedback tátil visual.
- **Skeletons Inteligentes:** Como já implementado, mas expandido para tabelas inteiras (loading states que imitam a estrutura exata da tabela).

---

## 3. Bibliotecas e Funcionalidades Chave (O Arsenal)

Para resolver os problemas de UX descritos no `UX_DESIGN_SOLUTIONS.md`.

### 3.1 Virtualização de Listas (`@tanstack/react-virtual`)
**O Problema dos 3.600 Itens:** O DOM não aguenta renderizar 3000 linhas de tabela.
**A Solução:** Virtualização. Renderizar apenas o que está na viewport (+ buffer). Isso permite scroll infinito liso em listas gigantes de histórico.

### 3.2 Tabelas Poderosas (`@tanstack/react-table`)
Para a "Tabela Densa" do histórico:
- **Headless UI:** Controle total do markup (table, grid, flex).
- **Sorting/Filtering complexo:** Filtrar por "Data", "Diagnóstico" e "Médico" simultaneamente no client-side com performance instantânea.
- **Row Expansion:** Permitir clicar numa linha e abrir os detalhes (como desenhado no UX docs) sem navegar para outra página.

### 3.3 Command Palette (`cmdk`) - A Central de Comando
Transformar a busca num "Spotlight" médico (Ctrl+K):
- Buscar Paciente (navega para perfil)
- Buscar Consulta (abre modal)
- Ações Rápidas ("Nova Prescrição", "Agendar Retorno")
- Tudo acessível via teclado, ideal para médicos heavy-users.

### 3.4 Visualização de Dados (`recharts` customizado)
Charts não devem parecer "padrão de biblioteca".
- Customizar tooltips para serem minimalistas.
- Remover grids excessivos.
- Usar gradientes nas áreas dos gráficos para suavidade.

---

## 4. Plano de Ação (Próximos Passos Front-Only)

### Fase 1: Fundação Visual (Sessão Atual/Próxima)
1.  **Refinar `tailwind.config`:** Adicionar tokens de sombra "premium" e cores semânticas (`bg-surface-glass`).
2.  **Global Motion Provider:** Configurar `framer-motion` (`MotionConfig`) para que todas as animações sigam a mesma física (spring damping/stiffness).
3.  **Componente `PageTransition`:** Wrapper para todas as páginas.

### Fase 2: O Dashboard de Ação
1.  **Layout Grid:** Implementar o grid assimétrico proposto no doc de UX.
2.  **Glass Widgets:** Criar os cards de "Ações Rápidas" e "Hoje" com o novo estilo visual.
3.  **Command K:** Implementar a barra de busca global no topo.

### Fase 3: Histórico e Dados (Complexo)
1.  **Instalar e Configurar `tanstack-table` e `react-virtual`**.
2.  **Criar `DataTable` component:** Reutilizável, com paginação, sorteio e virtualização embutidos.
3.  **Migrar `HistoryPage`:** Substituir a lista atual pela nova `DataTable` densa.

### Fase 4: Detalhes de Polimento
1.  **Tooltips:** Usar `Radix UI Tooltip` com animação de slide em todos os botões de ícone.
2.  **Skeleton Screens:** Garantir que todas as telas tenham loading states cinza/pulsantes (como o que acabamos de corrigir).
3.  **Error Boundaries:** Telas de erro bonitas (não a "tela branca da morte") que permitem tentar novamente.

---

## Resumo da Visão

Não estamos apenas "arrumando bugs". Estamos construindo um **Sistema Operacional Médico**. O frontend deve passar a sensação de **solidez**, **velocidade** e **clareza**. O médico deve sentir que o software "pensa" na velocidade dele.
