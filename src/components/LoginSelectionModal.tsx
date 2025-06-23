import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building, User } from "lucide-react";

interface LoginSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVendedor: () => void;
  onSelectEntregador: () => void;
}

export const LoginSelectionModal = ({
  isOpen,
  onClose,
  onSelectVendedor,
  onSelectEntregador,
}: LoginSelectionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Escolha seu tipo de acesso
          </DialogTitle>
        </DialogHeader>

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

        <div className="text-center">
          <Button variant="ghost" onClick={onClose}>
            Voltar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
