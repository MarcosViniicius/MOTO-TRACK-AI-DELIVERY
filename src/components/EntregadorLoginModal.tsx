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

interface EntregadorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (delivererId: string) => void;
  deliverers: Deliverer[];
}

export const EntregadorLoginModal = ({
  isOpen,
  onClose,
  onLogin,
  deliverers,
}: EntregadorLoginModalProps) => {
  const [selectedDeliverer, setSelectedDeliverer] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeliverer) {
      alert("Por favor, selecione seu nome");
      return;
    }
    onLogin(selectedDeliverer);
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Login - Entregador
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="text-center mb-6">
          <User className="h-16 w-16 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold">Acesso do Entregador</h3>
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
                {deliverers.map((deliverer) => (
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
            {deliverers.length === 0 && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Nenhum entregador cadastrado.
                <br />
                Peça ao vendedor para criar sua conta.
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!selectedDeliverer || deliverers.length === 0}
          >
            Entrar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
