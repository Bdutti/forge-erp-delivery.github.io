// @ts-nocheck
import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  pedidos, 
  produtos, 
  clientes, 
  itensPedido,
  snapshotsConcorrente,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[ForgeDB] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

/**
 * criarPedido — Create order with automatic stock decrement
 */
export async function criarPedido(input: {
  numero: string;
  clienteId?: number;
  canal: "balcao" | "ifood" | "whatsapp" | "telefone";
  itens: Array<{
    produtoId: number;
    quantidade: number;
    precoUnitario: number;
  }>;
  desconto?: number;
  observacoes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const total = input.itens.reduce((sum, item) => sum + item.precoUnitario * item.quantidade, 0) - (input.desconto || 0);

  // Create order
  const [pedido] = await db
    .insert(pedidos)
    .values({
      numero: input.numero,
      clienteId: input.clienteId,
      canal: input.canal,
      total: total.toString(),
      desconto: input.desconto?.toString() || "0",
      observacoes: input.observacoes,
      status: "aberto",
    })
    .$returningId();

  // Create line items and decrement stock
  for (const item of input.itens) {
    await db.insert(itensPedido).values({
      pedidoId: pedido.id,
      produtoId: item.produtoId,
      quantidade: item.quantidade,
      precoUnitario: item.precoUnitario.toString(),
      subtotal: (item.precoUnitario * item.quantidade).toString(),
    });

    // Decrement stock
    await db
      .update(produtos)
      .set({
        estoque: sql`estoque - ${item.quantidade}`,
      })
      .where(eq(produtos.id, item.produtoId));
  }

  return pedido;
}

/**
 * upsertProduto — Create or update product
 */
export async function upsertProduto(input: {
  id?: number;
  nome: string;
  descricao?: string;
  preco: number;
  custo: number;
  estoque?: number;
  categoria: string;
  sku?: string;
  ativo?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (input.id) {
    // Update
    await db
      .update(produtos)
      .set({
        nome: input.nome,
        descricao: input.descricao,
        preco: input.preco.toString(),
        custo: input.custo.toString(),
        estoque: input.estoque,
        categoria: input.categoria,
        sku: input.sku,
        ativo: input.ativo ?? true,
      })
      .where(eq(produtos.id, input.id));
    
    return { id: input.id, ...input };
  } else {
    // Create
    const [result] = await db
      .insert(produtos)
      .values({
        nome: input.nome,
        descricao: input.descricao,
        preco: input.preco.toString(),
        custo: input.custo.toString(),
        estoque: input.estoque || 0,
        categoria: input.categoria,
        sku: input.sku,
        ativo: input.ativo ?? true,
      })
      .$returningId();
    
    return { id: result.id, ...input };
  }
}

/**
 * atualizarStatus — Update order status
 */
export async function atualizarStatus(pedidoId: number, novoStatus: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(pedidos)
    .set({
      status: novoStatus as any,
    })
    .where(eq(pedidos.id, pedidoId));

  return { id: pedidoId, status: novoStatus };
}

/**
 * getKPIs — Get key performance indicators
 */
export async function getKPIs() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Total revenue (today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [faturamento] = await db
    .select({
      total: sql<number>`COALESCE(SUM(CAST(total AS DECIMAL(10,2))), 0)`,
    })
    .from(pedidos)
    .where(
      and(
        eq(pedidos.status, "entregue"),
        sql`DATE(createdAt) = DATE(${today})`
      )
    );

  // Average ticket
  const [ticketMedio] = await db
    .select({
      media: sql<number>`COALESCE(AVG(CAST(total AS DECIMAL(10,2))), 0)`,
    })
    .from(pedidos)
    .where(
      and(
        eq(pedidos.status, "entregue"),
        sql`DATE(createdAt) = DATE(${today})`
      )
    );

  // Active orders
  const [pedidosAtivos] = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(pedidos)
    .where(
      and(
        sql`status IN ('aberto', 'preparando', 'pronto')`,
        sql`DATE(createdAt) = DATE(${today})`
      )
    );

  // Stock alerts (products below minimum)
  const [alertasEstoque] = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(produtos)
    .where(sql`estoque < 5 AND ativo = true`);

  // Revenue by channel
  const canalData = await db
    .select({
      canal: pedidos.canal,
      total: sql<number>`COALESCE(SUM(CAST(total AS DECIMAL(10,2))), 0)`,
    })
    .from(pedidos)
    .where(
      and(
        eq(pedidos.status, "entregue"),
        sql`DATE(createdAt) = DATE(${today})`
      )
    )
    .groupBy(pedidos.canal);

  // Profit calculation
  const [lucroData] = await db
    .select({
      receita: sql<number>`COALESCE(SUM(CAST(${pedidos.total} AS DECIMAL(10,2))), 0)`,
      custo: sql<number>`COALESCE(SUM(CAST(${produtos.custo} AS DECIMAL(10,2)) * ${itensPedido.quantidade}), 0)`,
    })
    .from(pedidos)
    .leftJoin(itensPedido, eq(pedidos.id, itensPedido.pedidoId))
    .leftJoin(produtos, eq(itensPedido.produtoId, produtos.id))
    .where(
      and(
        eq(pedidos.status, "entregue"),
        sql`DATE(${pedidos.createdAt}) = DATE(${today})`
      )
    );

  return {
    faturamento: parseFloat(faturamento?.total?.toString() || "0"),
    ticketMedio: parseFloat(ticketMedio?.media?.toString() || "0"),
    pedidosAtivos: pedidosAtivos?.count || 0,
    alertasEstoque: alertasEstoque?.count || 0,
    canalData: canalData.map(c => ({
      canal: c.canal,
      total: parseFloat(c.total?.toString() || "0"),
    })),
    lucro: {
      receita: parseFloat(lucroData?.receita?.toString() || "0"),
      custo: parseFloat(lucroData?.custo?.toString() || "0"),
      lucroLiquido: parseFloat((lucroData?.receita || 0) - (lucroData?.custo || 0)),
    },
  };
}

/**
 * getPedidos — Get orders with filters
 */
// @ts-ignore
export async function getPedidos(filters?: {
  status?: string;
  canal?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const conditions: any[] = [];
  
  if (filters?.status) {
    conditions.push(eq(pedidos.status, filters.status as any));
  }

  if (filters?.canal) {
    conditions.push(eq(pedidos.canal, filters.canal as any));
  }

  let query = db.select().from(pedidos);
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  query = query.orderBy(desc(pedidos.createdAt));

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.offset(filters.offset);
  }

  return await query;
}

/**
 * getProdutos — Get products with filters
 */
// @ts-ignore
export async function getProdutos(filters?: {
  categoria?: string;
  ativo?: boolean;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const conditions: any[] = [];
  
  if (filters?.categoria) {
    conditions.push(eq(produtos.categoria, filters.categoria));
  }

  if (filters?.ativo !== undefined) {
    conditions.push(eq(produtos.ativo, filters.ativo));
  }

  let query = db.select().from(produtos);
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.offset(filters.offset);
  }

  return await query;
}

/**
 * getSnapshotsConcorrente — Get competitor snapshots
 */
// @ts-ignore
export async function getSnapshotsConcorrente(filters?: {
  concorrente?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const conditions: any[] = [];
  
  if (filters?.concorrente) {
    conditions.push(eq(snapshotsConcorrente.concorrente, filters.concorrente));
  }

  let query = db.select().from(snapshotsConcorrente);
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  query = query.orderBy(desc(snapshotsConcorrente.createdAt));

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.offset(filters.offset);
  }

  return await query;
}
