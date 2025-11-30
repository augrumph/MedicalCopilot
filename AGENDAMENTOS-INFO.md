# Sistema de Agendamentos - Como Funciona

## 📋 Visão Geral

O sistema de agendamentos foi projetado para trabalhar com **dados reais de pacientes** importados da sua base de dados (CSV, Excel, etc.).

## 🔄 Como os Agendamentos são Criados

### 1. **Fonte de Dados: Pacientes Reais**
- Os agendamentos NÃO usam dados fictícios
- Eles são gerados a partir dos **pacientes já cadastrados** no sistema
- Cada agendamento está vinculado a um paciente real com:
  - ID do paciente
  - Nome do paciente
  - Telefone do paciente
  - Dados reais do cadastro

### 2. **Geração Automática**
Quando você acessa a página de Agendamentos, o sistema:

1. **Verifica** se existem pacientes cadastrados
2. **Verifica** se existem agendamentos para HOJE
3. Se NÃO existirem agendamentos para hoje:
   - Gera automaticamente agendamentos usando pacientes reais
   - Distribui os agendamentos ao longo de 7 dias (hoje + 6 dias futuros)
   - Sempre usa a **data atual** como referência

### 3. **Distribuição de Agendamentos**

#### **HOJE (Dia Atual)**
- 6 a 8 agendamentos
- Status variados: agendado, confirmado, em andamento, concluído
- Horários entre 8h e 17h (com intervalo de almoço 12h-14h)

#### **Próximos 2 Dias**
- 4 a 6 agendamentos por dia
- Status: agendado ou confirmado

#### **Dias 4-7**
- 2 a 4 agendamentos por dia
- Status: agendado ou confirmado

## 🔧 Botão "Atualizar Dados"

O botão permite:
- Limpar todos os agendamentos antigos
- Recriar agendamentos com a **data de hoje**
- Usar os pacientes atuais do banco de dados
- Útil quando:
  - Você importou novos pacientes
  - Os agendamentos estão desatualizados
  - Quer testar com dados frescos

## ⚠️ Importante

### **SEM PACIENTES = SEM AGENDAMENTOS**
Se você não tiver pacientes cadastrados:
- O sistema mostrará um aviso
- Não criará agendamentos fictícios
- Você precisa **importar pacientes primeiro**

### **Como Importar Pacientes**
1. Vá para a página de **Pacientes**
2. Use a função de importação (CSV/Excel)
3. Após importar, volte para **Agendamentos**
4. Clique em **"Atualizar Dados"** para gerar agendamentos

## 📊 Informações dos Agendamentos

Cada agendamento contém:
- **Paciente**: Nome e telefone reais do banco de dados
- **Data**: Sempre atualizada (hoje + próximos dias)
- **Horário**: Slots de 30 minutos (8h às 17h)
- **Tipo**: Consulta, Retorno, Check-up, Procedimento
- **Status**: Agendado, Confirmado, Em andamento, Concluído, Cancelado
- **Motivo**: Razões realistas (dor de cabeça, diabetes, etc.)

## 🎯 Fluxo Recomendado

1. ✅ Importe seus pacientes (CSV/Excel)
2. ✅ Vá para Agendamentos
3. ✅ Sistema gera automaticamente agendamentos
4. ✅ Se precisar atualizar, clique em "Atualizar Dados"
5. ✅ Visualize e gerencie seus agendamentos

## 💡 Dicas

- O sistema mantém agendamentos no localStorage
- Agendamentos são persistentes entre sessões
- Use "Atualizar Dados" quando importar novos pacientes
- Cada paciente pode ter múltiplos agendamentos em dias diferentes
