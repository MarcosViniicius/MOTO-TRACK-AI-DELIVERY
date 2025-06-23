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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building, User, Eye, EyeOff } from "lucide-react";

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

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (
    userType: string,
    delivererId?: string,
    credentials?: { email: string; password: string }
  ) => void;
  onShowRegistration: () => void;
  deliverers: Deliverer[];
}

export const LoginModal = ({
  isOpen,
  onClose,
  onLogin,
  onShowRegistration,
  deliverers,
}: LoginModalProps) => {
  const [activeTab, setActiveTab] = useState("vendedor");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [selectedDeliverer, setSelectedDeliverer] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (activeTab === "vendedor") {
      if (!credentials.email || !credentials.password) {
        alert("Por favor, preencha nome do estabelecimento e senha");
        return;
      }
      onLogin("vendedor", undefined, credentials);
    } else {
      if (!selectedDeliverer) {
        alert("Por favor, selecione um entregador");
        return;
      }
      onLogin("entregador", selectedDeliverer);
    }

    // Reset form
    setCredentials({ email: "", password: "" });
    setSelectedDeliverer("");
  };

  const handleClose = () => {
    setCredentials({ email: "", password: "" });
    setSelectedDeliverer("");
    setActiveTab("vendedor");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Acessar Sistema</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vendedor" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Vendedor
            </TabsTrigger>
            <TabsTrigger value="entregador" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Entregador
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vendedor" className="space-y-4 mt-6">
            <div className="text-center mb-4">
              <Building className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold">Acesso do Estabelecimento</h3>
              <p className="text-sm text-gray-600">
                Entre com suas credenciais
              </p>
            </div>

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

            <div className="text-center">
              <Button
                variant="link"
                onClick={onShowRegistration}
                className="text-sm"
              >
                Não tem conta? Criar estabelecimento
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="entregador" className="space-y-4 mt-6">
            <div className="text-center mb-4">
              <User className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Acesso do Entregador</h3>
              <p className="text-sm text-gray-600">Selecione seu nome</p>
            </div>

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
                      <div className="flex items-center gap-2">
                        <span>{deliverer.name}</span>
                        <span className="text-sm text-gray-500">
                          ({deliverer.vehicle} - {deliverer.zone})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {deliverers.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Nenhum entregador cadastrado. Peça ao vendedor para criar sua
                  conta.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleLogin}
            className="flex-1"
            disabled={
              (activeTab === "vendedor" &&
                (!credentials.email || !credentials.password)) ||
              (activeTab === "entregador" && !selectedDeliverer)
            }
          >
            Entrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
