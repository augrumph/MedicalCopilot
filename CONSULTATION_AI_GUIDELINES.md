# Diretrizes para IA - Página de Consulta Anterior

## Objetivo
Ajudar médicos que atendem alto volume (300+ pacientes/mês) a relembrar rapidamente consultas anteriores e conduzir retornos de forma eficiente.

## 1. KPIs (Métricas em Destaque)

### O que são
Métricas objetivas e acionáveis exibidas no topo da página para visualização rápida.

### Exemplos de KPIs que a IA deve extrair:

#### ✅ Temporais
- `"15d atrás"` - Dias desde última consulta
- `"Há 3 meses"` - Tempo de acompanhamento
- `"Retorno: 7 dias"` - Próximo retorno previsto

#### ✅ Quantitativos
- `"3 medicações"` - Número de medicamentos prescritos
- `"2 exames"` - Exames solicitados/pendentes
- `"5 orientações"` - Número de orientações dadas
- `"2 alertas"` - Diagnósticos críticos

#### ✅ Clínicos (extraídos da transcrição)
- `"Dor 7/10"` - Escala de dor relatada
- `"5 crises/sem"` - Frequência de episódios
- `"Febre 38.5°C"` - Sinais vitais importantes
- `"PA 140/90"` - Pressão arterial

#### ✅ Diagnóstico resumido
- `"Infecção Respiratória"` - Diagnóstico principal (máx 3 palavras)
- `"HAS + DM2"` - Múltiplas condições

### Formato dos KPIs
```typescript
{
  label: string,    // Curto, max 2 palavras
  value: string,    // Valor objetivo
  color: 'blue' | 'green' | 'purple' | 'red'
}
```

---

## 2. Perguntas Sugeridas (CRITICAL)

### O que NÃO fazer ❌
**NUNCA criar perguntas genéricas:**
- ❌ "Como está se sentindo?"
- ❌ "Melhorou?"
- ❌ "Está tomando os remédios?"
- ❌ "Como foi a semana?"

### O que fazer ✅
**SEMPRE criar perguntas específicas e contextualizadas** baseadas em:

#### 1. Sintomas específicos da última consulta
```
Extrair da transcrição:
- Característica do sintoma
- Intensidade
- Localização
- Frequência
- Gatilhos

Exemplo de pergunta:
✅ "A dor de cabeça que estava pulsátil na região temporal e intensidade 8/10 melhorou?"
✅ "As tonturasao levantar pela manhã que você relatou ainda acontecem?"
✅ "A tosse seca noturna que te acordava 3x por noite diminuiu?"
```

#### 2. Medicações prescritas
```
Extrair:
- Nome do medicamento
- Dose
- Via de administração
- Horário
- Duração

Exemplo de pergunta:
✅ "Conseguiu tomar o Losartana 50mg pela manhã todos os dias?"
✅ "O Omeprazol 20mg em jejum está controlando o refluxo?"
✅ "Teve algum efeito colateral com a Amoxicilina 500mg de 8/8h?"
```

#### 3. Exames solicitados
```
Exemplo de pergunta:
✅ "Fez o hemograma completo que solicitei? Trouxe o resultado?"
✅ "Conseguiu agendar a ultrassom de abdome?"
✅ "Verificou a glicemia em jejum como pedi?"
```

#### 4. Orientações não farmacológicas
```
Exemplo de pergunta:
✅ "Conseguiu aumentar a ingestão de água para 2L/dia como orientei?"
✅ "Fez as caminhadas de 30 minutos 3x por semana?"
✅ "Reduziu o sal da alimentação conforme conversamos?"
```

#### 5. Evolução esperada
```
Baseado no diagnóstico e tempo decorrido:
✅ "A febre que durava 3 dias já passou completamente?"
✅ "Os 7 dias de antibiótico terminaram? Como está a infecção?"
✅ "Depois de 15 dias de tratamento, a dor articular melhorou?"
```

### Template para geração de perguntas

```typescript
interface ContextualQuestion {
  // Elementos extraídos da consulta anterior
  symptom: {
    type: string;           // Ex: "dor de cabeça"
    characteristics: string; // Ex: "pulsátil"
    location: string;        // Ex: "região temporal"
    intensity: string;       // Ex: "8/10"
    frequency: string;       // Ex: "3x ao dia"
  };

  // Gerar pergunta
  question: string; // Ex: "A dor de cabeça pulsátil na região temporal, que estava 8/10 e ocorria 3x ao dia, melhorou?"
}
```

### Priorização das perguntas (ordem de importância):

1. **Sintoma principal** - O que trouxe o paciente
2. **Aderência ao tratamento** - Se seguiu medicação principal
3. **Evolução/Sinais de alerta** - Melhora, piora ou complicações

---

## 3. Bullet Points do Resumo

### Seções obrigatórias:

#### DIAGNÓSTICO
```
✅ Objetivo e específico:
• Rinossinusite aguda bacteriana
• Hipertensão arterial sistêmica estágio 1
• Diabetes mellitus tipo 2 descompensado

❌ Evitar genérico:
• Problema respiratório
• Pressão alta
• Açúcar no sangue
```

#### CONDUTA ANTERIOR
```
✅ Completa e acionável:
• Amoxicilina 500mg VO de 8/8h por 7 dias
• Aumentar ingesta hídrica para 2-3L/dia
• Repouso relativo por 3 dias
• Retorno se febre persistir > 48h

❌ Evitar vago:
• Antibiótico
• Beber água
• Descansar
```

#### OBSERVAÇÕES
```
Extrair pontos críticos da nota clínica:
• Paciente refere cefaleia há 5 dias
• Nega comorbidades prévias
• História familiar positiva para HAS (mãe e pai)
• Último exame de glicemia: 145mg/dL (há 2 meses)
```

---

## 4. Alertas Importantes

Destacar em vermelho se houver:
- Diagnósticos que não pode perder (red flags)
- Sintomas de alarme
- Necessidade de exames urgentes
- Follow-up crítico

```
Exemplo:
⚠️ ATENÇÃO:
• Descartar meningite bacteriana (cefaleia + rigidez de nuca)
• Monitorar sinais de sepse
• Reavaliar em 24-48h se não houver melhora
```

---

## Exemplo Completo de Página Gerada pela IA

```
PACIENTE: Maria Silva, 45 anos
ÚLTIMA CONSULTA: 15d atrás

KPIs:
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Última consulta │ Diagnóstico     │ Orientações     │ ⚠️ Alertas      │
│ 15d atrás       │ Enxaqueca       │ 4 itens         │ 1 crítico       │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘

PERGUNTAR AO PACIENTE:
1. A dor de cabeça pulsátil na região frontal que estava 8/10 e durava 4-6 horas melhorou?
2. O Naproxeno 500mg que orientei tomar no início da dor funcionou? Precisou tomar quantas vezes?
3. Os gatilhos que identificamos (falta de sono e pular refeições) - conseguiu evitar?

DIAGNÓSTICO:
• Enxaqueca sem aura - padrão típico
• Cefaleia tensional secundária (relacionada a estresse)

CONDUTA ANTERIOR:
• Naproxeno 500mg VO no início da dor (máx 2x/dia)
• Evitar gatilhos: jejum prolongado, privação de sono
• Diário de cefaleia por 1 mês
• Retorno em 30 dias ou se crises > 3x/semana

OBSERVAÇÕES:
• Crises de cefaleia há 6 meses, piorando últimas semanas
• 5-6 crises por mês, durando 4-6 horas cada
• Analgésicos comuns (paracetamol) sem efeito
• Trabalha em TI, longas horas de tela
• Mãe com enxaqueca (história familiar positiva)

⚠️ ALERTA:
• Retornar imediatamente se desenvolver: déficit neurológico, rigidez de nuca, febre ou alteração de consciência
```

---

## Métricas de Sucesso

Uma boa página de consulta anterior deve permitir ao médico:
- ✅ Relembrar o caso em **< 30 segundos**
- ✅ Ter **3 perguntas específicas** prontas para fazer
- ✅ Identificar **pontos de alerta** imediatamente
- ✅ Ver **evolução esperada** vs realidade

---

## Implementação Técnica

A IA deve processar:
1. **Transcrição da consulta anterior** (texto completo)
2. **Nota clínica gerada** (texto estruturado)
3. **Diagnósticos sugeridos** (lista)
4. **Orientações ao paciente** (lista)

E gerar:
1. **4-6 KPIs objetivos**
2. **3 perguntas contextualizadas**
3. **Bullet points resumidos**
4. **Alertas se necessário**

### Exemplo de prompt para IA:

```
Você é um assistente médico especializado. Analise a consulta anterior e gere:

CONSULTA ANTERIOR:
{transcrição completa da consulta}

GERE:

1. KPIs (4 métricas):
- Tempo desde última consulta
- Diagnóstico principal (máx 3 palavras)
- Número de orientações
- Alertas críticos (se houver)

2. 3 PERGUNTAS ESPECÍFICAS para fazer ao paciente hoje:
- Devem referenciar sintomas EXATOS mencionados (intensidade, localização, características)
- Devem mencionar medicações ESPECÍFICAS (nome, dose, horário)
- NUNCA use perguntas genéricas
Formato: "O [sintoma específico com características] que estava [intensidade/frequência] [melhorou/piorou/igual]?"

3. BULLET POINTS:
Diagnóstico: [lista]
Conduta anterior: [lista]
Observações: [máx 5 pontos-chave]

4. ALERTAS (se houver diagnósticos críticos):
[lista de red flags]
```
