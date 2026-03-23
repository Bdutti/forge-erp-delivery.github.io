import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Edit2, Trash2, Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ProdutoForm {
  id?: number;
  nome: string;
  descricao?: string;
  categoria: string;
  preco: number;
  custo: number;
  estoque: number;
  sku?: string;
}

export default function Produtos() {
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<ProdutoForm | null>(null);
  const [formData, setFormData] = useState<ProdutoForm>({
    nome: "",
    categoria: "Geral",
    preco: 0,
    custo: 0,
    estoque: 0,
  });

  // Buscar produtos
  const { data: produtos, isLoading, refetch } = trpc.forge.listarProdutos.useQuery({
    ativo: true,
  });

  // Upsert produto
  const upsertMutation = trpc.forge.upsertProduto.useMutation({
    onSuccess: () => {
      toast.success("✅ Produto salvo com sucesso!");
      setDialogAberto(false);
      setProdutoEmEdicao(null);
      setFormData({ nome: "", categoria: "Geral", preco: 0, custo: 0, estoque: 0 });
      refetch();
    },
    onError: (error) => {
      toast.error(`❌ Erro: ${error.message}`);
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

  // Calcular margem
  const calcularMargem = (preco: number, custo: number) => {
    if (custo === 0 || preco === 0) return 0;
    return ((preco - custo) / preco) * 100;
  };

  // Cor da margem
  const getCorMargem = (margem: number) => {
    if (margem >= 40) return "text-green-500";
    if (margem >= 20) return "text-yellow-500";
    return "text-red-500";
  };

  // Cor de fundo da margem
  const getCorFundoMargem = (margem: number) => {
    if (margem >= 40) return "bg-green-500/10 border-green-500/30";
    if (margem >= 20) return "bg-yellow-500/10 border-yellow-500/30";
    return "bg-red-500/10 border-red-500/30";
  };

  // Abrir dialog para novo produto
  const abrirNovoFormulario = () => {
    setProdutoEmEdicao(null);
    setFormData({ nome: "", categoria: "Geral", preco: 0, custo: 0, estoque: 0 });
    setDialogAberto(true);
  };

  // Abrir dialog para editar produto
  const abrirEdicao = (produto: any) => {
    setProdutoEmEdicao(produto);
    setFormData({
      id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao,
      categoria: produto.categoria,
      preco: parseFloat(produto.preco),
      custo: parseFloat(produto.custo),
      estoque: parseFloat(produto.estoque),
      sku: produto.sku,
    });
    setDialogAberto(true);
  };

  // Salvar produto
  const salvarProduto = async () => {
    if (!formData.nome || formData.preco <= 0 || formData.custo < 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    await upsertMutation.mutateAsync({
      id: formData.id,
      nome: formData.nome,
      descricao: formData.descricao,
      categoria: formData.categoria,
      preco: formData.preco,
      custo: formData.custo,
      estoque: formData.estoque,
      sku: formData.sku,
      ativo: true,
    });
  };

  // Deletar produto
  const deletarProduto = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este produto?")) return;
    // TODO: Implementar mutation de delete
    toast.info("Delete ainda não implementado");
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-barlow-condensed">Produtos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerenciar catálogo com cálculo de margem em tempo real
          </p>
        </div>
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button onClick={abrirNovoFormulario} className="bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-s1 border-s2">
            <DialogHeader>
              <DialogTitle className="font-barlow-condensed">
                {produtoEmEdicao ? "Editar Produto" : "Novo Produto"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="text-sm font-medium">Nome *</label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Hambúrguer Premium"
                  className="bg-s2 border-s3"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="text-sm font-medium">SKU</label>
                <Input
                  value={formData.sku || ""}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Ex: HAM-001"
                  className="bg-s2 border-s3"
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="text-sm font-medium">Categoria *</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-3 py-2 bg-s2 border border-s3 rounded-md text-foreground"
                >
                  <option>Hambúrguer</option>
                  <option>Bebidas</option>
                  <option>Acompanhamentos</option>
                  <option>Sobremesas</option>
                  <option>Geral</option>
                </select>
              </div>

              {/* Preço e Custo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Preço de Venda (R$) *</label>
                  <Input
                    type="number"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    step="0.01"
                    className="bg-s2 border-s3"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Custo (R$) *</label>
                  <Input
                    type="number"
                    value={formData.custo}
                    onChange={(e) => setFormData({ ...formData, custo: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    step="0.01"
                    className="bg-s2 border-s3"
                  />
                </div>
              </div>

              {/* Margem em Tempo Real */}
              {formData.preco > 0 && formData.custo >= 0 && (
                <div className={`p-3 rounded-md border-2 ${getCorFundoMargem(calcularMargem(formData.preco, formData.custo))}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Margem de Lucro</span>
                    <span className={`text-lg font-bold ${getCorMargem(calcularMargem(formData.preco, formData.custo))}`}>
                      {calcularMargem(formData.preco, formData.custo).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Lucro: R$ {(formData.preco - formData.custo).toFixed(2)}
                  </div>
                </div>
              )}

              {/* Estoque */}
              <div>
                <label className="text-sm font-medium">Estoque (unidades)</label>
                <Input
                  type="number"
                  value={formData.estoque}
                  onChange={(e) => setFormData({ ...formData, estoque: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  className="bg-s2 border-s3"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <textarea
                  value={formData.descricao || ""}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição do produto..."
                  rows={3}
                  className="w-full px-3 py-2 bg-s2 border border-s3 rounded-md text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={salvarProduto}
                  disabled={upsertMutation.isPending}
                  className="flex-1 bg-accent hover:bg-accent/90"
                >
                  {upsertMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
                <Button
                  onClick={() => setDialogAberto(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="space-y-3">
        <Input
          placeholder="🔍 Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="bg-s2 border-s3"
        />

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

      {/* Tabela de Produtos */}
      <div className="overflow-x-auto border border-s2 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-s2 bg-s1">
              <th className="text-left py-3 px-4 font-semibold">Produto</th>
              <th className="text-left py-3 px-4 font-semibold">SKU</th>
              <th className="text-right py-3 px-4 font-semibold">Preço</th>
              <th className="text-right py-3 px-4 font-semibold">Custo</th>
              <th className="text-center py-3 px-4 font-semibold">Margem</th>
              <th className="text-center py-3 px-4 font-semibold">Estoque</th>
              <th className="text-center py-3 px-4 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  Carregando produtos...
                </td>
              </tr>
            ) : produtosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum produto encontrado
                </td>
              </tr>
            ) : (
              produtosFiltrados.map((produto: any) => {
                const margem = calcularMargem(parseFloat(produto.preco), parseFloat(produto.custo));
                const estoque = parseFloat(produto.estoque);
                const estoquePercentual = Math.min((estoque / 100) * 100, 100);
                const alertaEstoque = estoque < 10;

                return (
                  <tr key={produto.id} className="border-b border-s2 hover:bg-s1 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-semibold">{produto.nome}</div>
                        <div className="text-xs text-muted-foreground">{produto.categoria}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">{produto.sku || "-"}</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      R$ {parseFloat(produto.preco).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      R$ {parseFloat(produto.custo).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={`${getCorMargem(margem)} bg-transparent border`}>
                        {margem.toFixed(1)}%
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {alertaEstoque && <AlertCircle className="w-4 h-4 text-red-500" />}
                          <span className="font-semibold">{estoque.toFixed(0)}</span>
                        </div>
                        <Progress value={estoquePercentual} className="h-1" />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirEdicao(produto)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletarProduto(produto.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
