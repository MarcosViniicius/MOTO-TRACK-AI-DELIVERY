import React from "react";
import { cn } from "@/lib/utils";
import { Package, Users, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => {
  return (
    <div className={cn("text-center py-12 px-4", className)}>
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-gray-100 rounded-full">
          {icon || <Package className="h-12 w-12 text-gray-400" />}
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <Button
          onClick={action.onClick}
          className="inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Estados vazios específicos para o projeto
export const EmptyDeliveries: React.FC<{
  onCreateDelivery?: () => void;
  canCreate?: boolean;
}> = ({ onCreateDelivery, canCreate = true }) => {
  return (
    <EmptyState
      title="Nenhuma entrega encontrada"
      description={
        canCreate
          ? "Comece criando sua primeira entrega para gerenciar seus pedidos de forma eficiente."
          : "Não há entregas disponíveis no momento."
      }
      icon={<Package className="h-12 w-12 text-blue-400" />}
      action={
        canCreate && onCreateDelivery
          ? {
              label: "Criar primeira entrega",
              onClick: onCreateDelivery,
            }
          : undefined
      }
    />
  );
};

export const EmptyDeliverers: React.FC<{ onCreateDeliverer?: () => void }> = ({
  onCreateDeliverer,
}) => {
  return (
    <EmptyState
      title="Nenhum entregador cadastrado"
      description="Cadastre entregadores para começar a atribuir entregas e gerenciar sua equipe de delivery."
      icon={<Users className="h-12 w-12 text-green-400" />}
      action={
        onCreateDeliverer
          ? {
              label: "Cadastrar primeiro entregador",
              onClick: onCreateDeliverer,
            }
          : undefined
      }
    />
  );
};

export const EmptyReports: React.FC = () => {
  return (
    <EmptyState
      title="Nenhum relatório disponível"
      description="Os relatórios aparecerão aqui conforme você registrar entregas e atividades."
      icon={<FileText className="h-12 w-12 text-purple-400" />}
    />
  );
};
