# Forge ERP Delivery — Guia de Deploy

## 📋 Pré-requisitos

- Node.js 22.13.0+
- pnpm 10.4.1+
- MySQL 8.0+ ou TiDB
- Conta Google Cloud com Google Sheets API habilitada (opcional, para sincronização)

## 🚀 Deploy Local (Desenvolvimento)

### 1. Clonar repositório

```bash
git clone <seu-repositorio>
cd forge-erp-delivery
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/forge_erp

# OAuth
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
JWT_SECRET=seu_jwt_secret_aleatorio

# Owner
OWNER_OPEN_ID=seu_open_id
OWNER_NAME=Seu Nome

# Forge API (Manus)
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api

# Google Sheets (opcional)
GOOGLE_CREDENTIALS_B64=base64_encoded_service_account_json
SHEETS_ID=seu_sheets_id

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=seu_website_id

# App Config
VITE_APP_TITLE=Forge ERP Delivery
VITE_APP_LOGO=https://seu-cdn.com/logo.png
```

### 4. Criar banco de dados

```bash
# Gerar migrações Drizzle
pnpm drizzle-kit generate

# Aplicar migrações (via Management UI ou CLI)
pnpm db:push
```

### 5. Iniciar servidor de desenvolvimento

```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`

## 🌐 Deploy em Produção (Manus)

### 1. Preparar projeto

```bash
# Verificar tipos TypeScript
pnpm check

# Executar testes
pnpm test

# Build
pnpm build
```

### 2. Configurar secrets no Management UI

Acesse o painel de controle e configure:

- `DATABASE_URL` — Connection string do banco de dados
- `JWT_SECRET` — Chave secreta para sessões
- `VITE_APP_ID` — ID da aplicação OAuth
- `OAUTH_SERVER_URL` — URL do servidor OAuth
- `OWNER_OPEN_ID` — OpenID do proprietário
- `OWNER_NAME` — Nome do proprietário
- `BUILT_IN_FORGE_API_KEY` — Chave da API Forge
- `BUILT_IN_FORGE_API_URL` — URL da API Forge
- `GOOGLE_CREDENTIALS_B64` — Credenciais Google (base64)
- `SHEETS_ID` — ID da planilha Google Sheets
- `VITE_APP_TITLE` — Título da aplicação
- `VITE_APP_LOGO` — URL do logo

### 3. Criar checkpoint

```bash
# No Management UI, clique em "Publish" após criar um checkpoint
```

### 4. Deploy automático

O sistema será deployado automaticamente após criar o checkpoint.

## 🔐 Configurar Google Sheets (Opcional)

### 1. Criar Service Account

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto
3. Habilite a Google Sheets API
4. Crie uma chave de serviço (Service Account)
5. Baixe o arquivo JSON

### 2. Codificar credenciais em Base64

```bash
# No Linux/Mac
cat service-account.json | base64 | tr -d '\n'

# No Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Content service-account.json -Raw))) | Set-Clipboard
```

### 3. Configurar variável de ambiente

```env
GOOGLE_CREDENTIALS_B64=seu_base64_aqui
SHEETS_ID=seu_sheets_id
```

### 4. Compartilhar planilha

Compartilhe a planilha Google Sheets com o email do Service Account (encontrado no JSON).

## 📊 Usar Google Sheets Sync

### Via UI

1. Acesse a página de **Configurações** (ícone de engrenagem no rail lateral)
2. Clique em **Sincronizar Agora** para sincronizar todos os dados
3. Ou use os botões individuais para exportar Pedidos, Produtos ou KPIs

### Via API (tRPC)

```typescript
// Sincronizar todos os dados
const resultado = await trpc.forge.sincronizarSheets.mutate();

// Exportar apenas pedidos
const resultado = await trpc.forge.exportarPedidosSheets.mutate();

// Exportar apenas produtos
const resultado = await trpc.forge.exportarProdutosSheets.mutate();

// Exportar apenas KPIs
const resultado = await trpc.forge.exportarKPIsSheets.mutate();
```

## 🧪 Executar Testes

```bash
# Todos os testes
pnpm test

# Testes específicos
pnpm test server/routers/forge.test.ts
pnpm test server/routers/integration.test.ts

# Com cobertura
pnpm test --coverage
```

## 📈 Monitorar em Produção

### Logs

Acesse os logs via Management UI:
- `.manus-logs/devserver.log` — Logs do servidor
- `.manus-logs/browserConsole.log` — Console do navegador
- `.manus-logs/networkRequests.log` — Requisições HTTP

### Health Check

```bash
# Verificar status do servidor
curl https://seu-dominio.manus.space/api/health
```

## 🐛 Troubleshooting

### Erro: "Database connection failed"

- Verifique `DATABASE_URL`
- Certifique-se de que o banco de dados está acessível
- Verifique credenciais e firewall

### Erro: "Google Sheets not configured"

- Verifique se `GOOGLE_CREDENTIALS_B64` está configurado
- Verifique se `SHEETS_ID` está correto
- Certifique-se de que a planilha foi compartilhada com o Service Account

### Erro: "OAuth callback failed"

- Verifique `VITE_APP_ID` e `OAUTH_SERVER_URL`
- Certifique-se de que a URL de callback está registrada no OAuth provider

## 📞 Suporte

Para problemas ou dúvidas:
- Consulte a documentação em `README.md`
- Abra uma issue no repositório
- Entre em contato com o suporte Manus

---

**Última atualização:** 23 de Março de 2026
