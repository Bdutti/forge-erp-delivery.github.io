# Forge ERP Delivery — Guia de Uso Completo

## 📱 Visão Geral

O **Forge ERP Delivery** é um sistema de gestão de pedidos e produtos com tema industrial dark, desenvolvido especificamente para operações de delivery e restaurantes. O sistema oferece funcionalidades avançadas de análise, sincronização com Google Sheets e monitoramento de concorrentes.

### Características Principais

- **PDV Fullscreen** — Interface otimizada para vendas rápidas
- **Gestão de Pedidos** — Fluxo completo com múltiplos canais (balcão, iFood, WhatsApp, telefone)
- **CRUD de Produtos** — Gerenciar cardápio com cálculo de margem em tempo real
- **Dashboards Avançados** — 4 abas com análise de vendas, estoque, financeiro e executivo
- **Análise de Concorrência** — Benchmarking com scatter plot e comparação de preços
- **Google Sheets Sync** — Exportar dados em tempo real para análise externa
- **Tema Forge Dark** — Interface industrial com acento brasa e animações fluidas

## 🎨 Interface e Navegação

### Rail de Ícones Lateral

O rail lateral esquerdo contém os principais ícones de navegação:

| Ícone | Página | Função |
|-------|--------|--------|
| 📊 | PDV | Ponto de venda fullscreen |
| 🏠 | Pedidos | Gerenciar pedidos com filtros |
| 📦 | Produtos | CRUD de produtos e estoque |
| 📈 | Dashboards | Análise com 4 abas |
| 📉 | Concorrência | Benchmarking e análise de preços |
| ⚙️ | Configurações | Google Sheets e sistema |
| 🚪 | Logout | Sair do sistema |

**Dica:** Passe o mouse sobre os ícones para ver tooltips com nomes das páginas.

## 💰 PDV — Ponto de Venda

### Como usar

1. **Buscar produtos** — Digite no campo de busca para filtrar produtos
2. **Filtrar por categoria** — Clique nas pills de categoria na parte superior
3. **Adicionar ao carrinho** — Clique no produto para adicionar quantidade
4. **Aplicar desconto** — Use o campo de desconto no painel de checkout
5. **Finalizar pedido** — Clique em "Finalizar Pedido" para confirmar

### Informações do Carrinho

- **Total gigante** — Valor total em destaque
- **Itens** — Lista de produtos adicionados
- **Desconto** — Percentual aplicado
- **Número do pedido** — Gerado automaticamente ao finalizar

### Canais de Venda

Selecione o canal de venda:
- **Balcão** — Venda presencial
- **iFood** — Pedido via iFood
- **WhatsApp** — Pedido via WhatsApp
- **Telefone** — Pedido por telefone

## 📋 Pedidos

### Filtros de Status

Use os botões de filtro para visualizar pedidos por status:

- **Pendente** ⏳ — Aguardando preparação
- **Preparando** 🔄 — Em preparação
- **Pronto** ✅ — Pronto para entrega
- **Entregue** 🎉 — Entregue ao cliente
- **Cancelado** ❌ — Pedido cancelado

### Fluxo de Pedidos

1. Pedido chega em status **Pendente**
2. Clique em **Preparar** para mudar para **Preparando**
3. Clique em **Pronto** para mudar para **Pronto**
4. Clique em **Entregar** para finalizar como **Entregue**

### Refresh Automático

O sistema atualiza a lista de pedidos automaticamente a cada 30 segundos. Você pode:
- Desativar auto-refresh clicando em **Auto-refresh OFF**
- Atualizar manualmente clicando em **Atualizar Agora**

### Informações do Pedido

Cada pedido exibe:
- **Número** — ID único do pedido
- **Cliente** — Nome do cliente
- **Canal** — Origem do pedido
- **Total** — Valor total
- **Itens** — Produtos no pedido
- **Status** — Estado atual

## 📦 Produtos

### CRUD Completo

#### Criar Produto

1. Clique em **Novo Produto**
2. Preencha os campos:
   - **Nome** — Nome do produto
   - **Categoria** — Categoria (ex: Hambúrgueres)
   - **Preço** — Preço de venda
   - **Custo** — Custo do produto
   - **Estoque** — Quantidade em estoque
   - **SKU** (opcional) — Código do produto
3. Clique em **Salvar**

#### Editar Produto

1. Clique no botão **Editar** no produto
2. Modifique os campos desejados
3. Clique em **Salvar**

#### Deletar Produto

1. Clique no botão **Deletar** no produto
2. Confirme a exclusão

### Cálculo de Margem em Tempo Real

A margem é calculada automaticamente enquanto você digita:

- **Verde** 🟢 — Margem ≥ 40% (excelente)
- **Amarelo** 🟡 — Margem ≥ 20% (bom)
- **Vermelho** 🔴 — Margem < 20% (crítico)

**Fórmula:** `(Preço - Custo) / Preço × 100`

### Barra de Progresso de Estoque

Cada produto exibe uma barra visual:
- **Verde** — Estoque abundante (> 50 un)
- **Amarelo** — Estoque médio (10-50 un)
- **Vermelho** — Estoque crítico (< 10 un)

## 📊 Dashboards

### Aba Vendas

Visualize:
- **Faturamento** — Total de vendas do período
- **Ticket Médio** — Valor médio por pedido
- **Pedidos por Canal** — Distribuição de vendas
- **Gráfico de Faturamento** — Tendência ao longo do tempo

### Aba Estoque

Visualize:
- **Nível de Estoque** — Quantidade de cada produto
- **Produtos Críticos** — Itens com estoque baixo
- **Rotatividade** — Produtos mais vendidos
- **Alertas** — Produtos que precisam reposição

### Aba Financeiro

Visualize:
- **Receita** — Total de vendas
- **Custo** — Custo dos produtos vendidos
- **Lucro Líquido** — Lucro após custos
- **Fluxo de Caixa** — Entrada e saída de dinheiro

### Aba Executivo

Visualize:
- **KPIs Principais** — Métricas-chave do negócio
- **Alertas Operacionais** — Problemas que precisam atenção
- **Tendências** — Padrões de vendas
- **Metas** — Comparação com objetivos

## 🏆 Concorrência

### Benchmarking

Visualize como você se compara com concorrentes:

- **Taxa de Conversão** — Percentual de vendas bem-sucedidas
- **Tempo Médio** — Tempo para preparar pedido
- **Posição no Mercado** — Ranking entre concorrentes

### Scatter Plot

Gráfico interativo mostrando:
- **Eixo X** — Taxa de conversão (%)
- **Eixo Y** — Tempo médio (minutos)
- **Posição ideal** — Canto superior esquerdo (alta taxa, baixo tempo)

### Sua Vantagem

Tabela comparativa mostrando:
- **Vantagem Taxa** — Diferença em taxa de conversão
- **Vantagem Tempo** — Diferença em tempo de preparação
- **Vantagem Geral** — Score combinado

### Tendência de Preços

Gráfico de linha mostrando evolução de preços nos últimos 6 meses.

### Comparação de Produtos

Gráfico de barras comparando preços de produtos específicos entre você e concorrentes.

## ⚙️ Configurações

### Google Sheets Sync

#### Sincronizar Agora

Clique em **Sincronizar Agora** para exportar todos os dados para Google Sheets:
- Pedidos (última coluna: número, cliente, status, total)
- Produtos (nome, categoria, preço, margem, estoque)
- KPIs (faturamento, ticket médio, lucro)

#### Exportações Individuais

Exporte apenas os dados que você precisa:
- **Exportar Pedidos** — Apenas dados de pedidos
- **Exportar Produtos** — Apenas dados de produtos
- **Exportar KPIs** — Apenas métricas de negócio

#### Requisitos

Para usar Google Sheets Sync:
1. Configure `GOOGLE_CREDENTIALS_B64` com credenciais do Service Account
2. Configure `SHEETS_ID` com o ID da sua planilha
3. Compartilhe a planilha com o email do Service Account

### Informações do Sistema

Visualize:
- **Versão** — Versão do sistema
- **Ambiente** — Produção ou desenvolvimento
- **Banco de Dados** — Tipo de banco em uso
- **Tema** — Tema visual ativo
- **Recursos Disponíveis** — Funcionalidades habilitadas

## 🔑 Atalhos de Teclado

| Atalho | Função |
|--------|--------|
| `Esc` | Fechar diálogos |
| `Enter` | Confirmar ações |
| `Ctrl+S` | Salvar (em formulários) |

## 💡 Dicas e Truques

### Maximizar Produtividade

1. **Use o PDV fullscreen** — Dedique um monitor para o PDV
2. **Organize categorias** — Agrupe produtos relacionados
3. **Defina preços competitivos** — Monitore concorrentes regularmente
4. **Sincronize com Sheets** — Analise dados em tempo real no Google Sheets
5. **Revise KPIs diariamente** — Acompanhe métricas importantes

### Gestão de Estoque

1. **Monitore produtos críticos** — Veja alertas de estoque baixo
2. **Ajuste preços conforme demanda** — Use análise de concorrência
3. **Acompanhe rotatividade** — Identifique produtos lentos
4. **Reponha regularmente** — Não deixe estoque vencer

### Análise de Vendas

1. **Compare canais** — Veja qual canal gera mais vendas
2. **Analise ticket médio** — Identifique oportunidades de upsell
3. **Monitore tendências** — Veja padrões sazonais
4. **Exporte para Sheets** — Faça análises avançadas em Excel

## ❓ Perguntas Frequentes

**P: Como alterar o tema?**
R: O tema Forge Dark é padrão. Você pode customizar cores nas configurações do navegador.

**P: Posso usar em mobile?**
R: O sistema é otimizado para desktop. Mobile é suportado mas não recomendado para PDV.

**P: Como fazer backup dos dados?**
R: Exporte regularmente para Google Sheets ou faça backup do banco de dados.

**P: Posso integrar com meu sistema atual?**
R: Sim, via API tRPC. Consulte a documentação técnica.

**P: Qual é o limite de produtos?**
R: Sem limite técnico. Performance depende do seu banco de dados.

**P: Como adicionar novos canais de venda?**
R: Modifique o enum de canais em `server/routers/forge.ts` e redeploy.

## 📞 Suporte

Para problemas ou dúvidas:
- Consulte a documentação em `README.md`
- Verifique `DEPLOYMENT.md` para configuração
- Abra uma issue no repositório
- Entre em contato com o suporte

---

**Última atualização:** 23 de Março de 2026

**Versão:** 1.0.0

**Desenvolvido com ❤️ usando Forge Dark Theme**
