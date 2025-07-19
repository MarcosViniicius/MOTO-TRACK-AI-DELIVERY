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
  MapPin,
  Phone,
  MoreVertical,
  Package,
  Edit,
  Trash2,
  User,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Delivery {
  id: number;
  customerName: string;
  address: string;
  phone?: string;
  value: number;
  paymentMethod: string;
  assignedTo?: string;
  assignedToName?: string;
  priority: string;
  estimatedTime: string;
  observations?: string;
  status: string;
  createdAt?: string;
}

interface DeliveryCardProps {
  delivery: Delivery;
  userType: "vendedor" | "entregador";
  onViewDetails: (delivery: Delivery) => void;
  onEdit?: (delivery: Delivery) => void;
  onDelete?: (delivery: Delivery) => void;
  className?: string;
}

const statusConfig = {
  pendente: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "📋",
    label: "Pendente",
  },
  em_andamento: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "🚛",
    label: "Em Rota",
  },
  entregue: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "✅",
    label: "Entregue",
  },
  cancelada: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "❌",
    label: "Cancelada",
  },
};

const priorityConfig = {
  baixa: { color: "bg-green-100 text-green-800", dot: "bg-green-500" },
  normal: { color: "bg-blue-100 text-blue-800", dot: "bg-blue-500" },
  alta: { color: "bg-orange-100 text-orange-800", dot: "bg-orange-500" },
  urgente: { color: "bg-red-100 text-red-800", dot: "bg-red-500" },
};

export const DeliveryCard: React.FC<DeliveryCardProps> = ({
  delivery,
  userType,
  onViewDetails,
  onEdit,
  onDelete,
  className,
}) => {
  const statusInfo =
    statusConfig[delivery.status as keyof typeof statusConfig] ||
    statusConfig.pendente;
  const priorityInfo =
    priorityConfig[delivery.priority as keyof typeof priorityConfig] ||
    priorityConfig.normal;

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
          <h3 className="font-semibold text-gray-900 truncate">
            {delivery.customerName || "Cliente não identificado"}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={priorityInfo.color} variant="outline">
              <div
                className={cn("w-2 h-2 rounded-full mr-1", priorityInfo.dot)}
              />
              {delivery.priority}
            </Badge>
            <Badge className={statusInfo.color} variant="outline">
              <span className="mr-1">{statusInfo.icon}</span>
              {statusInfo.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="flex items-start gap-2 mb-3">
        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
        <p className="text-sm text-gray-700 break-words flex-1">
          {delivery.address}
        </p>
      </div>

      {/* Informações da entrega */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Valor:</span>
          <span className="font-semibold text-green-600">
            R$ {delivery.value.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Pagamento:</span>
          <Badge variant="secondary" className="text-xs">
            {delivery.paymentMethod}
          </Badge>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Tempo est.:</span>
          <span className="text-gray-700">{delivery.estimatedTime}</span>
        </div>

        {delivery.assignedToName && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Entregador:</span>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="text-gray-700">{delivery.assignedToName}</span>
            </div>
          </div>
        )}

        {delivery.observations && (
          <div className="flex items-start gap-2 text-sm">
            <FileText className="h-3 w-3 text-gray-500 mt-0.5 shrink-0" />
            <span className="text-gray-600 text-xs">
              {delivery.observations}
            </span>
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex gap-2">
          {delivery.phone && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`tel:${delivery.phone}`)}
              className="h-8 w-8 p-0"
            >
              <Phone className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(delivery)}
          >
            <Package className="h-4 w-4 mr-2" />
            Detalhes
          </Button>
        </div>

        {userType === "vendedor" && (onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(delivery)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
              )}
              {onEdit && onDelete && <DropdownMenuSeparator />}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(delivery)}
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
    </div>
  );
};
