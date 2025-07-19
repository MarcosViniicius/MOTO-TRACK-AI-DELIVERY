import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings,
  Bell,
  Palette,
  MapPin,
  DollarSign,
  Clock,
  Truck,
  Shield,
  Database,
  Mail,
  Smartphone,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface SystemSettingsProps {
  onSettingsChange: (settings: SystemSettings) => void;
  currentSettings?: SystemSettings;
}

export interface SystemSettings {
  // Configurações Gerais
  general: {
    businessName: string;
    businessAddress: string;
    businessPhone: string;
    businessEmail: string;
    timeZone: string;
    language: string;
    currency: string;
    defaultEstimatedTime: string;
  };

  // Configurações de Notificações
  notifications: {
    enableEmailNotifications: boolean;
    enableSMSNotifications: boolean;
    enablePushNotifications: boolean;
    notifyOnNewDelivery: boolean;
    notifyOnStatusChange: boolean;
    notifyOnDeliveryComplete: boolean;
    notifyOnDeliveryDelay: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
  };

  // Configurações de Tema
  theme: {
    primaryColor: string;
    secondaryColor: string;
    darkMode: boolean;
    compactView: boolean;
    showDelivererPhotos: boolean;
    showMapInCards: boolean;
  };

  // Configurações de Entregas
  delivery: {
    autoAssignDeliveries: boolean;
    maxDeliversPerDeliverer: number;
    requireCustomerConfirmation: boolean;
    allowPartialDeliveries: boolean;
    enableDeliveryTracking: boolean;
    enableCustomerRating: boolean;
    defaultPriority: string;
    enableGeofencing: boolean;
    maxDeliveryRadius: number;
  };

  // Configurações de Segurança
  security: {
    requireTwoFactor: boolean;
    sessionTimeout: number;
    allowMultipleLogins: boolean;
    enableAuditLog: boolean;
    enableDataEncryption: boolean;
    passwordComplexity: string;
  };

  // Configurações de Integração
  integrations: {
    enableWhatsAppAPI: boolean;
    whatsAppAPIKey: string;
    enableGoogleMaps: boolean;
    googleMapsAPIKey: string;
    enableSMSGateway: boolean;
    smsGatewayProvider: string;
    smsAPIKey: string;
    enableEmailService: boolean;
    emailProvider: string;
    emailAPIKey: string;
  };
}

const defaultSettings: SystemSettings = {
  general: {
    businessName: "MotoTrack AI",
    businessAddress: "",
    businessPhone: "",
    businessEmail: "",
    timeZone: "America/Sao_Paulo",
    language: "pt-BR",
    currency: "BRL",
    defaultEstimatedTime: "30-45 min",
  },
  notifications: {
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    enablePushNotifications: true,
    notifyOnNewDelivery: true,
    notifyOnStatusChange: true,
    notifyOnDeliveryComplete: true,
    notifyOnDeliveryDelay: true,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
  },
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    darkMode: false,
    compactView: false,
    showDelivererPhotos: true,
    showMapInCards: false,
  },
  delivery: {
    autoAssignDeliveries: false,
    maxDeliversPerDeliverer: 5,
    requireCustomerConfirmation: false,
    allowPartialDeliveries: false,
    enableDeliveryTracking: true,
    enableCustomerRating: true,
    defaultPriority: "normal",
    enableGeofencing: false,
    maxDeliveryRadius: 10,
  },
  security: {
    requireTwoFactor: false,
    sessionTimeout: 120,
    allowMultipleLogins: true,
    enableAuditLog: true,
    enableDataEncryption: true,
    passwordComplexity: "medium",
  },
  integrations: {
    enableWhatsAppAPI: false,
    whatsAppAPIKey: "",
    enableGoogleMaps: false,
    googleMapsAPIKey: "",
    enableSMSGateway: false,
    smsGatewayProvider: "twilio",
    smsAPIKey: "",
    enableEmailService: false,
    emailProvider: "sendgrid",
    emailAPIKey: "",
  },
};

export const SystemSettings = ({
  onSettingsChange,
  currentSettings,
}: SystemSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>(
    currentSettings || defaultSettings
  );
  const { addToast } = useToast();

  // Atualizar settings quando currentSettings mudar
  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    }
  }, [currentSettings]);

  const handleSave = () => {
    try {
      onSettingsChange(settings);

      // Salvar no localStorage
      localStorage.setItem("mototrack_settings", JSON.stringify(settings));

      addToast({
        type: "success",
        title: "Configurações salvas",
        message: "As configurações foram atualizadas com sucesso!",
      });

      setIsOpen(false);
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao salvar",
        message: "Ocorreu um erro ao salvar as configurações.",
      });
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    addToast({
      type: "info",
      title: "Configurações restauradas",
      message: "Todas as configurações foram restauradas para o padrão.",
    });
  };

  const updateSetting = (
    category: keyof SystemSettings,
    key: string,
    value: string | boolean | number
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Configurações do Sistema
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações do Sistema
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general" className="gap-1">
              <Settings className="h-3 w-3" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1">
              <Bell className="h-3 w-3" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="theme" className="gap-1">
              <Palette className="h-3 w-3" />
              Tema
            </TabsTrigger>
            <TabsTrigger value="delivery" className="gap-1">
              <Truck className="h-3 w-3" />
              Entregas
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1">
              <Shield className="h-3 w-3" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-1">
              <Database className="h-3 w-3" />
              Integrações
            </TabsTrigger>
          </TabsList>

          {/* Configurações Gerais */}
          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Nome do Negócio</Label>
                <Input
                  id="businessName"
                  value={settings.general.businessName}
                  onChange={(e) =>
                    updateSetting("general", "businessName", e.target.value)
                  }
                  placeholder="Nome da sua empresa"
                />
              </div>
              <div>
                <Label htmlFor="businessPhone">Telefone</Label>
                <Input
                  id="businessPhone"
                  value={settings.general.businessPhone}
                  onChange={(e) =>
                    updateSetting("general", "businessPhone", e.target.value)
                  }
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <Label htmlFor="businessEmail">E-mail</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={settings.general.businessEmail}
                  onChange={(e) =>
                    updateSetting("general", "businessEmail", e.target.value)
                  }
                  placeholder="contato@empresa.com"
                />
              </div>
              <div>
                <Label htmlFor="timeZone">Fuso Horário</Label>
                <Select
                  value={settings.general.timeZone}
                  onValueChange={(value) =>
                    updateSetting("general", "timeZone", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">
                      Brasília (GMT-3)
                    </SelectItem>
                    <SelectItem value="America/New_York">
                      Nova York (GMT-5)
                    </SelectItem>
                    <SelectItem value="Europe/London">
                      Londres (GMT+0)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currency">Moeda</Label>
                <Select
                  value={settings.general.currency}
                  onValueChange={(value) =>
                    updateSetting("general", "currency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                    <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="defaultEstimatedTime">
                  Tempo Estimado Padrão
                </Label>
                <Input
                  id="defaultEstimatedTime"
                  value={settings.general.defaultEstimatedTime}
                  onChange={(e) =>
                    updateSetting(
                      "general",
                      "defaultEstimatedTime",
                      e.target.value
                    )
                  }
                  placeholder="30-45 min"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="businessAddress">Endereço</Label>
              <Textarea
                id="businessAddress"
                value={settings.general.businessAddress}
                onChange={(e) =>
                  updateSetting("general", "businessAddress", e.target.value)
                }
                placeholder="Endereço completo da empresa"
                rows={2}
              />
            </div>
          </TabsContent>

          {/* Configurações de Notificações */}
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="enableEmailNotifications">
                  Notificações por E-mail
                </Label>
                <Switch
                  id="enableEmailNotifications"
                  checked={settings.notifications.enableEmailNotifications}
                  onCheckedChange={(checked) =>
                    updateSetting(
                      "notifications",
                      "enableEmailNotifications",
                      checked
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="enableSMSNotifications">
                  Notificações por SMS
                </Label>
                <Switch
                  id="enableSMSNotifications"
                  checked={settings.notifications.enableSMSNotifications}
                  onCheckedChange={(checked) =>
                    updateSetting(
                      "notifications",
                      "enableSMSNotifications",
                      checked
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="enablePushNotifications">
                  Notificações Push
                </Label>
                <Switch
                  id="enablePushNotifications"
                  checked={settings.notifications.enablePushNotifications}
                  onCheckedChange={(checked) =>
                    updateSetting(
                      "notifications",
                      "enablePushNotifications",
                      checked
                    )
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Label htmlFor="notifyOnNewDelivery">Nova Entrega</Label>
                <Switch
                  id="notifyOnNewDelivery"
                  checked={settings.notifications.notifyOnNewDelivery}
                  onCheckedChange={(checked) =>
                    updateSetting(
                      "notifications",
                      "notifyOnNewDelivery",
                      checked
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifyOnStatusChange">Mudança de Status</Label>
                <Switch
                  id="notifyOnStatusChange"
                  checked={settings.notifications.notifyOnStatusChange}
                  onCheckedChange={(checked) =>
                    updateSetting(
                      "notifications",
                      "notifyOnStatusChange",
                      checked
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifyOnDeliveryComplete">
                  Entrega Concluída
                </Label>
                <Switch
                  id="notifyOnDeliveryComplete"
                  checked={settings.notifications.notifyOnDeliveryComplete}
                  onCheckedChange={(checked) =>
                    updateSetting(
                      "notifications",
                      "notifyOnDeliveryComplete",
                      checked
                    )
                  }
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quietHoursStart">Início do Silêncio</Label>
                  <Input
                    id="quietHoursStart"
                    type="time"
                    value={settings.notifications.quietHoursStart}
                    onChange={(e) =>
                      updateSetting(
                        "notifications",
                        "quietHoursStart",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="quietHoursEnd">Fim do Silêncio</Label>
                  <Input
                    id="quietHoursEnd"
                    type="time"
                    value={settings.notifications.quietHoursEnd}
                    onChange={(e) =>
                      updateSetting(
                        "notifications",
                        "quietHoursEnd",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Outras abas seriam implementadas de forma similar... */}

          <TabsContent value="theme" className="space-y-4 mt-4">
            <div className="text-center py-8 text-gray-500">
              <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Configurações de tema em desenvolvimento...</p>
            </div>
          </TabsContent>

          <TabsContent value="delivery" className="space-y-4 mt-4">
            <div className="text-center py-8 text-gray-500">
              <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Configurações de entrega em desenvolvimento...</p>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 mt-4">
            <div className="text-center py-8 text-gray-500">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Configurações de segurança em desenvolvimento...</p>
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4 mt-4">
            <div className="text-center py-8 text-gray-500">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Configurações de integração em desenvolvimento...</p>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={handleReset}>
            Restaurar Padrões
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar Configurações</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
