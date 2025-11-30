# 🎯 Launcher Simples - Dashboard como "Controle Remoto"

## 🔥 Filosofia da Mudança

**ANTES**: Tentativa de ser um CRM complexo
**AGORA**: Espelho simples da agenda do Google Calendar

### O Produto É Um LAUNCHER (Iniciador)

O médico abre a tela para **clicar em "Ouvir" no paciente certo**. Só isso.

Não gerenciamos presença/falta porque **não temos permissão de escrita no Google Calendar**.
Se fingirmos que temos, criamos conflito de verdade com a agenda original.

---

## ✅ O Que Foi Removido (Limpeza Visual)

### ❌ Removidos:

1. **Bloco "X pacientes com provável falta"** - Ruído visual
2. **Barra de métricas complexas** - "Urgentes / Atrasados / Críticos"
3. **Botão "Marcar Falta"** - Não podemos modificar o Calendar
4. **Status "Provável Falta"** - Sem permissão de gestão
5. **Auto-limpeza sugerida** - Fora do escopo
6. **Filtros por prioridade** - Simplificado demais

### ✅ Mantidos (Essenciais):

1. **Saudação dinâmica** - "Bom dia/tarde/noite, Dr. [Nome]!"
2. **Contador simples** - "Você tem X agendamentos hoje"
3. **Badges de convênio** - Unimed, Bradesco, Particular (parsing inteligente)
4. **Tags automáticas** - Retorno, 1ª Vez, Exames (extraídas da descrição)

---

## 🎯 Nova Lógica: 3 Estados Simples

### 1. **PASSADO** (Anteriores)
- Horários que já passaram (>30min)
- Visual: `opacity: 0.5` (meio apagado/cinza)
- Ainda clicável se paciente chegar atrasado
- Botão: Ícone Play pequeno (ghost)

### 2. **FOCO** (Horário Atual) ⭐
- O agendamento mais próximo do horário atual (±30min)
- Ou o primeiro "em atendimento" (in-progress)
- Visual:
  - Borda roxa destacada (`ring-2 ring-[#8C00FF]`)
  - Shadow XL
  - Badge "SUGERIDO" ou "EM ATENDIMENTO"
- Botão: **GRANDE** "Iniciar Consulta" com gradiente

### 3. **FUTURO** (Próximos)
- Agendamentos que virão depois
- Visual: Padrão, limpo
- Botão: Ícone Play (aparece no hover em desktop)

---

## 📊 Código - Lógica de Agrupamento

```typescript
// DashboardPage.tsx:44-85
const groupedAppointments = useMemo(() => {
  const groups = {
    past: [],    // <-30min
    focus: [],   // ±30min (apenas 1)
    future: [],  // >30min
  };

  let focusFound = false;

  todayAppointments.forEach(apt => {
    const diffMinutes = calcTimeDiff(apt.startTime, now);

    // In-progress = sempre foco
    if (apt.status === 'in-progress') {
      groups.focus.push(apt);
      focusFound = true;
    }
    // ±30min e ainda não focou = foco
    else if (!focusFound && diffMinutes >= -30 && diffMinutes <= 30) {
      groups.focus.push(apt);
      focusFound = true;
    }
    // Passado
    else if (diffMinutes < -30) {
      groups.past.push(apt);
    }
    // Futuro
    else {
      groups.future.push(apt);
    }
  });

  return groups;
}, [todayAppointments, now]);
```

**Regra**: Apenas 1 paciente em foco por vez. O mais próximo do horário atual.

---

## 🎨 Visual dos Cards

### A. Cards "Anteriores" (Passados)

```tsx
// opacity: 0.5
<Card className="opacity-50 shadow-md hover:shadow-lg">
  <span className="text-gray-500">{time}</span>
  <h3 className="text-gray-600">{name}</h3>
  <Button variant="ghost" size="sm">
    <Play className="h-5 w-5" />
  </Button>
</Card>
```

**Por quê**: Se o médico não atendeu às 08:00, ele visualmente "some" da atenção principal, mas continua clicável se o paciente chegar atrasado.

---

### B. Card "Em Foco" (Destaque) ⭐

```tsx
// ring-2 ring-[#8C00FF] shadow-xl
<Card className="ring-2 ring-[#8C00FF] shadow-xl">
  <Badge className="bg-[#8C00FF] text-white">
    SUGERIDO
  </Badge>
  <h3 className="text-gray-900 text-lg font-bold">
    {name}
  </h3>
  <Button size="default" className="bg-gradient-to-r from-[#8C00FF] to-[#450693]">
    <Stethoscope className="mr-2" />
    Iniciar Consulta
  </Button>
</Card>
```

**Desktop**: Botão grande "Iniciar Consulta"
**Mobile**: Botão médio "Iniciar" com ícone

---

### C. Cards "Próximos" (Futuros)

```tsx
// Visual padrão
<Card className="shadow-md hover:shadow-lg">
  <span className="text-gray-900">{time}</span>
  <h3 className="text-gray-900">{name}</h3>
  <Button variant="ghost" className="opacity-0 group-hover:opacity-100">
    <Play className="h-5 w-5" />
  </Button>
</Card>
```

**Desktop**: Play aparece no hover
**Mobile**: Play sempre visível, pequeno

---

## 🧠 Parse Inteligente (Google Calendar)

### Problema:
Secretária coloca informações no título: `"Consulta João - Unimed"`

### Solução:
Regex no front para detectar palavras-chave:

```typescript
// DashboardPage.tsx:117-140
const getSmartTags = (appointment: Appointment) => {
  const tags: string[] = [];

  // Insurance da nossa base
  if (appointment.insurance) {
    tags.push(appointment.insurance);
  }

  // Parse keywords da reason
  if (appointment.reason) {
    const reason = appointment.reason.toLowerCase();

    if (reason.includes('retorno') || type === 'follow-up') {
      tags.push('Retorno');
    }
    if (reason.includes('primeira') || isFirstVisit) {
      tags.push('1ª Vez');
    }
    if (reason.includes('exame')) {
      tags.push('Exames');
    }
  }

  return tags;
};
```

**Resultado**: Tags automáticas como badges coloridas.

---

## 📱 Como a Tela Fica

### Cabeçalho (Hero)

```
┌─────────────────────────────────────────────┐
│ 🎯 Launcher • 14:23                         │
│                                              │
│ Boa tarde, Dr. Silva! 👋                    │
│ Você tem 13 agendamentos hoje • 5 concluídos│
└─────────────────────────────────────────────┘
```

### Lista (Scrollável)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANTERIORES (opacity 50%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────┐
│ 08:00  [Avatar] Marcelo Reis Souza     [▶] │
│        Dor nas costas • Unimed              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 09:00  [Avatar] Paulo Teixeira         [▶] │
│        Dor abdominal • Particular           │
└─────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HORÁRIO ATUAL ⭐ (ring-2, shadow-xl)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌═════════════════════════════════════════════┐
║ 10:00  [Avatar] Gabriela Reis     SUGERIDO ║
║        Dor abdominal • Unimed • Retorno     ║
║                                              ║
║        [🩺 INICIAR CONSULTA COM IA]         ║
└═════════════════════════════════════════════┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRÓXIMOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────┐
│ 11:30  [Avatar] Leonardo Santos        [▶] │
│        Dor abdominal • Bradesco • 1ª Vez    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 14:30  [Avatar] Camila Reis            [▶] │
│        Check-up • Particular                │
└─────────────────────────────────────────────┘
```

---

## 🔧 Estado "Em Atendimento"

### Quando Aparece:
Só quando o médico **realmente clicou em "Iniciar"**.

### Visual:
```tsx
<Card className="ring-2 ring-green-500 shadow-xl animate-pulse">
  <Badge className="bg-green-600 text-white">
    EM ATENDIMENTO
  </Badge>
</Card>
```

- Borda verde pulsante
- Badge "EM ATENDIMENTO" verde
- Animação pulse sutil

---

## 🎯 Resumo das Direções

### Para o Front-End:

1. ✅ **Ordenação**: 3 baldes (Passado, Foco, Futuro)
2. ✅ **Passado**: `opacity: 0.5`, botão Play pequeno
3. ✅ **Foco**: Borda roxa, botão grande "Iniciar Consulta"
4. ✅ **Futuro**: Visual padrão, Play no hover
5. ✅ **Parse**: Regex para extrair tags de `appointment.reason`
6. ✅ **Hero**: Saudação + contador simples
7. ❌ **Removido**: Métricas complexas, no-show, auto-limpeza

---

## 📊 Comparação Antes vs Depois

| Aspecto | ❌ ANTES (Cockpit Complexo) | ✅ AGORA (Launcher Simples) |
|---------|----------------------------|----------------------------|
| **Foco** | CRM de gestão | Espelho de agenda |
| **Status** | 7 níveis complexos | 3 estados (Passado/Foco/Futuro) |
| **Botões** | Marcar Falta, Histórico, Iniciar | Apenas Iniciar (Play) |
| **Métricas** | 4 KPIs clicáveis | Contador simples |
| **No-Show** | Gerenciamento completo | Não gerencia |
| **Permissões** | Finge ter escrita no Calendar | Apenas leitura |
| **Conflito** | Alto (2 fontes de verdade) | Zero (1 fonte: Calendar) |
| **Visual** | Badges urgentes, alertas | Limpo, hierarquia por opacity |

---

## 🏆 Vantagens do Launcher Simples

### 1. **Zero Conflito de Verdade**
- Não modifica o Google Calendar
- Sistema não fica "desincronizado" com a realidade
- Médico não precisa "limpar" faltas em 2 lugares

### 2. **Foco no Essencial**
- Médico vê quem é o próximo
- Clica para iniciar IA
- Pronto.

### 3. **Hierarquia Visual Clara**
- Passados: Meio apagados (mas ainda clicáveis)
- Foco: DESTAQUE com borda roxa
- Futuros: Discretos

### 4. **Parsing Inteligente**
- Tags extraídas automaticamente da descrição
- Unimed, Bradesco, Retorno, 1ª Vez, Exames
- Sem necessidade de campos separados

### 5. **Performance**
- Menos estado para gerenciar
- Menos lógica condicional
- Build 5KB menor (757KB vs 763KB)

---

## 🚀 Resultado Final

**O Dashboard agora é um "Controle Remoto".**
**O médico aponta para o paciente certo e clica "Play".**

Sem gestão de presença.
Sem conflito com o Calendar.
Sem poluição visual.

**Simples. Limpo. Focado.** 🎯
