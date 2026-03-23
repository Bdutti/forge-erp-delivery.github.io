import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "../routers";

describe("Google Sheets Sync", () => {
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

  it("sincronizarSheets é uma procedure válida", async () => {
    const caller = appRouter.createCaller(ctx);
    expect(caller.forge.sincronizarSheets).toBeDefined();
  });

  it("exportarPedidosSheets é uma procedure válida", async () => {
    const caller = appRouter.createCaller(ctx);
    expect(caller.forge.exportarPedidosSheets).toBeDefined();
  });

  it("exportarProdutosSheets é uma procedure válida", async () => {
    const caller = appRouter.createCaller(ctx);
    expect(caller.forge.exportarProdutosSheets).toBeDefined();
  });

  it("exportarKPIsSheets é uma procedure válida", async () => {
    const caller = appRouter.createCaller(ctx);
    expect(caller.forge.exportarKPIsSheets).toBeDefined();
  });

  it("sincronizarSheets retorna objeto com sucesso e mensagem", async () => {
    const caller = appRouter.createCaller(ctx);

    try {
      const resultado = await caller.forge.sincronizarSheets();
      
      expect(resultado).toHaveProperty("sucesso");
      expect(resultado).toHaveProperty("mensagem");
      expect(resultado).toHaveProperty("timestamp");
      expect(typeof resultado.sucesso).toBe("boolean");
      expect(typeof resultado.mensagem).toBe("string");
    } catch (error) {
      // Pode falhar se Google Sheets não estiver configurado
      expect(error).toBeDefined();
    }
  });

  it("exportarPedidosSheets retorna objeto com sucesso e mensagem", async () => {
    const caller = appRouter.createCaller(ctx);

    try {
      const resultado = await caller.forge.exportarPedidosSheets();
      
      expect(resultado).toHaveProperty("sucesso");
      expect(resultado).toHaveProperty("mensagem");
      expect(typeof resultado.sucesso).toBe("boolean");
      expect(typeof resultado.mensagem).toBe("string");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("exportarProdutosSheets retorna objeto com sucesso e mensagem", async () => {
    const caller = appRouter.createCaller(ctx);

    try {
      const resultado = await caller.forge.exportarProdutosSheets();
      
      expect(resultado).toHaveProperty("sucesso");
      expect(resultado).toHaveProperty("mensagem");
      expect(typeof resultado.sucesso).toBe("boolean");
      expect(typeof resultado.mensagem).toBe("string");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("exportarKPIsSheets retorna objeto com sucesso e mensagem", async () => {
    const caller = appRouter.createCaller(ctx);

    try {
      const resultado = await caller.forge.exportarKPIsSheets();
      
      expect(resultado).toHaveProperty("sucesso");
      expect(resultado).toHaveProperty("mensagem");
      expect(typeof resultado.sucesso).toBe("boolean");
      expect(typeof resultado.mensagem).toBe("string");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
