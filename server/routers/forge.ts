import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  criarPedido,
  upsertProduto,
  atualizarStatus,
  getKPIs,
  getPedidos,
  getProdutos,
  getSnapshotsConcorrente,
} from "../forgedb";
import {
  sincronizarTodosOsDados,
  exportarPedidosParaSheets,
  exportarProdutosParaSheets,
  exportarKPIsParaSheets,
} from "../sheets";

export const forgeRouter = router({
  // ─────────────────────────────────────────────────────────────────────────
  // Pedidos
  // ─────────────────────────────────────────────────────────────────────────

  criarPedido: protectedProcedure
    .input(
      z.object({
        numero: z.string(),
        clienteId: z.number().optional(),
        canal: z.enum(["balcao", "ifood", "whatsapp", "telefone"]),
        itens: z.array(
          z.object({
            produtoId: z.number(),
            quantidade: z.number(),
            precoUnitario: z.number(),
          })
        ),
        desconto: z.number().optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await criarPedido(input);
    }),

  atualizarStatus: protectedProcedure
    .input(
      z.object({
        pedidoId: z.number(),
        novoStatus: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await atualizarStatus(input.pedidoId, input.novoStatus);
    }),

  listarPedidos: protectedProcedure
    .input(
      z.object({
        status: z.string().optional(),
        canal: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await getPedidos(input);
    }),

  // ─────────────────────────────────────────────────────────────────────────
  // Produtos
  // ─────────────────────────────────────────────────────────────────────────

  upsertProduto: protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        nome: z.string(),
        descricao: z.string().optional(),
        preco: z.number(),
        custo: z.number(),
        estoque: z.number().optional(),
        categoria: z.string(),
        sku: z.string().optional(),
        ativo: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await upsertProduto(input);
    }),

  listarProdutos: protectedProcedure
    .input(
      z.object({
        categoria: z.string().optional(),
        ativo: z.boolean().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await getProdutos(input);
    }),

  // ─────────────────────────────────────────────────────────────────────────
  // KPIs & Analytics
  // ─────────────────────────────────────────────────────────────────────────

  getKPIs: protectedProcedure.query(async () => {
    return await getKPIs();
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Concorrência
  // ─────────────────────────────────────────────────────────────────────────

  listarSnapshotsConcorrente: protectedProcedure
    .input(
      z.object({
        concorrente: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await getSnapshotsConcorrente(input);
    }),

  sincronizarSheets: protectedProcedure.mutation(async () => {
    try {
      const pedidos = await getPedidos({});
      const produtos = await getProdutos({});
      const kpis = await getKPIs();

      const sucesso = await sincronizarTodosOsDados(pedidos, produtos, kpis);

      return {
        sucesso,
        mensagem: sucesso
          ? "Dados sincronizados com Google Sheets com sucesso"
          : "Erro ao sincronizar dados com Google Sheets",
        timestamp: new Date(),
      };
    } catch (error: any) {
      return {
        sucesso: false,
        mensagem: `Erro ao sincronizar: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }),

  exportarPedidosSheets: protectedProcedure.mutation(async () => {
    try {
      const pedidos = await getPedidos({});
      const sucesso = await exportarPedidosParaSheets(pedidos);

      return {
        sucesso,
        mensagem: sucesso
          ? `${pedidos.length} pedidos exportados com sucesso`
          : "Erro ao exportar pedidos",
      };
    } catch (error: any) {
      return {
        sucesso: false,
        mensagem: `Erro: ${error.message}`,
      };
    }
  }),

  exportarProdutosSheets: protectedProcedure.mutation(async () => {
    try {
      const produtos = await getProdutos({});
      const sucesso = await exportarProdutosParaSheets(produtos);

      return {
        sucesso,
        mensagem: sucesso
          ? `${produtos.length} produtos exportados com sucesso`
          : "Erro ao exportar produtos",
      };
    } catch (error: any) {
      return {
        sucesso: false,
        mensagem: `Erro: ${error.message}`,
      };
    }
  }),

  exportarKPIsSheets: protectedProcedure.mutation(async () => {
    try {
      const kpis = await getKPIs();
      const sucesso = await exportarKPIsParaSheets(kpis);

      return {
        sucesso,
        mensagem: sucesso
          ? "KPIs exportados com sucesso"
          : "Erro ao exportar KPIs",
      };
    } catch (error: any) {
      return {
        sucesso: false,
        mensagem: `Erro: ${error.message}`,
      };
    }
  }),
});
