import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronRight, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const STATUS_CORES: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  pendente: { bg: "bg-yellow-500/10", text: "text-yellow-500", icon: <Clock className="w-4 h-4" /> },
  preparando: { bg: "bg-blue-500/10", text: "text-blue-500", icon: <AlertCircle className="w-4 h-4" /> },
  pronto: { bg: "bg-green-500/10", text: "text-green-500", icon: <CheckCircle2 className="w-4 h-4" /> },
  entregue: { bg: "bg-green-600/10", text: "text-green-600", icon: <CheckCircle2 className="w-4 h-4" /> },
  cancelado: { bg: "bg-red-500/10", text: "text-red-500", icon: <XCircle className="w-4 h-4" /> },
};

const STATUS_PROXIMOS: Record<string, string> = {
  pendente: "preparando",
  preparando: "pronto",
  pronto: "entregue",
  entregue: "entregue",
  cancelado: "cancelado",
};

export default function Pedidos() {
  const [filtroStatus, setFiltroStatus] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [ultimoRefresh, setUltimoRefresh] = useState<Date>(new Date());

  // Buscar pedidos
  const { data: pedidos, isLoading, refetch } = trpc.forge.listarPedidos.useQuery({});

  // Mutation para atualizar status
  const atualizarStatusMutation = trpc.forge.atualizarStatus.useMutation({
    onSuccess: () => {
      toast.success("✅ Status atualizado!");
      refetch();
    },
    onError: (error) => {
      toast.error(`❌ Erro: ${error.message}`);
    },
  });

  // Mutation para cancelar pedido
  const cancelarPedidoMutation = trpc.forge.atualizarStatus.useMutation({
    onSuccess: () => {
      toast.success("✅ Pedido cancelado!");
      refetch();
    },
    onError: (error) => {
      toast.error(`❌ Erro: ${error.message}`);
    },
  });

  // Auto-refresh a cada 30s
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refetch();
      setUltimoRefresh(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);

  // Filtrar pedidos
  const pedidosFiltrados = useMemo(() => {
    if (!pedidos) return [];
    if (!filtroStatus) return pedidos;
    return pedidos.filter((p: any) => p.status === filtroStatus);
  }, [pedidos, filtroStatus]);

  // Contar pedidos por status
  const contadores = useMemo(() => {
    if (!pedidos) return {};
    return pedidos.reduce((acc: any, p: any) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});
  }, [pedidos]);

  // Avancar status
  const avancarStatus = async (pedidoId: number, statusAtual: string) => {
    const novoStatus = STATUS_PROXIMOS[statusAtual];
    if (!novoStatus || novoStatus === statusAtual) return;

    await atualizarStatusMutation.mutateAsync({
      pedidoId,
      novoStatus,
    });
  };

  // Cancelar pedido
  const cancelar = async (pedidoId: number) => {
    if (!confirm("Tem certeza que deseja cancelar este pedido?")) return;
    await cancelarPedidoMutation.mutateAsync({
      pedidoId,
      novoStatus: "cancelado",
    });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-barlow-condensed">Pedidos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerenciar fluxo de pedidos com avanço de status inline
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Auto-refresh {autoRefresh ? "ON" : "OFF"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetch();
              setUltimoRefresh(new Date());
            }}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar Agora
          </Button>
        </div>
      </div>

      {/* Último refresh */}
      <div className="text-xs text-muted-foreground">
        Último refresh: {ultimoRefresh.toLocaleTimeString("pt-BR")}
        {autoRefresh && " (atualiza a cada 30s)"}
      </div>

      {/* Filtros de Status */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={filtroStatus === null ? "default" : "outline"}
          size="sm"
          onClick={() => setFiltroStatus(null)}
          className="whitespace-nowrap"
        >
          Todos ({pedidos?.length || 0})
        </Button>
        {Object.entries(STATUS_CORES).map(([status, config]) => (
          <Button
            key={status}
            variant={filtroStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroStatus(status)}
            className="whitespace-nowrap gap-2"
          >
            {config.icon}
            {status.charAt(0).toUpperCase() + status.slice(1)} ({contadores[status] || 0})
          </Button>
        ))}
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Carregando pedidos...
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum pedido encontrado
          </div>
        ) : (
          pedidosFiltrados.map((pedido: any) => {
            const config = STATUS_CORES[pedido.status] || STATUS_CORES.pendente;
            const proximoStatus = STATUS_PROXIMOS[pedido.status];

            return (
              <Card
                key={pedido.id}
                className={`p-4 border-2 transition-all hover:border-accent ${config.bg}`}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Informações do Pedido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold font-barlow-condensed text-lg">
                        #{pedido.numero}
                      </h3>
                      <Badge className={`${config.text} bg-transparent border`}>
                        {pedido.status.toUpperCase()}
                      </Badge>
                      {pedido.desconto > 0 && (
                        <Badge variant="secondary" className="text-green-500">
                          -{pedido.desconto}%
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Cliente</p>
                        <p className="font-semibold">{pedido.cliente?.nome || "Sem nome"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Canal</p>
                        <p className="font-semibold">{pedido.canal}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Total</p>
                        <p className="font-bold text-accent">R$ {pedido.total?.toFixed(2) || "0.00"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Itens</p>
                        <p className="font-semibold">{pedido.itens?.length || 0}</p>
                      </div>
                    </div>

                    {/* Itens do Pedido */}
                    {pedido.itens && pedido.itens.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-s2 text-xs">
                        <p className="text-muted-foreground mb-2">Itens:</p>
                        <div className="space-y-1">
                          {pedido.itens.slice(0, 3).map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between">
                              <span>{item.produto?.nome || "Produto"}</span>
                              <span className="text-muted-foreground">
                                {item.quantidade}x R$ {item.preco?.toFixed(2) || "0.00"}
                              </span>
                            </div>
                          ))}
                          {pedido.itens.length > 3 && (
                            <p className="text-muted-foreground">
                              +{pedido.itens.length - 3} mais...
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col gap-2 ml-4">
                    {/* Botão Avancar Status */}
                    {proximoStatus && proximoStatus !== pedido.status && (
                      <Button
                        onClick={() => avancarStatus(pedido.id, pedido.status)}
                        disabled={atualizarStatusMutation.isPending}
                        className="bg-accent hover:bg-accent/90 gap-2 whitespace-nowrap"
                        size="sm"
                      >
                        <ChevronRight className="w-4 h-4" />
                        {proximoStatus === "preparando" && "Preparar"}
                        {proximoStatus === "pronto" && "Pronto"}
                        {proximoStatus === "entregue" && "Entregar"}
                      </Button>
                    )}

                    {/* Botão Cancelar */}
                    {pedido.status !== "entregue" && pedido.status !== "cancelado" && (
                      <Button
                        onClick={() => cancelar(pedido.id)}
                        disabled={cancelarPedidoMutation.isPending}
                        variant="destructive"
                        size="sm"
                        className="whitespace-nowrap"
                      >
                        Cancelar
                      </Button>
                    )}

                    {/* Status Final */}
                    {(pedido.status === "entregue" || pedido.status === "cancelado") && (
                      <div className="text-xs text-center font-semibold text-muted-foreground">
                        {pedido.status === "entregue" ? "✓ Finalizado" : "✗ Cancelado"}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Resumo */}
      {pedidos && pedidos.length > 0 && (
        <Card className="p-4 bg-s1 border-s2">
          <h3 className="font-semibold mb-3">Resumo do Dia</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Total de Pedidos</p>
              <p className="text-xl font-bold">{pedidos.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Faturamento</p>
              <p className="text-xl font-bold text-green-500">
                R$ {pedidos.reduce((sum: number, p: any) => sum + (p.total || 0), 0).toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Ticket Médio</p>
              <p className="text-xl font-bold">
                R$ {(pedidos.reduce((sum: number, p: any) => sum + (p.total || 0), 0) / pedidos.length).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Taxa Conclusão</p>
              <p className="text-xl font-bold text-blue-500">
                {Math.round((pedidos.filter((p: any) => p.status === "entregue").length / pedidos.length) * 100)}%
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Cancelados</p>
              <p className="text-xl font-bold text-red-500">
                {pedidos.filter((p: any) => p.status === "cancelado").length}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
