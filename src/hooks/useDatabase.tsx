import { useState, useEffect } from "react";

// Tipos para o banco de dados
export interface Delivery {
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
  establishmentId: string; // Para multi-tenant
}

export interface Deliverer {
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

export interface Establishment {
  id: string;
  name: string;
  email: string;
  password: string; // Em produção seria hash
  createdAt: string;
}

const STORAGE_KEYS = {
  deliveries: "mototrack_deliveries",
  deliverers: "mototrack_deliverers",
  establishments: "mototrack_establishments",
  currentEstablishment: "mototrack_current_establishment",
};

// Mock data inicial
const initialEstablishments: Establishment[] = [
  {
    id: "est_1",
    name: "Restaurante Demo",
    email: "admin@restaurante.com",
    password: "123456", // Em produção seria hash
    createdAt: "2024-06-20T10:00:00Z",
  },
];

const initialDeliverers: Deliverer[] = [
  {
    id: "1",
    name: "Carlos Oliveira",
    phone: "(11) 99999-1234",
    email: "carlos@email.com",
    vehicle: "moto",
    plate: "ABC-1234",
    zone: "centro",
    status: "disponivel",
    createdAt: "2024-06-20T10:00:00Z",
    establishmentId: "est_1",
  },
  {
    id: "2",
    name: "Ana Silva",
    phone: "(11) 99999-5678",
    email: "ana@email.com",
    vehicle: "bicicleta",
    plate: "",
    zone: "zona_norte",
    status: "ocupado",
    createdAt: "2024-06-19T14:30:00Z",
    establishmentId: "est_1",
  },
];

const initialDeliveries: Delivery[] = [
  {
    id: 1,
    customerName: "João Silva",
    address: "Rua das Flores, 123 - Centro",
    phone: "(11) 99999-1234",
    value: 45.9,
    paymentMethod: "pix",
    status: "pendente",
    priority: "normal",
    estimatedTime: "30-45 min",
    observations: "Casa amarela, portão azul",
    assignedTo: null,
    assignedToName: null,
    createdAt: "2024-06-22T10:30:00Z",
    establishmentId: "est_1",
  },
];

export const useDatabase = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [deliverers, setDeliverers] = useState<Deliverer[]>([]);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [currentEstablishment, setCurrentEstablishment] = useState<
    string | null
  >(null);

  // Carrega dados do localStorage na inicialização
  useEffect(() => {
    const savedDeliveries = localStorage.getItem(STORAGE_KEYS.deliveries);
    const savedDeliverers = localStorage.getItem(STORAGE_KEYS.deliverers);
    const savedEstablishments = localStorage.getItem(
      STORAGE_KEYS.establishments
    );
    const savedCurrentEstablishment = localStorage.getItem(
      STORAGE_KEYS.currentEstablishment
    );

    if (savedDeliveries) {
      setDeliveries(JSON.parse(savedDeliveries));
    } else {
      setDeliveries(initialDeliveries);
    }

    if (savedDeliverers) {
      setDeliverers(JSON.parse(savedDeliverers));
    } else {
      setDeliverers(initialDeliverers);
    }

    if (savedEstablishments) {
      setEstablishments(JSON.parse(savedEstablishments));
    } else {
      setEstablishments(initialEstablishments);
    }

    if (savedCurrentEstablishment) {
      setCurrentEstablishment(savedCurrentEstablishment);
    }
  }, []);

  // Salva no localStorage sempre que os dados mudam
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.deliveries, JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.deliverers, JSON.stringify(deliverers));
  }, [deliverers]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.establishments,
      JSON.stringify(establishments)
    );
  }, [establishments]);

  useEffect(() => {
    if (currentEstablishment) {
      localStorage.setItem(
        STORAGE_KEYS.currentEstablishment,
        currentEstablishment
      );
    }
  }, [currentEstablishment]);

  // Funções para gerenciar deliveries
  const addDelivery = (
    delivery: Omit<Delivery, "id" | "createdAt" | "establishmentId">
  ) => {
    const newDelivery: Delivery = {
      ...delivery,
      id: Math.max(...deliveries.map((d) => d.id), 0) + 1,
      createdAt: new Date().toISOString(),
      establishmentId: currentEstablishment || "est_1",
    };
    setDeliveries((prev) => [...prev, newDelivery]);
    return newDelivery;
  };

  const updateDelivery = (id: number, updates: Partial<Delivery>) => {
    setDeliveries((prev) =>
      prev.map((delivery) =>
        delivery.id === id ? { ...delivery, ...updates } : delivery
      )
    );
  };

  const deleteDelivery = (id: number) => {
    setDeliveries((prev) => prev.filter((delivery) => delivery.id !== id));
  };

  // Funções para gerenciar deliverers
  const addDeliverer = (
    deliverer: Omit<Deliverer, "id" | "createdAt" | "establishmentId">
  ) => {
    const newDeliverer: Deliverer = {
      ...deliverer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      establishmentId: currentEstablishment || "est_1",
    };
    setDeliverers((prev) => [...prev, newDeliverer]);
    return newDeliverer;
  };

  const updateDeliverer = (id: string, updates: Partial<Deliverer>) => {
    setDeliverers((prev) =>
      prev.map((deliverer) =>
        deliverer.id === id ? { ...deliverer, ...updates } : deliverer
      )
    );
  };

  const deleteDeliverer = (id: string) => {
    setDeliverers((prev) => prev.filter((deliverer) => deliverer.id !== id));
    // Remove assignments
    setDeliveries((prev) =>
      prev.map((delivery) =>
        delivery.assignedTo === id
          ? {
              ...delivery,
              assignedTo: null,
              assignedToName: null,
              status: "pendente",
            }
          : delivery
      )
    );
  };

  // Função para criar estabelecimento
  const createEstablishment = (
    establishmentData: Omit<Establishment, "id" | "createdAt">
  ) => {
    const newEstablishment: Establishment = {
      ...establishmentData,
      id: `est_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setEstablishments((prev) => [...prev, newEstablishment]);
    return newEstablishment;
  };

  // Função para autenticar estabelecimento
  const authenticateEstablishment = (name: string, password: string) => {
    const establishment = establishments.find(
      (est) => est.name === name && est.password === password
    );
    if (establishment) {
      setCurrentEstablishment(establishment.id);
      return establishment;
    }
    return null;
  };

  // Filtrar dados pelo estabelecimento atual
  const getFilteredDeliveries = () => {
    return deliveries.filter(
      (delivery) => delivery.establishmentId === currentEstablishment
    );
  };

  const getFilteredDeliverers = () => {
    return deliverers.filter(
      (deliverer) => deliverer.establishmentId === currentEstablishment
    );
  };

  return {
    // Dados
    deliveries: getFilteredDeliveries(),
    deliverers: getFilteredDeliverers(),
    establishments,
    currentEstablishment,

    // Funções CRUD
    addDelivery,
    updateDelivery,
    deleteDelivery,
    addDeliverer,
    updateDeliverer,
    deleteDeliverer,
    createEstablishment,
    authenticateEstablishment,
    setCurrentEstablishment,
  };
};
