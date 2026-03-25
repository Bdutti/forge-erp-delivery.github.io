import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Registro() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // Validar e-mail único
  const { data: emailValido } = trpc.authEmail.validarEmailUnico.useQuery(
    { email: formData.email },
    { enabled: formData.email.length > 0 }
  );

  // Validar força da senha
  const { data: senhaValida } = trpc.authEmail.validarSenha.useQuery(
    { senha: formData.senha },
    { enabled: formData.senha.length > 0 }
  );

  // Registrar usuário
  const registrarMutation = trpc.authEmail.registrar.useMutation({
    onSuccess: (data) => {
      toast.success("✅ Registro realizado com sucesso!");
      setTimeout(() => navigate("/login"), 2000);
    },
    onError: (error) => {
      setErro(error.message);
      toast.error(`❌ ${error.message}`);
    },
  });

  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    // Validações básicas
    if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
      setErro("Preencha todos os campos");
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas não correspondem");
      return;
    }

    if (!senhaValida?.forte) {
      setErro("Senha não atende aos requisitos de segurança");
      return;
    }

    if (!emailValido?.disponivel) {
      setErro("E-mail já cadastrado");
      return;
    }

    setCarregando(true);
    await registrarMutation.mutateAsync({
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      confirmarSenha: formData.confirmarSenha,
    });
    setCarregando(false);
  };

  return (
    <div className="min-h-screen bg-s0 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-s1 border-s2">
        <div className="p-8">
          {/* Cabeçalho */}
          <div className="mb-8 text-center">
            <div className="w-12 h-12 rounded-lg bg-brasa flex items-center justify-center mx-auto mb-4 animate-glow-pulse">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <h1 className="text-2xl font-bold font-barlow-condensed mb-2">Criar Conta</h1>
            <p className="text-muted-foreground text-sm">Forge ERP Delivery</p>
          </div>

          {/* Erro */}
          {erro && (
            <Alert className="mb-6 bg-red-500/10 border-red-500/30">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-500">{erro}</AlertDescription>
            </Alert>
          )}

          {/* Formulário */}
          <form onSubmit={handleRegistrar} className="space-y-4">
            {/* Nome */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Nome Completo</label>
              <Input
                type="text"
                placeholder="Seu nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="bg-s2 border-s3"
                disabled={carregando}
              />
            </div>

            {/* E-mail */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">E-mail</label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-s2 border-s3"
                  disabled={carregando}
                />
                {formData.email && emailValido && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {emailValido.disponivel ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {formData.email && emailValido && (
                <p className={`text-xs mt-1 ${emailValido.disponivel ? "text-green-500" : "text-red-500"}`}>
                  {emailValido.disponivel ? "E-mail disponível" : "E-mail já cadastrado"}
                </p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Senha</label>
              <div className="relative">
                <Input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  className="bg-s2 border-s3 pr-10"
                  disabled={carregando}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {mostrarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Requisitos de senha */}
              {formData.senha && senhaValida && (
                <div className="mt-3 p-3 bg-s2 rounded-md space-y-2">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Requisitos:</p>
                  <div className="space-y-1">
                    {Object.entries(senhaValida.requisitos).map(([req, atende]) => (
                      <div key={req} className="flex items-center gap-2 text-xs">
                        <div className={`w-4 h-4 rounded flex items-center justify-center ${atende ? "bg-green-500" : "bg-s3"}`}>
                          {atende && <span className="text-white text-xs">✓</span>}
                        </div>
                        <span className={atende ? "text-green-500" : "text-muted-foreground"}>
                          {req === "minimo8Caracteres" && "Mínimo 8 caracteres"}
                          {req === "temMaiuscula" && "Uma letra maiúscula"}
                          {req === "temMinuscula" && "Uma letra minúscula"}
                          {req === "temNumero" && "Um número"}
                          {req === "temEspecial" && "Um caractere especial (@$!%*?&)"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Confirmar Senha</label>
              <div className="relative">
                <Input
                  type={mostrarConfirmar ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  value={formData.confirmarSenha}
                  onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                  className="bg-s2 border-s3 pr-10"
                  disabled={carregando}
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {mostrarConfirmar ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmarSenha && (
                <p className={`text-xs mt-1 ${formData.senha === formData.confirmarSenha ? "text-green-500" : "text-red-500"}`}>
                  {formData.senha === formData.confirmarSenha ? "Senhas correspondem" : "Senhas não correspondem"}
                </p>
              )}
            </div>

            {/* Botão Registrar */}
            <Button
              type="submit"
              disabled={carregando || !emailValido?.disponivel || !senhaValida?.forte}
              className="w-full bg-accent hover:bg-accent/90 mt-6"
            >
              {carregando ? "Registrando..." : "Criar Conta"}
            </Button>
          </form>

          {/* Link para Login */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Já tem conta? </span>
            <button
              onClick={() => navigate("/login")}
              className="text-accent hover:underline font-medium"
            >
              Faça login
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
