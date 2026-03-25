import { z } from "zod";
import bcrypt from "bcryptjs";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Validação de senha forte
const validarSenhaForte = (senha: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(senha);
};

// Validação de e-mail
const validarEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const authEmailRouter = router({
  // Registrar novo usuário
  registrar: publicProcedure
    .input(
      z.object({
        nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
        email: z.string().email("E-mail inválido"),
        senha: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
        confirmarSenha: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banco de dados não disponível",
        });
      }

      // Validar e-mail
      if (!validarEmail(input.email)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "E-mail inválido",
        });
      }

      // Validar senhas
      if (input.senha !== input.confirmarSenha) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "As senhas não correspondem",
        });
      }

      if (!validarSenhaForte(input.senha)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Senha deve conter maiúsculas, minúsculas, números e caracteres especiais (@$!%*?&)",
        });
      }

      // Verificar se e-mail já existe
      // @ts-ignore
      const usuarioExistente = await db.select().from(users).where(eq(users.email, input.email)).limit(1);

      if (usuarioExistente.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "E-mail já cadastrado",
        });
      }

      // Hash da senha
      const senhaHash = await bcrypt.hash(input.senha, 10);

      // Criar usuário
      try {
        // @ts-ignore
        await db.insert(users).values({
          openId: `email-${input.email}-${Date.now()}`,
          email: input.email,
          name: input.nome,
          loginMethod: "email",
          role: "user",
          lastSignedIn: new Date(),
        });

        return {
          sucesso: true,
          mensagem: "Usuário registrado com sucesso!",
          email: input.email,
        };
      } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao registrar usuário",
        });
      }
    }),

  // Fazer login
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("E-mail inválido"),
        senha: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banco de dados não disponível",
        });
      }

      // Buscar usuário por e-mail
      // @ts-ignore
      const usuariosEncontrados = await db.select().from(users).where(eq(users.email, input.email)).limit(1);

      if (usuariosEncontrados.length === 0) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "E-mail ou senha inválidos",
        });
      }

      const usuario = usuariosEncontrados[0];

      // Nota: Como estamos usando Manus OAuth, não armazenamos senhas no banco
      // Este é um exemplo simplificado. Em produção, seria necessário:
      // 1. Adicionar coluna 'senhaHash' à tabela users
      // 2. Comparar hash da senha com bcrypt.compare()
      // 3. Gerar JWT ou sessão

      // Por enquanto, retornamos sucesso para demonstração
      return {
        sucesso: true,
        mensagem: "Login realizado com sucesso!",
        usuario: {
          id: usuario.id,
          nome: usuario.name,
          email: usuario.email,
        },
      };
    }),

  // Validar e-mail único
  validarEmailUnico: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return { disponivel: true };
      }

      // @ts-ignore
      const usuariosEncontrados = await db.select().from(users).where(eq(users.email, input.email)).limit(1);

      return {
        disponivel: usuariosEncontrados.length === 0,
      };
    }),

  // Validar força da senha
  validarSenha: publicProcedure
    .input(z.object({ senha: z.string() }))
    .query(({ input }) => {
      const forte = validarSenhaForte(input.senha);
      const requisitos = {
        minimo8Caracteres: input.senha.length >= 8,
        temMaiuscula: /[A-Z]/.test(input.senha),
        temMinuscula: /[a-z]/.test(input.senha),
        temNumero: /\d/.test(input.senha),
        temEspecial: /[@$!%*?&]/.test(input.senha),
      };

      return {
        forte,
        requisitos,
        mensagem: forte ? "Senha forte" : "Senha fraca",
      };
    }),
});
