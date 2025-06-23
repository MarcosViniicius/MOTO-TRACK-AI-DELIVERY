import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Eye, EyeOff, ArrowLeft } from "lucide-react";

interface VendedorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: { email: string; password: string }) => void;
  onShowRegistration: () => void;
}

export const VendedorLoginModal = ({
  isOpen,
  onClose,
  onLogin,
  onShowRegistration,
}: VendedorLoginModalProps) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      alert("Por favor, preencha nome do estabelecimento e senha");
      return;
    }
    onLogin(credentials);
  };

  const handleClose = () => {
    setCredentials({ email: "", password: "" });
    setShowPassword(false);
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
              <Building className="h-5 w-5 text-blue-600" />
              Login - Vendedor
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="text-center mb-6">
          <Building className="h-16 w-16 text-blue-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold">Acesso do Estabelecimento</h3>
          <p className="text-sm text-gray-600">Entre com suas credenciais</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="establishmentName">Nome do Estabelecimento</Label>
            <Input
              id="establishmentName"
              type="text"
              value={credentials.email}
              onChange={(e) =>
                setCredentials((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Ex: Restaurante do João"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="••••••••"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>

        <div className="text-center pt-4 border-t">
          <Button
            variant="link"
            onClick={onShowRegistration}
            className="text-sm"
          >
            Não tem conta? Criar estabelecimento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
