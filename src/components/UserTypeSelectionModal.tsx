import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building, User, LogOut } from "lucide-react";

interface UserTypeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVendedor: () => void;
  onSelectEntregador: () => void;
  establishmentName: string;
  onLogout: () => void;
}

export const UserTypeSelectionModal = ({
  isOpen,
  onClose,
  onSelectVendedor,
  onSelectEntregador,
  establishmentName,
  onLogout,
}: UserTypeSelectionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-center text-xl flex-1">
              Bem-vindo, {establishmentName}!
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="p-1"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            Escolha como você quer acessar o sistema:
          </p>
        </div>

        <div className="space-y-4 py-6">
          <Button
            onClick={onSelectVendedor}
            className="w-full h-20 text-lg flex flex-col gap-2"
            variant="outline"
          >
            <Building className="h-8 w-8" />
            <span>Vendedor</span>
            <span className="text-sm text-gray-500">
              Gerenciar entregas e entregadores
            </span>
          </Button>

          <Button
            onClick={onSelectEntregador}
            className="w-full h-20 text-lg flex flex-col gap-2"
            variant="outline"
          >
            <User className="h-8 w-8" />
            <span>Entregador</span>
            <span className="text-sm text-gray-500">
              Visualizar e confirmar entregas
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
