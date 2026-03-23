# Forge ERP Delivery — TODO

## Tema & UI Base
- [x] Implementar tema Forge Dark com 6 camadas de superfície (--s0 a --s6)
- [x] Configurar acento brasa #ff6b2b com efeito glow
- [x] Adicionar tipografia Barlow Condensed + DM Mono
- [x] Implementar grain overlay de ruído sutil
- [x] Criar rail de ícones lateral com tooltip
- [x] Implementar badge de notificação vivo
- [x] Adicionar animações de entrada escalonadas por página

## Backend & Banco de Dados
- [x] Criar schema Drizzle para pedidos, produtos, clientes, itens_pedido, snapshots_concorrente
- [x] Implementar ForgeDB simulado com localStorage (compatível com tRPC)
- [x] Implementar criarPedido() com decremento automático de estoque
- [x] Implementar upsertProduto()
- [x] Implementar atualizarStatus()
- [x] Implementar getKPIs()
- [ ] Criar procedures tRPC para todas as operações

## PDV Fullscreen
- [ ] Implementar grid de produtos com stripes de categoria coloridas
- [ ] Implementar busca em tempo real
- [ ] Criar pills de categoria horizontal
- [ ] Implementar checkout panel fixo à direita com total gigante
- [ ] Adicionar toast de confirmação com número do pedido
- [ ] Integrar decremento automático de estoque ao criar pedido

## Página de Pedidos
- [ ] Implementar filtros de status com contadores
- [ ] Implementar fluxo de avanço de status inline
- [ ] Implementar cancelamento inline
- [ ] Adicionar refresh automático a cada 30s
- [ ] Exibir lista de pedidos com cliente, status, canal e total

## Página de Produtos
- [ ] Implementar CRUD completo (criar, ler, atualizar, deletar)
- [ ] Implementar cálculo de margem em tempo real
- [ ] Adicionar mudança de cor verde/amarelo/vermelho conforme margem
- [ ] Implementar barra de progresso de estoque por produto
- [ ] Adicionar validação de campos

## Dashboards (4 Abas)
- [ ] Aba Vendas: gráficos de faturamento, ticket médio, pedidos por canal
- [ ] Aba Estoque: níveis de estoque, produtos críticos, rotatividade
- [ ] Aba Financeiro: receita, custos, lucro, fluxo de caixa
- [ ] Aba Executivo: KPIs principais, alertas operacionais, tendências
- [ ] Integrar Chart.js para todos os gráficos
- [ ] Usar dados reais do banco

## Página de Concorrência
- [ ] Implementar benchmarking completo
- [ ] Criar scatter plot taxa × tempo
- [ ] Adicionar coluna "sua vantagem" automática
- [ ] Exibir snapshots de preços de concorrentes
- [ ] Implementar comparação visual

## Google Sheets Sync
- [ ] Configurar credenciais Google (service account)
- [ ] Implementar exportação de pedidos em tempo real
- [ ] Implementar exportação de produtos em tempo real
- [ ] Implementar exportação de KPIs em tempo real
- [ ] Adicionar sincronização bidirecional
- [ ] Criar tabelas estruturadas na planilha

## Scraper de Concorrentes
- [ ] Implementar scraper de iFood
- [ ] Criar snapshots periódicos de preços
- [ ] Salvar dados no banco (snapshots_concorrente)
- [ ] Implementar alertas para mudanças significativas
- [ ] Adicionar monitoramento de produtos

## Pipeline CI/CD
- [ ] Criar workflow GitHub Actions
- [ ] Implementar validação de estrutura
- [ ] Implementar testes de conectividade
- [ ] Implementar deploy automático
- [ ] Adicionar verificação de dependências
- [ ] Configurar secrets (GOOGLE_CREDENTIALS_B64, SHEETS_ID, etc.)

## Testes & Validação
- [ ] Escrever testes vitest para procedures tRPC
- [ ] Testar fluxo completo de pedido
- [ ] Testar CRUD de produtos
- [ ] Testar cálculos de KPIs
- [ ] Testar sincronização com Google Sheets
- [ ] Testar scraper de concorrentes

## Entrega
- [ ] Criar checkpoint final
- [ ] Documentar instruções de deploy
- [ ] Preparar guia de uso do sistema
