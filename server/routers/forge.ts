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
});
