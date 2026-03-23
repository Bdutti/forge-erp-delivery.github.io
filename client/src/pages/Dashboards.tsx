import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, Package, AlertCircle } from "lucide-react";

export default function Dashboards() {
  const { data: kpis, isLoading } = trpc.forge.getKPIs.useQuery(undefined);
  const { data: pedidos } = trpc.forge.listarPedidos.useQuery({});
  const { data: produtos } = trpc.forge.listarProdutos.useQuery({});

  // Dados para gráficos
  const dadosVendas = useMemo(() => {
    if (!pedidos) return [];
    // Simular dados de vendas por dia
    return [
      { dia: "Seg", vendas: 1200, pedidos: 8 },
      { dia: "Ter", vendas: 1900, pedidos: 12 },
      { dia: "Qua", vendas: 1500, pedidos: 10 },
      { dia: "Qui", vendas: 2200, pedidos: 15 },
      { dia: "Sex", vendas: 2800, pedidos: 18 },
      { dia: "Sab", vendas: 3200, pedidos: 22 },
      { dia: "Dom", vendas: 2500, pedidos: 16 },
    ];
  }, [pedidos]);

  const dadosCanalVendas = useMemo(() => {
    return [
      { name: "Balcão", value: 45, color: "#ff6b2b" },
      { name: "iFood", value: 35, color: "#3b82f6" },
      { name: "WhatsApp", value: 15, color: "#10b981" },
      { name: "Telefone", value: 5, color: "#f59e0b" },
    ];
  }, []);

  const dadosEstoque = useMemo(() => {
    if (!produtos) return [];
    return [
      { categoria: "Hambúrguer", estoque: 45, minimo: 20 },
      { categoria: "Bebidas", estoque: 80, minimo: 30 },
      { categoria: "Acompanhamentos", estoque: 60, minimo: 25 },
      { categoria: "Sobremesas", estoque: 35, minimo: 15 },
    ];
  }, [produtos]);

  const dadosFinanceiro = useMemo(() => {
    return [
      { mes: "Jan", receita: 15000, custo: 6000, lucro: 9000 },
      { mes: "Fev", receita: 18000, custo: 7200, lucro: 10800 },
      { mes: "Mar", receita: 22000, custo: 8800, lucro: 13200 },
      { mes: "Abr", receita: 20000, custo: 8000, lucro: 12000 },
      { mes: "Mai", receita: 25000, custo: 10000, lucro: 15000 },
      { mes: "Jun", receita: 28000, custo: 11200, lucro: 16800 },
    ];
  }, []);

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-barlow-condensed">Dashboards</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Análise completa de vendas, estoque, financeiro e executivo
        </p>
      </div>

      {/* KPIs Principais */}
      {kpis && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-s1 border-s2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Faturamento</p>
                <p className="text-2xl font-bold font-barlow-condensed text-accent">
                  R$ {kpis.faturamento.toFixed(0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-accent opacity-50" />
            </div>
          </Card>

          <Card className="p-4 bg-s1 border-s2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold font-barlow-condensed">
                  R$ {kpis.ticketMedio.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 bg-s1 border-s2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pedidos Ativos</p>
                <p className="text-2xl font-bold font-barlow-condensed">
                  {kpis.pedidosAtivos}
                </p>
              </div>
              <Package className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 bg-s1 border-s2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertas Estoque</p>
                <p className="text-2xl font-bold font-barlow-condensed">
                  {kpis.alertasEstoque}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500 opacity-50" />
            </div>
          </Card>
        </div>
      )}

      {/* Abas de Dashboards */}
      <Tabs defaultValue="vendas" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-s1 border border-s2">
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="executivo">Executivo</TabsTrigger>
        </TabsList>

        {/* Aba: Vendas */}
        <TabsContent value="vendas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gráfico: Vendas por Dia */}
            <Card className="p-4 bg-s1 border-s2">
              <h3 className="font-semibold mb-4">Vendas por Dia</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dadosVendas}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="dia" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #444" }} />
                  <Legend />
                  <Line type="monotone" dataKey="vendas" stroke="#ff6b2b" strokeWidth={2} dot={{ fill: "#ff6b2b" }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Gráfico: Vendas por Canal */}
            <Card className="p-4 bg-s1 border-s2">
              <h3 className="font-semibold mb-4">Vendas por Canal (%)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dadosCanalVendas}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dadosCanalVendas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Tabela: Pedidos Recentes */}
            <Card className="p-4 bg-s1 border-s2 lg:col-span-2">
              <h3 className="font-semibold mb-4">Pedidos Recentes</h3>
              <div className="space-y-2">
                {pedidos?.slice(0, 5).map((pedido: any) => (
                  <div key={pedido.id} className="flex items-center justify-between p-2 bg-s2 rounded">
                    <div>
                      <p className="font-semibold text-sm">{pedido.numero}</p>
                      <p className="text-xs text-muted-foreground">{pedido.canal}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R$ {pedido.total?.toFixed(2) || "0.00"}</p>
                      <Badge variant="outline" className="text-xs">
                        {pedido.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Aba: Estoque */}
        <TabsContent value="estoque" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gráfico: Estoque por Categoria */}
            <Card className="p-4 bg-s1 border-s2">
              <h3 className="font-semibold mb-4">Estoque por Categoria</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosEstoque}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="categoria" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #444" }} />
                  <Legend />
                  <Bar dataKey="estoque" fill="#ff6b2b" />
                  <Bar dataKey="minimo" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Alertas de Estoque */}
            <Card className="p-4 bg-s1 border-s2">
              <h3 className="font-semibold mb-4">Produtos Críticos</h3>
              <div className="space-y-2">
                {produtos?.filter((p: any) => parseFloat(p.estoque) < 10).map((produto: any) => (
                  <div key={produto.id} className="flex items-center justify-between p-2 bg-red-500/10 border border-red-500/30 rounded">
                    <div>
                      <p className="font-semibold text-sm">{produto.nome}</p>
                      <p className="text-xs text-muted-foreground">{produto.categoria}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-500">{parseFloat(produto.estoque).toFixed(0)} un</p>
                    </div>
                  </div>
                ))}
                {!produtos?.some((p: any) => parseFloat(p.estoque) < 10) && (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhum produto crítico</p>
                )}
              </div>
            </Card>

            {/* Rotatividade */}
            <Card className="p-4 bg-s1 border-s2 lg:col-span-2">
              <h3 className="font-semibold mb-4">Rotatividade de Estoque</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dadosEstoque.map((item) => (
                  <div key={item.categoria} className="text-center p-3 bg-s2 rounded">
                    <p className="text-xs text-muted-foreground mb-1">{item.categoria}</p>
                    <p className="text-lg font-bold">{item.estoque}</p>
                    <p className="text-xs text-muted-foreground">Mín: {item.minimo}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Aba: Financeiro */}
        <TabsContent value="financeiro" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gráfico: Receita vs Custo */}
            <Card className="p-4 bg-s1 border-s2">
              <h3 className="font-semibold mb-4">Receita vs Custo (últimos 6 meses)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosFinanceiro}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="mes" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #444" }} />
                  <Legend />
                  <Bar dataKey="receita" fill="#10b981" />
                  <Bar dataKey="custo" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Gráfico: Lucro Líquido */}
            <Card className="p-4 bg-s1 border-s2">
              <h3 className="font-semibold mb-4">Lucro Líquido (últimos 6 meses)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dadosFinanceiro}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="mes" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #444" }} />
                  <Line type="monotone" dataKey="lucro" stroke="#ff6b2b" strokeWidth={3} dot={{ fill: "#ff6b2b", r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Resumo Financeiro */}
            {kpis && (
              <Card className="p-4 bg-s1 border-s2 lg:col-span-2">
                <h3 className="font-semibold mb-4">Resumo Financeiro</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-s2 rounded text-center">
                    <p className="text-xs text-muted-foreground mb-1">Receita Total</p>
                    <p className="text-xl font-bold text-green-500">R$ {kpis.lucro.receita.toFixed(0)}</p>
                  </div>
                  <div className="p-3 bg-s2 rounded text-center">
                    <p className="text-xs text-muted-foreground mb-1">Custo Total</p>
                    <p className="text-xl font-bold text-red-500">R$ {kpis.lucro.custo.toFixed(0)}</p>
                  </div>
                  <div className="p-3 bg-s2 rounded text-center">
                    <p className="text-xs text-muted-foreground mb-1">Lucro Líquido</p>
                    <p className="text-xl font-bold text-accent">R$ {kpis.lucro.lucroLiquido.toFixed(0)}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Aba: Executivo */}
        <TabsContent value="executivo" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* KPIs Executivos */}
            {kpis && (
              <>
                <Card className="p-4 bg-s1 border-s2">
                  <h3 className="font-semibold mb-4">Indicadores Principais</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-s2 rounded">
                      <span className="text-sm">Faturamento Diário</span>
                      <span className="font-bold text-accent">R$ {(kpis.faturamento / 30).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-s2 rounded">
                      <span className="text-sm">Ticket Médio</span>
                      <span className="font-bold">R$ {kpis.ticketMedio.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-s2 rounded">
                      <span className="text-sm">Margem Média</span>
                      <span className="font-bold text-green-500">32.5%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-s2 rounded">
                      <span className="text-sm">Taxa de Conversão</span>
                      <span className="font-bold">78%</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-s1 border-s2">
                  <h3 className="font-semibold mb-4">Saúde do Negócio</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Lucratividade</span>
                        <span className="font-bold text-green-500">60%</span>
                      </div>
                      <div className="w-full bg-s2 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Eficiência Operacional</span>
                        <span className="font-bold text-blue-500">85%</span>
                      </div>
                      <div className="w-full bg-s2 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Satisfação de Estoque</span>
                        <span className="font-bold text-yellow-500">72%</span>
                      </div>
                      <div className="w-full bg-s2 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "72%" }}></div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Tendências */}
                <Card className="p-4 bg-s1 border-s2 lg:col-span-2">
                  <h3 className="font-semibold mb-4">Tendências da Semana</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-s2 rounded text-center">
                      <p className="text-xs text-muted-foreground mb-1">Vendas</p>
                      <p className="text-lg font-bold text-green-500">↑ 12%</p>
                    </div>
                    <div className="p-3 bg-s2 rounded text-center">
                      <p className="text-xs text-muted-foreground mb-1">Custos</p>
                      <p className="text-lg font-bold text-red-500">↓ 5%</p>
                    </div>
                    <div className="p-3 bg-s2 rounded text-center">
                      <p className="text-xs text-muted-foreground mb-1">Pedidos</p>
                      <p className="text-lg font-bold text-blue-500">↑ 8%</p>
                    </div>
                    <div className="p-3 bg-s2 rounded text-center">
                      <p className="text-xs text-muted-foreground mb-1">Lucro</p>
                      <p className="text-lg font-bold text-accent">↑ 18%</p>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
