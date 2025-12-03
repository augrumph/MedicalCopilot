# 📅 Guia de Integração de Calendários

Este guia mostra como conectar seus calendários médicos ao MedicalCopilot.

---

## 🟢 Google Calendar (RECOMENDADO)

O Google Calendar é **compatível com**:
- ✅ **Doctoralia** (sincroniza automaticamente)
- ✅ **iClinic** (exporta para Google)
- ✅ **GestãoDS** (sincroniza com Google)
- ✅ **Android** (nativo)
- ✅ **iPhone/iPad** (adicione conta Google)

### Setup Rápido (5 minutos)

#### 1️⃣ Abra o Google Cloud Console
**Link direto:** https://console.cloud.google.com/apis/credentials

#### 2️⃣ Crie um Projeto (se ainda não tiver)
- Clique em **"CREATE PROJECT"** (canto superior)
- Nome: `MedicalCopilot`
- Clique em **"CREATE"**

#### 3️⃣ Ative a API do Google Calendar
**Link direto:** https://console.cloud.google.com/apis/library/calendar-json.googleapis.com
- Clique em **"ENABLE"**

#### 4️⃣ Configure OAuth Consent Screen
**Link direto:** https://console.cloud.google.com/apis/credentials/consent
- Escolha **"External"**
- Preencha:
  - **App name:** `MedicalCopilot`
  - **User support email:** seu email
  - **Developer contact:** seu email
- Clique em **"SAVE AND CONTINUE"** até terminar

#### 5️⃣ Crie o OAuth Client ID
**Link direto:** https://console.cloud.google.com/apis/credentials
- Clique em **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
- **Application type:** `Web application`
- **Name:** `MedicalCopilot Web Client`

**⚠️ IMPORTANTE - Authorized JavaScript origins:**
Adicione estes 3 URIs (clique em "+ ADD URI" para cada um):
```
http://localhost:5173
http://localhost:5174
http://localhost:3000
```

- Clique em **"CREATE"**

#### 6️⃣ Copie o Client ID
- Uma janela vai aparecer com seu **Client ID**
- Copie o código (formato: `123456789-abc.apps.googleusercontent.com`)
- Cole no arquivo `.env`:
```bash
VITE_GOOGLE_CLIENT_ID=seu-client-id-aqui.apps.googleusercontent.com
```

#### 7️⃣ Reinicie o Servidor
```bash
# Pare o servidor (Ctrl+C)
npm run dev
```

✅ **Pronto!** O botão "Conectar Conta Google" agora funciona.

---

## 🍎 Apple Calendar / iCloud

Se você usa **Apple Calendar** (Mac/iPhone), você pode:

### Opção 1: Adicionar conta Google ao Apple Calendar (RECOMENDADO)
1. No Mac: **System Settings** → **Internet Accounts** → Adicionar conta Google
2. No iPhone: **Settings** → **Calendar** → **Accounts** → Adicionar conta Google
3. Use a integração Google acima ✅

### Opção 2: Exportar link público iCal
1. Abra **Calendar** no Mac
2. Clique com botão direito no calendário
3. **Sharing Settings** → Marque **"Public Calendar"**
4. Copie o link que aparece
5. Cole no campo **"Link da Agenda (.ics)"** no MedicalCopilot

---

## 🏥 Softwares Médicos Populares

### Doctoralia
- ✅ **Sincroniza automaticamente com Google Calendar**
- Configure no app: **Configurações** → **Integrações** → **Google Calendar**
- Use a integração Google acima

### iClinic
- ✅ **Exporta para Google Calendar**
- No iClinic: **Agenda** → **Exportar** → **Google Calendar**
- Use a integração Google acima

### Feegow
1. No Feegow: **Configurações** → **Exportar Agenda**
2. Copie o **link público (.ics)**
3. Cole no campo **"Link da Agenda (.ics)"** no MedicalCopilot

### ProDoctor
1. **Menu** → **Configurações** → **Sincronização de Calendário**
2. Ative **"Calendário Público"**
3. Copie o link iCal
4. Cole no MedicalCopilot

### HiDoctor
1. **Configurações** → **Agenda** → **Feed iCal**
2. Copie o link público
3. Cole no MedicalCopilot

### GestãoDS
- ✅ **Sincroniza com Google Calendar**
- Configure: **Integrações** → **Google**
- Use a integração Google acima

---

## 📧 Outlook / Office 365

1. Acesse **Outlook.com** ou **Office 365**
2. **Settings** → **Calendar** → **Shared calendars**
3. Selecione o calendário → **Publish**
4. Copie o link **ICS**
5. Cole no MedicalCopilot

---

## ❓ Troubleshooting

### "Google não configurado"
- Verifique se você colocou o Client ID no arquivo `.env`
- Reinicie o servidor: `Ctrl+C` → `npm run dev`

### "Erro 403: access_denied" ou "Acesso bloqueado: o app não concluiu o processo de verificação"
**Solução:**
1. Abra: https://console.cloud.google.com/apis/credentials/consent
2. Na seção **"Test users"**, clique em **"+ ADD USERS"**
3. Adicione seu email (o mesmo que você usa no Google Calendar)
4. Clique em **"SAVE"**
5. Tente conectar novamente

**Por que isso acontece?**
- Quando o app está em modo de desenvolvimento, o Google só permite acesso a emails pré-aprovados
- Você pode adicionar até 100 emails de testadores
- Alternativamente, você pode clicar em **"PUBLISH APP"** para liberar para todos (não recomendado durante desenvolvimento)

### "Erro ao conectar com Google Calendar"
- Verifique se adicionou `http://localhost:5173` nas **Authorized JavaScript origins**
- Tente desabilitar bloqueadores de popup
- Certifique-se de que a API do Google Calendar está habilitada
- Limpe o cache do navegador e tente novamente

### Link iCal não funciona
- Certifique-se de que o link termina com `.ics` ou contém `ical`/`calendar`
- Verifique se o calendário está configurado como **público**
- Teste o link no navegador (deve baixar um arquivo .ics)

---

## 🔐 Segurança

- ✅ Seus dados nunca saem do navegador
- ✅ O token de acesso é armazenado localmente
- ✅ Links iCal são somente leitura
- ✅ Você pode desconectar a qualquer momento

---

## 📞 Suporte

Encontrou algum problema? Abra uma issue no repositório ou entre em contato.
