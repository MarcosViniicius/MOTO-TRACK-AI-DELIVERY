import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/useToast";

interface DeliveryData {
  customerName: string;
  address: string;
  phone?: string;
  value: number;
  paymentMethod: string;
  assignedTo?: string;
  priority: string;
  estimatedTime: string;
  observations?: string;
}

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

interface Deliverer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  vehicle: string;
  plate?: string;
  zone: string;
  status: string;
  establishmentId?: string;
}

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (delivery: DeliveryData) => void;
  deliverers: Deliverer[];
  delivery?: Delivery | null; // Adicionar prop para edição
}

export const DeliveryModal = ({
  isOpen,
  onClose,
  onSave,
  deliverers,
  delivery, // Nova prop
}: DeliveryModalProps) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    customerName: "",
    address: "",
    phone: "",
    value: "",
    paymentMethod: "",
    assignedTo: "",
    priority: "normal",
    estimatedTime: "",
    observations: "",
  });

  // Efeito para preencher o formulário quando editando
  useEffect(() => {
    if (delivery) {
      setFormData({
        customerName: delivery.customerName || "",
        address: delivery.address || "",
        phone: delivery.phone || "",
        value: delivery.value.toString(),
        paymentMethod: delivery.paymentMethod || "",
        assignedTo: delivery.assignedTo || "",
        priority: delivery.priority || "normal",
        estimatedTime: delivery.estimatedTime || "",
        observations: delivery.observations || "",
      });
    } else {
      // Reset para novo
      setFormData({
        customerName: "",
        address: "",
        phone: "",
        value: "",
        paymentMethod: "",
        assignedTo: "",
        priority: "normal",
        estimatedTime: "",
        observations: "",
      });
    }
  }, [delivery, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações melhoradas
    if (!formData.address.trim()) {
      addToast({
        type: "error",
        title: "Erro de validação",
        message: "O endereço é obrigatório",
      });
      return;
    }

    if (!formData.value || parseFloat(formData.value) <= 0) {
      addToast({
        type: "error",
        title: "Erro de validação",
        message: "O valor deve ser maior que zero",
      });
      return;
    }

    if (!formData.paymentMethod) {
      addToast({
        type: "error",
        title: "Erro de validação",
        message: "Selecione uma forma de pagamento",
      });
      return;
    }

    try {
      const deliveryData = {
        customerName:
          formData.customerName.trim() || "Cliente não identificado",
        address: formData.address.trim(),
        phone: formData.phone.trim() || undefined,
        value: parseFloat(formData.value),
        paymentMethod: formData.paymentMethod,
        assignedTo:
          formData.assignedTo === "none"
            ? undefined
            : formData.assignedTo || undefined,
        priority: formData.priority,
        estimatedTime: formData.estimatedTime.trim() || "30-45 min",
        observations: formData.observations.trim() || undefined,
      };

      onSave(deliveryData);

      addToast({
        type: "success",
        title: delivery ? "Entrega atualizada" : "Entrega criada",
        message: delivery
          ? "As alterações foram salvas com sucesso"
          : "Nova entrega foi adicionada com sucesso",
      });

      // Reset form apenas se não estiver editando
      if (!delivery) {
        setFormData({
          customerName: "",
          address: "",
          phone: "",
          value: "",
          paymentMethod: "",
          assignedTo: "",
          priority: "normal",
          estimatedTime: "",
          observations: "",
        });
      }
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao salvar",
        message: "Ocorreu um erro ao salvar a entrega. Tente novamente.",
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const availableDeliverers =
    deliverers?.filter((d) => d.status === "disponivel") || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {delivery ? "Editar Entrega" : "Nova Entrega"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Informações do Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Informações do Cliente
            </h3>

            <div>
              <Label htmlFor="customerName" className="text-sm font-medium">
                Nome do Cliente
              </Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
                placeholder="Ex: João Silva (opcional)"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium">
                Endereço <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Ex: Rua das Flores, 123 - Centro"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                Telefone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Ex: (11) 99999-1234"
                className="mt-1"
              />
            </div>
          </div>

          {/* Informações da Entrega */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Detalhes da Entrega
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="value" className="text-sm font-medium">
                  Valor <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.value}
                  onChange={(e) => handleChange("value", e.target.value)}
                  placeholder="Ex: 45.90"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="estimatedTime" className="text-sm font-medium">
                  Tempo Estimado
                </Label>
                <Input
                  id="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={(e) =>
                    handleChange("estimatedTime", e.target.value)
                  }
                  placeholder="Ex: 30-45 min"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentMethod" className="text-sm font-medium">
                  Forma de Pagamento <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    handleChange("paymentMethod", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                    <SelectItem value="loja">Pago na Loja</SelectItem>
                    <SelectItem value="sem_pagamento">Sem Pagamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority" className="text-sm font-medium">
                  Prioridade
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleChange("priority", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Baixa
                      </div>
                    </SelectItem>
                    <SelectItem value="normal">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        Normal
                      </div>
                    </SelectItem>
                    <SelectItem value="alta">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        Alta
                      </div>
                    </SelectItem>
                    <SelectItem value="urgente">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Urgente
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="assignedTo" className="text-sm font-medium">
                Atribuir Entregador
              </Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) => handleChange("assignedTo", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione um entregador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Atribuir depois</SelectItem>
                  {availableDeliverers.map((deliverer) => (
                    <SelectItem key={deliverer.id} value={deliverer.id}>
                      <div className="flex items-center gap-2">
                        <span>{deliverer.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {deliverer.vehicle}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableDeliverers.length === 0 && (
                <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  Nenhum entregador disponível no momento
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="observations" className="text-sm font-medium">
                Observações
              </Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleChange("observations", e.target.value)}
                placeholder="Ex: Casa amarela, portão azul, deixar com porteiro"
                rows={3}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 order-1 sm:order-2"
              disabled={
                !formData.address || !formData.value || !formData.paymentMethod
              }
            >
              {delivery ? "Salvar Alterações" : "Criar Entrega"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
