import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Phone,
  Edit,
  Trash2,
  Plus,
  Search,
  Bike,
  Car,
  User,
} from "lucide-react";

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
  createdAt?: string;
}

interface DelivererManagementProps {
  deliverers: Deliverer[];
  onAddDeliverer: () => void;
  onEditDeliverer: (deliverer: Deliverer) => void;
  onDeleteDeliverer: (id: string) => void;
  onCallDeliverer: (phone: string) => void;
}

export const DelivererManagement = ({
  deliverers,
  onAddDeliverer,
  onEditDeliverer,
  onDeleteDeliverer,
  onCallDeliverer,
}: DelivererManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const statusConfig = {
    disponivel: { color: "bg-green-500", label: "Disponível" },
    ocupado: { color: "bg-blue-500", label: "Ocupado" },
    inativo: { color: "bg-gray-500", label: "Inativo" },
    folga: { color: "bg-orange-500", label: "Folga" },
  };

  const vehicleIcons = {
    moto: Bike,
    bicicleta: Bike,
    carro: Car,
    a_pe: User,
  };

  const filteredDeliverers = deliverers.filter((deliverer) => {
    const matchesSearch =
      deliverer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliverer.phone?.includes(searchTerm);
    const matchesStatus =
      statusFilter === "todos" || deliverer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getVehicleIcon = (vehicle: string) => {
    const IconComponent =
      vehicleIcons[vehicle as keyof typeof vehicleIcons] || User;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gerenciar Entregadores</CardTitle>
            <Button onClick={onAddDeliverer}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Entregador
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["todos", "disponivel", "ocupado", "inativo", "folga"].map(
                (status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status === "todos"
                      ? "Todos"
                      : statusConfig[status as keyof typeof statusConfig]
                          ?.label}
                  </Button>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDeliverers.map((deliverer) => (
          <Card
            key={deliverer.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{deliverer.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {getVehicleIcon(deliverer.vehicle)}
                    <span className="capitalize">{deliverer.vehicle}</span>
                    {deliverer.plate && <span>• {deliverer.plate}</span>}
                  </div>
                </div>
                <Badge
                  className={`${
                    statusConfig[deliverer.status as keyof typeof statusConfig]
                      ?.color
                  } text-white`}
                >
                  {
                    statusConfig[deliverer.status as keyof typeof statusConfig]
                      ?.label
                  }
                </Badge>
              </div>

              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{deliverer.phone}</span>
                </div>
                {deliverer.email && (
                  <div className="flex items-center gap-2">
                    <span>📧</span>
                    <span>{deliverer.email}</span>
                  </div>
                )}
                {deliverer.zone && (
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span className="capitalize">
                      {deliverer.zone.replace("_", " ")}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCallDeliverer(deliverer.phone!)}
                  className="flex-1"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Ligar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEditDeliverer(deliverer)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDeleteDeliverer(deliverer.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDeliverers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum entregador encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== "todos"
                ? "Tente ajustar os filtros de busca"
                : "Comece adicionando seu primeiro entregador"}
            </p>
            {!searchTerm && statusFilter === "todos" && (
              <Button onClick={onAddDeliverer}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Entregador
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
