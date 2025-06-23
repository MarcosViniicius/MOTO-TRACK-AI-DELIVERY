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
import { Building, User, LogOut, RefreshCw } from "lucide-react";

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

interface ProfileSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVendedor: () => void;
  onSelectEntregador: (delivererId: string) => void;
  onLogout: () => void;
  establishmentName: string;
  currentUserType?: string;
  currentUserName?: string;
  deliverers: Deliverer[];
  establishmentId: string;
}

export const ProfileSwitcher = ({
  isOpen,
  onClose,
  onSelectVendedor,
  onSelectEntregador,
  onLogout,
  establishmentName,
  currentUserType,
  currentUserName,
  deliverers,
  establishmentId,
}: ProfileSwitcherProps) => {
  const [selectedDeliverer, setSelectedDeliverer] = useState("");

  // Filtrar entregadores do estabelecimento logado
  const establishmentDeliverers = deliverers.filter(
    (d) => d.establishmentId === establishmentId
  );

  const handleSwitchToEntregador = () => {
    if (!selectedDeliverer) {
      alert("Por favor, selecione um entregador");
      return;
    }
    onSelectEntregador(selectedDeliverer);
    setSelectedDeliverer("");
    onClose();
  };

  const handleSwitchToVendedor = () => {
    onSelectVendedor();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-center text-lg flex-1">
              <div className="flex items-center gap-2 justify-center">
                <RefreshCw className="h-5 w-5" />
                Alternar Perfil
              </div>
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="p-1 text-red-600 hover:text-red-700"
              title="Sair completamente"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            <strong>{establishmentName}</strong>
          </p>
          {currentUserType && (
            <p className="text-xs text-blue-600">
              Atual:{" "}
              {currentUserType === "vendedor"
                ? "Vendedor"
                : `Entregador (${currentUserName})`}
            </p>
          )}
        </div>

        <div className="space-y-4 py-4">
          <Button
            onClick={handleSwitchToVendedor}
            className="w-full h-16 text-lg flex flex-col gap-1"
            variant={currentUserType === "vendedor" ? "default" : "outline"}
            disabled={currentUserType === "vendedor"}
          >
            <Building className="h-6 w-6" />
            <span>Vendedor</span>
            <span className="text-xs opacity-75">
              Gerenciar entregas e entregadores
            </span>
          </Button>

          <div className="space-y-2">
            <Label htmlFor="deliverer">Entrar como Entregador:</Label>
            <Select
              value={selectedDeliverer}
              onValueChange={setSelectedDeliverer}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um entregador" />
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

            <Button
              onClick={handleSwitchToEntregador}
              className="w-full"
              variant="outline"
              disabled={
                !selectedDeliverer || establishmentDeliverers.length === 0
              }
            >
              <User className="h-4 w-4 mr-2" />
              Entrar como Entregador
            </Button>

            {establishmentDeliverers.length === 0 && (
              <p className="text-sm text-gray-500 text-center">
                Nenhum entregador cadastrado.
                <br />
                Cadastre entregadores na aba vendedor.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
