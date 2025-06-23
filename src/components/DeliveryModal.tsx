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
    if (!formData.address || !formData.value) return;

    onSave({
      customerName: formData.customerName || "Cliente não identificado",
      address: formData.address,
      phone: formData.phone,
      value: parseFloat(formData.value),
      paymentMethod: formData.paymentMethod,
      assignedTo: formData.assignedTo,
      priority: formData.priority,
      estimatedTime: formData.estimatedTime || "30-45 min",
      observations: formData.observations,
    });

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
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const availableDeliverers =
    deliverers?.filter((d) => d.status === "disponivel") || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto custom-scrollbar mx-4">
        {" "}
        <DialogHeader>
          <DialogTitle>
            {delivery ? "Editar Entrega" : "Nova Entrega"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName">Nome do Cliente (opcional)</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
              placeholder="Ex: João Silva"
            />
          </div>
          <div>
            <Label htmlFor="address">Endereço *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Ex: Rua das Flores, 123 - Centro"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefone (opcional)</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Ex: (11) 99999-1234"
            />
          </div>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="value">Valor *</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => handleChange("value", e.target.value)}
                placeholder="Ex: 45.90"
                required
              />
            </div>
            <div>
              <Label htmlFor="estimatedTime">Tempo Estimado</Label>
              <Input
                id="estimatedTime"
                value={formData.estimatedTime}
                onChange={(e) => handleChange("estimatedTime", e.target.value)}
                placeholder="Ex: 30-45 min"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentMethod">Forma de Pagamento *</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, paymentMethod: value }))
                }
              >
                <SelectTrigger>
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
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="assignedTo">Atribuir Entregador</Label>
            <Select
              value={formData.assignedTo}
              onValueChange={(value) => handleChange("assignedTo", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um entregador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Atribuir depois</SelectItem>
                {availableDeliverers.map((deliverer) => (
                  <SelectItem key={deliverer.id} value={deliverer.id}>
                    {deliverer.name} - {deliverer.vehicle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableDeliverers.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">
                Nenhum entregador disponível no momento
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleChange("observations", e.target.value)}
              placeholder="Ex: Casa amarela, portão azul, deixar com porteiro"
              rows={3}
            />
          </div>{" "}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 order-2 sm:order-1"
            >
              Cancelar
            </Button>{" "}
            <Button type="submit" className="flex-1 order-1 sm:order-2">
              {delivery ? "Salvar Alterações" : "Criar Entrega"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
