import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Edit3,
  Trash2,
} from "lucide-react";

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

interface DeliveryStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: Delivery | null;
  onUpdateStatus: (
    deliveryId: number | string,
    status: string,
    notes?: string
  ) => void;
  onEditDelivery: (delivery: Delivery) => void;
  onDeleteDelivery: (deliveryId: number | string) => void;
  userType: "vendedor" | "entregador";
}

export const DeliveryStatusModal: React.FC<DeliveryStatusModalProps> = ({
  isOpen,
  onClose,
  delivery,
  onUpdateStatus,
  onEditDelivery,
  onDeleteDelivery,
  userType,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>(
    delivery?.status || "pendente"
  );
  const [notes, setNotes] = useState("");

  React.useEffect(() => {
    if (delivery) {
      setSelectedStatus(delivery.status);
      setNotes("");
    }
  }, [delivery]);

  if (!delivery) return null;

  const statusOptions = [
    {
      value: "pendente" as const,
      label: "Pendente",
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      description: "Entrega aguardando processamento",
    },
    {
      value: "em_andamento" as const,
      label: "Em Rota",
      icon: Truck,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      description: "Entregador a caminho do destino",
    },
    {
      value: "entregue" as const,
      label: "Entregue",
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 border-green-200",
      description: "Entrega realizada com sucesso",
    },
    {
      value: "cancelada" as const,
      label: "Cancelada",
      icon: XCircle,
      color: "bg-red-100 text-red-800 border-red-200",
      description: "Entrega cancelada",
    },
  ];

  const currentStatusOption = statusOptions.find(
    (opt) => opt.value === delivery.status
  );
  const selectedStatusOption = statusOptions.find(
    (opt) => opt.value === selectedStatus
  );

  const handleUpdateStatus = () => {
    onUpdateStatus(delivery.id, selectedStatus, notes || undefined);
    onClose();
  };

  const handleEdit = () => {
    onEditDelivery(delivery);
    onClose();
  };

  const handleDelete = () => {
    onDeleteDelivery(delivery.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Gerenciar Entrega
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Entrega */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">
              {delivery.customerName || "Cliente não identificado"}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-gray-500 min-w-[80px]">Endereço:</span>
                <span className="text-gray-900">{delivery.address}</span>
              </div>
              {delivery.phone && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 min-w-[80px]">Telefone:</span>
                  <span className="text-gray-900">{delivery.phone}</span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <span className="text-gray-500 min-w-[80px]">Valor:</span>
                <span className="text-gray-900 font-medium">
                  R$ {delivery.value.toFixed(2)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-500 min-w-[80px]">Pagamento:</span>
                <span className="text-gray-900">{delivery.paymentMethod}</span>
              </div>
              {delivery.assignedToName && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 min-w-[80px]">
                    Entregador:
                  </span>
                  <span className="text-gray-900">
                    {delivery.assignedToName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status Atual */}
          <div>
            <Label className="text-base font-medium">Status Atual</Label>
            <div className="mt-2 flex items-center gap-3">
              {currentStatusOption && (
                <>
                  <currentStatusOption.icon className="h-5 w-5 text-gray-600" />
                  <Badge className={currentStatusOption.color}>
                    {currentStatusOption.label}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {currentStatusOption.description}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Alterar Status */}
          <div>
            <Label htmlFor="status" className="text-base font-medium">
              Alterar Status
            </Label>
            <div className="mt-2 space-y-3">
              <Select
                value={selectedStatus}
                onValueChange={(value) =>
                  setSelectedStatus(value as Delivery["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedStatusOption && selectedStatus !== delivery.status && (
                <div className="p-3 rounded-lg border border-blue-200 bg-blue-50">
                  <div className="flex items-center gap-2 mb-1">
                    <selectedStatusOption.icon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {selectedStatusOption.label}
                    </span>
                  </div>
                  <p className="text-xs text-blue-700">
                    {selectedStatusOption.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Observações */}
          {selectedStatus !== delivery.status && (
            <div>
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione observações sobre a mudança de status..."
                rows={3}
                className="mt-1"
              />
            </div>
          )}

          {/* Ações */}
          <div className="flex flex-col gap-3">
            {/* Atualizar Status */}
            {selectedStatus !== delivery.status && (
              <Button onClick={handleUpdateStatus} className="w-full">
                <Package className="h-4 w-4 mr-2" />
                Atualizar Status para {selectedStatusOption?.label}
              </Button>
            )}

            {/* Outras Ações (apenas para vendedor) */}
            {userType === "vendedor" && (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="flex-1"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Entrega</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir esta entrega? Esta ação
                        não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            <Button onClick={onClose} variant="outline" className="w-full">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
