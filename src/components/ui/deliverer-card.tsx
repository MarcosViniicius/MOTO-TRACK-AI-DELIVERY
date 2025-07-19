import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface DelivererCardProps {
  deliverer: Deliverer;
  onEdit?: (deliverer: Deliverer) => void;
  onDelete?: (deliverer: Deliverer) => void;
  className?: string;
}

const statusConfig = {
  disponivel: {
    color: "bg-green-100 text-green-800 border-green-200",
    dot: "bg-green-500",
    label: "Disponível",
  },
  ocupado: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    dot: "bg-yellow-500",
    label: "Ocupado",
  },
  inativo: {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    dot: "bg-gray-500",
    label: "Inativo",
  },
};

const vehicleConfig = {
  moto: { icon: "🏍️", label: "Moto" },
  bicicleta: { icon: "🚲", label: "Bicicleta" },
  carro: { icon: "🚗", label: "Carro" },
  a_pe: { icon: "🚶", label: "A pé" },
};

export const DelivererCard: React.FC<DelivererCardProps> = ({
  deliverer,
  onEdit,
  onDelete,
  className,
}) => {
  const statusInfo =
    statusConfig[deliverer.status as keyof typeof statusConfig] ||
    statusConfig.disponivel;
  const vehicleInfo =
    vehicleConfig[deliverer.vehicle as keyof typeof vehicleConfig] ||
    vehicleConfig.moto;

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 card-hover",
        className
      )}
    >
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900 truncate">
              {deliverer.name}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={statusInfo.color} variant="outline">
              <div
                className={cn("w-2 h-2 rounded-full mr-1", statusInfo.dot)}
              />
              {statusInfo.label}
            </Badge>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(deliverer)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
              )}
              {onEdit && onDelete && <DropdownMenuSeparator />}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(deliverer)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Informações do veículo */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{vehicleInfo.icon}</span>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {vehicleInfo.label}
            </p>
            {deliverer.plate && (
              <p className="text-xs text-gray-500">Placa: {deliverer.plate}</p>
            )}
          </div>
        </div>

        {/* Zona de entrega */}
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-gray-600">Zona de entrega:</p>
            <p className="text-sm font-medium text-gray-900">
              {deliverer.zone}
            </p>
          </div>
        </div>
      </div>

      {/* Contatos */}
      {(deliverer.phone || deliverer.email) && (
        <div className="space-y-2 pt-3 border-t border-gray-100">
          {deliverer.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">{deliverer.phone}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`tel:${deliverer.phone}`)}
                className="h-6 w-6 p-0 ml-auto"
              >
                <Phone className="h-3 w-3" />
              </Button>
            </div>
          )}

          {deliverer.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 truncate flex-1">
                {deliverer.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`mailto:${deliverer.email}`)}
                className="h-6 w-6 p-0 ml-auto"
              >
                <Mail className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
