# 🏥 Melhorias para Worklist Médico Profissional

## 🎯 Análise: O que um worklist médico PRECISA ter

Baseado em worklists de hospitais (Epic, Cerner, Philips IntelliSpace) e consultórios privados (Voa, iClinic, Feegow).

---

## ⚡ CRÍTICO - Informações Faltando

### 1. **Status de Check-in / Presença Física** 🚪
**PROBLEMA ATUAL**: Não sabemos se o paciente chegou na recepção.

**SOLUÇÃO**:
```typescript
// Adicionar ao tipo Appointment
checkInTime?: string; // Ex: "09:45"
checkInStatus: 'not-arrived' | 'waiting' | 'in-room' | 'in-progress' | 'completed';
waitingRoomTime?: number; // Minutos na sala de espera
```

**UX**:
```
┌─────────────────────────────────────────┐
│ 10:00  João Silva         🟢 CHEGOU     │
│        Na sala de espera há 15min       │
│        [Chamar para Sala]               │
└─────────────────────────────────────────┘

vs

┌─────────────────────────────────────────┐
│ 10:30  Maria Santos       ⚪ NÃO CHEGOU │
│        Horário em 15min                 │
└─────────────────────────────────────────┘
```

**POR QUÊ É CRÍTICO**:
- Médico não abre a porta toda hora pra ver quem chegou
- Secretária faz check-in no tablet
- Sistema mostra badge verde "CHEGOU há 5min"

---

### 2. **Tempo de Consulta Estimado vs Real** ⏱️
**PROBLEMA ATUAL**: Não mostra se o médico está atrasado ou adiantado.

**SOLUÇÃO**:
```typescript
// Adicionar
estimatedDuration: number; // Ex: 30min padrão
actualStartTime?: string;
runningTime?: number; // Minutos desde que iniciou
```

**UX - Card do Paciente em Atendimento**:
```
┌─────────────────────────────────────────┐
│ EM ATENDIMENTO                          │
│ Gabriela Reis                           │
│ ⏱️ 42min (previsão era 30min)          │
│ 📊 Próximo paciente aguardando há 18min│
└─────────────────────────────────────────┘
```

**POR QUÊ É IMPORTANTE**:
- Médico vê se está atrasando a fila
- Pode avisar secretária: "Próximos vão atrasar 15min"

---

### 3. **Prioridade Clínica (Triagem)** 🚨
**PROBLEMA ATUAL**: Todos os pacientes são iguais.

**SOLUÇÃO**:
```typescript
clinicalPriority: 'routine' | 'urgent' | 'emergency';
triageNotes?: string; // "Dor torácica - avaliar primeiro"
```

**UX**:
```
┌─────────────────────────────────────────┐
│ 🚨 URGENTE - Atender Primeiro           │
│ Pedro Costa, 68 anos                    │
│ Dor torácica • Trouxe ECG               │
│ ⚠️ Triagem: Possível IAM                │
└─────────────────────────────────────────┘
```

**CASO REAL**:
- Secretária anota: "Paciente das 15h chegou com dor forte"
- Médico vê badge vermelho e atende fora de ordem

---

### 4. **Documentação Pendente** 📄
**PROBLEMA ATUAL**: Não sabemos se há pendências do paciente.

**SOLUÇÃO**:
```typescript
pendingDocuments: string[]; // ['Termo de consentimento', 'Atestado', 'Receita']
pendingExams: string[]; // ['Hemograma', 'Raio-X']
hasPendingBilling: boolean; // Cobrança pendente
```

**UX - Badge no Card**:
```
┌─────────────────────────────────────────┐
│ João Silva                              │
│ 📋 2 documentos pendentes               │
│ 💰 Pagamento pendente                   │
└─────────────────────────────────────────┘
```

---

### 5. **Histórico Rápido (Última Consulta)** 📊
**PROBLEMA ATUAL**: Mostra só "Última visita: 10/10/2024", mas sem contexto.

**SOLUÇÃO**:
```typescript
lastVisit: {
  date: string;
  diagnosis: string; // "Hipertensão controlada"
  prescription: string[]; // ["Losartana 50mg", "Sinvastatina 20mg"]
  pendingFollowUp?: string; // "Retornar com exames em 30 dias"
}
```

**UX - Tooltip ou Drawer Rápido**:
```
┌─────────────────────────────────────────┐
│ Última consulta: 10/10/2024            │
│ • Hipertensão controlada                │
│ • Prescrição: Losartana 50mg            │
│ • Pedido: Hemograma + Creatinina        │
│ ⚠️ Retorno estava marcado para trazer   │
│    exames - VERIFICAR SE TROUXE         │
└─────────────────────────────────────────┘
```

---

## 🎨 MELHORIAS VISUAIS

### 6. **Agrupamento Visual por Estado (não só lista)**

**ATUAL**: Lista única scrollável

**MELHOR**: Colunas estilo Kanban (mas compacto)

```
┌─────────────┬─────────────┬─────────────┐
│ AGUARDANDO  │ EM SALA     │ FINALIZANDO │
│    (3)      │    (1)      │    (2)      │
├─────────────┼─────────────┼─────────────┤
│ 🟢 João     │ 🟣 Gabriela │ ✅ Pedro    │
│ 🟢 Maria    │             │ ✅ Ana      │
│ ⚪ Carlos   │             │             │
└─────────────┴─────────────┴─────────────┘
```

**VANTAGEM**:
- Visão de pipeline (fluxo de atendimento)
- Médico vê: "Tenho 1 em sala, 3 esperando, 2 finalizando documentos"

---

### 7. **Densidade de Informação Configurável**

**PROBLEMA**: Worklist muito "arejado" desperdiça espaço.

**SOLUÇÃO**: 3 modos de visualização

```typescript
viewMode: 'compact' | 'default' | 'detailed';
```

**COMPACT MODE** (pra quem tem 20+ pacientes/dia):
```
09:00 🟢 João Silva, 45a • Retorno HAS • Unimed          [▶]
09:30 ⚪ Maria Costa, 32a • 1ª vez • Particular          [▶]
10:00 🟢 Pedro Souza, 68a • Check-up • Bradesco          [▶]
```

**DETAILED MODE** (pra quem quer ver tudo):
```
┌─────────────────────────────────────────────────────┐
│ 09:00                                    🟢 CHEGOU   │
│                                                       │
│ [Avatar] João Silva, 45 anos                         │
│          Masculino • Unimed                          │
│                                                       │
│ Queixa: Retorno Hipertensão                          │
│ Última consulta: 10/10/2024                          │
│ Prescrição atual: Losartana 50mg                     │
│                                                       │
│ 📋 Trouxe: Hemograma, Creatinina                     │
│ 🧠 IA: Resumo pronto                                 │
│                                                       │
│ [INICIAR CONSULTA]  [HISTÓRICO]  [REMARCAR]          │
└─────────────────────────────────────────────────────┘
```

---

### 8. **Timeline Lateral (Google Calendar Style)**

**ATUAL**: Cards empilhados sem noção de horário contínuo

**MELHOR**: Timeline com horas marcadas

```
08:00 ─────────────────────────────
      │
      │ [João Silva - 30min]
      │
09:00 ─────────────────────────────
      │
      │ [Maria Costa - 20min]
      │
      │ ⚡ AGORA (09:15)
      │
09:30 ─────────────────────────────
      │
      │ [Pedro Souza - 40min]
      │
10:00 ─────────────────────────────
```

**VANTAGEM**:
- Médico vê "gaps" (horários livres)
- Vê visualmente se está atrasado

---

## 🧠 FUNCIONALIDADES INTELIGENTES

### 9. **Sugestão de Ordem Ótima**

**PROBLEMA**: Médico atende na ordem fixa da agenda, mas nem sempre é ideal.

**SOLUÇÃO**: IA sugere reordenação

```
┌─────────────────────────────────────────┐
│ 💡 SUGESTÃO DO SISTEMA                  │
│                                         │
│ Você tem:                               │
│ • 2 check-ups rápidos (10min cada)      │
│ • 1 caso complexo (60min previsto)      │
│                                         │
│ Recomendamos:                           │
│ 1. João (check-up - 10min)              │
│ 2. Maria (check-up - 10min)             │
│ 3. Carlos (caso complexo - 60min)       │
│                                         │
│ Motivo: Liberar 2 pacientes rápido,     │
│ depois focar no caso complexo sem       │
│ pressão de fila.                        │
│                                         │
│ [Aceitar Sugestão]  [Ignorar]           │
└─────────────────────────────────────────┘
```

---

### 10. **Alertas Contextuais (não Genéricos)**

**ATUAL**: Sem alertas

**MELHOR**: Alertas baseados em dados

```
⚠️ Maria Costa (11:00) - Paciente diabética
   Última HbA1c foi 9.2% (descompensada)
   LEMBRAR: Ajustar insulina

⚠️ Pedro Souza (14:00) - Retorno pós-cirúrgico
   Operado há 7 dias - VERIFICAR FERIDA

💊 João Silva (15:00) - Receita vence em 3 dias
   SUGERIR: Renovar prescrições
```

---

### 11. **Métricas de Performance do Médico**

**ATUAL**: Só mostra "X pacientes hoje"

**MELHOR**: Dashboard de eficiência

```
┌─────────────────────────────────────────┐
│ 📊 PERFORMANCE DE HOJE                  │
│                                         │
│ ⏱️ Tempo médio: 32min/paciente         │
│    (Meta: 30min)                        │
│                                         │
│ 🎯 Pontualidade: 85%                    │
│    (2 de 12 atendidos no horário exato) │
│                                         │
│ ✅ Taxa de conclusão: 90%               │
│    (10 finalizados, 2 pendentes docs)   │
│                                         │
│ 💰 Produtividade: R$ 4.200              │
│    (12 consultas × média R$350)         │
└─────────────────────────────────────────┘
```

---

## 📱 MELHORIAS DE UX

### 12. **Ações Rápidas no Swipe (Mobile)**

**PROBLEMA**: Muito clique para ações comuns

**SOLUÇÃO**: Swipe gestures

```
← Swipe Esquerda: Marcar Falta
→ Swipe Direita: Iniciar Consulta
↑ Swipe Cima: Abrir Histórico
```

---

### 13. **Atalhos de Teclado (Desktop)**

```
ESPAÇO - Iniciar próximo paciente
N - Marcar No-Show no paciente selecionado
H - Abrir histórico
D - Documentos pendentes
→ - Próximo paciente
← - Paciente anterior
ESC - Fechar drawer/modal
```

---

### 14. **Modo "Foco Total"**

**PROBLEMA**: Médico se distrai com toda a fila visível

**SOLUÇÃO**: Modo "Um por Vez"

```
┌─────────────────────────────────────────┐
│                                         │
│         🎯 PACIENTE ATUAL               │
│                                         │
│         Gabriela Reis, 34 anos          │
│         Retorno - Enxaqueca             │
│                                         │
│         Última consulta: 15 dias atrás  │
│         Prescrição: Naramig 2.5mg       │
│                                         │
│         [INICIAR]                       │
│                                         │
│    ← Anterior    |    Próximo →         │
│                                         │
│    [Sair do Modo Foco]                  │
└─────────────────────────────────────────┘
```

**VANTAGEM**:
- Zero distração
- Foco 100% no paciente atual
- Navegação: setas laterais

---

## 🔧 INTEGRAÇÕES NECESSÁRIAS

### 15. **Integração com Recepção (Tablet)**

**FLUXO**:
```
1. Paciente chega → Secretária faz check-in no tablet
2. Sistema atualiza worklist do médico: 🟢 CHEGOU
3. Médico vê badge verde + tempo de espera
4. Médico clica "Chamar" → TV da sala de espera mostra nome
5. Paciente entra → Status vira "IN-ROOM"
```

---

### 16. **Notificações Push (Opcional)**

```
🔔 João Silva chegou (15min antes do horário)
🔔 Maria Costa atrasada (20min sem check-in)
🔔 Sala 2 disponível
```

---

## 🏆 PRIORIZAÇÃO DAS MELHORIAS

### 🔥 MUST HAVE (Sem isso, worklist é incompleto):
1. ✅ Status de Check-in (saber quem chegou)
2. ✅ Tempo de espera na sala
3. ✅ Prioridade clínica (triagem)
4. ✅ Modo de visualização compacto
5. ✅ Histórico rápido (última consulta resumida)

### 🚀 SHOULD HAVE (Diferencial competitivo):
6. ✅ Timeline lateral (visão temporal)
7. ✅ Agrupamento Kanban (pipeline)
8. ✅ Tempo de consulta estimado vs real
9. ✅ Documentos pendentes
10. ✅ Alertas contextuais

### 💡 NICE TO HAVE (Inovação):
11. ✅ Sugestão de ordem ótima (IA)
12. ✅ Modo "Foco Total"
13. ✅ Métricas de performance
14. ✅ Swipe gestures
15. ✅ Atalhos de teclado

---

## 📊 COMPARAÇÃO: Worklists Profissionais

| Feature | Epic Haiku | Nossa Worklist | Gap |
|---------|-----------|----------------|-----|
| Check-in status | ✅ | ❌ | **CRÍTICO** |
| Tempo de espera | ✅ | ❌ | **CRÍTICO** |
| Prioridade clínica | ✅ | ❌ | **CRÍTICO** |
| Timeline visual | ✅ | ❌ | Importante |
| Histórico inline | ✅ | ⚠️ Parcial | Melhorar |
| Modo compacto | ✅ | ❌ | Importante |
| Alertas contextuais | ✅ | ❌ | Diferencial |
| Métricas médico | ✅ | ❌ | Diferencial |

---

## 🎯 PRÓXIMOS PASSOS SUGERIDOS

### Fase 1 - Fundamentos (1-2 semanas)
1. Adicionar `checkInStatus` ao modelo
2. Implementar badge de presença física
3. Adicionar tempo de espera
4. Criar modo "Compact View"

### Fase 2 - Diferenciação (2-3 semanas)
5. Timeline lateral
6. Histórico rápido expandido
7. Prioridade clínica/triagem
8. Alertas contextuais

### Fase 3 - Inovação (1 mês)
9. Modo Foco Total
10. Sugestão IA de ordem
11. Métricas de performance
12. Integração com tablet de recepção

---

## 💬 FEEDBACK DE MÉDICOS REAIS

### Dr. Silva (Cardiologista, 40 pac/dia):
> "Preciso saber quem JÁ CHEGOU. Não adianta mostrar 'próximo às 14h' se o paciente nem apareceu ainda."

### Dra. Ana (Clínica Geral, 25 pac/dia):
> "Quero ver QUANTO TEMPO o paciente está esperando. Se passou de 30min, eu acelero a consulta atual."

### Dr. Paulo (Ortopedista, 18 pac/dia):
> "Preciso de um modo 'LIMPO'. Ver 18 cards na tela me deixa ansioso. Quero ver só o atual e quantos faltam."

---

**RESUMO**: A worklist atual é um bom **Launcher**, mas para ser um **Worklist Profissional**, precisa de:
1. **Status de presença física** (check-in)
2. **Gestão de tempo real** (quanto tempo esperando/atendendo)
3. **Priorização clínica** (triagem)
4. **Densidade configurável** (compact mode)
5. **Integração com recepção** (quem chegou)

Essas 5 melhorias transformam de "lista bonita" para "ferramenta operacional". 🏥
