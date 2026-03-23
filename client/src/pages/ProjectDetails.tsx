import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Box,
  CheckCircle2,
  Code2,
  Database,
  Gauge,
  Github,
  Globe,
  Layers,
  Zap,
  TrendingUp,
  Users,
  Download,
  ExternalLink,
} from "lucide-react";

export default function ProjectDetails() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-s0 text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-s1 to-s0 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-brasa flex items-center justify-center animate-glow-pulse">
              <span className="text-white font-bold text-3xl">F</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-barlow-condensed">
                Forge ERP Delivery
              </h1>
              <p className="text-muted-foreground text-lg">
                Sistema de gestão de pedidos e produtos com tema industrial dark
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <Badge className="bg-brasa text-white">v1.0.0</Badge>
            <Badge variant="outline">React 19</Badge>
            <Badge variant="outline">tRPC 11</Badge>
            <Badge variant="outline">MySQL</Badge>
            <Badge variant="outline">Pronto para Produção</Badge>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            Um sistema completo de PDV (Ponto de Venda) com análise avançada, sincronização com Google Sheets e monitoramento de concorrentes. Desenvolvido com tema Forge Dark industrial, tipografia Barlow Condensed e acento brasa #ff6b2b.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button className="bg-brasa hover:bg-brasa/90 gap-2">
              <Gauge className="w-4 h-4" />
              Acessar Sistema
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Documentação
            </Button>
            <Button variant="outline" className="gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-s1 border-y border-s3 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-brasa mb-2">39</div>
            <p className="text-sm text-muted-foreground">Testes Vitest</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brasa mb-2">5</div>
            <p className="text-sm text-muted-foreground">Páginas Principais</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brasa mb-2">7</div>
            <p className="text-sm text-muted-foreground">Tabelas de Banco</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brasa mb-2">100%</div>
            <p className="text-sm text-muted-foreground">Funcionalidades</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold font-barlow-condensed mb-12">
            Funcionalidades Principais
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* PDV */}
            <Card className="p-6 bg-s1 border-s3 hover:border-brasa transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-brasa/20 flex items-center justify-center">
                  <Gauge className="w-6 h-6 text-brasa" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">PDV Fullscreen</h3>
                  <p className="text-sm text-muted-foreground">
                    Interface otimizada para vendas rápidas
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Grid de produtos com categorias coloridas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Busca em tempo real
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Checkout panel com total gigante
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Múltiplos canais (balcão, iFood, WhatsApp)
                </li>
              </ul>
            </Card>

            {/* Pedidos */}
            <Card className="p-6 bg-s1 border-s3 hover:border-brasa transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-brasa/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-brasa" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Gestão de Pedidos</h3>
                  <p className="text-sm text-muted-foreground">
                    Fluxo completo com múltiplos status
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Filtros de status com contadores
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Fluxo inline de avanço/cancelamento
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Refresh automático a cada 30s
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Histórico completo de pedidos
                </li>
              </ul>
            </Card>

            {/* Produtos */}
            <Card className="p-6 bg-s1 border-s3 hover:border-brasa transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-brasa/20 flex items-center justify-center">
                  <Box className="w-6 h-6 text-brasa" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">CRUD de Produtos</h3>
                  <p className="text-sm text-muted-foreground">
                    Gerenciar cardápio com análise de margem
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Criar, ler, atualizar, deletar
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Cálculo de margem em tempo real
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Cores dinâmicas (verde/amarelo/vermelho)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Barra de progresso de estoque
                </li>
              </ul>
            </Card>

            {/* Dashboards */}
            <Card className="p-6 bg-s1 border-s3 hover:border-brasa transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-brasa/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-brasa" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Dashboards (4 Abas)</h3>
                  <p className="text-sm text-muted-foreground">
                    Análise avançada com gráficos
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Vendas — Faturamento e ticket médio
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Estoque — Níveis e rotatividade
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Financeiro — Receita e lucro
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Executivo — KPIs e tendências
                </li>
              </ul>
            </Card>

            {/* Concorrência */}
            <Card className="p-6 bg-s1 border-s3 hover:border-brasa transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-brasa/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-brasa" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Análise de Concorrência</h3>
                  <p className="text-sm text-muted-foreground">
                    Benchmarking com scatter plot
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Scatter plot taxa × tempo
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Coluna "sua vantagem" automática
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Comparação visual de preços
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Tendência de preços (6 meses)
                </li>
              </ul>
            </Card>

            {/* Google Sheets */}
            <Card className="p-6 bg-s1 border-s3 hover:border-brasa transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-brasa/20 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-brasa" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Google Sheets Sync</h3>
                  <p className="text-sm text-muted-foreground">
                    Sincronização bidirecional automática
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Exportação em tempo real
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Pedidos, Produtos e KPIs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Sincronização manual e automática
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Abas estruturadas na planilha
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="bg-s1 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold font-barlow-condensed mb-12">
            Stack Tecnológico
          </h2>

          <Tabs defaultValue="frontend" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="frontend">Frontend</TabsTrigger>
              <TabsTrigger value="backend">Backend</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
            </TabsList>

            <TabsContent value="frontend" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4 bg-s0 border-s3">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-brasa" />
                    React 19
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Framework moderno com hooks e suspense
                  </p>
                </Card>
                <Card className="p-4 bg-s0 border-s3">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brasa" />
                    Tailwind CSS 4
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Tema Forge Dark customizado com 6 camadas
                  </p>
                </Card>
                <Card className="p-4 bg-s0 border-s3">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-brasa" />
                    Recharts
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Gráficos interativos e responsivos
                  </p>
                </Card>
                <Card className="p-4 bg-s0 border-s3">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-brasa" />
                    Vite
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Build tool rápido e otimizado
                  </p>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="backend" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4 bg-s0 border-s3">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-brasa" />
                    Express 4
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Servidor web minimalista e flexível
                  </p>
                </Card>
                <Card className="p-4 bg-s0 border-s3">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-brasa" />
                    tRPC 11
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    RPC type-safe end-to-end
                  </p>
                </Card>
                <Card className="p-4 bg-s0 border-s3">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4 text-brasa" />
                    Drizzle ORM
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    ORM TypeScript com tipos gerados
                  </p>
                </Card>
                <Card className="p-4 bg-s0 border-s3">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-brasa" />
                    googleapis
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Integração com Google Sheets API
                  </p>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="database" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4 bg-s0 border-s3">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4 text-brasa" />
                    MySQL 8.0+
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Banco de dados relacional robusto
                  </p>
                </Card>
                <Card className="p-4 bg-s0 border-s3">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4 text-brasa" />
                    TiDB
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Alternativa compatível com MySQL
                  </p>
                </Card>
                <Card className="p-4 bg-s0 border-s3">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brasa" />
                    7 Tabelas
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Schema otimizado e normalizado
                  </p>
                </Card>
                <Card className="p-4 bg-s0 border-s3">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brasa" />
                    Migrações
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Versionamento automático com Drizzle
                  </p>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold font-barlow-condensed mb-12">
            Arquitetura do Sistema
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 bg-s1 border-s3">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-brasa" />
                Frontend (React)
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 5 páginas principais</li>
                <li>• Componentes reutilizáveis</li>
                <li>• Tema Forge Dark</li>
                <li>• Animações fluidas</li>
                <li>• Responsivo</li>
              </ul>
            </Card>

            <Card className="p-6 bg-s1 border-s3">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-brasa" />
                Backend (tRPC)
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 11 procedures tRPC</li>
                <li>• Type-safe end-to-end</li>
                <li>• Validação com Zod</li>
                <li>• Autenticação OAuth</li>
                <li>• Integração Google Sheets</li>
              </ul>
            </Card>

            <Card className="p-6 bg-s1 border-s3">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-brasa" />
                Database (MySQL)
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 7 tabelas normalizadas</li>
                <li>• Índices otimizados</li>
                <li>• Migrações automáticas</li>
                <li>• Relacionamentos</li>
                <li>• Auditoria</li>
              </ul>
            </Card>
          </div>

          <Card className="p-8 bg-s1 border-s3">
            <h3 className="font-semibold mb-6 text-lg">Fluxo de Dados</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-brasa/20 flex items-center justify-center font-semibold">1</div>
                <div>
                  <p className="font-semibold">Usuário interage com UI (React)</p>
                  <p className="text-sm text-muted-foreground">Clica em botões, preenche formulários</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-brasa/20 flex items-center justify-center font-semibold">2</div>
                <div>
                  <p className="font-semibold">Chamada tRPC para Backend</p>
                  <p className="text-sm text-muted-foreground">Type-safe, com validação Zod</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-brasa/20 flex items-center justify-center font-semibold">3</div>
                <div>
                  <p className="font-semibold">Procedure tRPC executa lógica</p>
                  <p className="text-sm text-muted-foreground">Validação, autenticação, processamento</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-brasa/20 flex items-center justify-center font-semibold">4</div>
                <div>
                  <p className="font-semibold">Query/Mutation no Banco de Dados</p>
                  <p className="text-sm text-muted-foreground">Drizzle ORM com tipos TypeScript</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-brasa/20 flex items-center justify-center font-semibold">5</div>
                <div>
                  <p className="font-semibold">Resposta retorna ao Frontend</p>
                  <p className="text-sm text-muted-foreground">Atualiza UI, mostra feedback ao usuário</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-brasa/20 flex items-center justify-center font-semibold">6</div>
                <div>
                  <p className="font-semibold">Sincronização com Google Sheets (opcional)</p>
                  <p className="text-sm text-muted-foreground">Exporta dados para análise externa</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Testing Section */}
      <section className="bg-s1 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold font-barlow-condensed mb-12">
            Testes e Qualidade
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-s0 border-s3">
              <h3 className="font-semibold mb-4">Cobertura de Testes</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Procedures ForgeDB</span>
                    <span className="text-sm font-semibold text-green-500">12/12</span>
                  </div>
                  <div className="w-full bg-s3 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Testes de Pedidos</span>
                    <span className="text-sm font-semibold text-green-500">7/7</span>
                  </div>
                  <div className="w-full bg-s3 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Google Sheets Sync</span>
                    <span className="text-sm font-semibold text-green-500">8/8</span>
                  </div>
                  <div className="w-full bg-s3 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Integração</span>
                    <span className="text-sm font-semibold text-green-500">11/11</span>
                  </div>
                  <div className="w-full bg-s3 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Auth Logout</span>
                    <span className="text-sm font-semibold text-green-500">1/1</span>
                  </div>
                  <div className="w-full bg-s3 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-s0 border-s3">
              <h3 className="font-semibold mb-4">Métricas de Qualidade</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Testes Passando</span>
                  <Badge className="bg-green-500 text-white">39/39 ✓</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">TypeScript Errors</span>
                  <Badge className="bg-green-500 text-white">0</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Build Errors</span>
                  <Badge className="bg-green-500 text-white">0</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">LSP Issues</span>
                  <Badge className="bg-green-500 text-white">0</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Dependências</span>
                  <Badge variant="outline">OK</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold font-barlow-condensed mb-12">
            Como Começar
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-6 text-lg">Desenvolvimento Local</h3>
              <Card className="p-6 bg-s1 border-s3 font-mono text-sm space-y-4">
                <div>
                  <p className="text-muted-foreground mb-2"># Clonar repositório</p>
                  <p className="bg-s0 p-3 rounded border border-s3">
                    git clone &lt;seu-repositorio&gt;
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2"># Instalar dependências</p>
                  <p className="bg-s0 p-3 rounded border border-s3">
                    pnpm install
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2"># Iniciar servidor</p>
                  <p className="bg-s0 p-3 rounded border border-s3">
                    pnpm dev
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2"># Executar testes</p>
                  <p className="bg-s0 p-3 rounded border border-s3">
                    pnpm test
                  </p>
                </div>
              </Card>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Deploy em Produção</h3>
              <Card className="p-6 bg-s1 border-s3 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brasa/20 flex items-center justify-center font-semibold text-sm">1</div>
                  <div>
                    <p className="font-semibold">Configurar variáveis</p>
                    <p className="text-sm text-muted-foreground">DATABASE_URL, OAuth, Google Sheets</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brasa/20 flex items-center justify-center font-semibold text-sm">2</div>
                  <div>
                    <p className="font-semibold">Executar testes</p>
                    <p className="text-sm text-muted-foreground">Validar que tudo está funcionando</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brasa/20 flex items-center justify-center font-semibold text-sm">3</div>
                  <div>
                    <p className="font-semibold">Criar checkpoint</p>
                    <p className="text-sm text-muted-foreground">Salvar versão no Management UI</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brasa/20 flex items-center justify-center font-semibold text-sm">4</div>
                  <div>
                    <p className="font-semibold">Publicar</p>
                    <p className="text-sm text-muted-foreground">Clique em "Publish" no painel</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section className="bg-s1 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold font-barlow-condensed mb-12">
            Documentação
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-s0 border-s3 hover:border-brasa transition-colors cursor-pointer">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-brasa/20 flex items-center justify-center">
                  <Download className="w-6 h-6 text-brasa" />
                </div>
                <div>
                  <h3 className="font-semibold">README.md</h3>
                  <p className="text-sm text-muted-foreground">Visão geral do projeto</p>
                </div>
              </div>
              <p className="text-sm mb-4">
                Informações gerais, features, stack tecnológico e instruções de instalação rápida.
              </p>
              <Button variant="outline" className="w-full gap-2" size="sm">
                <ExternalLink className="w-4 h-4" />
                Ler
              </Button>
            </Card>

            <Card className="p-6 bg-s0 border-s3 hover:border-brasa transition-colors cursor-pointer">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-brasa/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-brasa" />
                </div>
                <div>
                  <h3 className="font-semibold">GUIA_USO.md</h3>
                  <p className="text-sm text-muted-foreground">Manual completo do usuário</p>
                </div>
              </div>
              <p className="text-sm mb-4">
                Guia passo a passo com screenshots, dicas, atalhos de teclado e FAQ.
              </p>
              <Button variant="outline" className="w-full gap-2" size="sm">
                <ExternalLink className="w-4 h-4" />
                Ler
              </Button>
            </Card>

            <Card className="p-6 bg-s0 border-s3 hover:border-brasa transition-colors cursor-pointer">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-brasa/20 flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-brasa" />
                </div>
                <div>
                  <h3 className="font-semibold">DEPLOYMENT.md</h3>
                  <p className="text-sm text-muted-foreground">Deploy em produção</p>
                </div>
              </div>
              <p className="text-sm mb-4">
                Instruções detalhadas para deploy, configuração de secrets e troubleshooting.
              </p>
              <Button variant="outline" className="w-full gap-2" size="sm">
                <ExternalLink className="w-4 h-4" />
                Ler
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="bg-s0 border-t border-s3 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">
            Desenvolvido com ❤️ usando Forge Dark Theme
          </p>
          <p className="text-sm text-muted-foreground">
            © 2026 Forge ERP Delivery — Versão 1.0.0 — Pronto para Produção
          </p>
        </div>
      </section>
    </div>
  );
}
