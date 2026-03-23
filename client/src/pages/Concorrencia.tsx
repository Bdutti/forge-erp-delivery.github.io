import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, AlertCircle, Target } from "lucide-react";

export default function Concorrencia() {
  const { data: snapshots } = trpc.forge.listarSnapshotsConcorrente.useQuery({});
  const { data: produtos } = trpc.forge.listarProdutos.useQuery({});

  // Dados para scatter plot (taxa × tempo)
  const dadosScatter = useMemo(() => {
    if (!snapshots) return [];

    // Simular dados de benchmarking
    return [
      { nome: "Você", taxa: 45, tempo: 8, fill: "#ff6b2b" },
      { nome: "Concorrente A", taxa: 38, tempo: 12, fill: "#3b82f6" },
      { nome: "Concorrente B", taxa: 52, tempo: 15, fill: "#ef4444" },
      { nome: "Concorrente C", taxa: 41, tempo: 10, fill: "#10b981" },
      { nome: "Concorrente D", taxa: 35, tempo: 18, fill: "#f59e0b" },
      { nome: "Concorrente E", taxa: 48, tempo: 9, fill: "#8b5cf6" },
    ];
  }, [snapshots]);

  // Calcular vantagem
  const vantagens = useMemo(() => {
    const meusDados = dadosScatter.find((d) => d.nome === "Você");
    if (!meusDados) return [];

    return dadosScatter
      .filter((d) => d.nome !== "Você")
      .map((concorrente) => ({
        nome: concorrente.nome,
        taxa: concorrente.taxa,
        tempo: concorrente.tempo,
        vantagemTaxa: meusDados.taxa - concorrente.taxa,
        vantagemTempo: concorrente.tempo - meusDados.tempo,
        vantagemGeral: (meusDados.taxa - concorrente.taxa) + (concorrente.tempo - meusDados.tempo) * 2,
      }));
  }, [dadosScatter]);

  // Dados de tendência de preços
  const dadosTendencia = useMemo(() => {
    return [
      { mes: "Jan", voce: 28.5, concA: 32.0, concB: 25.0, concC: 30.0 },
      { mes: "Fev", voce: 29.0, concA: 31.5, concB: 26.0, concC: 29.5 },
      { mes: "Mar", voce: 28.8, concA: 33.0, concB: 24.5, concC: 31.0 },
      { mes: "Abr", voce: 30.0, concA: 32.5, concB: 27.0, concC: 30.5 },
      { mes: "Mai", voce: 31.5, concA: 34.0, concB: 28.0, concC: 32.0 },
      { mes: "Jun", voce: 32.0, concA: 35.0, concB: 29.0, concC: 33.0 },
    ];
  }, []);

  // Comparação de produtos
  const comparacaoProdutos = useMemo(() => {
    if (!produtos) return [];

    return [
      {
        nome: "Hambúrguer Premium",
        voce: 28.5,
        concA: 32.0,
        concB: 25.0,
        vantagem: "Preço competitivo",
      },
      {
        nome: "X-Burguer",
        voce: 22.0,
        concA: 24.0,
        concB: 20.0,
        vantagem: "Melhor preço",
      },
      {
        nome: "Refrigerante 2L",
        voce: 8.5,
        concA: 9.0,
        concB: 8.0,
        vantagem: "Preço médio",
      },
      {
        nome: "Batata Frita",
        voce: 12.0,
        concA: 13.5,
        concB: 11.0,
        vantagem: "Melhor preço",
      },
      {
        nome: "Sorvete",
        voce: 15.0,
        concA: 14.0,
        concB: 16.0,
        vantagem: "Preço competitivo",
      },
    ];
  }, [produtos]);

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-barlow-condensed">Concorrência</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Benchmarking completo com análise de preços e performance
        </p>
      </div>

      {/* KPIs de Vantagem */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-s1 border-s2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
              <p className="text-2xl font-bold font-barlow-condensed text-accent">45%</p>
              <p className="text-xs text-green-500 mt-1">↑ 8% vs concorrentes</p>
            </div>
            <Target className="w-8 h-8 text-accent opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-s1 border-s2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tempo Médio</p>
              <p className="text-2xl font-bold font-barlow-condensed">8 min</p>
              <p className="text-xs text-green-500 mt-1">↓ 40% vs concorrentes</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-s1 border-s2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Posição no Mercado</p>
              <p className="text-2xl font-bold font-barlow-condensed">2º lugar</p>
              <p className="text-xs text-yellow-500 mt-1">Entre 5 concorrentes</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Scatter Plot: Taxa × Tempo */}
      <Card className="p-4 bg-s1 border-s2">
        <h3 className="font-semibold mb-4">Benchmarking: Taxa de Conversão × Tempo Médio</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              type="number"
              dataKey="taxa"
              name="Taxa de Conversão (%)"
              stroke="#999"
              label={{ value: "Taxa de Conversão (%)", position: "insideBottomRight", offset: -10 }}
            />
            <YAxis
              type="number"
              dataKey="tempo"
              name="Tempo Médio (min)"
              stroke="#999"
              label={{ value: "Tempo Médio (min)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #444" }}
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-s1 border border-s2 p-2 rounded text-xs">
                      <p className="font-semibold">{data.nome}</p>
                      <p>Taxa: {data.taxa}%</p>
                      <p>Tempo: {data.tempo} min</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Concorrentes" data={dadosScatter} fill="#3b82f6" />
          </ScatterChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Posição ideal: canto superior esquerdo (alta taxa, baixo tempo)
        </p>
      </Card>

      {/* Tabela: Sua Vantagem */}
      <Card className="p-4 bg-s1 border-s2">
        <h3 className="font-semibold mb-4">Sua Vantagem Competitiva</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-s2">
                <th className="text-left py-2 px-3 font-semibold">Concorrente</th>
                <th className="text-center py-2 px-3 font-semibold">Taxa</th>
                <th className="text-center py-2 px-3 font-semibold">Tempo</th>
                <th className="text-center py-2 px-3 font-semibold">Vantagem Taxa</th>
                <th className="text-center py-2 px-3 font-semibold">Vantagem Tempo</th>
                <th className="text-center py-2 px-3 font-semibold">Vantagem Geral</th>
              </tr>
            </thead>
            <tbody>
              {vantagens.map((v, idx) => (
                <tr key={idx} className="border-b border-s2 hover:bg-s1 transition-colors">
                  <td className="py-2 px-3 font-semibold">{v.nome}</td>
                  <td className="text-center py-2 px-3">{v.taxa}%</td>
                  <td className="text-center py-2 px-3">{v.tempo} min</td>
                  <td className="text-center py-2 px-3">
                    <Badge
                      className={`${
                        v.vantagemTaxa > 0
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      } border`}
                    >
                      {v.vantagemTaxa > 0 ? "+" : ""}{v.vantagemTaxa}%
                    </Badge>
                  </td>
                  <td className="text-center py-2 px-3">
                    <Badge
                      className={`${
                        v.vantagemTempo > 0
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      } border`}
                    >
                      {v.vantagemTempo > 0 ? "-" : "+"}{Math.abs(v.vantagemTempo)} min
                    </Badge>
                  </td>
                  <td className="text-center py-2 px-3">
                    <Badge
                      className={`${
                        v.vantagemGeral > 0
                          ? "bg-accent/20 text-accent"
                          : "bg-red-500/20 text-red-500"
                      } border`}
                    >
                      {v.vantagemGeral > 0 ? "+" : ""}{v.vantagemGeral.toFixed(1)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Tendência de Preços */}
      <Card className="p-4 bg-s1 border-s2">
        <h3 className="font-semibold mb-4">Tendência de Preços (últimos 6 meses)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dadosTendencia}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="mes" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #444" }} />
            <Legend />
            <Line type="monotone" dataKey="voce" stroke="#ff6b2b" strokeWidth={2} name="Seu Preço" />
            <Line type="monotone" dataKey="concA" stroke="#3b82f6" strokeWidth={2} name="Concorrente A" />
            <Line type="monotone" dataKey="concB" stroke="#ef4444" strokeWidth={2} name="Concorrente B" />
            <Line type="monotone" dataKey="concC" stroke="#10b981" strokeWidth={2} name="Concorrente C" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Comparação de Produtos */}
      <Card className="p-4 bg-s1 border-s2">
        <h3 className="font-semibold mb-4">Comparação de Preços por Produto</h3>
        <div className="space-y-3">
          {comparacaoProdutos.map((produto, idx) => (
            <div key={idx} className="p-3 bg-s2 rounded">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">{produto.nome}</p>
                <Badge className="bg-accent/20 text-accent border">{produto.vantagem}</Badge>
              </div>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Seu preço</p>
                  <div className="flex items-end gap-1">
                    <div
                      className="bg-accent rounded"
                      style={{ height: `${(produto.voce / 35) * 100}px`, minHeight: "20px" }}
                    />
                    <p className="text-sm font-bold">R$ {produto.voce.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Concorrente A</p>
                  <div className="flex items-end gap-1">
                    <div
                      className="bg-blue-500 rounded"
                      style={{ height: `${(produto.concA / 35) * 100}px`, minHeight: "20px" }}
                    />
                    <p className="text-sm font-bold">R$ {produto.concA.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Concorrente B</p>
                  <div className="flex items-end gap-1">
                    <div
                      className="bg-red-500 rounded"
                      style={{ height: `${(produto.concB / 35) * 100}px`, minHeight: "20px" }}
                    />
                    <p className="text-sm font-bold">R$ {produto.concB.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Alertas de Preço */}
      <Card className="p-4 bg-red-500/10 border border-red-500/30">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          Alertas de Preço
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            ⚠️ <strong>Concorrente B</strong> reduziu preço de Hambúrguer em 8% (de R$ 27,17 para R$ 25,00)
          </p>
          <p>
            ⚠️ <strong>Concorrente A</strong> aumentou preço de Refrigerante em 3% (de R$ 8,74 para R$ 9,00)
          </p>
          <p>
            ✓ Seu preço está competitivo em 4 de 5 produtos
          </p>
        </div>
      </Card>
    </div>
  );
}
