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

    if (!formData.name || !formData.vehicle || !formData.zone) {
      // Em vez de alert, poderíamos usar um estado para mostrar erros visuais
      return;
    }

    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto custom-scrollbar mx-4">
        <DialogHeader>
          <DialogTitle>
            {deliverer ? "Editar Entregador" : "Novo Entregador"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nome completo"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="(11) 99999-9999"
            />
            <span className="text-xs text-gray-500">Opcional</span>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="entregador@email.com"
            />
            <span className="text-xs text-gray-500">Opcional</span>
          </div>
          <div>
            <Label htmlFor="vehicle">Veículo *</Label>
            <Select
              value={formData.vehicle}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, vehicle: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o veículo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="moto">Moto</SelectItem>
                <SelectItem value="bicicleta">Bicicleta</SelectItem>
                <SelectItem value="carro">Carro</SelectItem>
                <SelectItem value="a_pe">A pé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.vehicle === "moto" || formData.vehicle === "carro" ? (
            <div>
              <Label htmlFor="plate">Placa</Label>
              <Input
                id="plate"
                value={formData.plate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, plate: e.target.value }))
                }
                placeholder="ABC-1234"
              />
              <span className="text-xs text-gray-500">Opcional</span>
            </div>
          ) : null}
          <div>
            <Label htmlFor="zone">Zona de Entrega *</Label>
            <Input
              id="zone"
              value={formData.zone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, zone: e.target.value }))
              }
              placeholder="Ex: Centro, Bairro Todo, Ruas A e B, etc..."
              required
            />
            <span className="text-xs text-gray-500">
              Descreva a área de atuação (bairros, ruas específicas, região,
              etc.)
            </span>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="ocupado">Ocupado</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>{" "}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 order-1 sm:order-2">
              {deliverer ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
