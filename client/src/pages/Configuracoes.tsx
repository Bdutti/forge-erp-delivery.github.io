import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";

export default function Configuracoes() {
  const [ultimaSincronizacao, setUltimaSincronizacao] = useState<Date | null>(null);
  const [sincronizando, setSincronizando] = useState(false);

  // Mutations para sincronização
  const sincronizarSheetsMutation = trpc.forge.sincronizarSheets.useMutation({
    onSuccess: (data) => {
      if (data.sucesso) {
        toast.success("✅ " + data.mensagem);
        setUltimaSincronizacao(new Date(data.timestamp));
      } else {
        toast.error("❌ " + data.mensagem);
      }
      setSincronizando(false);
    },
    onError: (error) => {
      toast.error(`❌ Erro: ${error.message}`);
      setSincronizando(false);
    },
  });

  const exportarPedidosMutation = trpc.forge.exportarPedidosSheets.useMutation({
    onSuccess: (data) => {
      if (data.sucesso) {
        toast.success("✅ " + data.mensagem);
      } else {
        toast.error("❌ " + data.mensagem);
      }
    },
    onError: (error) => {
      toast.error(`❌ Erro: ${error.message}`);
    },
  });

  const exportarProdutosMutation = trpc.forge.exportarProdutosSheets.useMutation({
    onSuccess: (data) => {
      if (data.sucesso) {
        toast.success("✅ " + data.mensagem);
      } else {
        toast.error("❌ " + data.mensagem);
      }
    },
    onError: (error) => {
      toast.error(`❌ Erro: ${error.message}`);
    },
  });

  const exportarKPIsMutation = trpc.forge.exportarKPIsSheets.useMutation({
    onSuccess: (data) => {
      if (data.sucesso) {
        toast.success("✅ " + data.mensagem);
      } else {
        toast.error("❌ " + data.mensagem);
      }
    },
    onError: (error) => {
      toast.error(`❌ Erro: ${error.message}`);
    },
  });

  const handleSincronizar = async () => {
    setSincronizando(true);
    await sincronizarSheetsMutation.mutateAsync();
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-barlow-condensed">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerenciar integrações e sincronizações do sistema
        </p>
      </div>

      <Tabs defaultValue="sheets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sheets">Google Sheets</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>

        {/* Google Sheets Tab */}
        <TabsContent value="sheets" className="space-y-4">
          {/* Status */}
          <Card className="p-4 bg-s1 border-s2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Status de Sincronização</h3>
              <Badge className={ultimaSincronizacao ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"}>
                {ultimaSincronizacao ? "✓ Conectado" : "⚠ Não sincronizado"}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Última sincronização:{" "}
                <span className="font-semibold">
                  {ultimaSincronizacao
                    ? ultimaSincronizacao.toLocaleString("pt-BR")
                    : "Nunca"}
                </span>
              </p>
              <p className="text-muted-foreground">
                Credenciais: <span className="font-semibold">Configuradas</span>
              </p>
            </div>
          </Card>

          {/* Sincronização Completa */}
          <Card className="p-4 bg-s1 border-s2">
            <h3 className="font-semibold mb-4">Sincronização Completa</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sincroniza todos os dados (pedidos, produtos e KPIs) com Google Sheets em uma única operação.
            </p>
            <Button
              onClick={handleSincronizar}
              disabled={sincronizando || sincronizarSheetsMutation.isPending}
              className="w-full bg-accent hover:bg-accent/90 gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${sincronizando ? "animate-spin" : ""}`} />
              {sincronizando ? "Sincronizando..." : "Sincronizar Agora"}
            </Button>
          </Card>

          {/* Exportações Individuais */}
          <Card className="p-4 bg-s1 border-s2">
            <h3 className="font-semibold mb-4">Exportações Individuais</h3>
            <div className="space-y-3">
              <Button
                onClick={() => exportarPedidosMutation.mutateAsync()}
                disabled={exportarPedidosMutation.isPending}
                variant="outline"
                className="w-full gap-2"
              >
                <Download className="w-4 h-4" />
                {exportarPedidosMutation.isPending ? "Exportando..." : "Exportar Pedidos"}
              </Button>
              <Button
                onClick={() => exportarProdutosMutation.mutateAsync()}
                disabled={exportarProdutosMutation.isPending}
                variant="outline"
                className="w-full gap-2"
              >
                <Download className="w-4 h-4" />
                {exportarProdutosMutation.isPending ? "Exportando..." : "Exportar Produtos"}
              </Button>
              <Button
                onClick={() => exportarKPIsMutation.mutateAsync()}
                disabled={exportarKPIsMutation.isPending}
                variant="outline"
                className="w-full gap-2"
              >
                <Download className="w-4 h-4" />
                {exportarKPIsMutation.isPending ? "Exportando..." : "Exportar KPIs"}
              </Button>
            </div>
          </Card>

          {/* Informações */}
          <Card className="p-4 bg-blue-500/10 border border-blue-500/30">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              Informações
            </h3>
            <div className="text-sm space-y-2">
              <p>
                • A sincronização cria 3 abas na planilha: <strong>Pedidos</strong>, <strong>Produtos</strong> e <strong>KPIs</strong>
              </p>
              <p>
                • Cada aba contém os dados mais recentes do sistema
              </p>
              <p>
                • A sincronização é segura e não altera dados locais
              </p>
              <p>
                • Configure <strong>GOOGLE_CREDENTIALS_B64</strong> e <strong>SHEETS_ID</strong> nas variáveis de ambiente
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* Sistema Tab */}
        <TabsContent value="sistema" className="space-y-4">
          <Card className="p-4 bg-s1 border-s2">
            <h3 className="font-semibold mb-4">Informações do Sistema</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Versão</span>
                <span className="font-semibold">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ambiente</span>
                <span className="font-semibold">Production</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Banco de Dados</span>
                <span className="font-semibold">MySQL/TiDB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tema</span>
                <span className="font-semibold">Forge Dark</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-s1 border-s2">
            <h3 className="font-semibold mb-4">Recursos Disponíveis</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>PDV Fullscreen</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Gestão de Pedidos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>CRUD de Produtos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Dashboards com 4 Abas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Análise de Concorrência</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Google Sheets Sync</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
