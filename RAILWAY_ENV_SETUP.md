# 🚂 Railway - Configuração de Variáveis de Ambiente

## ⚠️ IMPORTANTE: Configurar ANTES do próximo deploy

A chave do Gemini agora é lida de **variável de ambiente**. Você precisa adicionar `VITE_GEMINI_API_KEY` na Railway.

---

## 📝 Passo a Passo

### 1. Acesse o Dashboard da Railway

1. Vá para: https://railway.app/
2. Faça login
3. Selecione o projeto **MedicalCopilot**

### 2. Adicione a Variável de Ambiente

1. Clique na aba **Variables**
2. Clique em **+ New Variable**
3. Adicione:

```
VITE_GEMINI_API_KEY=AIzaSyCs1bFvOlN7zOHP2Mw6TJev6tWxFgJaAwE
```

### 3. Verifique Outras Variáveis Necessárias

Certifique-se de que TODAS essas variáveis estão configuradas na Railway:

```bash
# Google Calendar
VITE_GOOGLE_CLIENT_ID=278224527355-2pl19it9k6gur53qea5rkv0c5rj22fg0.apps.googleusercontent.com

# Deepgram (Transcrição)
VITE_DEEPGRAM_API_KEY=e331b3f55c981613e21ddc07ad5ae38980cb156c

# OpenAI (se usar)
VITE_OPENAI_API_KEY=<sua-chave-openai>
VITE_OPENAI_MODEL=gpt-4o-mini

# Gemini (NOVA - ADICIONAR AGORA!)
VITE_GEMINI_API_KEY=AIzaSyCs1bFvOlN7zOHP2Mw6TJev6tWxFgJaAwE

# Backend URL (ajustar para URL da Railway)
VITE_BACKEND_URL=https://seu-backend.up.railway.app
```

### 4. Salvar e Redeploy

1. Clique em **Save** ou **Add**
2. A Railway vai fazer **redeploy automático**
3. Aguarde o build completar (~3-5 minutos)

---

## ✅ Como Verificar se Funcionou

Após o deploy:

1. Abra a aplicação no navegador
2. Vá para **Consulta** > **Consulta ao Vivo**
3. Clique em **Iniciar** gravação
4. Fale por 15-20 segundos
5. Pare a gravação
6. **Aguarde 10 segundos** (análise demora um pouco)
7. Insights devem aparecer na tela

Se aparecer erro **403 Forbidden** no console, a chave não foi configurada corretamente.

---

## 🔒 Segurança

### ⚠️ Chaves Expostas Publicamente

**ATENÇÃO:** As chaves que você forneceu estão sendo enviadas publicamente nesta conversa e **podem vazar**.

**Recomendação URGENTE:**

1. **Após configurar a Railway**, gere **NOVAS chaves** em:
   - Gemini: https://aistudio.google.com/app/apikey
   - Deepgram: https://console.deepgram.com/
   - Google Calendar: https://console.cloud.google.com/

2. **Revogue as chaves antigas** para evitar uso indevido

3. **Atualize** tanto o `.env` local quanto as variáveis da Railway

### ✅ Boas Práticas

- ✅ Variáveis de ambiente no `.env` (local) e Railway (produção)
- ✅ Arquivo `.env` no `.gitignore` (nunca commitar)
- ✅ Usar `.env.example` como template
- ❌ NUNCA colocar chaves direto no código
- ❌ NUNCA commitar o `.env` no Git

---

## 🐛 Troubleshooting

### Erro: "VITE_GEMINI_API_KEY is undefined"

**Causa:** Variável não configurada na Railway

**Solução:** Adicione `VITE_GEMINI_API_KEY` nas variáveis de ambiente e redeploy

### Erro: "403 Forbidden - API key leaked"

**Causa:** Chave foi reportada como vazada pelo Google

**Solução:** Gere nova chave em https://aistudio.google.com/app/apikey

### Insights não aparecem

**Possíveis causas:**

1. Variável não configurada → Verificar Railway Variables
2. Chave inválida → Testar no test-gemini.html local
3. Transcrição muito curta → Falar por 15+ segundos
4. Análise ainda processando → Aguardar 10-15 segundos

---

## 📞 Suporte

Se continuar com problemas:

1. Verificar **console do navegador** (F12) para erros
2. Verificar **logs da Railway** para erros de build
3. Testar **localmente** primeiro (`npm run dev`)
4. Gerar **nova chave** se necessário

---

**Status:** ✅ Código atualizado e commitado
**Próximo Passo:** ⚠️ Configurar VITE_GEMINI_API_KEY na Railway
