import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, FileText } from "lucide-react";

interface Delivery {
  id: number;
  customerName: string;
  address: string;
  paymentMethod: string;
  value: number;
  status: string;
  assignedTo?: string;
  assignedToName?: string;
  observations?: string;
  phone?: string;
}

interface POSExportProps {
  deliveries: Delivery[];
  delivererName: string;
  paperWidth?: number; // 58 ou 80mm
}

export const POSExport: React.FC<POSExportProps> = ({
  deliveries,
  delivererName,
  paperWidth = 80,
}) => {
  const maxChars = paperWidth === 58 ? 32 : 48;

  const paymentMapping = {
    pix: "PIX",
    dinheiro: "Dinheiro",
    cartao: "Cartao",
    loja: "Pago Loja",
    sem_pagamento: "Sem Pagto",
  };

  const formatLine = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength - 3) + "..."
      : text;
  };

  const generatePOSContent = () => {
    const separator = "-".repeat(maxChars);
    let content = "";

    // Cabeçalho
    content += `CONTROLE DE ENTREGAS\n`;
    content += `${separator}\n`;
    content += `Entregador: ${delivererName}\n`;
    content += `Data: ${new Date().toLocaleDateString("pt-BR")}\n`;
    content += `Hora: ${new Date().toLocaleTimeString("pt-BR")}\n`;
    content += `${separator}\n`;

    // Lista de entregas (em_rota = para entregar)
    const deliveriesToPrint = deliveries.filter((d) => d.status === "em_rota");

    if (deliveriesToPrint.length === 0) {
      content += `Nenhuma entrega atribuida\n`;
    } else {
      content += `ENTREGAS PARA REALIZAR:\n\n`;

      deliveriesToPrint.forEach((delivery, index) => {
        const payment =
          paymentMapping[
            delivery.paymentMethod as keyof typeof paymentMapping
          ] || delivery.paymentMethod;
        const value = `R$ ${delivery.value.toFixed(2)}`;

        content += `${index + 1}. ${delivery.customerName}\n`;
        content += `${formatLine(delivery.address, maxChars)}\n`;
        content += `Tel: ${delivery.phone || "N/A"}\n`;
        content += `${payment} - ${value}\n`;

        if (delivery.observations) {
          content += `OBS: ${formatLine(
            delivery.observations,
            maxChars - 5
          )}\n`;
        }

        content += `[ ] ENTREGUE\n`; // Checkbox para marcar
        content += `\n`;
      });
    }

    // Rodapé
    content += `${separator}\n`;
    content += `Total de entregas: ${deliveriesToPrint.length}\n`;
    content += `Valor total: R$ ${deliveriesToPrint
      .reduce((sum, d) => sum + d.value, 0)
      .toFixed(2)}\n`;
    content += `${separator}\n`;
    content += `Assinatura: _______________\n`;

    return content;
  };

  const handlePrint = (width: number) => {
    const content = generatePOSContent();

    // Criar uma nova janela para impressão
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert(
        "Erro ao abrir janela de impressão. Verifique o bloqueador de pop-ups."
      );
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Controle de Entregas - ${delivererName}</title>
          <style>
            @media print {
              body {
                font-family: 'Courier New', monospace;
                font-size: ${width === 58 ? "9px" : "11px"};
                line-height: 1.1;
                margin: 0;
                padding: 2mm;
                width: ${width}mm;
                white-space: pre-wrap;
              }
              @page {
                size: ${width}mm auto;
                margin: 0;
              }
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: ${width === 58 ? "10px" : "12px"};
              line-height: 1.2;
              margin: 0;
              padding: 10px;
              white-space: pre-wrap;
              background: white;
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Aguardar um pouco e imprimir
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleExportText = () => {
    const content = generatePOSContent();
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `controle_entregas_${delivererName}_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deliveriesToPrint = deliveries.filter((d) => d.status === "em_rota");

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">
          📋 Controle de Entregas
        </h3>
        <p className="text-sm text-blue-700">
          Imprima este controle antes de sair para as entregas. Use como base
          para conferir e marcar as entregas realizadas.
        </p>
      </div>

      {deliveriesToPrint.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <p>Nenhuma entrega atribuída para impressão</p>
          <p className="text-sm">
            Entregas aparecem aqui quando estão "Em Rota"
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => handlePrint(80)}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Imprimir 80mm
            </Button>
            <Button
              onClick={() => handlePrint(58)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Imprimir 58mm
            </Button>
            <Button
              onClick={handleExportText}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Exportar TXT
            </Button>
          </div>

          <div className="bg-gray-100 p-4 rounded border text-xs font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
            <strong>📄 Prévia da impressão:</strong>
            <br />
            {generatePOSContent()}
          </div>

          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>💡 Dica:</strong> Imprima este controle e leve junto nas
              entregas. Marque com um ✓ ou X conforme for entregando para ter
              controle físico.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
