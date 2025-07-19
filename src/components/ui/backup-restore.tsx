import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Shield,
  Archive,
  HardDrive,
  Cloud,
  FileText,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { SystemSettings } from "@/components/ui/system-settings";

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

interface Establishment {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface BackupData {
  deliveries: Delivery[];
  deliverers: Deliverer[];
  establishments: Establishment[];
  settings?: SystemSettings | Record<string, unknown>;
}

interface BackupRestoreProps {
  onBackup: () => Promise<BackupData>;
  onRestore: (data: BackupData) => Promise<void>;
  onClearData: () => Promise<void>;
  currentData?: {
    deliveries: number;
    deliverers: number;
    establishments: number;
  };
}

interface BackupFile {
  id: string;
  name: string;
  size: string;
  date: string;
  version: string;
  type: "manual" | "automatic";
  tables: string[];
  recordCount: number;
}

export const BackupRestore = ({
  onBackup,
  onRestore,
  onClearData,
  currentData,
}: BackupRestoreProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [backupNote, setBackupNote] = useState("");
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(
    localStorage.getItem("mototrack-auto-backup") === "true"
  );
  const [backupHistory, setBackupHistory] = useState<BackupFile[]>([]);
  const { addToast } = useToast();

  // Carregar histórico de backups do localStorage
  React.useEffect(() => {
    loadBackupHistory();
  }, []);

  const loadBackupHistory = () => {
    try {
      const history = localStorage.getItem("mototrack-backup-history");
      if (history) {
        setBackupHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error("Erro ao carregar histórico de backups:", error);
    }
  };

  const saveBackupToHistory = (backup: BackupFile) => {
    try {
      const newHistory = [backup, ...backupHistory].slice(0, 10); // Manter apenas 10 backups
      setBackupHistory(newHistory);
      localStorage.setItem(
        "mototrack-backup-history",
        JSON.stringify(newHistory)
      );
    } catch (error) {
      console.error("Erro ao salvar histórico de backup:", error);
    }
  };

  const toggleAutoBackup = () => {
    const newValue = !autoBackupEnabled;
    setAutoBackupEnabled(newValue);
    localStorage.setItem("mototrack-auto-backup", newValue.toString());

    if (newValue) {
      addToast({
        type: "success",
        title: "Backup automático ativado",
        message: "Backups serão criados automaticamente a cada 24 horas.",
      });
      scheduleAutoBackup();
    } else {
      addToast({
        type: "info",
        title: "Backup automático desativado",
        message: "Você precisará criar backups manualmente.",
      });
    }
  };

  const scheduleAutoBackup = () => {
    // Implementar backup automático (simplificado para demonstração)
    const lastAutoBackup = localStorage.getItem("mototrack-last-auto-backup");
    const now = new Date().getTime();
    const dayMs = 24 * 60 * 60 * 1000;

    if (!lastAutoBackup || now - parseInt(lastAutoBackup) > dayMs) {
      setTimeout(() => {
        if (autoBackupEnabled) {
          handleCreateBackup(true);
        }
      }, 5000); // 5 segundos para demonstração (em produção seria 24h)
    }
  };

  const handleCreateBackup = async (isAutomatic = false) => {
    try {
      setIsBackingUp(true);
      setBackupProgress(0);

      // Simular progresso do backup
      const progressInterval = setInterval(() => {
        setBackupProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 300);

      // Executar backup real
      const backupData = await onBackup();

      // Adicionar metadados do backup
      const completeBackup = {
        metadata: {
          version: "1.0.0",
          createdAt: new Date().toISOString(),
          note: isAutomatic
            ? "Backup automático"
            : backupNote || "Backup manual",
          recordCount:
            (backupData.deliveries?.length || 0) +
            (backupData.deliverers?.length || 0) +
            (backupData.establishments?.length || 0),
          type: isAutomatic ? "automatic" : "manual",
        },
        data: backupData,
      };

      // Salvar no histórico
      const backupFile: BackupFile = {
        id: Date.now().toString(),
        name: isAutomatic ? "Backup Automático" : backupNote || "Backup Manual",
        size: `${(JSON.stringify(completeBackup).length / 1024).toFixed(1)} KB`,
        date: new Date().toLocaleString("pt-BR"),
        version: "1.0.0",
        type: isAutomatic ? "automatic" : "manual",
        tables: ["deliveries", "deliverers", "establishments"],
        recordCount: completeBackup.metadata.recordCount,
      };

      saveBackupToHistory(backupFile);

      if (!isAutomatic) {
        // Criar e baixar arquivo apenas para backups manuais
        const blob = new Blob([JSON.stringify(completeBackup, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `mototrack-backup-${
          new Date().toISOString().replace(/[:.]/g, "-").split("T")[0]
        }.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      // Salvar backup no localStorage
      localStorage.setItem(
        `mototrack-backup-${backupFile.id}`,
        JSON.stringify(completeBackup)
      );

      if (isAutomatic) {
        localStorage.setItem(
          "mototrack-last-auto-backup",
          Date.now().toString()
        );
      }

      addToast({
        type: "success",
        title: isAutomatic
          ? "Backup automático criado"
          : "Backup criado com sucesso",
        message: isAutomatic
          ? "O backup foi salvo automaticamente."
          : "O arquivo de backup foi baixado para seu computador.",
      });

      setBackupNote("");
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro no backup",
        message: "Não foi possível criar o backup. Tente novamente.",
      });
    } finally {
      setIsBackingUp(false);
      setBackupProgress(0);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/json" || file.name.endsWith(".json")) {
        setSelectedFile(file);
      } else {
        addToast({
          type: "error",
          title: "Tipo de arquivo inválido",
          message: "Por favor, selecione um arquivo JSON de backup.",
        });
      }
    }
  };

  const handleRestore = async () => {
    if (!selectedFile) {
      addToast({
        type: "error",
        title: "Nenhum arquivo selecionado",
        message: "Por favor, selecione um arquivo de backup para restaurar.",
      });
      return;
    }

    try {
      setIsRestoring(true);
      setRestoreProgress(0);

      // Simular progresso da restauração
      const progressInterval = setInterval(() => {
        setRestoreProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 15;
        });
      }, 400);

      // Ler arquivo
      const fileContent = await selectedFile.text();
      const backupData = JSON.parse(fileContent);

      // Validar estrutura do backup
      if (!backupData.data || !backupData.metadata) {
        throw new Error("Arquivo de backup inválido");
      }

      // Executar restauração
      await onRestore(backupData.data);

      addToast({
        type: "success",
        title: "Dados restaurados com sucesso",
        message: "O sistema foi restaurado a partir do backup selecionado.",
      });

      setSelectedFile(null);
      setIsOpen(false);
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro na restauração",
        message:
          "Não foi possível restaurar os dados. Verifique o arquivo de backup.",
      });
    } finally {
      setIsRestoring(false);
      setRestoreProgress(0);
    }
  };

  const handleClearAllData = async () => {
    try {
      await onClearData();
      addToast({
        type: "success",
        title: "Dados limpos com sucesso",
        message: "Todos os dados foram removidos do sistema.",
      });
      setIsOpen(false);
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao limpar dados",
        message: "Não foi possível limpar os dados. Tente novamente.",
      });
    }
  };

  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024)
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleRestoreFromHistory = async (backupId: string) => {
    try {
      const backupData = localStorage.getItem(`mototrack-backup-${backupId}`);
      if (!backupData) {
        addToast({
          type: "error",
          title: "Backup não encontrado",
          message: "O backup selecionado não foi encontrado no histórico.",
        });
        return;
      }

      const backup = JSON.parse(backupData);
      if (!backup.data) {
        throw new Error("Estrutura de backup inválida");
      }

      await handleRestoreWithMetadata(backup.data, backup.metadata);
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro na restauração",
        message: "Não foi possível restaurar o backup selecionado.",
      });
    }
  };

  const handleDownloadFromHistory = (backupId: string, backupName: string) => {
    try {
      const backupData = localStorage.getItem(`mototrack-backup-${backupId}`);
      if (!backupData) {
        addToast({
          type: "error",
          title: "Backup não encontrado",
          message: "O backup selecionado não foi encontrado.",
        });
        return;
      }

      const blob = new Blob([backupData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${backupName.replace(/\s+/g, "-")}-${backupId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast({
        type: "success",
        title: "Download iniciado",
        message: "O arquivo de backup está sendo baixado.",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro no download",
        message: "Não foi possível baixar o backup.",
      });
    }
  };

  const handleDeleteFromHistory = (backupId: string) => {
    try {
      const newHistory = backupHistory.filter(
        (backup) => backup.id !== backupId
      );
      setBackupHistory(newHistory);
      localStorage.setItem(
        "mototrack-backup-history",
        JSON.stringify(newHistory)
      );
      localStorage.removeItem(`mototrack-backup-${backupId}`);

      addToast({
        type: "success",
        title: "Backup removido",
        message: "O backup foi removido do histórico.",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao remover",
        message: "Não foi possível remover o backup.",
      });
    }
  };

  const validateBackupFile = (
    backupData: unknown
  ): backupData is { data: BackupData; metadata: Record<string, unknown> } => {
    if (!backupData || typeof backupData !== "object") {
      return false;
    }

    const backup = backupData as Record<string, unknown>;
    if (!backup.data || !backup.metadata) {
      return false;
    }

    const data = backup.data as Record<string, unknown>;
    return (
      Array.isArray(data.deliveries) &&
      Array.isArray(data.deliverers) &&
      Array.isArray(data.establishments)
    );
  };

  const handleRestoreWithMetadata = async (
    data: BackupData,
    metadata?: Record<string, unknown>
  ) => {
    try {
      setIsRestoring(true);
      setRestoreProgress(0);

      // Simular progresso da restauração
      const progressInterval = setInterval(() => {
        setRestoreProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 15;
        });
      }, 400);

      // Executar restauração
      await onRestore(data);

      addToast({
        type: "success",
        title: "Dados restaurados com sucesso",
        message: `O sistema foi restaurado com ${
          data.deliveries?.length || 0
        } entregas e ${data.deliverers?.length || 0} entregadores.`,
      });

      setSelectedFile(null);
      setIsOpen(false);
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro na restauração",
        message:
          "Não foi possível restaurar os dados. Verifique o arquivo de backup.",
      });
    } finally {
      setIsRestoring(false);
      setRestoreProgress(0);
    }
  };

  // Função para exportar relatório de backup
  const exportBackupReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      systemStatus: {
        deliveries: currentData?.deliveries || 0,
        deliverers: currentData?.deliverers || 0,
        establishments: currentData?.establishments || 0,
      },
      backupHistory: backupHistory.map((backup) => ({
        ...backup,
        isAvailable: !!localStorage.getItem(`mototrack-backup-${backup.id}`),
      })),
      autoBackupEnabled,
      totalBackupSize:
        backupHistory
          .reduce((total, backup) => {
            const size = parseFloat(backup.size.replace(/[^\d.]/g, ""));
            return total + (isNaN(size) ? 0 : size);
          }, 0)
          .toFixed(1) + " KB",
      recommendations: generateBackupRecommendations(),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mototrack-backup-report-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast({
      type: "success",
      title: "Relatório exportado",
      message: "O relatório de backup foi baixado com sucesso.",
    });
  };

  const generateBackupRecommendations = () => {
    const recommendations = [];

    if (!autoBackupEnabled) {
      recommendations.push(
        "Ative o backup automático para maior segurança dos dados"
      );
    }

    if (backupHistory.length === 0) {
      recommendations.push("Crie seu primeiro backup para proteger seus dados");
    } else if (backupHistory.length < 3) {
      recommendations.push("Mantenha pelo menos 3 backups para redundância");
    }

    const lastBackup = backupHistory[0];
    if (lastBackup) {
      const daysSinceLastBackup = Math.floor(
        (Date.now() - new Date(lastBackup.date).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (daysSinceLastBackup > 7) {
        recommendations.push(
          "Último backup há mais de 7 dias - considere fazer um novo"
        );
      }
    }

    return recommendations;
  };

  const cleanupOldBackups = () => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 dias

      const oldBackups = backupHistory.filter(
        (backup) =>
          new Date(backup.date) < cutoffDate && backup.type === "automatic"
      );

      oldBackups.forEach((backup) => {
        handleDeleteFromHistory(backup.id);
      });

      if (oldBackups.length > 0) {
        addToast({
          type: "info",
          title: "Limpeza realizada",
          message: `${oldBackups.length} backups automáticos antigos foram removidos.`,
        });
      }
    } catch (error) {
      console.error("Erro ao limpar backups antigos:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Database className="h-4 w-4" />
          Backup e Restauração
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup e Restauração de Dados
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações do Sistema */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {currentData?.deliveries || 0}
                    </div>
                    <div className="text-sm text-blue-700">Entregas</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {currentData?.deliverers || 0}
                    </div>
                    <div className="text-sm text-green-700">Entregadores</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {backupHistory.length}
                    </div>
                    <div className="text-sm text-purple-700">Backups</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {
                        backupHistory.filter((b) => b.type === "automatic")
                          .length
                      }
                    </div>
                    <div className="text-sm text-orange-700">Automáticos</div>
                  </div>
                </div>

                {/* Controle de Backup Automático */}
                <div className="mt-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Backup Automático</h4>
                      <p className="text-sm text-muted-foreground">
                        Cria backups automaticamente a cada 24 horas
                      </p>
                    </div>
                    <Button
                      variant={autoBackupEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={toggleAutoBackup}
                      className="gap-2"
                    >
                      {autoBackupEnabled ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Ativado
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4" />
                          Desativado
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Criar Backup */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              <h3 className="font-medium">Criar Backup</h3>
            </div>

            <div className="p-4 border rounded-lg space-y-4">
              <div>
                <Label htmlFor="backupNote">Nota do Backup (opcional)</Label>
                <Textarea
                  id="backupNote"
                  value={backupNote}
                  onChange={(e) => setBackupNote(e.target.value)}
                  placeholder="Descreva o motivo deste backup..."
                  rows={3}
                />
              </div>

              {isBackingUp && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Criando backup...</span>
                    <span>{backupProgress}%</span>
                  </div>
                  <Progress value={backupProgress} />
                </div>
              )}

              <Button
                onClick={() => handleCreateBackup(false)}
                disabled={isBackingUp}
                className="w-full gap-2"
              >
                {isBackingUp ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Criando Backup...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Criar e Baixar Backup
                  </>
                )}
              </Button>

              <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-900">
                      O backup inclui:
                    </p>
                    <ul className="mt-1 space-y-0.5 text-blue-700">
                      <li>• Todas as entregas</li>
                      <li>• Dados dos entregadores</li>
                      <li>• Configurações do estabelecimento</li>
                      <li>• Preferências do sistema</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurar Backup */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <h3 className="font-medium">Restaurar Backup</h3>
            </div>

            <div className="p-4 border rounded-lg space-y-4">
              <div>
                <Label htmlFor="backupFile">Arquivo de Backup</Label>
                <Input
                  id="backupFile"
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="mt-1"
                />
                {selectedFile && (
                  <div className="mt-2 p-2 bg-green-50 rounded flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">
                        {selectedFile.name}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {formatFileSize(selectedFile.size)}
                    </Badge>
                  </div>
                )}
              </div>

              {isRestoring && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Restaurando dados...</span>
                    <span>{restoreProgress}%</span>
                  </div>
                  <Progress value={restoreProgress} />
                </div>
              )}

              <Button
                onClick={handleRestore}
                disabled={!selectedFile || isRestoring}
                className="w-full gap-2"
                variant="secondary"
              >
                {isRestoring ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Restaurando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Restaurar Dados
                  </>
                )}
              </Button>

              <div className="text-xs text-muted-foreground bg-yellow-50 p-3 rounded">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-yellow-900">Atenção:</p>
                    <p className="mt-1 text-yellow-700">
                      A restauração irá sobrescrever todos os dados atuais.
                      Recomendamos criar um backup antes de continuar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Histórico de Backups */}
        <div className="space-y-4">
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              <h3 className="font-medium">Histórico de Backups</h3>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportBackupReport}
                className="gap-2"
              >
                <FileText className="h-3 w-3" />
                Relatório
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={cleanupOldBackups}
                className="gap-2"
              >
                <Trash2 className="h-3 w-3" />
                Limpar Antigos
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadBackupHistory}
                className="gap-2"
              >
                <RefreshCw className="h-3 w-3" />
                Atualizar
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            {backupHistory.map((backup) => (
              <div key={backup.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{backup.name}</h4>
                      <Badge
                        variant={
                          backup.type === "manual" ? "default" : "secondary"
                        }
                      >
                        {backup.type === "manual" ? "Manual" : "Automático"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {backup.date} • {backup.size} • {backup.recordCount}{" "}
                      registros
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Tabelas: {backup.tables.join(", ")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() =>
                        handleDownloadFromHistory(backup.id, backup.name)
                      }
                    >
                      <Download className="h-3 w-3" />
                      Baixar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => handleRestoreFromHistory(backup.id)}
                    >
                      <Upload className="h-3 w-3" />
                      Restaurar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1"
                      onClick={() => handleDeleteFromHistory(backup.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                      Remover
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zona de Perigo */}
        <div className="space-y-4">
          <Separator />
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <h3 className="font-medium text-red-900">Zona de Perigo</h3>
            </div>

            <p className="text-sm text-red-700 mb-4">
              As ações abaixo são irreversíveis e podem causar perda de dados.
              Use com extrema cautela.
            </p>

            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="h-3 w-3" />
                    Limpar Todos os Dados
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Confirmar Limpeza de Dados
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação irá remover permanentemente todos os dados do
                      sistema, incluindo entregas, entregadores e configurações.
                      Esta ação não pode ser desfeita. Tem certeza que deseja
                      continuar?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearAllData}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Sim, Limpar Tudo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
