import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { feedbacks } from "../../drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";

export const feedbackRouter = router({
  /**
   * criar — Create new feedback
   */
  criar: protectedProcedure
    .input(
      z.object({
        tipo: z.enum(["bug", "sugestao", "elogio", "outro"]),
        mensagem: z.string().min(10).max(1000),
        email: z.string().email().optional(),
        pagina: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [feedback] = await db
        .insert(feedbacks)
        .values({
          userId: ctx.user.id,
          tipo: input.tipo,
          mensagem: input.mensagem,
          email: input.email,
          pagina: input.pagina,
          status: "novo",
        })
        .$returningId();

      return feedback;
    }),

  /**
   * listar — List feedbacks (admin only)
   */
  listar: protectedProcedure
    .input(
      z.object({
        status: z.enum(["novo", "lido", "em_analise", "resolvido"]).optional(),
        tipo: z.enum(["bug", "sugestao", "elogio", "outro"]).optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Only admins can list feedbacks
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      let query = db.select().from(feedbacks);

      const conditions: any[] = [];
      if (input.status) {
        conditions.push(eq(feedbacks.status, input.status));
      }
      if (input.tipo) {
        conditions.push(eq(feedbacks.tipo, input.tipo));
      }

      if (conditions.length > 0) {
        // @ts-ignore
        query = query.where(...conditions);
      }

      // @ts-ignore
      query = query.orderBy(desc(feedbacks.createdAt));

      if (input.limit) {
        // @ts-ignore
        query = query.limit(input.limit);
      }

      if (input.offset) {
        // @ts-ignore
        query = query.offset(input.offset);
      }

      return await query;
    }),

  /**
   * atualizar — Update feedback status (admin only)
   */
  atualizar: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["novo", "lido", "em_analise", "resolvido"]),
        resposta: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Only admins can update feedbacks
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      await db
        .update(feedbacks)
        .set({
          status: input.status,
          resposta: input.resposta,
          updatedAt: new Date(),
        })
        .where(eq(feedbacks.id, input.id));

      return { success: true };
    }),

  /**
   * deletar — Delete feedback (admin only)
   */
  deletar: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Only admins can delete feedbacks
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      await db.delete(feedbacks).where(eq(feedbacks.id, input.id));

      return { success: true };
    }),

  /**
   * obter — Get single feedback (admin only)
   */
  obter: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Only admins can view feedbacks
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const [feedback] = await db
        .select()
        .from(feedbacks)
        .where(eq(feedbacks.id, input.id));

      return feedback;
    }),

  /**
   * contar — Count feedbacks by status (admin only)
   */
  contar: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Only admins can count feedbacks
    if (ctx.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // @ts-ignore
    const [novo] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(feedbacks)
      .where(eq(feedbacks.status, "novo"));

    // @ts-ignore
    const [emAnalise] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(feedbacks)
      .where(eq(feedbacks.status, "em_analise"));

    return {
      novo: novo?.count || 0,
      emAnalise: emAnalise?.count || 0,
    };
  }),
});

