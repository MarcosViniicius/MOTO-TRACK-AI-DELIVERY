import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Truck,
  Users,
  MapPin,
  Calendar,
  Download,
  Eye,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Delivery {
  id: number;
  customerName: string;
  address: string;
  phone: string;
  value: number;
  paymentMethod: string;
  status: string;
  priority: string;
  estimatedTime: string;
  observations: string;
  assignedTo: string | null;
  assignedToName: string | null;
  createdAt: string;
  completedAt?: string;
  establishmentId: string;
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
  createdAt: string;
}

interface ReportsAnalyticsProps {
  deliveries: Delivery[];
  deliverers: Deliverer[];
}

export const ReportsAnalytics = ({
  deliveries,
  deliverers,
}: ReportsAnalyticsProps) => {
  const [dateRange, setDateRange] = useState("last_7_days");
  const [selectedDeliverer, setSelectedDeliverer] = useState("all");

  // Filtrar entregas baseado no período selecionado
  const filteredDeliveries = useMemo(() => {
    const now = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "yesterday":
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "last_7_days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "last_30_days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "this_month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "last_month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    return deliveries.filter((delivery) => {
      const deliveryDate = new Date(delivery.createdAt);
      const matchesDate = deliveryDate >= startDate;
      const matchesDeliverer =
        selectedDeliverer === "all" ||
        delivery.assignedTo === selectedDeliverer;
      return matchesDate && matchesDeliverer;
    });
  }, [deliveries, dateRange, selectedDeliverer]);

  // Estatísticas gerais
  const stats = useMemo(() => {
    const totalDeliveries = filteredDeliveries.length;
    const completedDeliveries = filteredDeliveries.filter(
      (d) => d.status === "entregue"
    ).length;
    const pendingDeliveries = filteredDeliveries.filter(
      (d) => d.status === "pendente"
    ).length;
    const inRouteDeliveries = filteredDeliveries.filter(
      (d) => d.status === "em_rota"
    ).length;
    const cancelledDeliveries = filteredDeliveries.filter(
      (d) => d.status === "cancelada"
    ).length;

    const totalRevenue = filteredDeliveries
      .filter((d) => d.status === "entregue")
      .reduce((sum, d) => sum + d.value, 0);

    const averageDeliveryValue =
      completedDeliveries > 0 ? totalRevenue / completedDeliveries : 0;

    const completionRate =
      totalDeliveries > 0 ? (completedDeliveries / totalDeliveries) * 100 : 0;

    // Tempo médio de entrega (simulado)
    const averageDeliveryTime = "42 min";

    return {
      totalDeliveries,
      completedDeliveries,
      pendingDeliveries,
      inRouteDeliveries,
      cancelledDeliveries,
      totalRevenue,
      averageDeliveryValue,
      completionRate,
      averageDeliveryTime,
    };
  }, [filteredDeliveries]);

  // Estatísticas por forma de pagamento
  const paymentStats = useMemo(() => {
    const paymentCounts = filteredDeliveries.reduce((acc, delivery) => {
      acc[delivery.paymentMethod] = (acc[delivery.paymentMethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(paymentCounts).map(([method, count]) => ({
      method,
      count,
      percentage: (count / filteredDeliveries.length) * 100,
    }));
  }, [filteredDeliveries]);

  // Estatísticas por entregador
  const delivererStats = useMemo(() => {
    const delivererCounts = filteredDeliveries.reduce((acc, delivery) => {
      if (delivery.assignedToName) {
        if (!acc[delivery.assignedToName]) {
          acc[delivery.assignedToName] = {
            total: 0,
            completed: 0,
            pending: 0,
            revenue: 0,
          };
        }
        acc[delivery.assignedToName].total++;
        if (delivery.status === "entregue") {
          acc[delivery.assignedToName].completed++;
          acc[delivery.assignedToName].revenue += delivery.value;
        } else if (delivery.status === "pendente") {
          acc[delivery.assignedToName].pending++;
        }
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number; pending: number; revenue: number }>);

    return Object.entries(delivererCounts).map(([name, stats]) => ({
      name,
      ...stats,
      completionRate:
        stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
    }));
  }, [filteredDeliveries]);

  // Estatísticas por prioridade
  const priorityStats = useMemo(() => {
    const priorityCounts = filteredDeliveries.reduce((acc, delivery) => {
      acc[delivery.priority] = (acc[delivery.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(priorityCounts).map(([priority, count]) => ({
      priority,
      count,
      percentage: (count / filteredDeliveries.length) * 100,
    }));
  }, [filteredDeliveries]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgente":
        return "bg-red-500";
      case "alta":
        return "bg-orange-500";
      case "normal":
        return "bg-yellow-500";
      case "baixa":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "pix":
        return "PIX";
      case "dinheiro":
        return "Dinheiro";
      case "cartao":
        return "Cartão";
      case "loja":
        return "Pago na Loja";
      case "sem_pagamento":
        return "Sem Pagamento";
      default:
        return method;
    }
  };

  const exportReport = () => {
    const reportData = {
      period: dateRange,
      generatedAt: new Date().toISOString(),
      stats,
      paymentStats,
      delivererStats,
      priorityStats,
      rawData: filteredDeliveries,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mototrack-report-${dateRange}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Relatórios e Analytics</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="yesterday">Ontem</SelectItem>
              <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
              <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
              <SelectItem value="this_month">Este mês</SelectItem>
              <SelectItem value="last_month">Mês anterior</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedDeliverer}
            onValueChange={setSelectedDeliverer}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos entregadores</SelectItem>
              {deliverers.map((deliverer) => (
                <SelectItem key={deliverer.id} value={deliverer.id}>
                  {deliverer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={exportReport} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Entregas
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                {stats.completedDeliveries} concluídas
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.totalRevenue.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              Média: R$ {stats.averageDeliveryValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conclusão
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completionRate.toFixed(1)}%
            </div>
            <Progress value={stats.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageDeliveryTime}
            </div>
            <div className="text-xs text-muted-foreground">Por entrega</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Estatísticas Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status das Entregas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Status das Entregas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Concluídas</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (stats.completedDeliveries / stats.totalDeliveries) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {stats.completedDeliveries}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Em Rota</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (stats.inRouteDeliveries / stats.totalDeliveries) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {stats.inRouteDeliveries}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Pendentes</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (stats.pendingDeliveries / stats.totalDeliveries) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {stats.pendingDeliveries}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Canceladas</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (stats.cancelledDeliveries / stats.totalDeliveries) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {stats.cancelledDeliveries}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formas de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Formas de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentStats.map(({ method, count, percentage }) => (
                <div key={method} className="flex items-center justify-between">
                  <span className="text-sm">
                    {getPaymentMethodLabel(method)}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance dos Entregadores */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Performance dos Entregadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {delivererStats.map(
                ({ name, total, completed, revenue, completionRate }) => (
                  <div key={name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{name}</h4>
                      <Badge variant="outline">
                        {completionRate.toFixed(1)}% conclusão
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium text-foreground">
                          {total}
                        </span>
                        <br />
                        Total de entregas
                      </div>
                      <div>
                        <span className="font-medium text-foreground">
                          {completed}
                        </span>
                        <br />
                        Concluídas
                      </div>
                      <div>
                        <span className="font-medium text-foreground">
                          R$ {revenue.toFixed(2)}
                        </span>
                        <br />
                        Receita gerada
                      </div>
                    </div>
                    <Progress value={completionRate} className="mt-2" />
                  </div>
                )
              )}

              {delivererStats.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    Nenhum dado de entregador disponível para o período
                    selecionado
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
