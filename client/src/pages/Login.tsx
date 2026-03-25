import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Login() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // Login
  const loginMutation = trpc.authEmail.login.useMutation({
    onSuccess: (data) => {
      toast.success("✅ Login realizado com sucesso!");
      setTimeout(() => navigate("/pdv"), 2000);
    },
    onError: (error) => {
      setErro(error.message);
      toast.error(`❌ ${error.message}`);
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    // Validações básicas
    if (!formData.email || !formData.senha) {
      setErro("Preencha todos os campos");
      return;
    }

    setCarregando(true);
    await loginMutation.mutateAsync({
      email: formData.email,
      senha: formData.senha,
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
            <h1 className="text-2xl font-bold font-barlow-condensed mb-2">Fazer Login</h1>
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
          <form onSubmit={handleLogin} className="space-y-4">
            {/* E-mail */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">E-mail</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-s2 border-s3"
                disabled={carregando}
              />
            </div>

            {/* Senha */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Senha</label>
              <div className="relative">
                <Input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Sua senha"
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
            </div>

            {/* Botão Login */}
            <Button
              type="submit"
              disabled={carregando}
              className="w-full bg-accent hover:bg-accent/90 mt-6"
            >
              {carregando ? "Entrando..." : "Fazer Login"}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-3 text-center text-sm">
            <div>
              <span className="text-muted-foreground">Não tem conta? </span>
              <button
                onClick={() => navigate("/registro")}
                className="text-accent hover:underline font-medium"
              >
                Registre-se
              </button>
            </div>
            <button className="text-muted-foreground hover:text-foreground text-xs">
              Esqueceu sua senha?
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-s3"></div>
            <span className="text-xs text-muted-foreground">OU</span>
            <div className="flex-1 h-px bg-s3"></div>
          </div>

          {/* OAuth Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full bg-s2 border-s3 hover:bg-s3"
            onClick={() => {
              toast.info("Redirecionando para Manus OAuth...");
              // Implementar Manus OAuth aqui
            }}
          >
            Entrar com Manus
          </Button>
        </div>
      </Card>
    </div>
  );
}
