import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, ArrowLeft } from "lucide-react";

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

interface EntregadorSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onSelectDeliverer: (delivererId: string) => void;
  deliverers: Deliverer[];
  establishmentId: string;
}

export const EntregadorSelectionModal = ({
  isOpen,
  onClose,
  onBack,
  onSelectDeliverer,
  deliverers,
  establishmentId,
}: EntregadorSelectionModalProps) => {
  const [selectedDeliverer, setSelectedDeliverer] = useState("");

  // Filtrar entregadores do estabelecimento logado
  const establishmentDeliverers = deliverers.filter(
    (d) => d.establishmentId === establishmentId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeliverer) {
      alert("Por favor, selecione seu nome");
      return;
    }
    onSelectDeliverer(selectedDeliverer);
  };

  const handleClose = () => {
    setSelectedDeliverer("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Selecionar Entregador
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="text-center mb-6">
          <User className="h-16 w-16 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold">Quem é você?</h3>
          <p className="text-sm text-gray-600">Selecione seu nome da lista</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="deliverer">Selecione seu nome</Label>
            <Select
              value={selectedDeliverer}
              onValueChange={setSelectedDeliverer}
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha seu nome da lista" />
              </SelectTrigger>
              <SelectContent>
                {establishmentDeliverers.map((deliverer) => (
                  <SelectItem key={deliverer.id} value={deliverer.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{deliverer.name}</span>
                      <span className="text-sm text-gray-500">
                        {deliverer.vehicle} - {deliverer.zone}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {establishmentDeliverers.length === 0 && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Nenhum entregador cadastrado para este estabelecimento.
                <br />
                Acesse como vendedor para criar entregadores.
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              !selectedDeliverer || establishmentDeliverers.length === 0
            }
          >
            Entrar como Entregador
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
