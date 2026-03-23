import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Plus, Minus, ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  produtoId: number;
  nome: string;
  preco: number;
  quantidade: number;
  categoria: string;
}

const CORES_CATEGORIA: Record<string, string> = {
  "Hambúrguer": "bg-red-500/20 border-red-500",
  "Bebidas": "bg-blue-500/20 border-blue-500",
  "Acompanhamentos": "bg-yellow-500/20 border-yellow-500",
  "Sobremesas": "bg-purple-500/20 border-purple-500",
  "Geral": "bg-gray-500/20 border-gray-500",
};

export default function PDV() {
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | null>(null);
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const [criandoPedido, setCriandoPedido] = useState(false);

  // Buscar produtos
  const { data: produtos, isLoading } = trpc.forge.listarProdutos.useQuery({
    ativo: true,
  });

  // Buscar KPIs
  const { data: kpis } = trpc.forge.getKPIs.useQuery();

  // Criar pedido
  const criarPedidoMutation = trpc.forge.criarPedido.useMutation({
    onSuccess: (pedido: any) => {
      toast.success(`✅ Pedido #${pedido.numero} criado com sucesso!`);
      setCarrinho([]);
      setCriandoPedido(false);
    },
    onError: (error) => {
      toast.error(`❌ Erro ao criar pedido: ${error.message}`);
      setCriandoPedido(false);
    },
  });

  // Filtrar produtos
  const produtosFiltrados = useMemo(() => {
    if (!produtos) return [];

    return produtos.filter((p: any) => {
      const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
      const matchCategoria = !categoriaFiltro || p.categoria === categoriaFiltro;
      return matchBusca && matchCategoria;
    });
  }, [produtos, busca, categoriaFiltro]);

  // Categorias únicas
  const categorias = useMemo(() => {
    if (!produtos) return [];
    const cats = new Set(produtos.map((p: any) => p.categoria));
    return Array.from(cats);
  }, [produtos]);

  // Totais do carrinho
  const totais = useMemo(() => {
    const subtotal = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
    return {
      subtotal,
      desconto: 0,
      total: subtotal,
      itens: carrinho.length,
      quantidade: carrinho.reduce((sum, item) => sum + item.quantidade, 0),
    };
  }, [carrinho]);

  // Adicionar ao carrinho
  const adicionarAoCarrinho = (produto: any) => {
    setCarrinho((prev) => {
      const existente = prev.find((item) => item.produtoId === produto.id);
      if (existente) {
        return prev.map((item) =>
          item.produtoId === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          produtoId: produto.id,
          nome: produto.nome,
          preco: parseFloat(produto.preco),
          quantidade: 1,
          categoria: produto.categoria,
        },
      ];
    });
  };

  // Remover do carrinho
  const removerDoCarrinho = (produtoId: number) => {
    setCarrinho((prev) => prev.filter((item) => item.produtoId !== produtoId));
  };

  // Atualizar quantidade
  const atualizarQuantidade = (produtoId: number, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(produtoId);
      return;
    }
    setCarrinho((prev) =>
      prev.map((item) =>
        item.produtoId === produtoId
          ? { ...item, quantidade: novaQuantidade }
          : item
      )
    );
  };

  // Finalizar pedido
  const finalizarPedido = async () => {
    if (carrinho.length === 0) {
      toast.error("Carrinho vazio!");
      return;
    }

    setCriandoPedido(true);
    const numero = `PED-${Date.now()}`;

    try {
      await criarPedidoMutation.mutateAsync({
        numero,
        canal: "balcao",
        itens: carrinho.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: item.preco,
        })),
      });
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
    }
  };

  return (
    <div className="flex h-screen bg-s0 text-foreground overflow-hidden">
      {/* Grid de Produtos */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-s1 border-b border-s2 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold font-barlow-condensed">PDV</h1>
            {kpis && (
              <div className="flex gap-4 text-sm">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Pedidos Ativos</div>
                  <div className="text-lg font-bold text-accent">{kpis.pedidosAtivos}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Faturamento</div>
                  <div className="text-lg font-bold text-accent">
                    R$ {kpis.faturamento.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Busca */}
          <Input
            placeholder="🔍 Buscar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="bg-s2 border-s3 text-foreground placeholder:text-muted-foreground"
          />

          {/* Filtro de Categorias */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={categoriaFiltro === null ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoriaFiltro(null)}
              className="whitespace-nowrap"
            >
              Todos
            </Button>
            {categorias.map((cat) => (
              <Button
                key={cat}
                variant={categoriaFiltro === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoriaFiltro(cat)}
                className="whitespace-nowrap"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid de Produtos */}
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
            {isLoading ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Carregando produtos...
              </div>
            ) : produtosFiltrados.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Nenhum produto encontrado
              </div>
            ) : (
              produtosFiltrados.map((produto: any) => {
                const corCategoria = CORES_CATEGORIA[produto.categoria] || CORES_CATEGORIA["Geral"];
                return (
                  <Card
                    key={produto.id}
                    className={`p-3 cursor-pointer border-2 transition-all hover:shadow-lg hover:shadow-accent/50 ${corCategoria}`}
                    onClick={() => adicionarAoCarrinho(produto)}
                  >
                    <div className="space-y-2">
                      <Badge variant="outline" className="text-xs">
                        {produto.categoria}
                      </Badge>
                      <h3 className="font-bold text-sm line-clamp-2">{produto.nome}</h3>
                      <div className="flex justify-between items-end">
                        <div className="text-lg font-bold text-accent">
                          R$ {parseFloat(produto.preco).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Est: {produto.estoque}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Painel de Checkout */}
      <div className="w-96 bg-s1 border-l border-s2 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-s2 border-b border-s3 p-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold font-barlow-condensed">Carrinho</h2>
            <Badge variant="secondary" className="ml-auto">
              {totais.itens} itens
            </Badge>
          </div>
        </div>

        {/* Itens do Carrinho */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {carrinho.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Carrinho vazio
              </div>
            ) : (
              carrinho.map((item) => (
                <Card key={item.produtoId} className="p-3 bg-s2 border-s3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.nome}</h4>
                        <div className="text-xs text-muted-foreground">
                          R$ {item.preco.toFixed(2)} cada
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removerDoCarrinho(item.produtoId)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    {/* Controles de Quantidade */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => atualizarQuantidade(item.produtoId, item.quantidade - 1)}
                        className="h-7 w-7 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantidade}
                        onChange={(e) =>
                          atualizarQuantidade(item.produtoId, parseInt(e.target.value) || 1)
                        }
                        className="h-7 w-12 text-center text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => atualizarQuantidade(item.produtoId, item.quantidade + 1)}
                        className="h-7 w-7 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <div className="ml-auto font-bold text-sm">
                        R$ {(item.preco * item.quantidade).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Totais */}
        <div className="bg-s2 border-t border-s3 p-4 space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>R$ {totais.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Desconto</span>
              <span>R$ {totais.desconto.toFixed(2)}</span>
            </div>
            <div className="border-t border-s3 pt-2 flex justify-between">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-bold font-barlow-condensed text-accent">
                R$ {totais.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Botão Finalizar */}
          <Button
            onClick={finalizarPedido}
            disabled={carrinho.length === 0 || criandoPedido}
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-6 text-lg"
          >
            {criandoPedido ? (
              "Criando pedido..."
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Finalizar Pedido
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
