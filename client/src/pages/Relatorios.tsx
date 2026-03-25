import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Calendar } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type TipoRelatorio = "vendas" | "estoque" | "concorrencia" | "executivo";
type Periodo = "dia" | "semana" | "mes" | "customizado";

export default function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>("vendas");
  const [periodo, setPeriodo] = useState<Periodo>("mes");
  const [canal, setCanal] = useState<string>("todos");
  const [gerando, setGerando] = useState(false);

  // Buscar dados
  const { data: kpis } = trpc.forge.getKPIs.useQuery(undefined);
  const { data: pedidos } = trpc.forge.listarPedidos.useQuery({});
  const { data: produtos } = trpc.forge.listarProdutos.useQuery({});
  const { data: snapshots } = trpc.forge.listarSnapshotsConcorrente.useQuery({});

  // Calcular data do período
  const dataInicio = useMemo(() => {
    const hoje = new Date();
    switch (periodo) {
      case "dia":
        return new Date(hoje.setDate(hoje.getDate() - 1));
      case "semana":
        return new Date(hoje.setDate(hoje.getDate() - 7));
      case "mes":
        return new Date(hoje.setMonth(hoje.getMonth() - 1));
      default:
        return new Date(hoje.setMonth(hoje.getMonth() - 1));
    }
  }, [periodo]);

  // Filtrar pedidos por período e canal
  const pedidosFiltrados = useMemo(() => {
    if (!pedidos) return [];
    return pedidos.filter((p: any) => {
      const dataPedido = new Date(p.criadoEm);
      const canalMatch = canal === "todos" || p.canal === canal;
      const periodoMatch = dataPedido >= dataInicio;
      return canalMatch && periodoMatch;
    });
  }, [pedidos, canal, dataInicio]);

  // Gerar relatório de vendas
  const gerarRelatarioVendas = async () => {
    setGerando(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      // Cabeçalho
      doc.setFontSize(20);
      doc.setTextColor(255, 107, 43); // Brasa
      doc.text("RELATÓRIO DE VENDAS", pageWidth / 2, yPos, { align: "center" });

      yPos += 15;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Período: ${dataInicio.toLocaleDateString("pt-BR")} a ${new Date().toLocaleDateString("pt-BR")}`, pageWidth / 2, yPos, { align: "center" });

      yPos += 20;

      // KPIs principais
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("INDICADORES PRINCIPAIS", 20, yPos);

      yPos += 10;
      doc.setFontSize(10);
      const totalVendas = pedidosFiltrados.reduce((sum: number, p: any) => sum + (parseFloat(p.total) || 0), 0);
      const ticketMedio = pedidosFiltrados.length > 0 ? totalVendas / pedidosFiltrados.length : 0;

      doc.text(`Total de Vendas: R$ ${totalVendas.toFixed(2)}`, 20, yPos);
      yPos += 8;
      doc.text(`Quantidade de Pedidos: ${pedidosFiltrados.length}`, 20, yPos);
      yPos += 8;
      doc.text(`Ticket Médio: R$ ${ticketMedio.toFixed(2)}`, 20, yPos);
      yPos += 8;
      doc.text(`Taxa de Conclusão: ${pedidosFiltrados.filter((p: any) => p.status === "entregue").length}/${pedidosFiltrados.length}`, 20, yPos);

      yPos += 15;

      // Vendas por canal
      doc.setFontSize(12);
      doc.text("VENDAS POR CANAL", 20, yPos);

      yPos += 10;
      doc.setFontSize(10);

      const canais = ["balcão", "iFood", "whatsapp", "telefone"];
      canais.forEach((c) => {
        const vendidosCanal = pedidosFiltrados.filter((p: any) => p.canal.toLowerCase() === c.toLowerCase());
        const totalCanal = vendidosCanal.reduce((sum: number, p: any) => sum + (parseFloat(p.total) || 0), 0);
        doc.text(`${c}: ${vendidosCanal.length} pedidos - R$ ${totalCanal.toFixed(2)}`, 20, yPos);
        yPos += 8;
      });

      yPos += 15;

      // Rodapé
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 20, pageHeight - 10);

      doc.save(`relatorio-vendas-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("✅ Relatório de Vendas gerado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("❌ Erro ao gerar relatório");
    } finally {
      setGerando(false);
    }
  };

  // Gerar relatório de estoque
  const gerarRelatarioEstoque = async () => {
    setGerando(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      // Cabeçalho
      doc.setFontSize(20);
      doc.setTextColor(255, 107, 43);
      doc.text("RELATÓRIO DE ESTOQUE", pageWidth / 2, yPos, { align: "center" });

      yPos += 15;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, pageWidth / 2, yPos, { align: "center" });

      yPos += 20;

      // Resumo de estoque
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("RESUMO DE ESTOQUE", 20, yPos);

      yPos += 10;
      doc.setFontSize(10);

      const totalEstoque = produtos?.reduce((sum: number, p: any) => sum + (parseFloat(p.estoque) || 0), 0) || 0;
      const produtosCriticos = produtos?.filter((p: any) => parseFloat(p.estoque) < 10) || [];
      const valorTotalEstoque = produtos?.reduce((sum: number, p: any) => sum + (parseFloat(p.estoque) * parseFloat(p.custo)) || 0, 0) || 0;

      doc.text(`Total de Produtos: ${produtos?.length || 0}`, 20, yPos);
      yPos += 8;
      doc.text(`Quantidade em Estoque: ${totalEstoque.toFixed(0)} unidades`, 20, yPos);
      yPos += 8;
      doc.text(`Valor Total do Estoque: R$ ${valorTotalEstoque.toFixed(2)}`, 20, yPos);
      yPos += 8;
      doc.text(`Produtos Críticos (<10 un): ${produtosCriticos.length}`, 20, yPos);

      yPos += 15;

      // Produtos críticos
      if (produtosCriticos.length > 0) {
        doc.setFontSize(12);
        doc.text("PRODUTOS CRÍTICOS", 20, yPos);

        yPos += 10;
        doc.setFontSize(9);

        produtosCriticos.slice(0, 10).forEach((p: any) => {
          const estoque = parseFloat(p.estoque) || 0;
          doc.text(`${p.nome}: ${estoque.toFixed(0)} un`, 20, yPos);
          yPos += 7;
          if (yPos > pageHeight - 20) {
            doc.addPage();
            yPos = 20;
          }
        });
      }

      // Rodapé
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 20, pageHeight - 10);

      doc.save(`relatorio-estoque-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("✅ Relatório de Estoque gerado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("❌ Erro ao gerar relatório");
    } finally {
      setGerando(false);
    }
  };

  // Gerar relatório executivo
  const gerarRelatarioExecutivo = async () => {
    setGerando(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      // Cabeçalho
      doc.setFontSize(20);
      doc.setTextColor(255, 107, 43);
      doc.text("RELATÓRIO EXECUTIVO", pageWidth / 2, yPos, { align: "center" });

      yPos += 15;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Período: ${dataInicio.toLocaleDateString("pt-BR")} a ${new Date().toLocaleDateString("pt-BR")}`, pageWidth / 2, yPos, { align: "center" });

      yPos += 20;

      // KPIs principais
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("INDICADORES PRINCIPAIS", 20, yPos);

      yPos += 10;
      doc.setFontSize(10);

      doc.text(`Faturamento: R$ ${(parseFloat(String(kpis?.faturamento)) || 0).toFixed(2)}`, 20, yPos);
      yPos += 8;
      doc.text(`Ticket Médio: R$ ${(parseFloat(String(kpis?.ticketMedio)) || 0).toFixed(2)}`, 20, yPos);
      yPos += 8;
      doc.text(`Receita Total: R$ ${(parseFloat(String(kpis?.lucro.receita)) || 0).toFixed(2)}`, 20, yPos);
      yPos += 8;
      doc.text(`Custo Total: R$ ${(parseFloat(String(kpis?.lucro.custo)) || 0).toFixed(2)}`, 20, yPos);
      yPos += 8;
      doc.text(`Lucro Líquido: R$ ${(parseFloat(String(kpis?.lucro.lucroLiquido)) || 0).toFixed(2)}`, 20, yPos);

      yPos += 15;

      // Análise de desempenho
      doc.setFontSize(12);
      doc.text("ANÁLISE DE DESEMPENHO", 20, yPos);

      yPos += 10;
      doc.setFontSize(10);

      const totalPedidos = pedidosFiltrados.length;
      const pedidosEntregues = pedidosFiltrados.filter((p: any) => p.status === "entregue").length;
      const taxaConclusao = totalPedidos > 0 ? ((pedidosEntregues / totalPedidos) * 100).toFixed(1) : "0";

      doc.text(`Total de Pedidos: ${totalPedidos}`, 20, yPos);
      yPos += 8;
      doc.text(`Pedidos Entregues: ${pedidosEntregues}`, 20, yPos);
      yPos += 8;
      doc.text(`Taxa de Conclusão: ${taxaConclusao}%`, 20, yPos);

      yPos += 15;

      // Recomendações
      doc.setFontSize(12);
      doc.text("RECOMENDAÇÕES", 20, yPos);

      yPos += 10;
      doc.setFontSize(9);

      const recomendacoes: string[] = [];
      if (produtosCriticos.length > 0) {
        recomendacoes.push(`• Reabastecer ${produtosCriticos.length} produtos críticos`);
      }
      if (taxaConclusao < "80") {
        recomendacoes.push("• Melhorar taxa de conclusão de pedidos");
      }
      if (recomendacoes.length === 0) {
        recomendacoes.push("• Operações em bom funcionamento");
      }

      recomendacoes.forEach((rec) => {
        doc.text(rec, 20, yPos);
        yPos += 8;
      });

      // Rodapé
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 20, pageHeight - 10);

      doc.save(`relatorio-executivo-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("✅ Relatório Executivo gerado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("❌ Erro ao gerar relatório");
    } finally {
      setGerando(false);
    }
  };

  // Gerar relatório de concorrência
  const gerarRelatorioConcorrencia = async () => {
    setGerando(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      // Cabeçalho
      doc.setFontSize(20);
      doc.setTextColor(255, 107, 43);
      doc.text("RELATÓRIO DE CONCORRÊNCIA", pageWidth / 2, yPos, { align: "center" });

      yPos += 15;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, pageWidth / 2, yPos, { align: "center" });

      yPos += 20;

      // Resumo de concorrentes
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("RESUMO DE CONCORRENTES", 20, yPos);

      yPos += 10;
      doc.setFontSize(10);

      const concorrentes = snapshots?.reduce((acc: any, s: any) => {
        if (!acc[s.restaurante]) acc[s.restaurante] = [];
        acc[s.restaurante].push(s);
        return acc;
      }, {}) || {};

      doc.text(`Total de Concorrentes Monitorados: ${Object.keys(concorrentes).length}`, 20, yPos);
      yPos += 8;
      doc.text(`Total de Snapshots: ${snapshots?.length || 0}`, 20, yPos);

      yPos += 15;

      // Análise de preços
      doc.setFontSize(12);
      doc.text("ANÁLISE DE PREÇOS", 20, yPos);

      yPos += 10;
      doc.setFontSize(9);

      Object.entries(concorrentes).slice(0, 5).forEach(([concorrente, snaps]: any) => {
        const ultimoSnapshot = snaps[snaps.length - 1];
        const precoMedio = (parseFloat(ultimoSnapshot.precoMinimo) + parseFloat(ultimoSnapshot.precoMaximo)) / 2;
        doc.text(`${concorrente}: R$ ${precoMedio.toFixed(2)} (média)`, 20, yPos);
        yPos += 7;
      });

      // Rodapé
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 20, pageHeight - 10);

      doc.save(`relatorio-concorrencia-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("✅ Relatório de Concorrência gerado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("❌ Erro ao gerar relatório");
    } finally {
      setGerando(false);
    }
  };

  const handleGerarRelatorio = () => {
    switch (tipoRelatorio) {
      case "vendas":
        gerarRelatarioVendas();
        break;
      case "estoque":
        gerarRelatarioEstoque();
        break;
      case "executivo":
        gerarRelatarioExecutivo();
        break;
      case "concorrencia":
        gerarRelatorioConcorrencia();
        break;
    }
  };

  const produtosCriticos = produtos?.filter((p: any) => parseFloat(p.estoque) < 10) || [];

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-8">
        <FileText className="w-8 h-8 text-accent" />
        <h1 className="text-3xl font-bold font-barlow-condensed">Relatórios</h1>
      </div>

      {/* Controles */}
      <Card className="p-6 bg-s1 border-s2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Tipo de Relatório</label>
            <Select value={tipoRelatorio} onValueChange={(v) => setTipoRelatorio(v as TipoRelatorio)}>
              <SelectTrigger className="bg-s2 border-s3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vendas">Vendas</SelectItem>
                <SelectItem value="estoque">Estoque</SelectItem>
                <SelectItem value="concorrencia">Concorrência</SelectItem>
                <SelectItem value="executivo">Executivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Período</label>
            <Select value={periodo} onValueChange={(v) => setPeriodo(v as Periodo)}>
              <SelectTrigger className="bg-s2 border-s3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dia">Último Dia</SelectItem>
                <SelectItem value="semana">Última Semana</SelectItem>
                <SelectItem value="mes">Último Mês</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {tipoRelatorio === "vendas" && (
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Canal</label>
              <Select value={canal} onValueChange={setCanal}>
                <SelectTrigger className="bg-s2 border-s3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="balcão">Balcão</SelectItem>
                  <SelectItem value="iFood">iFood</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="telefone">Telefone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-end">
            <Button onClick={handleGerarRelatorio} disabled={gerando} className="w-full bg-accent hover:bg-accent/90">
              <Download className="w-4 h-4 mr-2" />
              {gerando ? "Gerando..." : "Gerar PDF"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Preview de dados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tipoRelatorio === "vendas" && (
          <>
            <Card className="p-6 bg-s1 border-s2">
              <h2 className="text-lg font-semibold mb-4">Resumo de Vendas</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de Vendas:</span>
                  <span className="font-bold text-accent">R$ {pedidosFiltrados.reduce((sum: number, p: any) => sum + (parseFloat(p.total) || 0), 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantidade de Pedidos:</span>
                  <span className="font-bold">{pedidosFiltrados.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ticket Médio:</span>
                  <span className="font-bold">R$ {(pedidosFiltrados.length > 0 ? pedidosFiltrados.reduce((sum: number, p: any) => sum + (parseFloat(p.total) || 0), 0) / pedidosFiltrados.length : 0).toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </>
        )}

        {tipoRelatorio === "estoque" && (
          <>
            <Card className="p-6 bg-s1 border-s2">
              <h2 className="text-lg font-semibold mb-4">Resumo de Estoque</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de Produtos:</span>
                  <span className="font-bold">{produtos?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantidade em Estoque:</span>
                  <span className="font-bold">{(produtos?.reduce((sum: number, p: any) => sum + (parseFloat(p.estoque) || 0), 0) || 0).toFixed(0)} un</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Produtos Críticos:</span>
                  <span className="font-bold text-red-500">{produtosCriticos.length}</span>
                </div>
              </div>
            </Card>
          </>
        )}

        {tipoRelatorio === "executivo" && (
          <>
            <Card className="p-6 bg-s1 border-s2">
              <h2 className="text-lg font-semibold mb-4">KPIs Principais</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Faturamento:</span>
                  <span className="font-bold text-green-500">R$ {(parseFloat(String(kpis?.faturamento)) || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lucro Líquido:</span>
                  <span className="font-bold text-accent">R$ {(parseFloat(String(kpis?.lucro.lucroLiquido)) || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ticket Médio:</span>
                  <span className="font-bold">R$ {(parseFloat(String(kpis?.ticketMedio)) || 0).toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
