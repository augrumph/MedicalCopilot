# 🏥 Melhorias REALISTAS para Worklist (Apenas Google Calendar)

## 🔒 LIMITAÇÃO: Read-Only do Google Calendar

**O que TEMOS**:
- ✅ Lista de agendamentos (horário, nome, descrição)
- ✅ Horário atual (para calcular proximidade)
- ✅ Histórico de consultas anteriores (nosso banco)

**O que NÃO TEMOS**:
- ❌ Check-in físico (paciente chegou?)
- ❌ Tempo de espera na sala
- ❌ Status em tempo real da recepção
- ❌ Modificação do Google Calendar

---

## ✅ MELHORIAS POSSÍVEIS (Sem Integração com Recepção)

### 1. **Timeline Visual (Google Calendar Style)** ⏰

**PROBLEMA ATUAL**: Cards empilhados, sem noção de "gaps" ou "fluxo temporal"

**SOLUÇÃO**: Timeline lateral mostrando a agenda contínua

```
08:00 ────────────────────────────────────
      │
      │ ✅ João Silva (30min) - CONCLUÍDO
      │
08:30 ────────────────────────────────────
      │
      │ [15min LIVRE]
      │
08:45 ────────────────────────────────────
      │
      │ 🟣 Maria Costa (20min) - EM ATENDIMENTO
      │
      │ ⚡ AGORA (09:03)
      │
09:15 ────────────────────────────────────
      │
      │ 🔵 Pedro Souza (40min) - PRÓXIMO (12min)
      │
09:45 ────────────────────────────────────
```

**VANTAGEM**:
- Médico vê visualmente os "gaps" (horários livres)
- Vê quanto tempo tem até o próximo
- Identifica se está "adiantado" ou "atrasado" no cronograma

**IMPLEMENTAÇÃO**:
- Usar `startTime` e calcular duração padrão (30min default)
- Renderizar linha do tempo com scroll automático para "AGORA"

---

### 2. **Modo Compact (Densidade Alta)** 📊

**PROBLEMA ATUAL**: Cards muito "arejados" - desperdiçam espaço vertical

**SOLUÇÃO**: Modo compacto para ver mais pacientes de uma vez

```typescript
// Toggle entre 3 modos
viewDensity: 'comfortable' | 'compact' | 'detailed'
```

**MODO COMPACT** (lista densa):
```
08:00  ✅ João Silva, 45a • HAS • Unimed
08:30  🟣 Maria Costa, 32a • Retorno • Bradesco    [EM ATEND.]
09:00  🔵 Pedro Souza, 68a • Check-up • Particular [PRÓXIMO]
09:30  ⚪ Ana Lima, 54a • 1ª vez • Amil            [em 27min]
10:00  ⚪ Carlos Dias, 41a • Retorno • Unimed      [em 57min]
```

**MODO COMFORTABLE** (atual):
```
┌─────────────────────────────────────────┐
│ 09:00                        🔵 PRÓXIMO │
│ Pedro Souza, 68 anos                    │
│ Check-up • Particular                   │
│ [INICIAR CONSULTA]                      │
└─────────────────────────────────────────┘
```

**MODO DETAILED** (máxima info):
```
┌─────────────────────────────────────────┐
│ 09:00                        🔵 PRÓXIMO │
│                                         │
│ [Avatar] Pedro Souza, 68 anos           │
│          Masculino • Particular         │
│                                         │
│ Queixa: Check-up anual                  │
│ Última consulta: 10/10/2024 (30d atrás) │
│ Tags: Hipertenso, Diabético             │
│                                         │
│ 🧠 IA: Resumo pronto                    │
│ 📋 Documentos: Hemograma, Glicemia      │
│                                         │
│ [INICIAR] [HISTÓRICO] [REMARCAR]        │
└─────────────────────────────────────────┘
```

---

### 3. **Estimativa de Término da Agenda** 🏁

**PROBLEMA ATUAL**: Médico não sabe "quando vou terminar hoje?"

**SOLUÇÃO**: Calcular horário previsto de término

```typescript
// Calcular baseado em:
// - Consultas restantes
// - Tempo médio por tipo (primeira consulta = 40min, retorno = 25min)
// - Atraso atual acumulado

const calculateEndTime = () => {
  let totalMinutes = 0;
  remainingAppointments.forEach(apt => {
    const duration = apt.isFirstVisit ? 40 : 25; // Média histórica
    totalMinutes += duration;
  });
  return addMinutes(now, totalMinutes);
}
```

**UX - Card de Resumo**:
```
┌─────────────────────────────────────────┐
│ 📊 RESUMO DO DIA                        │
│                                         │
│ Agora: 14:23                            │
│ Término previsto: 18:15                 │
│                                         │
│ Faltam: 7 pacientes (3h52min)           │
│ Atendidos: 8 de 15 (53%)                │
│                                         │
│ ⚠️ Você está 15min atrasado no cronograma│
└─────────────────────────────────────────┘
```

**VANTAGEM**:
- Médico planeja: "Consigo ir na academia às 18h30?"
- Ou avisa secretária: "Não marque mais nada hoje"

---

### 4. **Parsing Inteligente do Título do Google Calendar** 🧠

**PROBLEMA**: Secretária coloca tudo no título: "João Silva - Unimed - Retorno HAS"

**SOLUÇÃO**: Regex para extrair informações estruturadas

```typescript
// Exemplo de título da secretária:
// "João Silva - Unimed - Retorno - Trouxe exames"

const parseCalendarTitle = (title: string) => {
  const parsed = {
    patientName: '',
    insurance: null,
    tags: [] as string[],
  };

  // Extrair convênio
  const insurances = ['unimed', 'bradesco', 'amil', 'sulamerica', 'particular'];
  insurances.forEach(ins => {
    if (title.toLowerCase().includes(ins)) {
      parsed.insurance = ins;
    }
  });

  // Extrair tags
  if (/retorno|return/i.test(title)) parsed.tags.push('Retorno');
  if (/primeira|1[aª]|first/i.test(title)) parsed.tags.push('1ª Vez');
  if (/exam|exame/i.test(title)) parsed.tags.push('Trouxe Exames');
  if (/urgente|urgent|priorit/i.test(title)) parsed.tags.push('Urgente');
  if (/telemedicina|online|video/i.test(title)) parsed.tags.push('Telemedicina');

  // Nome do paciente (primeira parte antes do "-")
  parsed.patientName = title.split('-')[0].trim();

  return parsed;
}
```

**RESULTADO VISUAL**:
```
Calendar Title: "João Silva - Unimed - Retorno HAS - Trouxe exames"

Vira:
┌─────────────────────────────────────────┐
│ João Silva, 45 anos                     │
│ 🟢 Unimed • Retorno • Trouxe Exames     │
│ Queixa: HAS (Hipertensão)               │
└─────────────────────────────────────────┘
```

---

### 5. **Indicador de Atraso/Adiantamento** ⏱️

**PROBLEMA ATUAL**: Não mostra se o médico está "no tempo" ou atrasado

**SOLUÇÃO**: Comparar horário real vs horário previsto

```typescript
// Se agora são 14:23 e o paciente era às 14:00:
// - Se ainda atendendo o das 14:00 = OK (dentro do prazo)
// - Se já passou para o das 14:30 = Adiantado 7min
// - Se ainda no das 13:30 = Atrasado 23min

const getScheduleStatus = () => {
  const currentInProgress = appointments.find(a => a.status === 'in-progress');
  if (!currentInProgress) return null;

  const [hours, minutes] = currentInProgress.startTime.split(':').map(Number);
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);

  const diffMinutes = Math.floor((now.getTime() - scheduledTime.getTime()) / 60000);

  if (diffMinutes < -5) return { status: 'ahead', minutes: Math.abs(diffMinutes) };
  if (diffMinutes > 15) return { status: 'behind', minutes: diffMinutes };
  return { status: 'on-time', minutes: 0 };
}
```

**UX - Badge no Card do Paciente em Atendimento**:
```
┌─────────────────────────────────────────┐
│ 🟣 EM ATENDIMENTO                       │
│ Maria Costa, 32 anos                    │
│                                         │
│ ⏱️ Há 18min (começou às 14:00)         │
│ 🟢 No horário (dentro do esperado)      │
│                                         │
│ Próximo paciente em: 12min              │
└─────────────────────────────────────────┘

vs

┌─────────────────────────────────────────┐
│ 🟣 EM ATENDIMENTO                       │
│ Pedro Souza, 68 anos                    │
│                                         │
│ ⏱️ Há 42min (começou às 13:30)         │
│ 🔴 Atrasado 12min no cronograma         │
│                                         │
│ 3 pacientes aguardando                  │
└─────────────────────────────────────────┘
```

---

### 6. **Agrupamento por "Blocos de Tempo"** 📅

**PROBLEMA ATUAL**: Lista única sem divisões temporais

**SOLUÇÃO**: Agrupar por períodos do dia

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANHÃ (08:00 - 12:00) • 5 pacientes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 08:00 João Silva - CONCLUÍDO
✅ 09:00 Maria Costa - CONCLUÍDO
🟣 10:00 Pedro Souza - EM ATENDIMENTO
🔵 11:00 Ana Lima - PRÓXIMO
⚪ 11:30 Carlos Dias - CONFIRMADO

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TARDE (14:00 - 18:00) • 8 pacientes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚪ 14:00 Fernanda Reis - em 3h37min
⚪ 14:30 Gabriel Santos - em 4h07min
...
```

**VANTAGEM**:
- Separação visual entre turnos
- Médico vê "Acabei a manhã" vs "Ainda tenho 8 à tarde"

---

### 7. **Quick Stats (Estatísticas Rápidas)** 📊

**PROBLEMA ATUAL**: Hero só mostra "X agendamentos hoje"

**SOLUÇÃO**: Métricas úteis calculadas

```
┌─────────────────────────────────────────┐
│ 📊 ESTATÍSTICAS DO DIA                  │
│                                         │
│ ⏱️ Tempo médio por consulta: 28min     │
│ 🎯 Consultas/hora: 2.1                  │
│ 📈 Produtividade: 87%                   │
│ 🕐 Início: 08:00 | Término prev: 18:15  │
│                                         │
│ 💰 Valor gerado hoje: R$ 4.850          │
│    (14 consultas × R$346 médio)         │
└─────────────────────────────────────────┘
```

**CÁLCULOS**:
```typescript
const stats = {
  avgDuration: completedAppointments.reduce((acc, apt) =>
    acc + (apt.endTime - apt.startTime), 0) / completedAppointments.length,

  consultationsPerHour: completedAppointments.length / hoursWorked,

  productivity: completedAppointments.length / todayAppointments.length * 100,

  revenue: todayAppointments.reduce((acc, apt) =>
    acc + getConsultationPrice(apt.insurance), 0)
}
```

---

### 8. **Histórico Inline (Sem Sair da Worklist)** 📖

**PROBLEMA ATUAL**: Clicar "Histórico" navega para outra página (perde contexto)

**SOLUÇÃO**: Drawer lateral que abre histórico SEM sair da worklist

```
┌──────────────────┬───────────────────────┐
│ WORKLIST         │ HISTÓRICO - João Silva│
│                  │                       │
│ 🟣 Maria Costa   │ Última: 10/11/2024    │
│ 🔵 Pedro Souza   │ • HAS controlada      │
│ ⚪ Ana Lima      │ • PA: 130/85          │
│ ⚪ Carlos Dias   │ • Prescrição:         │
│                  │   - Losartana 50mg    │
│                  │   - Sinvastatina 20mg │
│                  │                       │
│                  │ Anterior: 10/09/2024  │
│                  │ • HAS descompensada   │
│                  │ • PA: 160/100         │
│                  │                       │
│                  │ [Fechar]              │
└──────────────────┴───────────────────────┘
```

**VANTAGEM**:
- Médico não "perde" a lista
- Quick look no histórico
- ESC fecha o drawer

---

### 9. **Modo "Foco Total" (Zen Mode)** 🧘

**PROBLEMA**: Ver 15 cards causa ansiedade

**SOLUÇÃO**: Modo minimalista - 1 paciente por vez

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│         🎯 PRÓXIMO PACIENTE             │
│                                         │
│         Pedro Souza, 68 anos            │
│         Check-up anual • Particular     │
│                                         │
│         Última consulta: Há 30 dias     │
│         Prescrição: Losartana 50mg      │
│                                         │
│         ⏱️ Em 12 minutos                │
│                                         │
│         [INICIAR CONSULTA]              │
│                                         │
│                                         │
│    ← Anterior (Maria)  |  Próximo (Ana) →│
│                                         │
│    Faltam: 7 pacientes                  │
│    [Sair do Modo Foco]                  │
│                                         │
└─────────────────────────────────────────┘
```

**ATALHO**: `F` para entrar/sair do Foco

---

### 10. **Filtros Inteligentes** 🔍

**PROBLEMA ATUAL**: Filtro só por status genérico

**SOLUÇÃO**: Filtros por contexto clínico

```typescript
type SmartFilter =
  | 'all'
  | 'primeira-vez'      // Só primeiras consultas
  | 'retorno'           // Só retornos
  | 'trouxe-exames'     // Pacientes que trouxeram exames
  | 'particular'        // Só particulares
  | 'convenio'          // Só convênio
  | 'telemedicina'      // Só online
  | 'longa-duracao'     // Consultas >40min previstas
```

**UX - Chips de Filtro**:
```
[Todos: 15] [1ª Vez: 4] [Retorno: 11] [Trouxe Exames: 6] [Particular: 5]
```

Clica em "Trouxe Exames" → Mostra só os 6 que trouxeram exames

---

### 11. **Atalhos de Teclado** ⌨️

**Para Desktop**:
```
ESPAÇO       - Iniciar próximo paciente
→            - Navegar para próximo
←            - Navegar para anterior
H            - Abrir histórico do selecionado
F            - Modo Foco
C            - Modo Compact/Comfortable toggle
ESC          - Fechar drawer/modal
1, 2, 3      - Alternar filtros (Todos, Próximos, Pendentes)
```

---

### 12. **Indicador de "Pacientes Restantes" Gamificado** 🎮

**PROBLEMA**: Tom negativo "Ainda faltam 8"

**SOLUÇÃO**: Tom positivo de progresso

```
┌─────────────────────────────────────────┐
│ 🎯 PROGRESSO DO DIA                     │
│                                         │
│ ████████████░░░░░░░░ 60%                │
│                                         │
│ ✅ Concluídos: 9 de 15                  │
│ 🟣 Em atendimento: 1                    │
│ 🔵 Faltam: 5                            │
│                                         │
│ 💪 Você está 73% mais rápido que ontem  │
└─────────────────────────────────────────┘
```

---

## 🏆 PRIORIZAÇÃO REALISTA

### 🔥 QUICK WINS (Implementar AGORA - 1 semana):
1. ✅ **Modo Compact** - Densidade configurável
2. ✅ **Parsing do Calendar** - Extrair convênio/tags do título
3. ✅ **Estimativa de Término** - "Você termina às 18:15"
4. ✅ **Agrupamento Temporal** - Manhã/Tarde/Noite
5. ✅ **Atalhos de Teclado** - SPACE, →, H, F, C

### 🚀 HIGH IMPACT (2-3 semanas):
6. ✅ **Timeline Visual** - Google Calendar style
7. ✅ **Modo Foco Total** - 1 paciente por vez
8. ✅ **Histórico Drawer** - Sem sair da worklist
9. ✅ **Indicador de Atraso** - "Você está 12min atrasado"
10. ✅ **Quick Stats** - Métricas do dia

### 💡 NICE TO HAVE (1 mês):
11. ✅ **Filtros Inteligentes** - Por tipo, convênio, etc
12. ✅ **Gamificação** - Barra de progresso positiva

---

## 📊 COMPARAÇÃO: Antes vs Depois

| Aspecto | ❌ ANTES | ✅ DEPOIS |
|---------|---------|----------|
| **Densidade** | Só 1 modo | 3 modos (Compact/Comfortable/Detailed) |
| **Parsing** | Genérico | Extrai convênio/tags do título |
| **Término** | Não mostra | "Término previsto: 18:15" |
| **Atraso** | Não calcula | "Você está 12min atrasado" |
| **Histórico** | Nova página | Drawer lateral (mantém contexto) |
| **Foco** | Sempre lista | Modo Zen (1 por vez) |
| **Timeline** | Cards empilhados | Linha do tempo visual |
| **Atalhos** | Só mouse | SPACE, →, H, F, C |
| **Tom** | Neutro | Gamificado e positivo |

---

## 🎯 CONCLUSÃO

**SEM** integração com recepção, ainda podemos transformar o Worklist em uma **ferramenta profissional** focando em:

1. **Melhor visualização** (Timeline, Compact Mode, Foco)
2. **Inteligência sobre os dados que TEMOS** (Parsing, Estimativas, Alertas)
3. **UX de desktop profissional** (Atalhos, Drawer, Filtros)
4. **Feedback positivo** (Progresso, não pressão)

**A limitação não está no check-in. Está em aproveitar ao MÁXIMO os dados do Calendar.** 🚀
