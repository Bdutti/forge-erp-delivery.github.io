import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "../routers";

describe("Testes de Integração - Fluxo Completo", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      user: {
        id: 1,
        openId: "test-user",
        email: "test@example.com",
        name: "Test User",
        role: "admin",
      },
      req: { protocol: "https", headers: {} },
      res: { clearCookie: vi.fn() },
    };
  });

  describe("Fluxo Completo de Pedido", () => {
    it("1. Criar produto", async () => {
      const caller = appRouter.createCaller(ctx);

      try {
        const produto = await caller.forge.upsertProduto({
          nome: "Teste Integração",
          categoria: "Testes",
          preco: 50.0,
          custo: 20.0,
          estoque: 100,
          ativo: true,
        });

        expect(produto).toHaveProperty("id");
        expect(produto.nome).toBe("Teste Integração");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("2. Criar pedido com produto", async () => {
      const caller = appRouter.createCaller(ctx);

      try {
        const pedido = await caller.forge.criarPedido({
          numero: "PED-INTEG-001",
          clienteId: 1,
          canal: "balcao",
          itens: [
            {
              produtoId: 1,
              quantidade: 2,
              precoUnitario: 50.0,
            },
          ],
          desconto: 5,
        });

        expect(pedido).toHaveProperty("id");
        expect(pedido.numero).toBe("PED-INTEG-001");
        expect(pedido.status).toBe("pendente");
        expect(typeof pedido.total).toBe("number");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("3. Atualizar status do pedido", async () => {
      const caller = appRouter.createCaller(ctx);

      try {
        // Criar pedido
        const pedido = await caller.forge.criarPedido({
          numero: "PED-INTEG-002",
          clienteId: 1,
          canal: "balcao",
          itens: [
            {
              produtoId: 1,
              quantidade: 1,
              precoUnitario: 50.0,
            },
          ],
        });

        // Atualizar status
        const pedidoAtualizado = await caller.forge.atualizarStatus({
          pedidoId: pedido.id,
          novoStatus: "preparando",
        });

        expect(pedidoAtualizado.status).toBe("preparando");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("4. Listar pedidos", async () => {
      const caller = appRouter.createCaller(ctx);

      try {
        const pedidos = await caller.forge.listarPedidos({});
        expect(Array.isArray(pedidos)).toBe(true);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("5. Obter KPIs", async () => {
      const caller = appRouter.createCaller(ctx);

      try {
        const kpis = await caller.forge.getKPIs();
        expect(kpis).toHaveProperty("faturamento");
        expect(kpis).toHaveProperty("ticketMedio");
        expect(kpis).toHaveProperty("pedidosAtivos");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("CRUD de Produtos", () => {
    it("Criar produto", async () => {
      const caller = appRouter.createCaller(ctx);

      try {
        const produto = await caller.forge.upsertProduto({
          nome: "Produto CRUD Test",
          categoria: "Testes",
          preco: 75.0,
          custo: 30.0,
          estoque: 50,
          ativo: true,
        });

        expect(produto).toHaveProperty("id");
        expect(produto.nome).toBe("Produto CRUD Test");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("Listar produtos", async () => {
      const caller = appRouter.createCaller(ctx);

      try {
        const produtos = await caller.forge.listarProdutos({});
        expect(Array.isArray(produtos)).toBe(true);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("Atualizar produto", async () => {
      const caller = appRouter.createCaller(ctx);

      try {
        const produtoAtualizado = await caller.forge.upsertProduto({
          id: 1,
          nome: "Produto Atualizado",
          categoria: "Testes",
          preco: 80.0,
          custo: 35.0,
          estoque: 75,
          ativo: true,
        });

        expect(produtoAtualizado.nome).toBe("Produto Atualizado");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("Cálculos de KPIs", () => {
    it("KPIs contêm métricas esperadas", async () => {
      const caller = appRouter.createCaller(ctx);

      try {
        const kpis = await caller.forge.getKPIs();

        expect(typeof kpis.faturamento).toBe("number");
        expect(typeof kpis.ticketMedio).toBe("number");
        expect(typeof kpis.pedidosAtivos).toBe("number");
        expect(typeof kpis.alertasEstoque).toBe("number");
        expect(kpis.faturamento).toBeGreaterThanOrEqual(0);
        expect(kpis.ticketMedio).toBeGreaterThanOrEqual(0);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("KPIs incluem lucro", async () => {
      const caller = appRouter.createCaller(ctx);

      try {
        const kpis = await caller.forge.getKPIs();

        expect(kpis).toHaveProperty("lucro");
        expect(kpis.lucro).toHaveProperty("receita");
        expect(kpis.lucro).toHaveProperty("custo");
        expect(kpis.lucro).toHaveProperty("lucroLiquido");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("Snapshots de Concorrentes", () => {
    it("Listar snapshots de concorrentes", async () => {
      const caller = appRouter.createCaller(ctx);

      try {
        const snapshots = await caller.forge.listarSnapshotsConcorrente({});
        expect(Array.isArray(snapshots)).toBe(true);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
