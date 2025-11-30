# Dashboard Worklist Médica - Conceito

## 🎯 Objetivo
Transformar o Dashboard em uma **lista de trabalho eficiente** que permita ao médico:
- Ver rapidamente o que precisa fazer HOJE
- Priorizar atendimentos urgentes
- Acessar histórico do paciente com 1 clique
- Iniciar consulta direto da lista
- Visualizar pendências (retornos, exames, etc)

---

## 📋 Estrutura da Worklist

### **1. Hero - Resumo do Dia**
```
┌─────────────────────────────────────────────┐
│ 🏥 Worklist - [Data/Hora atual]            │
│ Bom dia, Dr. Silva                          │
│ Você tem 8 pacientes agendados hoje        │
│ • 2 urgentes • 3 confirmados • 3 pendentes  │
└─────────────────────────────────────────────┘
```

### **2. KPIs Focados em Ação**
- **Agora**: Pacientes no horário atual
- **Próximo**: Próximo paciente (em X minutos)
- **Aguardando**: Pacientes que chegaram
- **Concluídos Hoje**: Atendidos

### **3. Lista de Pacientes Priorizada**

**Prioridades:**
1. 🔴 **URGENTE** - Chegou atrasado / Urgência médica
2. 🟡 **AGORA** - Horário atual (±15min)
3. 🟢 **PRÓXIMO** - Próximos 30min
4. ⚪ **AGENDADO** - Confirmados para hoje
5. ⚫ **PENDENTE** - Não confirmados

**Card de Paciente na Worklist:**
```
┌─────────────────────────────────────────────┐
│ 🔴 08:30 [ATRASADO 10min]                  │
│                                              │
│ 👤 João Silva, 45 anos                      │
│ 📋 Retorno - Hipertensão                    │
│ 📊 Última consulta: 15 dias atrás           │
│ ⚠️  PA anterior: 140/90 (elevada)           │
│                                              │
│ [📁 Histórico] [🩺 Iniciar Consulta]       │
└─────────────────────────────────────────────┘
```

---

## 🎨 Features da Worklist

### **Filtros Rápidos:**
- [ ] Todos
- [ ] Urgentes
- [ ] Aguardando
- [ ] Próximos
- [ ] Pendentes de confirmação

### **Ações Rápidas por Paciente:**
1. **Ver Histórico** - Modal com últimas consultas
2. **Iniciar Consulta** - Abre direto no atendimento
3. **Reagendar** - Troca horário
4. **Marcar Falta** - No-show
5. **Confirmar Chegada** - Paciente na recepção

### **Informações Contextuais:**
- Última consulta (quantos dias)
- Motivo do agendamento
- Alertas médicos (alergias, condições críticas)
- Sinais vitais da última visita
- Exames pendentes

---

## 📱 Responsividade

### Mobile:
- Cards empilhados verticalmente
- Informações essenciais apenas
- Botões grandes para ações
- Swipe para ações rápidas

### Desktop:
- Visão em lista ou cards
- Mais informações visíveis
- Sidebar com detalhes do paciente selecionado
- Atalhos de teclado

---

## 🚀 Próximos Passos

1. ✅ Redesenhar hero com foco em produtividade
2. ✅ Criar KPIs acionáveis (Agora, Próximo, Aguardando)
3. ✅ Implementar lista priorizada de pacientes
4. ✅ Adicionar badges de status visual
5. ✅ Ações rápidas em cada card
6. ✅ Informações contextuais do paciente
7. ✅ Filtros e busca inteligente
8. ✅ Layout mobile otimizado

---

**A Worklist será a central de comando do médico!** 🏥⚡
