import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  X,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOptions {
  search: string;
  status: string;
  priority: string;
  paymentMethod: string;
  assignedTo: string;
}

interface DeliveryFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  deliverers?: Array<{ id: string; name: string }>;
  className?: string;
}

const statusOptions = [
  { value: "todos", label: "Todos os status", icon: Package },
  { value: "pendente", label: "Pendentes", icon: Clock },
  { value: "em_andamento", label: "Em rota", icon: Truck },
  { value: "entregue", label: "Entregues", icon: CheckCircle },
  { value: "cancelada", label: "Canceladas", icon: XCircle },
];

const priorityOptions = [
  { value: "todas", label: "Todas as prioridades" },
  { value: "baixa", label: "Baixa", color: "bg-green-100 text-green-800" },
  { value: "normal", label: "Normal", color: "bg-blue-100 text-blue-800" },
  { value: "alta", label: "Alta", color: "bg-orange-100 text-orange-800" },
  { value: "urgente", label: "Urgente", color: "bg-red-100 text-red-800" },
];

const paymentOptions = [
  { value: "todos", label: "Todos os pagamentos" },
  { value: "pix", label: "PIX" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "cartao", label: "Cartão" },
  { value: "loja", label: "Pago na Loja" },
  { value: "sem_pagamento", label: "Sem Pagamento" },
];

export const DeliveryFilters: React.FC<DeliveryFiltersProps> = ({
  filters,
  onFiltersChange,
  deliverers = [],
  className,
}) => {
  const hasActiveFilters =
    filters.search ||
    filters.status !== "todos" ||
    filters.priority !== "todas" ||
    filters.paymentMethod !== "todos" ||
    filters.assignedTo !== "todos";

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: "todos",
      priority: "todas",
      paymentMethod: "todos",
      assignedTo: "todos",
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Barra de pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por cliente, endereço, telefone..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          className="pl-10 pr-10"
        />
        {filters.search && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFiltersChange({ search: "" })}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Filtros rápidos por status */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => {
          const Icon = option.icon;
          const isActive = filters.status === option.value;

          return (
            <Button
              key={option.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onFiltersChange({ status: option.value })}
              className="flex items-center gap-2"
            >
              <Icon className="h-3 w-3" />
              {option.label}
            </Button>
          );
        })}
      </div>

      {/* Filtros avançados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Prioridade */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Prioridade</Label>
          <Select
            value={filters.priority}
            onValueChange={(value) => onFiltersChange({ priority: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.color && (
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          option.color.includes("bg-")
                            ? option.color.split(" ")[0].replace("bg-", "bg-")
                            : "bg-gray-300"
                        )}
                      />
                    )}
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Forma de pagamento */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Pagamento</Label>
          <Select
            value={filters.paymentMethod}
            onValueChange={(value) => onFiltersChange({ paymentMethod: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {paymentOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Entregador */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Entregador</Label>
          <Select
            value={filters.assignedTo}
            onValueChange={(value) => onFiltersChange({ assignedTo: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os entregadores</SelectItem>
              <SelectItem value="unassigned">Sem entregador</SelectItem>
              {deliverers.map((deliverer) => (
                <SelectItem key={deliverer.id} value={deliverer.id}>
                  {deliverer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Indicador de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-900">Filtros aplicados</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {
                [
                  filters.search && "busca",
                  filters.status !== "todos" && "status",
                  filters.priority !== "todas" && "prioridade",
                  filters.paymentMethod !== "todos" && "pagamento",
                  filters.assignedTo !== "todos" && "entregador",
                ].filter(Boolean).length
              }
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-700"
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
};
