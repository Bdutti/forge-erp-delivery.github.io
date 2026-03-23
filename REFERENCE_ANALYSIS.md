# Análise da Referência delivery_erp

## 📋 Resumo Executivo

O projeto `delivery_erp` é uma solução Python/SQLite com 3 pilares principais:
1. **Scraper iFood** — Coleta dados de concorrentes via Selenium + BeautifulSoup
2. **Sincronização Google Sheets** — Exporta dados para análise externa
3. **Pipeline CI/CD** — GitHub Actions com agendamento diário + disparo manual

## 🗄️ Arquitetura de Banco de Dados

### Tabelas Principais (SQLite)

| Tabela | Propósito | Notas |
|--------|-----------|-------|
| `restaurantes` | Concorrentes monitorados | `eh_proprio=1` marca próprio negócio |
| `snapshots_concorrente` | Histórico de métricas | Rating, tempo entrega, taxa, horários |
| `itens_cardapio` | Cardápio histórico | Preço, disponibilidade, categoria |
| `pedidos` | Vendas do próprio negócio | Status: aberto→preparando→pronto→entregue |
| `itens_pedido` | Linhas de pedido | Quantidade, preço unitário, desconto |
| `produtos` | Catálogo próprio | Estoque, custo, preço venda |
| `clientes` | Base de clientes | Canal origem, histórico gasto |
| `movimentacoes_estoque` | Auditoria de estoque | Entrada/saída/ajuste/perda |
| `caixa_sessoes` | Abertura/fechamento de caixa | Totais por forma pagamento |
| `configuracoes` | Variáveis de sistema | Nome empresa, fuso horário, etc |

**Diferenças vs. Forge ERP atual:**
- `delivery_erp` usa SQLite; Forge usa MySQL
- `delivery_erp` tem tabelas de auditoria (`movimentacoes_estoque`, `caixa_sessoes`)
- `delivery_erp` separa `restaurantes` (concorrentes) de `produtos` (próprio)
- Forge consolidou em `snapshotsConcorrente` sem histórico de cardápio

## 🕷️ Estratégia de Scraper iFood

### Fluxo
1. **Inicializar Selenium** com Chrome headless
2. **Carregar URL** do restaurante iFood
3. **Aguardar elementos** (rating, tempo entrega, cardápio)
4. **Extrair dados** com BeautifulSoup
5. **Persistir snapshot** com timestamp
6. **Retry automático** (3 tentativas, delay 5s)

### Dados Coletados por Snapshot
- Rating e número de avaliações
- Tempo entrega (min/max)
- Taxa de entrega
- Distância
- Horários abertura/fechamento
- Número de itens no cardápio
- Itens individuais (nome, preço, categoria, disponibilidade)

### Configuração
- URLs monitoradas em `config/urls_monitoradas.txt` (uma por linha)
- Suporta `--proprio` para marcar restaurante como próprio negócio
- Logs salvos em `logs/scraper_YYYYMMDD_HHMMSS.log`

## 📊 Sincronização Google Sheets

### Abas Geradas
- **vendas**: Todos os pedidos com detalhes (número, data, hora, cliente, canal, status, total)
- **itens_vendidos**: Itens por pedido (produto, quantidade, preço unitário, subtotal)
- **estoque**: Produtos com estoque atual, mínimo, custo, preço venda
- **concorrentes**: Snapshots de concorrentes (restaurante, data, rating, taxa, tempo)
- **cardapio_concorrentes**: Itens de cardápio históricos (restaurante, categoria, preço)

### Fluxo
1. Conectar com `gspread` + Service Account (credenciais JSON)
2. Abrir planilha por ID
3. Para cada aba: limpar, escrever cabeçalho, inserir dados
4. Timestamp de sincronização no rodapé

### Credenciais
- Service Account JSON → base64 → armazenado em `GOOGLE_CREDENTIALS_B64` (secret GitHub)
- Planilha compartilhada com e-mail da service account
- ID da planilha em `SHEETS_ID` (secret GitHub)

## 🚀 Pipeline CI/CD (GitHub Actions)

### Triggers
1. **Agendado**: Diariamente 03:00 BRT (06:00 UTC)
2. **Manual** (`workflow_dispatch`): Com opções `modo` (tudo/somente_scraper/somente_sync) e `headless`
3. **Push/PR**: Lint + testes em mudanças no código

### Jobs
| Job | Quando | Ação |
|-----|--------|------|
| `lint` | Push/PR | Ruff lint + mypy type-check |
| `tests` | Push/PR | pytest com cobertura |
| `scraper` | Schedule/Manual | Executa scraper, salva DB como artefato |
| `sync_sheets` | Schedule/Manual (depende scraper) | Sincroniza dados para Sheets |
| `notificar_falha` | Qualquer falha | POST webhook (Slack/Discord) |

### Artefatos
- `delivery-erp-db`: Banco SQLite (retenção 90 dias)
- `relatorios-scraping`: JSONs de relatório (retenção 30 dias)

### Secrets Necessários
- `CIDADE_MONITORADA`: Ex. "São Paulo"
- `URL_PROPRIO_RESTAURANTE`: URL iFood do próprio restaurante
- `GOOGLE_CREDENTIALS_B64`: Service Account JSON em base64
- `SHEETS_ID`: ID da planilha Google Sheets
- `WEBHOOK_NOTIFICACAO`: URL webhook para falhas (Slack/Discord)

## 🔄 Recomendações de Integração com Forge ERP

### 1. **Scraper iFood → tRPC Procedure**
```typescript
// server/routers.ts
scraper: router({
  executarScraping: protectedProcedure
    .input(z.object({ urls: z.array(z.string()), cidade: z.string() }))
    .mutation(async ({ input }) => {
      // Chamar scraper Python via child_process ou API REST
      // Salvar snapshots em `snapshotsConcorrente`
    }),
})
```

### 2. **Google Sheets Sync → tRPC + Webhook**
```typescript
sync: router({
  sincronizarSheets: protectedProcedure
    .mutation(async () => {
      // Exportar pedidos, produtos, KPIs para Sheets
      // Usar gspread-js ou API REST do Google Sheets
    }),
})
```

### 3. **CI/CD GitHub Actions → Manus Deploy**
- Manter pipeline Python para scraper (não há Selenium em Node.js puro)
- Adicionar job Node.js para testes de tRPC
- Usar `manus-upload-file` para artefatos críticos
- Webhook de notificação → Manus notification API

### 4. **Banco de Dados**
- Manter schema Drizzle atual
- Adicionar tabelas de auditoria (movimentacoes_estoque, caixa_sessoes)
- Considerar índices para queries de concorrência

## 📝 Próximas Etapas Recomendadas

1. **Implementar tRPC routers** para scraper e sync (Fases 4-6)
2. **Criar UI para Dashboards** com dados de concorrência (Fase 7)
3. **Integrar Google Sheets API** em Node.js (Fase 9)
4. **Configurar GitHub Actions** com jobs Node.js + Python (Fase 11)
5. **Adicionar auditoria de estoque** e caixa (feature futura)
