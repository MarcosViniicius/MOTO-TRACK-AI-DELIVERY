import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer, Download, FileText } from "lucide-react";

interface Delivery {
  id: number;
  customerName: string;
  address: string;
  phone?: string;
  value: number;
  paymentMethod: string;
  assignedTo?: string;
  assignedToName?: string;
  priority: string;
  estimatedTime: string;
  observations?: string;
  status: string;
  createdAt?: string;
}

interface POSPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliveries: Delivery[];
  establishmentName: string;
  userType: "vendedor" | "entregador";
  userName: string;
}

export const POSPrintModal: React.FC<POSPrintModalProps> = ({
  isOpen,
  onClose,
  deliveries,
  establishmentName,
  userType,
  userName,
}) => {
  const [paperSize, setPaperSize] = React.useState<"80mm" | "50mm">("80mm");
  const [filterStatus, setFilterStatus] = React.useState<string>("todas");

  const filteredDeliveries = deliveries.filter(
    (delivery) => filterStatus === "todas" || delivery.status === filterStatus
  );

  const generatePOSContent = () => {
    const width = paperSize === "80mm" ? 48 : 32;
    const separator = "=".repeat(width);
    const date = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    let content = `
${separator}
${establishmentName
  .toUpperCase()
  .padStart((width + establishmentName.length) / 2)}
CONTROLE DE ENTREGAS
${separator}
Data/Hora: ${date}
${userType === "vendedor" ? "Vendedor" : "Entregador"}: ${userName}
${separator}

`;

    if (filteredDeliveries.length === 0) {
      content += "Nenhuma entrega encontrada.\n";
    } else {
      filteredDeliveries.forEach((delivery, index) => {
        const statusText = {
          pendente: "PENDENTE",
          em_andamento: "EM ROTA",
          entregue: "ENTREGUE",
          cancelada: "CANCELADA",
        }[delivery.status];

        content += `${index + 1}. ${delivery.customerName || "Cliente"}
Endereco: ${delivery.address}
${
  delivery.phone ? `Telefone: ${delivery.phone}\n` : ""
}Valor: R$ ${delivery.value.toFixed(2)}
Pagamento: ${delivery.paymentMethod}
Status: ${statusText}
${
  delivery.assignedToName ? `Entregador: ${delivery.assignedToName}\n` : ""
}Tempo Est.: ${delivery.estimatedTime}
${delivery.observations ? `Obs: ${delivery.observations}\n` : ""}${"-".repeat(
          width
        )}
`;
      });
    }

    content += `
${separator}
Total de entregas: ${filteredDeliveries.length}
Pendentes: ${filteredDeliveries.filter((d) => d.status === "pendente").length}
Em rota: ${filteredDeliveries.filter((d) => d.status === "em_andamento").length}
Entregues: ${filteredDeliveries.filter((d) => d.status === "entregue").length}
Canceladas: ${filteredDeliveries.filter((d) => d.status === "cancelada").length}
${separator}
MotoTrack AI - Sistema de Entregas
${separator}
`;

    return content;
  };

  const handlePrint = () => {
    const content = generatePOSContent();
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Controle de Entregas - ${establishmentName}</title>
            <style>
              body {
                font-family: 'Courier New', monospace;
                font-size: ${paperSize === "80mm" ? "12px" : "10px"};
                line-height: 1.2;
                margin: 0;
                padding: 10px;
                white-space: pre-wrap;
                background: white;
              }
              @media print {
                body {
                  margin: 0;
                  padding: 5px;
                }
                @page {
                  size: ${paperSize === "80mm" ? "80mm" : "50mm"} auto;
                  margin: 0;
                }
              }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    const content = generatePOSContent();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `controle-entregas-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Impressão POS - Controle de Entregas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configurações */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tamanho do Papel
              </label>
              <Select
                value={paperSize}
                onValueChange={(value: "80mm" | "50mm") => setPaperSize(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="80mm">80mm (Padrão)</SelectItem>
                  <SelectItem value="50mm">50mm (Compacto)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Filtrar por Status
              </label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as entregas</SelectItem>
                  <SelectItem value="pendente">Apenas pendentes</SelectItem>
                  <SelectItem value="em_andamento">Apenas em rota</SelectItem>
                  <SelectItem value="entregue">Apenas entregues</SelectItem>
                  <SelectItem value="cancelada">Apenas canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Preview da Impressão
            </h3>
            <div
              className="bg-white p-3 rounded border text-xs font-mono leading-tight max-h-96 overflow-y-auto"
              style={{ fontSize: paperSize === "80mm" ? "10px" : "8px" }}
            >
              <pre className="whitespace-pre-wrap">{generatePOSContent()}</pre>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              Total de entregas a serem impressas:{" "}
              <strong>{filteredDeliveries.length}</strong>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handlePrint}
              className="flex-1 order-1 sm:order-1"
              disabled={filteredDeliveries.length === 0}
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1 order-2 sm:order-2"
              disabled={filteredDeliveries.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar TXT
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 order-3 sm:order-3"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
