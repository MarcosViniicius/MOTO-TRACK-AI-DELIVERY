import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
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

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "gray";
  className?: string;
}

const colorConfig = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    border: "border-blue-200",
  },
  green: {
    bg: "bg-green-50",
    icon: "text-green-600",
    border: "border-green-200",
  },
  yellow: {
    bg: "bg-yellow-50",
    icon: "text-yellow-600",
    border: "border-yellow-200",
  },
  red: {
    bg: "bg-red-50",
    icon: "text-red-600",
    border: "border-red-200",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    border: "border-purple-200",
  },
  gray: {
    bg: "bg-gray-50",
    icon: "text-gray-600",
    border: "border-gray-200",
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "blue",
  className,
}) => {
  const config = colorConfig[color];

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div
          className={cn("p-2 rounded-lg", config.bg, config.border, "border")}
        >
          <div className={cn("h-4 w-4", config.icon)}>{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp
              className={cn(
                "h-3 w-3 mr-1",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            />
            <span
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.value}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  deliveries: Delivery[];
  deliverers: Deliverer[];
  userType: "vendedor" | "entregador";
  className?: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  deliveries,
  deliverers,
  userType,
  className,
}) => {
  // Calcular estatísticas
  const stats = {
    total: deliveries.length,
    pendentes: deliveries.filter((d) => d.status === "pendente").length,
    emAndamento: deliveries.filter((d) => d.status === "em_andamento").length,
    entregues: deliveries.filter((d) => d.status === "entregue").length,
    canceladas: deliveries.filter((d) => d.status === "cancelada").length,
    faturamento: deliveries
      .filter((d) => d.status === "entregue")
      .reduce((sum, d) => sum + d.value, 0),
    entregadoresAtivos: deliverers.filter((d) => d.status === "disponivel")
      .length,
    entregadoresOcupados: deliverers.filter((d) => d.status === "ocupado")
      .length,
  };

  if (userType === "entregador") {
    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
          className
        )}
      >
        <StatsCard
          title="Minhas Entregas"
          value={stats.total}
          subtitle="Total no período"
          icon={<Package className="h-4 w-4" />}
          color="blue"
        />

        <StatsCard
          title="Pendentes"
          value={stats.pendentes}
          subtitle="Aguardando retirada"
          icon={<Clock className="h-4 w-4" />}
          color="yellow"
        />

        <StatsCard
          title="Em Andamento"
          value={stats.emAndamento}
          subtitle="Em rota de entrega"
          icon={<Truck className="h-4 w-4" />}
          color="blue"
        />

        <StatsCard
          title="Concluídas"
          value={stats.entregues}
          subtitle="Entregas finalizadas"
          icon={<CheckCircle className="h-4 w-4" />}
          color="green"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
        className
      )}
    >
      <StatsCard
        title="Total de Entregas"
        value={stats.total}
        subtitle="Todas as entregas"
        icon={<Package className="h-4 w-4" />}
        color="blue"
      />

      <StatsCard
        title="Pendentes"
        value={stats.pendentes}
        subtitle="Aguardando processamento"
        icon={<Clock className="h-4 w-4" />}
        color="yellow"
      />

      <StatsCard
        title="Em Rota"
        value={stats.emAndamento}
        subtitle="Sendo entregues"
        icon={<Truck className="h-4 w-4" />}
        color="blue"
      />

      <StatsCard
        title="Concluídas"
        value={stats.entregues}
        subtitle="Entregas finalizadas"
        icon={<CheckCircle className="h-4 w-4" />}
        color="green"
      />

      <StatsCard
        title="Faturamento"
        value={`R$ ${stats.faturamento.toFixed(2)}`}
        subtitle="Entregas concluídas"
        icon={<DollarSign className="h-4 w-4" />}
        color="green"
      />

      <StatsCard
        title="Entregadores"
        value={deliverers.length}
        subtitle={`${stats.entregadoresAtivos} disponíveis`}
        icon={<Users className="h-4 w-4" />}
        color="purple"
      />

      <StatsCard
        title="Canceladas"
        value={stats.canceladas}
        subtitle="Entregas canceladas"
        icon={<XCircle className="h-4 w-4" />}
        color="red"
      />

      <StatsCard
        title="Taxa de Sucesso"
        value={`${
          stats.total > 0
            ? Math.round((stats.entregues / stats.total) * 100)
            : 0
        }%`}
        subtitle="Entregas bem-sucedidas"
        icon={<TrendingUp className="h-4 w-4" />}
        color="green"
      />
    </div>
  );
};
