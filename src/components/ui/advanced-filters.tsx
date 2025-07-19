import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Calendar,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  User,
  X,
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
}

export interface FilterState {
  dateRange: {
    start: string;
    end: string;
  };
  valueRange: {
    min: string;
    max: string;
  };
  status: string;
  priority: string;
  paymentMethod: string;
  deliverer: string;
  zone: string;
  customerName: string;
  address: string;
  onlyWithObservations: boolean;
  onlyUrgent: boolean;
  onlyAssigned: boolean;
  onlyUnassigned: boolean;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  deliverers: Deliverer[];
}

export const AdvancedFilters = ({
  onFiltersChange,
  deliverers,
}: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: {
      start: "",
      end: "",
    },
    valueRange: {
      min: "",
      max: "",
    },
    status: "all",
    priority: "all",
    paymentMethod: "all",
    deliverer: "all",
    zone: "",
    customerName: "",
    address: "",
    onlyWithObservations: false,
    onlyUrgent: false,
    onlyAssigned: false,
    onlyUnassigned: false,
  });

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | boolean
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleNestedFilterChange = (
    parent: "dateRange" | "valueRange",
    key: string,
    value: string
  ) => {
    const newFilters = {
      ...filters,
      [parent]: {
        ...(filters[parent] as Record<string, string>),
        [key]: value,
      },
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearFilters = {
      dateRange: { start: "", end: "" },
      valueRange: { min: "", max: "" },
      status: "all",
      priority: "all",
      paymentMethod: "all",
      deliverer: "all",
      zone: "",
      customerName: "",
      address: "",
      onlyWithObservations: false,
      onlyUrgent: false,
      onlyAssigned: false,
      onlyUnassigned: false,
    };
    setFilters(clearFilters);
    onFiltersChange(clearFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.valueRange.min || filters.valueRange.max) count++;
    if (filters.status !== "all") count++;
    if (filters.priority !== "all") count++;
    if (filters.paymentMethod !== "all") count++;
    if (filters.deliverer !== "all") count++;
    if (filters.zone) count++;
    if (filters.customerName) count++;
    if (filters.address) count++;
    if (filters.onlyWithObservations) count++;
    if (filters.onlyUrgent) count++;
    if (filters.onlyAssigned) count++;
    if (filters.onlyUnassigned) count++;
    return count;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros Avançados
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-1">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados de Entregas
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Filtros de Data */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <h3 className="font-medium">Período</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="dateStart" className="text-xs">
                  Data Inicial
                </Label>
                <Input
                  id="dateStart"
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) =>
                    handleNestedFilterChange(
                      "dateRange",
                      "start",
                      e.target.value
                    )
                  }
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="dateEnd" className="text-xs">
                  Data Final
                </Label>
                <Input
                  id="dateEnd"
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) =>
                    handleNestedFilterChange("dateRange", "end", e.target.value)
                  }
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Filtros de Valor */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <h3 className="font-medium">Faixa de Valor</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="valueMin" className="text-xs">
                  Valor Mínimo
                </Label>
                <Input
                  id="valueMin"
                  type="number"
                  step="0.01"
                  min="0"
                  value={filters.valueRange.min}
                  onChange={(e) =>
                    handleNestedFilterChange(
                      "valueRange",
                      "min",
                      e.target.value
                    )
                  }
                  placeholder="0,00"
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="valueMax" className="text-xs">
                  Valor Máximo
                </Label>
                <Input
                  id="valueMax"
                  type="number"
                  step="0.01"
                  min="0"
                  value={filters.valueRange.max}
                  onChange={(e) =>
                    handleNestedFilterChange(
                      "valueRange",
                      "max",
                      e.target.value
                    )
                  }
                  placeholder="1000,00"
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Status e Prioridade */}
          <div className="space-y-4">
            <h3 className="font-medium">Status e Prioridade</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="status" className="text-xs">
                  Status
                </Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_rota">Em Rota</SelectItem>
                    <SelectItem value="entregue">Entregue</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority" className="text-xs">
                  Prioridade
                </Label>
                <Select
                  value={filters.priority}
                  onValueChange={(value) =>
                    handleFilterChange("priority", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as prioridades</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pagamento e Entregador */}
          <div className="space-y-4">
            <h3 className="font-medium">Pagamento e Responsável</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="paymentMethod" className="text-xs">
                  Forma de Pagamento
                </Label>
                <Select
                  value={filters.paymentMethod}
                  onValueChange={(value) =>
                    handleFilterChange("paymentMethod", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as formas</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                    <SelectItem value="loja">Pago na Loja</SelectItem>
                    <SelectItem value="sem_pagamento">Sem Pagamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="deliverer" className="text-xs">
                  Entregador
                </Label>
                <Select
                  value={filters.deliverer}
                  onValueChange={(value) =>
                    handleFilterChange("deliverer", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os entregadores</SelectItem>
                    {deliverers.map((deliverer) => (
                      <SelectItem key={deliverer.id} value={deliverer.id}>
                        {deliverer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Busca por Texto */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <h3 className="font-medium">Busca por Texto</h3>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="customerName" className="text-xs">
                  Nome do Cliente
                </Label>
                <Input
                  id="customerName"
                  value={filters.customerName}
                  onChange={(e) =>
                    handleFilterChange("customerName", e.target.value)
                  }
                  placeholder="Digite o nome..."
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="address" className="text-xs">
                  Endereço
                </Label>
                <Input
                  id="address"
                  value={filters.address}
                  onChange={(e) =>
                    handleFilterChange("address", e.target.value)
                  }
                  placeholder="Digite o endereço..."
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="zone" className="text-xs">
                  Zona
                </Label>
                <Input
                  id="zone"
                  value={filters.zone}
                  onChange={(e) => handleFilterChange("zone", e.target.value)}
                  placeholder="Digite a zona..."
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Filtros Booleanos */}
          <div className="space-y-4">
            <h3 className="font-medium">Filtros Especiais</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="onlyWithObservations" className="text-xs">
                  Apenas com observações
                </Label>
                <Switch
                  id="onlyWithObservations"
                  checked={filters.onlyWithObservations}
                  onCheckedChange={(checked) =>
                    handleFilterChange("onlyWithObservations", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="onlyUrgent" className="text-xs">
                  Apenas urgentes
                </Label>
                <Switch
                  id="onlyUrgent"
                  checked={filters.onlyUrgent}
                  onCheckedChange={(checked) =>
                    handleFilterChange("onlyUrgent", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="onlyAssigned" className="text-xs">
                  Apenas atribuídas
                </Label>
                <Switch
                  id="onlyAssigned"
                  checked={filters.onlyAssigned}
                  onCheckedChange={(checked) =>
                    handleFilterChange("onlyAssigned", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="onlyUnassigned" className="text-xs">
                  Apenas não atribuídas
                </Label>
                <Switch
                  id="onlyUnassigned"
                  checked={filters.onlyUnassigned}
                  onCheckedChange={(checked) =>
                    handleFilterChange("onlyUnassigned", checked)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="gap-2"
            disabled={getActiveFiltersCount() === 0}
          >
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
          <Button onClick={() => setIsOpen(false)}>Aplicar Filtros</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
