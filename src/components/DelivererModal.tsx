import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";

interface DelivererFormData {
  name: string;
  phone?: string;
  email?: string;
  vehicle: string;
  plate?: string;
  zone: string;
  status: string;
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

interface DelivererModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (delivererData: DelivererFormData) => void;
  deliverer?: Deliverer | null;
}

export const DelivererModal = ({
  isOpen,
  onClose,
  onSave,
  deliverer,
}: DelivererModalProps) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<DelivererFormData>({
    name: "",
    phone: "",
    email: "",
    vehicle: "",
    plate: "",
    zone: "",
    status: "disponivel",
  });

  useEffect(() => {
    if (deliverer) {
      setFormData({
        name: deliverer.name || "",
        phone: deliverer.phone || "",
        email: deliverer.email || "",
        vehicle: deliverer.vehicle || "",
        plate: deliverer.plate || "",
        zone: deliverer.zone || "",
        status: deliverer.status || "disponivel",
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        vehicle: "",
        plate: "",
        zone: "",
        status: "disponivel",
      });
    }
  }, [deliverer, isOpen]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações melhoradas
    if (!formData.name.trim()) {
      addToast({
        type: "error",
        title: "Erro de validação",
        message: "O nome do entregador é obrigatório",
      });
      return;
    }

    if (!formData.vehicle) {
      addToast({
        type: "error",
        title: "Erro de validação",
        message: "Selecione o tipo de veículo",
      });
      return;
    }

    if (!formData.zone.trim()) {
      addToast({
        type: "error",
        title: "Erro de validação",
        message: "A zona de entrega é obrigatória",
      });
      return;
    }

    // Validação de email se fornecido
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      addToast({
        type: "error",
        title: "Erro de validação",
        message: "Email inválido",
      });
      return;
    }

    // Validação de telefone se fornecido
    if (formData.phone && formData.phone.replace(/\D/g, "").length < 10) {
      addToast({
        type: "error",
        title: "Erro de validação",
        message: "Telefone deve ter pelo menos 10 dígitos",
      });
      return;
    }

    try {
      const delivererData = {
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        vehicle: formData.vehicle,
        plate: formData.plate.trim() || undefined,
        zone: formData.zone.trim(),
        status: formData.status,
      };

      onSave(delivererData);

      addToast({
        type: "success",
        title: deliverer ? "Entregador atualizado" : "Entregador criado",
        message: deliverer
          ? "As alterações foram salvas com sucesso"
          : "Novo entregador foi adicionado com sucesso",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao salvar",
        message: "Ocorreu um erro ao salvar o entregador. Tente novamente.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {deliverer ? "Editar Entregador" : "Novo Entregador"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Informações Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Informações Pessoais
            </h3>

            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Nome Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nome completo do entregador"
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="(11) 99999-9999"
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">Opcional</span>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="entregador@email.com"
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">Opcional</span>
              </div>
            </div>
          </div>

          {/* Informações do Veículo */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Veículo e Trabalho
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicle" className="text-sm font-medium">
                  Tipo de Veículo <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.vehicle}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, vehicle: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="moto">
                      <div className="flex items-center gap-2">🏍️ Moto</div>
                    </SelectItem>
                    <SelectItem value="bicicleta">
                      <div className="flex items-center gap-2">
                        🚲 Bicicleta
                      </div>
                    </SelectItem>
                    <SelectItem value="carro">
                      <div className="flex items-center gap-2">🚗 Carro</div>
                    </SelectItem>
                    <SelectItem value="a_pe">
                      <div className="flex items-center gap-2">🚶 A pé</div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponivel">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Disponível
                      </div>
                    </SelectItem>
                    <SelectItem value="ocupado">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        Ocupado
                      </div>
                    </SelectItem>
                    <SelectItem value="inativo">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        Inativo
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(formData.vehicle === "moto" || formData.vehicle === "carro") && (
              <div>
                <Label htmlFor="plate" className="text-sm font-medium">
                  Placa do Veículo
                </Label>
                <Input
                  id="plate"
                  value={formData.plate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, plate: e.target.value }))
                  }
                  placeholder="ABC-1234"
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">Opcional</span>
              </div>
            )}

            <div>
              <Label htmlFor="zone" className="text-sm font-medium">
                Zona de Entrega <span className="text-red-500">*</span>
              </Label>
              <Input
                id="zone"
                value={formData.zone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, zone: e.target.value }))
                }
                placeholder="Ex: Centro, Bairro Todo, Ruas A e B, etc..."
                required
                className="mt-1"
              />
              <span className="text-xs text-gray-500">
                Descreva a área de atuação (bairros, ruas específicas, região,
                etc.)
              </span>
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
              disabled={!formData.name || !formData.vehicle || !formData.zone}
            >
              {deliverer ? "Salvar Alterações" : "Criar Entregador"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
