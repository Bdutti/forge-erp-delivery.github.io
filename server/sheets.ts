// @ts-nocheck
import { google } from "googleapis";
import { ENV } from "./_core/env";

/**
 * Inicializa cliente Google Sheets com credenciais de Service Account
 */
export function initSheetsClient() {
  if (!ENV.googleCredentialsB64) {
    console.warn("[Sheets] GOOGLE_CREDENTIALS_B64 não configurado");
    return null;
  }

  try {
    const credentialsJson = Buffer.from(ENV.googleCredentialsB64, "base64").toString("utf-8");
    const credentials = JSON.parse(credentialsJson);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    return google.sheets({ version: "v4", auth });
  } catch (error) {
    console.error("[Sheets] Erro ao inicializar cliente:", error);
    return null;
  }
}

/**
 * Exporta pedidos para Google Sheets
 */
export async function exportarPedidosParaSheets(pedidos: any[]) {
  const sheets = initSheetsClient();
  if (!sheets || !ENV.sheetsId) {
    console.warn("[Sheets] Sheets não configurado ou sheetsId ausente");
    return false;
  }

  try {
    const values = [
      ["ID", "Número", "Cliente", "Canal", "Status", "Total", "Desconto", "Data", "Itens"],
      ...pedidos.map((p) => [
        p.id,
        p.numero,
        p.cliente?.nome || "N/A",
        p.canal,
        p.status,
        p.total,
        p.desconto || 0,
        new Date(p.createdAt).toLocaleString("pt-BR"),
        p.itens?.length || 0,
      ]),
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: ENV.sheetsId,
      range: "Pedidos!A1",
      valueInputOption: "RAW",
      requestBody: { values },
    });

    console.log(`[Sheets] ${pedidos.length} pedidos exportados com sucesso`);
    return true;
  } catch (error) {
    console.error("[Sheets] Erro ao exportar pedidos:", error);
    return false;
  }
}

/**
 * Exporta produtos para Google Sheets
 */
export async function exportarProdutosParaSheets(produtos: any[]) {
  const sheets = initSheetsClient();
  if (!sheets || !ENV.sheetsId) {
    console.warn("[Sheets] Sheets não configurado ou sheetsId ausente");
    return false;
  }

  try {
    const values = [
      ["ID", "Nome", "Categoria", "SKU", "Preço", "Custo", "Margem %", "Estoque", "Ativo"],
      ...produtos.map((p) => {
        const margem = p.preco > 0 ? ((p.preco - p.custo) / p.preco) * 100 : 0;
        return [
          p.id,
          p.nome,
          p.categoria,
          p.sku || "N/A",
          parseFloat(p.preco).toFixed(2),
          parseFloat(p.custo).toFixed(2),
          margem.toFixed(1),
          parseFloat(p.estoque).toFixed(0),
          p.ativo ? "Sim" : "Não",
        ];
      }),
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: ENV.sheetsId,
      range: "Produtos!A1",
      valueInputOption: "RAW",
      requestBody: { values },
    });

    console.log(`[Sheets] ${produtos.length} produtos exportados com sucesso`);
    return true;
  } catch (error) {
    console.error("[Sheets] Erro ao exportar produtos:", error);
    return false;
  }
}

/**
 * Exporta KPIs para Google Sheets
 */
export async function exportarKPIsParaSheets(kpis: any) {
  const sheets = initSheetsClient();
  if (!sheets || !ENV.sheetsId) {
    console.warn("[Sheets] Sheets não configurado ou sheetsId ausente");
    return false;
  }

  try {
    const values = [
      ["Métrica", "Valor"],
      ["Faturamento", kpis.faturamento.toFixed(2)],
      ["Ticket Médio", kpis.ticketMedio.toFixed(2)],
      ["Pedidos Ativos", kpis.pedidosAtivos],
      ["Alertas Estoque", kpis.alertasEstoque],
      ["Receita", kpis.lucro.receita.toFixed(2)],
      ["Custo", kpis.lucro.custo.toFixed(2)],
      ["Lucro Líquido", kpis.lucro.lucroLiquido.toFixed(2)],
      ["Data Atualização", new Date().toLocaleString("pt-BR")],
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: ENV.sheetsId,
      range: "KPIs!A1",
      valueInputOption: "RAW",
      requestBody: { values },
    });

    console.log("[Sheets] KPIs exportados com sucesso");
    return true;
  } catch (error) {
    console.error("[Sheets] Erro ao exportar KPIs:", error);
    return false;
  }
}

/**
 * Cria abas na planilha se não existirem
 */
export async function criarAbasSheets() {
  const sheets = initSheetsClient();
  if (!sheets || !ENV.sheetsId) {
    console.warn("[Sheets] Sheets não configurado ou sheetsId ausente");
    return false;
  }

  try {
    const abas = ["Pedidos", "Produtos", "KPIs"];
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: ENV.sheetsId,
    });

    const abasExistentes = spreadsheet.data.sheets?.map((s: any) => s.properties?.title) || [];

    for (const aba of abas) {
      if (!abasExistentes.includes(aba)) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: ENV.sheetsId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: aba,
                  },
                },
              },
            ],
          },
        });
        console.log(`[Sheets] Aba "${aba}" criada com sucesso`);
      }
    }

    return true;
  } catch (error) {
    console.error("[Sheets] Erro ao criar abas:", error);
    return false;
  }
}

/**
 * Sincroniza todos os dados para Google Sheets
 */
export async function sincronizarTodosOsDados(pedidos: any[], produtos: any[], kpis: any) {
  try {
    // Criar abas se não existirem
    await criarAbasSheets();

    // Exportar dados
    const resultadoPedidos = await exportarPedidosParaSheets(pedidos);
    const resultadoProdutos = await exportarProdutosParaSheets(produtos);
    const resultadoKPIs = await exportarKPIsParaSheets(kpis);

    return resultadoPedidos && resultadoProdutos && resultadoKPIs;
  } catch (error) {
    console.error("[Sheets] Erro ao sincronizar dados:", error);
    return false;
  }
}
