import { useState } from "react";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { useDatabase, Deliverer, Delivery } from "@/hooks/useDatabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Truck,
  Users,
  Package,
  BarChart3,
  MapPin,
  Phone,
  Plus,
  Search,
  Bell,
  RefreshCw,
  Building,
  User,
  LogOut,
  Printer,
  MoreVertical,
  Edit,
  CheckCircle,
  DollarSign,
  FileText,
  Eye,
} from "lucide-react";
import { DeliveryModal } from "@/components/DeliveryModal";
import { DelivererModal } from "@/components/DelivererModal";
import { POSPrintModal } from "@/components/POSPrintModal";
import { DeliveryStatusModal } from "@/components/DeliveryStatusModal";
import { DelivererManagement } from "@/components/DelivererManagement";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { AccountRegistration } from "@/components/AccountRegistration";
import { POSExport } from "@/components/POSExport";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyDeliveries, EmptyDeliverers } from "@/components/ui/empty-state";
import { Feedback } from "@/components/ui/feedback";

// Tipos para as props dos modais
interface InitialLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: { email: string; password: string }) => void;
  onShowRegistration: () => void;
}

interface EstablishmentData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

interface ProfileSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVendedor: () => void;
  onSelectEntregador: (delivererId: string) => void;
  onLogout: () => void;
  establishmentName: string;
  currentUserType?: string;
  currentUserName?: string;
  deliverers: Deliverer[];
  establishmentId: string;
}

// Componente ProfileSwitcher local
const ProfileSwitcher = ({
  isOpen,
  onClose,
  onSelectVendedor,
  onSelectEntregador,
  onLogout,
  establishmentName,
  currentUserType,
  currentUserName,
  deliverers,
  establishmentId,
}: ProfileSwitcherProps) => {
  const [selectedDeliverer, setSelectedDeliverer] = useState("");

  // Filtrar entregadores do estabelecimento logado
  const establishmentDeliverers = deliverers.filter(
    (d) => d.establishmentId === establishmentId
  );
  const handleSwitchToEntregador = () => {
    if (!selectedDeliverer) {
      // Usar feedback em vez de alert básico
      return;
    }
    onSelectEntregador(selectedDeliverer);
    setSelectedDeliverer("");
    onClose();
  };

  const handleSwitchToVendedor = () => {
    onSelectVendedor();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {" "}
      <DialogContent className="sm:max-w-md max-w-[95vw] mx-4">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-center text-lg flex-1">
              <div className="flex items-center gap-2 justify-center">
                <RefreshCw className="h-5 w-5" />
                Alternar Perfil
              </div>
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Sair completamente"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            <strong>{establishmentName}</strong>
          </p>
          {currentUserType && (
            <p className="text-xs text-blue-600">
              Atual:{" "}
              {currentUserType === "vendedor"
                ? "Vendedor"
                : `Entregador (${currentUserName})`}
            </p>
          )}
        </div>{" "}
        <div className="space-y-4 py-4">
          <Button
            onClick={handleSwitchToVendedor}
            className="w-full h-16 text-lg flex flex-col gap-1 hover-lift"
            variant={currentUserType === "vendedor" ? "default" : "outline"}
            disabled={currentUserType === "vendedor"}
          >
            <Building className="h-6 w-6" />
            <span>Vendedor</span>
            <span className="text-xs opacity-75">
              Gerenciar entregas e entregadores
            </span>
          </Button>

          <div className="space-y-2">
            <Label htmlFor="deliverer">Entrar como Entregador:</Label>
            <Select
              value={selectedDeliverer}
              onValueChange={setSelectedDeliverer}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um entregador" />
              </SelectTrigger>
              <SelectContent>
                {establishmentDeliverers.map((deliverer) => (
                  <SelectItem key={deliverer.id} value={deliverer.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{deliverer.name}</span>
                      <span className="text-sm text-gray-500">
                        {deliverer.vehicle} - {deliverer.zone}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleSwitchToEntregador}
              className="w-full"
              variant="outline"
              disabled={
                !selectedDeliverer || establishmentDeliverers.length === 0
              }
            >
              <User className="h-4 w-4 mr-2" />
              Entrar como Entregador
            </Button>

            {establishmentDeliverers.length === 0 && (
              <p className="text-sm text-gray-500 text-center">
                Nenhum entregador cadastrado.
                <br />
                Cadastre entregadores na aba vendedor.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal de Login Inicial
const InitialLoginModal = ({
  isOpen,
  onClose,
  onLogin,
  onShowRegistration,
}: InitialLoginModalProps) => {
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
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-blue-100 rounded-full">
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
          Login - MotoTrack AI
        </h2>{" "}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Nome do Estabelecimento
            </label>
            <input
              type="text"
              value={credentials.email}
              onChange={(e) =>
                setCredentials((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Ex: Restaurante do João"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Entrar
          </button>
        </form>{" "}
        <div className="text-center pt-6 border-t border-gray-200 mt-6">
          <button
            onClick={onShowRegistration}
            className="text-blue-600 hover:text-blue-700 hover:underline text-sm font-medium transition-colors"
          >
            Não tem conta? Criar estabelecimento
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-600 hover:text-gray-800 hover:bg-gray-50 py-2 px-4 rounded-md transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

const MainApp = () => {
  const {
    user,
    authenticatedEstablishment,
    login,
    logout,
    setEstablishment,
    clearEstablishment,
    isAuthenticated,
    isEstablishmentAuthenticated,
  } = useAuth();

  const {
    deliveries,
    deliverers,
    establishments,
    addDelivery,
    updateDelivery,
    deleteDelivery,
    addDeliverer,
    updateDeliverer,
    deleteDeliverer,
    createEstablishment,
    authenticateEstablishment,
  } = useDatabase();
  // Estados para controle de modais
  const [isInitialLoginOpen, setIsInitialLoginOpen] = useState(false);
  const [isProfileSwitcherOpen, setIsProfileSwitcherOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isDelivererModalOpen, setIsDelivererModalOpen] = useState(false);
  const [isPOSPrintModalOpen, setIsPOSPrintModalOpen] = useState(false);
  const [isDeliveryStatusModalOpen, setIsDeliveryStatusModalOpen] =
    useState(false);
  const [editingDeliverer, setEditingDeliverer] = useState<Deliverer | null>(
    null
  );
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");

  // Estados para filtros de relatórios
  const [dateFilter, setDateFilter] = useState("todos");
  const [statusReportFilter, setStatusReportFilter] = useState("todos");
  const [paymentFilter, setPaymentFilter] = useState("todos");
  const [delivererFilter, setDelivererFilter] = useState("todos");

  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
  } | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("entregas");

  // Função para mostrar feedback
  const showFeedback = (
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    setFeedbackMessage({ type, message });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Funções de autenticação
  const handleInitialLogin = (credentials: {
    email: string;
    password: string;
  }) => {
    const establishment = authenticateEstablishment(
      credentials.email,
      credentials.password
    );
    if (establishment) {
      setEstablishment(establishment);
      setIsInitialLoginOpen(false);
      setIsProfileSwitcherOpen(true);
      showFeedback("success", `Bem-vindo, ${establishment.name}!`);
    } else {
      showFeedback("error", "Nome do estabelecimento ou senha incorretos");
    }
  };

  const handleSelectVendedor = () => {
    if (authenticatedEstablishment) {
      login({
        id: authenticatedEstablishment.id,
        type: "vendedor",
        name: authenticatedEstablishment.name,
        email: authenticatedEstablishment.email,
        establishmentId: authenticatedEstablishment.id,
      });
    }
  };

  const handleSelectEntregador = (delivererId: string) => {
    const deliverer = deliverers.find((d) => d.id === delivererId);
    if (deliverer && authenticatedEstablishment) {
      login({
        id: deliverer.id,
        type: "entregador",
        name: deliverer.name,
        email: deliverer.email,
        establishmentId: authenticatedEstablishment.id,
      });
    }
  };

  const handleCompleteLogout = () => {
    clearEstablishment();
    setIsProfileSwitcherOpen(false);
  };

  const handleSwitchProfile = () => {
    setIsProfileSwitcherOpen(true);
  };
  const handleRegister = (establishmentData: EstablishmentData) => {
    const newEstablishment = createEstablishment(establishmentData);
    if (newEstablishment) {
      setEstablishment(newEstablishment);
      setIsRegistrationOpen(false);
      setIsProfileSwitcherOpen(true);
      showFeedback("success", "Estabelecimento criado com sucesso!");
    } else {
      showFeedback("error", "Erro ao criar estabelecimento. Tente novamente.");
    }
  };

  // Funções para gerenciar entregas
  const handleEditDelivery = (delivery: Delivery) => {
    setEditingDelivery(delivery);
    setIsDeliveryModalOpen(true);
  };
  const handleUpdateDeliveryStatus = (
    deliveryId: number | string,
    status: string,
    notes?: string
  ) => {
    const id = typeof deliveryId === "string" ? Number(deliveryId) : deliveryId;
    updateDelivery(id, { status });
    showFeedback("success", `Status da entrega atualizado`);
  };

  const handleDeleteDelivery = (deliveryId: number | string) => {
    const id = typeof deliveryId === "string" ? Number(deliveryId) : deliveryId;
    deleteDelivery(id);
    showFeedback("success", "Entrega excluída com sucesso");
  };
  const handleOpenDeliveryStatus = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsDeliveryStatusModalOpen(true);
  };

  // Dados derivados
  const currentEstablishmentDeliveries = deliveries.filter(
    (d) => d.establishmentId === authenticatedEstablishment?.id
  );

  const currentEstablishmentDeliverers = deliverers.filter(
    (d) => d.establishmentId === authenticatedEstablishment?.id
  );

  const notifications = [
    {
      id: "1",
      type: "delivery" as const,
      title: "Nova entrega criada",
      message: "Entrega #001 foi criada com sucesso",
      timestamp: new Date(),
      read: false,
    },
  ];

  const stats = {
    totalDeliveries: currentEstablishmentDeliveries.length,
    pendingDeliveries: currentEstablishmentDeliveries.filter(
      (d) => d.status === "pendente"
    ).length,
    completedDeliveries: currentEstablishmentDeliveries.filter(
      (d) => d.status === "entregue"
    ).length,
    activeDeliverers: currentEstablishmentDeliverers.filter(
      (d) => d.status === "disponivel"
    ).length,
  };

  // Filtro para mostrar apenas entregas pendentes ou em rota
  const activeDeliveries = currentEstablishmentDeliveries.filter(
    (delivery) =>
      delivery.status === "pendente" || delivery.status === "em_andamento"
  );

  // Função para filtrar entregas dos relatórios
  const filteredReportDeliveries = currentEstablishmentDeliveries.filter(
    (delivery) => {
      // Filtro de data
      if (dateFilter !== "todos") {
        const deliveryDate = new Date(delivery.createdAt || Date.now());
        const today = new Date();
        switch (dateFilter) {
          case "hoje":
            if (deliveryDate.toDateString() !== today.toDateString())
              return false;
            break;
          case "ontem": {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            if (deliveryDate.toDateString() !== yesterday.toDateString())
              return false;
            break;
          }
          case "semana": {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            if (deliveryDate < weekAgo) return false;
            break;
          }
          case "mes": {
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            if (deliveryDate < monthAgo) return false;
            break;
          }
        }
      }

      // Filtro de status
      if (
        statusReportFilter !== "todos" &&
        delivery.status !== statusReportFilter
      ) {
        return false;
      }

      // Filtro de forma de pagamento
      if (
        paymentFilter !== "todos" &&
        delivery.paymentMethod !== paymentFilter
      ) {
        return false;
      }

      // Filtro de entregador
      if (
        delivererFilter !== "todos" &&
        delivery.assignedTo !== delivererFilter
      ) {
        return false;
      }

      return true;
    }
  );

  // Se não há estabelecimento autenticado, mostra tela de login
  if (!isEstablishmentAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-blue-600">
              MotoTrack AI
            </CardTitle>
            <CardDescription>
              Sistema Completo de Controle de Entregas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setIsInitialLoginOpen(true)}
              className="w-full"
              size="lg"
            >
              Fazer Login
            </Button>
          </CardContent>
        </Card>

        <InitialLoginModal
          isOpen={isInitialLoginOpen}
          onClose={() => setIsInitialLoginOpen(false)}
          onLogin={handleInitialLogin}
          onShowRegistration={() => {
            setIsInitialLoginOpen(false);
            setIsRegistrationOpen(true);
          }}
        />

        {isRegistrationOpen && (
          <AccountRegistration
            isOpen={isRegistrationOpen}
            onClose={() => setIsRegistrationOpen(false)}
            onRegister={handleRegister}
          />
        )}
      </div>
    );
  }

  // Se há estabelecimento autenticado mas não há usuário logado, mostra seletor de perfil
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-blue-600">
              Bem-vindo, {authenticatedEstablishment.name}!
            </CardTitle>
            <CardDescription>
              Escolha como deseja acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setIsProfileSwitcherOpen(true)}
              className="w-full"
              size="lg"
            >
              Selecionar Perfil
            </Button>
          </CardContent>
        </Card>

        {isProfileSwitcherOpen && (
          <ProfileSwitcher
            isOpen={isProfileSwitcherOpen}
            onClose={() => setIsProfileSwitcherOpen(false)}
            onSelectVendedor={handleSelectVendedor}
            onSelectEntregador={handleSelectEntregador}
            onLogout={handleCompleteLogout}
            establishmentName={authenticatedEstablishment.name}
            deliverers={currentEstablishmentDeliverers}
            establishmentId={authenticatedEstablishment.id}
          />
        )}
      </div>
    );
  }
  // Interface principal com usuário logado
  return (
    <div className="min-h-screen bg-gray-50 fade-in">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:h-16 gap-4 sm:gap-0">
            <div className="flex items-center space-x-3">
              <Truck className="h-8 w-8 text-blue-600" />{" "}
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 text-break">
                  MotoTrack AI - {authenticatedEstablishment.name}
                </h1>
                <p className="text-sm text-gray-500 text-break">
                  {user.type === "vendedor"
                    ? "Modo: Vendedor"
                    : `Modo: Entregador (${user.name})`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              {/* Botão para alternar perfil */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwitchProfile}
                className="flex items-center gap-2 flex-1 sm:flex-initial"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Trocar Perfil</span>
                <span className="sm:hidden">Perfil</span>
              </Button>

              <Button
                variant="outline"
                onClick={logout}
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                <span className="hidden sm:inline">Sair do Perfil</span>
                <span className="sm:hidden">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>{" "}
      {/* Dashboard Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Feedback Messages */}
        {feedbackMessage && (
          <Feedback
            type={feedbackMessage.type}
            message={feedbackMessage.message}
            onClose={() => setFeedbackMessage(null)}
            className="mb-6"
          />
        )}

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Total de Entregas
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {stats.totalDeliveries}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Entregas Pendentes
              </CardTitle>
              <Package className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {stats.pendingDeliveries}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Entregas Concluídas
              </CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {stats.completedDeliveries}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Entregadores Ativos
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {stats.activeDeliverers}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <Card>
          <CardHeader>
            <CardTitle>Painel de Controle</CardTitle>
            <CardDescription>
              Gerencie suas entregas e entregadores de forma eficiente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="entregas">Entregas</TabsTrigger>
                <TabsTrigger value="entregadores">Entregadores</TabsTrigger>
                <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
              </TabsList>{" "}
              <TabsContent value="entregas" className="space-y-4">
                {" "}
                <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
                  <div className="flex items-center space-x-2 flex-1 max-w-md">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar entregas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    {/* Botão de Impressão POS */}
                    <Button
                      onClick={() => setIsPOSPrintModalOpen(true)}
                      variant="outline"
                      className="shrink-0"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Imprimir POS
                    </Button>
                    {user.type === "vendedor" && (
                      <Button
                        onClick={() => {
                          setEditingDelivery(null);
                          setIsDeliveryModalOpen(true);
                        }}
                        className="shrink-0"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Entrega
                      </Button>
                    )}
                  </div>
                </div>{" "}
                {/* Lista de Entregas */}
                <div className="space-y-4">
                  {activeDeliveries.length === 0 ? (
                    <EmptyDeliveries
                      onCreateDelivery={
                        user.type === "vendedor"
                          ? () => setIsDeliveryModalOpen(true)
                          : undefined
                      }
                      canCreate={user.type === "vendedor"}
                    />
                  ) : (
                    activeDeliveries
                      .filter((delivery) => {
                        // Aplicar filtro de busca se houver termo de pesquisa
                        if (searchTerm) {
                          return (
                            delivery.customerName
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            delivery.address
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            delivery.phone?.includes(searchTerm) ||
                            delivery.assignedToName
                              ?.toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          );
                        }
                        return true;
                      })
                      .map((delivery) => (
                        <Card
                          key={delivery.id}
                          className="hover:shadow-md transition-shadow"
                        >
                          {" "}
                          <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                              {/* Botão de Status Visível - Canto Superior Direito */}
                              <div className="flex justify-between items-start w-full">
                                <div className="space-y-2 flex-1">
                                  <h3 className="font-medium text-gray-900">
                                    {delivery.customerName}
                                  </h3>
                                  <p className="text-sm text-gray-600 flex items-start">
                                    <MapPin className="h-4 w-4 mr-1 mt-0.5 shrink-0" />
                                    <span className="break-words">
                                      {delivery.address}
                                    </span>
                                  </p>
                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                                    <span className="font-medium text-green-600">
                                      R$ {delivery.value.toFixed(2)}
                                    </span>
                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                      {delivery.paymentMethod}
                                    </span>
                                    <span className="text-blue-600">
                                      ⏱️ {delivery.estimatedTime}
                                    </span>
                                  </div>
                                </div>

                                {/* Botão de Status Grande e Visível */}
                                <Button
                                  onClick={() =>
                                    handleOpenDeliveryStatus(delivery)
                                  }
                                  variant={
                                    delivery.status === "entregue"
                                      ? "default"
                                      : delivery.status === "em_andamento"
                                      ? "secondary"
                                      : delivery.status === "cancelada"
                                      ? "destructive"
                                      : "outline"
                                  }
                                  className="ml-4 px-4 py-2 font-medium min-w-[100px] text-center"
                                  size="sm"
                                >
                                  {delivery.status === "pendente"
                                    ? "📋 Pendente"
                                    : delivery.status === "em_andamento"
                                    ? "🚛 Em Rota"
                                    : delivery.status === "entregue"
                                    ? "✅ Entregue"
                                    : "❌ Cancelada"}
                                </Button>
                              </div>
                            </div>

                            {/* Linha inferior com ações */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-4 pt-4 border-t">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                {delivery.assignedToName && (
                                  <span>👤 {delivery.assignedToName}</span>
                                )}
                                {delivery.observations && (
                                  <span>📝 Observações</span>
                                )}
                              </div>{" "}
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                {delivery.assignedToName && (
                                  <span>👤 {delivery.assignedToName}</span>
                                )}
                                {delivery.observations && (
                                  <span>📝 Observações</span>
                                )}
                              </div>
                              <div className="flex gap-1">
                                {delivery.phone && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      window.open(`tel:${delivery.phone}`)
                                    }
                                    className="shrink-0"
                                  >
                                    <Phone className="h-4 w-4" />
                                  </Button>
                                )}

                                {/* Menu de Ações */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="shrink-0"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {" "}
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleOpenDeliveryStatus(delivery)
                                      }
                                    >
                                      <Package className="h-4 w-4 mr-2" />
                                      Ver detalhes
                                    </DropdownMenuItem>
                                    {user.type === "vendedor" && (
                                      <>
                                        {" "}
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleEditDelivery(delivery)
                                          }
                                        >
                                          <Edit className="h-4 w-4 mr-2" />
                                          Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />{" "}
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleDeleteDelivery(delivery.id)
                                          }
                                          className="text-red-600"
                                        >
                                          <Truck className="h-4 w-4 mr-2" />
                                          Excluir
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  )}
                </div>
              </TabsContent>
              <TabsContent value="entregadores" className="space-y-4">
                {user.type === "vendedor" ? (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        Gerenciar Entregadores
                      </h3>
                      <Button
                        onClick={() => {
                          setEditingDeliverer(null);
                          setIsDelivererModalOpen(true); // Corrigido
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Entregador
                      </Button>
                    </div>{" "}
                    <div className="space-y-4">
                      {currentEstablishmentDeliverers.length === 0 ? (
                        <EmptyDeliverers
                          onCreateDeliverer={() => {
                            setEditingDeliverer(null);
                            setIsDelivererModalOpen(true);
                          }}
                        />
                      ) : (
                        currentEstablishmentDeliverers.map((deliverer) => (
                          <Card
                            key={deliverer.id}
                            className="hover:shadow-md transition-shadow"
                          >
                            <CardContent className="pt-6">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                <div className="space-y-2 flex-1">
                                  <h3 className="font-medium text-gray-900">
                                    {deliverer.name}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    🏍️ {deliverer.vehicle} - 📍 {deliverer.zone}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                                    {deliverer.phone && (
                                      <span className="flex items-center gap-1">
                                        📞{" "}
                                        <span className="break-all">
                                          {deliverer.phone}
                                        </span>
                                      </span>
                                    )}
                                    {deliverer.email && (
                                      <span className="flex items-center gap-1">
                                        📧{" "}
                                        <span className="break-all">
                                          {deliverer.email}
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                  <Badge
                                    variant={
                                      deliverer.status === "disponivel"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="whitespace-nowrap"
                                  >
                                    {deliverer.status === "disponivel"
                                      ? "Disponível"
                                      : "Ocupado"}
                                  </Badge>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingDeliverer(deliverer);
                                      setIsDelivererModalOpen(true);
                                    }}
                                    className="shrink-0"
                                  >
                                    Editar
                                  </Button>
                                </div>{" "}
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Acesso restrito. Entre como vendedor para gerenciar
                    entregadores.
                  </div>
                )}
              </TabsContent>
              <TabsContent value="relatorios" className="space-y-6">
                {/* Filtros de Relatórios */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Filtros de Relatórios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Filtro de Data */}
                      <div>
                        <Label htmlFor="dateFilter">Período</Label>
                        <Select
                          value={dateFilter}
                          onValueChange={setDateFilter}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar período" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hoje">Hoje</SelectItem>
                            <SelectItem value="ontem">Ontem</SelectItem>
                            <SelectItem value="semana">Esta Semana</SelectItem>
                            <SelectItem value="mes">Este Mês</SelectItem>
                            <SelectItem value="todos">
                              Todos os Períodos
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Filtro de Status */}
                      <div>
                        <Label htmlFor="statusReportFilter">Status</Label>
                        <Select
                          value={statusReportFilter}
                          onValueChange={setStatusReportFilter}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Filtrar por status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">
                              Todos os Status
                            </SelectItem>
                            <SelectItem value="pendente">Pendentes</SelectItem>
                            <SelectItem value="em_andamento">
                              Em Rota
                            </SelectItem>
                            <SelectItem value="entregue">Entregues</SelectItem>
                            <SelectItem value="cancelada">
                              Canceladas
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Filtro de Forma de Pagamento */}
                      <div>
                        <Label htmlFor="paymentFilter">
                          Forma de Pagamento
                        </Label>
                        <Select
                          value={paymentFilter}
                          onValueChange={setPaymentFilter}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Filtrar pagamento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">
                              Todas as Formas
                            </SelectItem>
                            <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                            <SelectItem value="PIX">PIX</SelectItem>
                            <SelectItem value="Cartão de Crédito">
                              Cartão de Crédito
                            </SelectItem>
                            <SelectItem value="Cartão de Débito">
                              Cartão de Débito
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Filtro de Entregador */}
                      <div>
                        <Label htmlFor="delivererFilter">Entregador</Label>
                        <Select
                          value={delivererFilter}
                          onValueChange={setDelivererFilter}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Filtrar por entregador" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">
                              Todos os Entregadores
                            </SelectItem>
                            {currentEstablishmentDeliverers.map((deliverer) => (
                              <SelectItem
                                key={deliverer.id}
                                value={deliverer.id}
                              >
                                {deliverer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Estatísticas dos Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center">
                        <Package className="h-8 w-8 text-blue-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">
                            Total de Entregas
                          </p>
                          <p className="text-2xl font-bold">
                            {filteredReportDeliveries.length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">
                            Entregues
                          </p>
                          <p className="text-2xl font-bold text-green-600">
                            {
                              filteredReportDeliveries.filter(
                                (d) => d.status === "entregue"
                              ).length
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center">
                        <Truck className="h-8 w-8 text-orange-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">
                            Em Rota
                          </p>
                          <p className="text-2xl font-bold text-orange-600">
                            {
                              filteredReportDeliveries.filter(
                                (d) => d.status === "em_andamento"
                              ).length
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center">
                        <DollarSign className="h-8 w-8 text-green-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">
                            Valor Total
                          </p>
                          <p className="text-2xl font-bold text-green-600">
                            R${" "}
                            {filteredReportDeliveries
                              .filter((d) => d.status === "entregue")
                              .reduce((sum, d) => sum + d.value, 0)
                              .toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Lista de Entregas Filtradas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Entregas Encontradas ({filteredReportDeliveries.length})
                      </span>
                      <Button
                        onClick={() => setIsPOSPrintModalOpen(true)}
                        variant="outline"
                        size="sm"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimir Relatório
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredReportDeliveries.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>
                          Nenhuma entrega encontrada com os filtros
                          selecionados.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredReportDeliveries.map((delivery) => (
                          <div
                            key={delivery.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">
                                  {delivery.customerName}
                                </h4>
                                <Badge
                                  variant={
                                    delivery.status === "entregue"
                                      ? "default"
                                      : delivery.status === "em_andamento"
                                      ? "secondary"
                                      : delivery.status === "cancelada"
                                      ? "destructive"
                                      : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {delivery.status === "pendente"
                                    ? "Pendente"
                                    : delivery.status === "em_andamento"
                                    ? "Em Rota"
                                    : delivery.status === "entregue"
                                    ? "Entregue"
                                    : "Cancelada"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                {delivery.address}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                <span>💰 R$ {delivery.value.toFixed(2)}</span>
                                <span>💳 {delivery.paymentMethod}</span>
                                {delivery.assignedToName && (
                                  <span>👤 {delivery.assignedToName}</span>
                                )}
                                <span>
                                  📅{" "}
                                  {new Date(
                                    delivery.createdAt || Date.now()
                                  ).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3 sm:mt-0">
                              <Button
                                onClick={() =>
                                  handleOpenDeliveryStatus(delivery)
                                }
                                variant="outline"
                                size="sm"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {user.type === "vendedor" && (
                                <>
                                  <Button
                                    onClick={() => handleEditDelivery(delivery)}
                                    variant="outline"
                                    size="sm"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      {/* Modais */}
      {isProfileSwitcherOpen && (
        <ProfileSwitcher
          isOpen={isProfileSwitcherOpen}
          onClose={() => setIsProfileSwitcherOpen(false)}
          onSelectVendedor={handleSelectVendedor}
          onSelectEntregador={handleSelectEntregador}
          onLogout={handleCompleteLogout}
          establishmentName={authenticatedEstablishment.name}
          currentUserType={user?.type}
          currentUserName={user?.name}
          deliverers={currentEstablishmentDeliverers}
          establishmentId={authenticatedEstablishment.id}
        />
      )}
      {isDeliveryModalOpen && (
        <DeliveryModal
          isOpen={isDeliveryModalOpen}
          onClose={() => setIsDeliveryModalOpen(false)}
          onSave={(deliveryData) => {
            if (editingDelivery) {
              // Editar entrega existente
              const completeDeliveryData = {
                customerName: deliveryData.customerName,
                address: deliveryData.address,
                phone: deliveryData.phone,
                value: deliveryData.value,
                paymentMethod: deliveryData.paymentMethod,
                assignedTo: deliveryData.assignedTo,
                assignedToName: deliveryData.assignedTo
                  ? deliverers.find((d) => d.id === deliveryData.assignedTo)
                      ?.name || ""
                  : "",
                priority: deliveryData.priority,
                estimatedTime: deliveryData.estimatedTime,
                observations: deliveryData.observations,
              };
              updateDelivery(Number(editingDelivery.id), completeDeliveryData);
              setEditingDelivery(null);
              showFeedback("success", "Entrega atualizada com sucesso!");
            } else {
              // Criar nova entrega
              const completeDeliveryData = {
                customerName: deliveryData.customerName,
                address: deliveryData.address,
                phone: deliveryData.phone,
                value: deliveryData.value,
                paymentMethod: deliveryData.paymentMethod,
                assignedTo: deliveryData.assignedTo,
                assignedToName: deliveryData.assignedTo
                  ? deliverers.find((d) => d.id === deliveryData.assignedTo)
                      ?.name || ""
                  : "",
                priority: deliveryData.priority,
                estimatedTime: deliveryData.estimatedTime,
                observations: deliveryData.observations,
                status: "pendente" as const,
              };
              addDelivery(completeDeliveryData);
              showFeedback("success", "Entrega criada com sucesso!");
            }
            setIsDeliveryModalOpen(false);
          }}
          deliverers={currentEstablishmentDeliverers}
          delivery={editingDelivery}
        />
      )}
      {isDelivererModalOpen && (
        <DelivererModal
          isOpen={isDelivererModalOpen}
          onClose={() => {
            setIsDelivererModalOpen(false); // Corrigido
            setEditingDeliverer(null);
          }}
          onSave={(delivererData) => {
            const mappedData = {
              name: delivererData.name,
              email: delivererData.email || "",
              phone: delivererData.phone || "",
              vehicle: delivererData.vehicle,
              plate: delivererData.plate || "",
              status: delivererData.status,
              zone: delivererData.zone,
              establishmentId: authenticatedEstablishment?.id,
            };

            if (editingDeliverer) {
              updateDeliverer(editingDeliverer.id, mappedData);
              setEditingDeliverer(null);
            } else {
              addDeliverer(mappedData);
            }
            setIsDelivererModalOpen(false); // Corrigido
          }}
          deliverer={editingDeliverer}
        />
      )}
      {/* Modal de Impressão POS */}
      {isPOSPrintModalOpen && (
        <POSPrintModal
          isOpen={isPOSPrintModalOpen}
          onClose={() => setIsPOSPrintModalOpen(false)}
          deliveries={currentEstablishmentDeliveries}
          establishmentName={authenticatedEstablishment.name}
          userType={user.type}
          userName={user.name}
        />
      )}
      {/* Modal de Status da Entrega */}
      {isDeliveryStatusModalOpen && selectedDelivery && (
        <DeliveryStatusModal
          isOpen={isDeliveryStatusModalOpen}
          onClose={() => {
            setIsDeliveryStatusModalOpen(false);
            setSelectedDelivery(null);
          }}
          delivery={selectedDelivery}
          onUpdateStatus={handleUpdateDeliveryStatus}
          onEditDelivery={handleEditDelivery}
          onDeleteDelivery={handleDeleteDelivery}
          userType={user.type}
        />
      )}
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default Index;
