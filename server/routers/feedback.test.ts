import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "admin" | "user" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "email",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("feedback router", () => {
  it("criar — should create feedback for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.feedback.criar({
      tipo: "sugestao",
      mensagem: "This is a great suggestion for improvement",
      email: "user@example.com",
      pagina: "/pdv",
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
  });

  it("criar — should reject feedback with short message", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.feedback.criar({
        tipo: "bug",
        mensagem: "short",
        pagina: "/pdv",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });

  it("criar — should reject feedback with long message", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const longMessage = "a".repeat(1001);

    try {
      await caller.feedback.criar({
        tipo: "elogio",
        mensagem: longMessage,
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });


  it("criar — should accept all feedback types", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const types: Array<"bug" | "sugestao" | "elogio" | "outro"> = [
      "bug",
      "sugestao",
      "elogio",
      "outro",
    ];

    for (const tipo of types) {
      const result = await caller.feedback.criar({
        tipo,
        mensagem: "This is a valid feedback message",
      });

      expect(result.id).toBeDefined();
    }
  });

  it("listar — should reject non-admin users", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.feedback.listar({});
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toContain("Unauthorized");
    }
  });

  it("listar — should allow admin users", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.feedback.listar({});

    expect(Array.isArray(result)).toBe(true);
  });

  it("atualizar — should reject non-admin users", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.feedback.atualizar({
        id: 1,
        status: "lido",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toContain("Unauthorized");
    }
  });

  it("deletar — should reject non-admin users", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.feedback.deletar({ id: 1 });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toContain("Unauthorized");
    }
  });

  it("obter — should reject non-admin users", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.feedback.obter({ id: 1 });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toContain("Unauthorized");
    }
  });

  it("contar — should reject non-admin users", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.feedback.contar();
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toContain("Unauthorized");
    }
  });
});
