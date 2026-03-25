import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";

describe("Autenticação por E-mail e Senha", () => {
  describe("validarEmailUnico", () => {
    it("retorna disponível para e-mail novo", async () => {
      const caller = appRouter.createCaller({});
      const resultado = await caller.authEmail.validarEmailUnico({
        email: `novo-${Date.now()}@example.com`,
      });
      expect(resultado.disponivel).toBe(true);
    });

    it("rejeita e-mail inválido", async () => {
      const caller = appRouter.createCaller({});
      try {
        await caller.authEmail.validarEmailUnico({
          email: "email-invalido",
        });
        expect.fail("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("validarSenha", () => {
    it("rejeita senha fraca (muito curta)", async () => {
      const caller = appRouter.createCaller({});
      const resultado = await caller.authEmail.validarSenha({
        senha: "abc123",
      });
      expect(resultado.forte).toBe(false);
      expect(resultado.requisitos.minimo8Caracteres).toBe(false);
    });

    it("rejeita senha sem maiúscula", async () => {
      const caller = appRouter.createCaller({});
      const resultado = await caller.authEmail.validarSenha({
        senha: "abcd1234@",
      });
      expect(resultado.forte).toBe(false);
      expect(resultado.requisitos.temMaiuscula).toBe(false);
    });

    it("rejeita senha sem minúscula", async () => {
      const caller = appRouter.createCaller({});
      const resultado = await caller.authEmail.validarSenha({
        senha: "ABCD1234@",
      });
      expect(resultado.forte).toBe(false);
      expect(resultado.requisitos.temMinuscula).toBe(false);
    });

    it("rejeita senha sem número", async () => {
      const caller = appRouter.createCaller({});
      const resultado = await caller.authEmail.validarSenha({
        senha: "AbcdEfgh@",
      });
      expect(resultado.forte).toBe(false);
      expect(resultado.requisitos.temNumero).toBe(false);
    });

    it("rejeita senha sem caractere especial", async () => {
      const caller = appRouter.createCaller({});
      const resultado = await caller.authEmail.validarSenha({
        senha: "Abcd1234",
      });
      expect(resultado.forte).toBe(false);
      expect(resultado.requisitos.temEspecial).toBe(false);
    });

    it("aceita senha forte", async () => {
      const caller = appRouter.createCaller({});
      const resultado = await caller.authEmail.validarSenha({
        senha: "SenhaForte123@",
      });
      expect(resultado.forte).toBe(true);
      expect(resultado.requisitos.minimo8Caracteres).toBe(true);
      expect(resultado.requisitos.temMaiuscula).toBe(true);
      expect(resultado.requisitos.temMinuscula).toBe(true);
      expect(resultado.requisitos.temNumero).toBe(true);
      expect(resultado.requisitos.temEspecial).toBe(true);
    });
  });

  describe("registrar", () => {
    it("rejeita e-mail inválido", async () => {
      const caller = appRouter.createCaller({});
      try {
        await caller.authEmail.registrar({
          nome: "Teste",
          email: "email-invalido",
          senha: "SenhaForte123@",
          confirmarSenha: "SenhaForte123@",
        });
        expect.fail("Deveria ter lançado erro");
      } catch (error: any) {
        expect(error.message).toContain("E-mail inválido");
      }
    });

    it("rejeita senhas que não correspondem", async () => {
      const caller = appRouter.createCaller({});
      try {
        await caller.authEmail.registrar({
          nome: "Teste",
          email: `teste-${Date.now()}@example.com`,
          senha: "SenhaForte123@",
          confirmarSenha: "SenhaForte456@",
        });
        expect.fail("Deveria ter lançado erro");
      } catch (error: any) {
        expect(error.message).toContain("não correspondem");
      }
    });

    it("rejeita senha fraca", async () => {
      const caller = appRouter.createCaller({});
      try {
        await caller.authEmail.registrar({
          nome: "Teste",
          email: `teste-${Date.now()}@example.com`,
          senha: "senha123",
          confirmarSenha: "senha123",
        });
        expect.fail("Deveria ter lançado erro");
      } catch (error: any) {
        expect(error.message).toContain("maiúsculas, minúsculas, números e caracteres especiais");
      }
    });

    it("rejeita nome muito curto", async () => {
      const caller = appRouter.createCaller({});
      try {
        await caller.authEmail.registrar({
          nome: "Jo",
          email: `teste-${Date.now()}@example.com`,
          senha: "SenhaForte123@",
          confirmarSenha: "SenhaForte123@",
        });
        expect.fail("Deveria ter lançado erro");
      } catch (error: any) {
        expect(error.message).toContain("Nome deve ter pelo menos 3 caracteres");
      }
    });
  });

  describe("login", () => {
    it("rejeita e-mail inválido", async () => {
      const caller = appRouter.createCaller({});
      try {
        await caller.authEmail.login({
          email: "email-invalido",
          senha: "SenhaForte123@",
        });
        expect.fail("Deveria ter lançado erro");
      } catch (error: any) {
        expect(error.message).toContain("E-mail inválido");
      }
    });

    it("rejeita e-mail não registrado", async () => {
      const caller = appRouter.createCaller({});
      try {
        await caller.authEmail.login({
          email: `nao-existe-${Date.now()}@example.com`,
          senha: "SenhaForte123@",
        });
        expect.fail("Deveria ter lançado erro");
      } catch (error: any) {
        expect(error.message).toContain("E-mail ou senha inválidos");
      }
    });
  });
});
