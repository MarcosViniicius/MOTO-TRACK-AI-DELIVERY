
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  StatusBar,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useStoredState } from '../hooks/useStoredState';
import { styles, colors } from '../styles/styles';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  openWhatsApp,
  openMaps,
  makeCall,
  copyToClipboard,
  shareText,
  getStatusColor,
  getStatusText,
  getPaymentMethodText,
  generateId
} from '../utils/helpers';

const { width } = Dimensions.get('window');

// Dados iniciais de exemplo
const initialDeliveries = [
  {
    id: 1,
    customerName: 'João Silva',
    address: 'Rua das Flores, 123 - Centro',
    phone: '11999999999',
    value: 45.90,
    paymentMethod: 'pix',
    status: 'pendente',
    observations: 'Portão azul, casa com jardim',
    assignedTo: null,
    createdAt: new Date().toISOString(),
    completedAt: null,
    coordinates: { lat: -23.550520, lng: -46.633308 }
  },
  {
    id: 2,
    customerName: 'Maria Santos',
    address: 'Av. Paulista, 456 - Bela Vista',
    phone: '11888888888',
    value: 67.50,
    paymentMethod: 'dinheiro',
    status: 'em_rota',
    observations: 'Apartamento 502, interfone 25',
    assignedTo: 'Carlos Oliveira',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: null,
    coordinates: { lat: -23.561684, lng: -46.655981 }
  },
  {
    id: 3,
    customerName: 'Pedro Oliveira',
    address: 'Rua Augusta, 789 - Consolação',
    phone: '11777777777',
    value: 23.40,
    paymentMethod: 'cartao',
    status: 'entregue',
    observations: '',
    assignedTo: 'Ana Silva',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    completedAt: new Date(Date.now() - 1800000).toISOString(),
    coordinates: { lat: -23.554142, lng: -46.662365 }
  },
  {
    id: 4,
    customerName: 'Cliente não identificado',
    address: 'Rua da Consolação, 321 - Centro',
    phone: '11666666666',
    value: 89.90,
    paymentMethod: 'pix',
    status: 'cancelada',
    observations: 'Cliente não atendeu após 3 tentativas',
    assignedTo: null,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    completedAt: null,
    coordinates: { lat: -23.543729, lng: -46.644123 }
  }
];

const MotoTrackApp = () => {
  const [userType, setUserType] = useStoredState('userType', null);
  const [deliveries, setDeliveries, isLoadingDeliveries] = useStoredState('deliveries', initialDeliveries);
  const [notifications, setNotifications, isLoadingNotifications] = useStoredState('notifications', []);
  
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNewDeliveryModal, setShowNewDeliveryModal] = useState(false);
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('entregas');
  
  // Form states
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    phone: '',
    value: '',
    paymentMethod: 'pix',
    observations: ''
  });

  useEffect(() => {
    // Simular notificações em tempo real
    const interval = setInterval(() => {
      const randomMessages = [
        'Nova entrega cadastrada por Maria',
        'Entrega #123 foi marcada como entregue',
        'João Silva está aguardando sua entrega',
        'Rota otimizada para suas entregas pendentes',
        'Lembrete: 3 entregas para hoje'
      ];
      
      const newNotification = {
        id: generateId(),
        message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        time: new Date().toISOString(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Simular carregamento
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = !searchText || 
      delivery.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchText.toLowerCase()) ||
      delivery.phone.includes(searchText);
    
    const matchesFilter = selectedFilter === 'todos' || delivery.status === selectedFilter;
    
    const matchesUserType = userType === 'vendedor' || 
      (userType === 'entregador' && delivery.assignedTo === 'Carlos Oliveira');
    
    return matchesSearch && matchesFilter && matchesUserType;
  });

  const getStatistics = () => {
    const stats = {
      pendentes: deliveries.filter(d => d.status === 'pendente').length,
      emRota: deliveries.filter(d => d.status === 'em_rota').length,
      entregues: deliveries.filter(d => d.status === 'entregue').length,
      faturamento: deliveries
        .filter(d => d.status === 'entregue')
        .reduce((sum, d) => sum + d.value, 0)
    };
    return stats;
  };

  const handleCreateDelivery = async () => {
    if (!formData.address) {
      Alert.alert('Erro', 'Endereço é obrigatório');
      return;
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const newDelivery = {
      id: generateId(),
      customerName: formData.customerName || 'Cliente não identificado',
      address: formData.address,
      phone: formData.phone,
      value: parseFloat(formData.value) || 0,
      paymentMethod: formData.paymentMethod,
      status: 'pendente',
      observations: formData.observations,
      assignedTo: null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      coordinates: { lat: -23.550520, lng: -46.633308 }
    };

    setDeliveries([newDelivery, ...deliveries]);
    setShowNewDeliveryModal(false);
    setFormData({
      customerName: '',
      address: '',
      phone: '',
      value: '',
      paymentMethod: 'pix',
      observations: ''
    });

    const notification = {
      id: generateId(),
      message: `Nova entrega criada: ${newDelivery.customerName}`,
      time: new Date().toISOString(),
      read: false
    };
    setNotifications([notification, ...notifications]);
  };

  const handleUpdateStatus = async (deliveryId, newStatus) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setDeliveries(deliveries.map(delivery => {
      if (delivery.id === deliveryId) {
        return {
          ...delivery,
          status: newStatus,
          completedAt: newStatus === 'entregue' ? new Date().toISOString() : null,
          assignedTo: newStatus === 'em_rota' && !delivery.assignedTo ? 'Carlos Oliveira' : delivery.assignedTo
        };
      }
      return delivery;
    }));

    const delivery = deliveries.find(d => d.id === deliveryId);
    const notification = {
      id: generateId(),
      message: `Entrega de ${delivery.customerName} marcada como ${getStatusText(newStatus)}`,
      time: new Date().toISOString(),
      read: false
    };
    setNotifications([notification, ...notifications]);
  };

  const exportSourceCode = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const sourceCode = `
# MotoTrack AI - Código Fonte Completo

## Estatísticas Atuais
- Entregas Pendentes: ${getStatistics().pendentes}
- Em Rota: ${getStatistics().emRota}
- Entregues: ${getStatistics().entregues}
- Faturamento: ${formatCurrency(getStatistics().faturamento)}

## Dados das Entregas
${JSON.stringify(deliveries, null, 2)}

## Tecnologias Utilizadas
- React Native + Expo
- AsyncStorage para persistência
- Expo Vector Icons
- Haptic Feedback
- Integração nativa (WhatsApp, Maps, Telefone)

Desenvolvido com ❤️ pela equipe MotoTrack AI
`;
    
    await shareText(sourceCode);
  };

  if (isLoadingDeliveries || isLoadingNotifications) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.emptyStateText, { marginTop: 16 }]}>
            Carregando MotoTrack AI...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userType) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={styles.loginContainer}>
          <View style={styles.loginCard}>
            <View style={styles.logo}>
              <Ionicons name="car-outline" size={64} color={colors.primary} />
              <Text style={styles.logoTitle}>MotoTrack AI</Text>
              <Text style={styles.logoSubtitle}>Sistema de Controle de Entregas</Text>
            </View>
            
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setUserType('vendedor');
              }}
            >
              <Text style={styles.loginButtonText}>Entrar como Vendedor</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.loginButton, styles.loginButtonSecondary]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setUserType('entregador');
              }}
            >
              <Text style={[styles.loginButtonText, styles.loginButtonTextSecondary]}>
                Entrar como Entregador
              </Text>
            </TouchableOpacity>
            
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success, marginRight: 8 }} />
                <Text style={{ fontSize: 12, color: colors.textLight }}>Sistema Online</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const stats = getStatistics();

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>
            {userType === 'vendedor' ? 'Dashboard Vendedor' : 'Minhas Entregas'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {formatDate(new Date())} • {userType === 'entregador' ? 'Carlos Oliveira' : 'Sistema Online'}
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowNotifications(!showNotifications);
            }}
            style={{ marginRight: 12, position: 'relative' }}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            {notifications.filter(n => !n.read).length > 0 && (
              <View style={{
                position: 'absolute',
                top: -2,
                right: -2,
                backgroundColor: colors.danger,
                borderRadius: 8,
                width: 16,
                height: 16,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{ color: colors.white, fontSize: 10, fontWeight: 'bold' }}>
                  {notifications.filter(n => !n.read).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setUserType(null);
            }}
          >
            <Ionicons name="log-out-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar entregas..."
          placeholderTextColor={colors.textLight}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
    </View>
  );

  const renderFilters = () => {
    const filters = [
      { key: 'todos', label: 'Todos' },
      { key: 'pendente', label: 'Pendentes' },
      { key: 'em_rota', label: 'Em Rota' },
      { key: 'entregue', label: 'Entregues' },
      { key: 'cancelada', label: 'Canceladas' }
    ];

    return (
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterPill,
                selectedFilter === filter.key && styles.filterPillActive
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedFilter(filter.key);
              }}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter.key && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderStats = () => {
    if (userType !== 'vendedor') return null;

    const statCards = [
      {
        title: 'Pendentes',
        value: stats.pendentes,
        color: colors.warning,
        icon: 'time-outline'
      },
      {
        title: 'Em Rota',
        value: stats.emRota,
        color: colors.primary,
        icon: 'car-outline'
      },
      {
        title: 'Entregues',
        value: stats.entregues,
        color: colors.success,
        icon: 'checkmark-circle-outline'
      },
      {
        title: 'Faturamento',
        value: formatCurrency(stats.faturamento),
        color: colors.purple,
        icon: 'card-outline'
      }
    ];

    return (
      <View style={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <View key={index} style={[styles.statCard, { borderLeftWidth: 4, borderLeftColor: stat.color }]}>
            <Text style={styles.statNumber}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.title}</Text>
            <Ionicons
              name={stat.icon}
              size={24}
              color={stat.color}
              style={styles.statIcon}
            />
          </View>
        ))}
      </View>
    );
  };

  const renderDeliveryCard = ({ item: delivery }) => (
    <TouchableOpacity
      style={styles.deliveryCard}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowDeliveryDetails(delivery);
      }}
    >
      <View style={styles.deliveryHeader}>
        <Text style={styles.deliveryName}>{delivery.customerName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(delivery.status) }]}>
          <Text style={styles.statusText}>{getStatusText(delivery.status)}</Text>
        </View>
      </View>
      
      <View style={styles.deliveryInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color={colors.textLight} />
          <Text style={styles.infoText}>{delivery.address}</Text>
        </View>
        
        {delivery.phone && (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color={colors.textLight} />
            <Text style={styles.infoText}>{delivery.phone}</Text>
          </View>
        )}
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <Text style={styles.valueText}>{formatCurrency(delivery.value)}</Text>
          <Text style={styles.paymentText}>{getPaymentMethodText(delivery.paymentMethod)}</Text>
        </View>
        
        {delivery.observations && (
          <Text style={styles.observationsText}>📝 {delivery.observations}</Text>
        )}
        
        {delivery.assignedTo && (
          <Text style={styles.assignedText}>👤 Atribuído a: {delivery.assignedTo}</Text>
        )}
      </View>
      
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openWhatsApp(delivery.phone, `Olá ${delivery.customerName}, sua entrega está a caminho!`)}
        >
          <Ionicons name="logo-whatsapp" size={16} color={colors.textLight} />
          <Text style={styles.actionButtonText}>WhatsApp</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openMaps(delivery.address)}
        >
          <Ionicons name="map-outline" size={16} color={colors.textLight} />
          <Text style={styles.actionButtonText}>Navegação</Text>
        </TouchableOpacity>
        
        {delivery.status === 'pendente' && userType === 'vendedor' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={() => handleUpdateStatus(delivery.id, 'em_rota')}
          >
            <Ionicons name="car-outline" size={16} color={colors.white} />
            <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>Enviar</Text>
          </TouchableOpacity>
        )}
        
        {delivery.status === 'em_rota' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSuccess]}
            onPress={() => handleUpdateStatus(delivery.id, 'entregue')}
          >
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.white} />
            <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>Entregue</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderDeliveryList = () => (
    <View style={styles.listContainer}>
      <FlatList
        data={filteredDeliveries}
        renderItem={renderDeliveryCard}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyStateText}>
              {searchText || selectedFilter !== 'todos' 
                ? 'Nenhuma entrega encontrada com os filtros aplicados'
                : 'Nenhuma entrega cadastrada ainda'
              }
            </Text>
          </View>
        )}
      />
    </View>
  );

  const renderTabBar = () => {
    const tabs = [
      { key: 'entregas', label: 'Entregas', icon: 'list-outline' },
      { key: 'historico', label: 'Histórico', icon: 'time-outline' },
      { key: 'perfil', label: 'Perfil', icon: 'person-outline' }
    ];

    return (
      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveTab(tab.key);
            }}
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={activeTab === tab.key ? colors.primary : colors.textLight}
            />
            <Text style={[
              styles.tabLabel,
              activeTab === tab.key && styles.tabLabelActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {renderHeader()}
      {renderFilters()}
      {renderStats()}
      {renderDeliveryList()}
      {renderTabBar()}
      
      {/* Notifications Dropdown */}
      {showNotifications && (
        <View style={styles.notificationDropdown}>
          <Text style={[styles.modalTitle, { marginBottom: 12, textAlign: 'left' }]}>
            Notificações
          </Text>
          {notifications.length === 0 ? (
            <Text style={styles.emptyStateText}>Nenhuma notificação</Text>
          ) : (
            notifications.slice(0, 5).map(notification => (
              <View key={notification.id} style={styles.notificationItem}>
                <Text style={styles.notificationText}>{notification.message}</Text>
                <Text style={styles.notificationTime}>
                  {formatDateTime(notification.time)}
                </Text>
              </View>
            ))
          )}
          
          <TouchableOpacity
            style={[styles.primaryButton, { marginTop: 12 }]}
            onPress={exportSourceCode}
          >
            <Text style={styles.primaryButtonText}>📥 Exportar Código Fonte</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* FAB for new delivery */}
      {userType === 'vendedor' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setShowNewDeliveryModal(true);
          }}
        >
          <Ionicons name="add" size={28} color={colors.white} />
        </TouchableOpacity>
      )}
      
      {/* New Delivery Modal */}
      <Modal
        visible={showNewDeliveryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNewDeliveryModal(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Entrega</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nome do Cliente (opcional)</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.customerName}
                  onChangeText={(text) => setFormData({...formData, customerName: text})}
                  placeholder="Digite o nome do cliente"
                  placeholderTextColor={colors.textLight}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Endereço *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.address}
                  onChangeText={(text) => setFormData({...formData, address: text})}
                  placeholder="Digite o endereço completo"
                  placeholderTextColor={colors.textLight}
                  multiline
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Telefone</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({...formData, phone: text})}
                  placeholder="(11) 99999-9999"
                  placeholderTextColor={colors.textLight}
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Valor</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.value}
                  onChangeText={(text) => setFormData({...formData, value: text})}
                  placeholder="0,00"
                  placeholderTextColor={colors.textLight}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Observações</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  value={formData.observations}
                  onChangeText={(text) => setFormData({...formData, observations: text})}
                  placeholder="Observações adicionais..."
                  placeholderTextColor={colors.textLight}
                  multiline
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.secondaryButton, { flex: 1 }]}
                onPress={() => setShowNewDeliveryModal(false)}
              >
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.primaryButton, { flex: 1 }]}
                onPress={handleCreateDelivery}
              >
                <Text style={styles.primaryButtonText}>Criar Entrega</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Delivery Details Modal */}
      <Modal
        visible={!!showDeliveryDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDeliveryDetails(null)}
      >
        {showDeliveryDetails && (
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalhes da Entrega</Text>
              
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Cliente</Text>
                  <Text style={styles.infoText}>{showDeliveryDetails.customerName}</Text>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Endereço</Text>
                  <Text style={styles.infoText}>{showDeliveryDetails.address}</Text>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Telefone</Text>
                  <Text style={styles.infoText}>{showDeliveryDetails.phone || 'Não informado'}</Text>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Valor</Text>
                  <Text style={[styles.infoText, { fontSize: 18, fontWeight: 'bold', color: colors.success }]}>
                    {formatCurrency(showDeliveryDetails.value)}
                  </Text>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Método de Pagamento</Text>
                  <Text style={styles.infoText}>{getPaymentMethodText(showDeliveryDetails.paymentMethod)}</Text>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Status</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(showDeliveryDetails.status), alignSelf: 'flex-start' }]}>
                    <Text style={styles.statusText}>{getStatusText(showDeliveryDetails.status)}</Text>
                  </View>
                </View>
                
                {showDeliveryDetails.observations && (
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Observações</Text>
                    <Text style={styles.infoText}>{showDeliveryDetails.observations}</Text>
                  </View>
                )}
                
                {showDeliveryDetails.assignedTo && (
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Entregador</Text>
                    <Text style={styles.infoText}>{showDeliveryDetails.assignedTo}</Text>
                  </View>
                )}
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Criado em</Text>
                  <Text style={styles.infoText}>{formatDateTime(showDeliveryDetails.createdAt)}</Text>
                </View>
                
                {showDeliveryDetails.completedAt && (
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Concluído em</Text>
                    <Text style={styles.infoText}>{formatDateTime(showDeliveryDetails.completedAt)}</Text>
                  </View>
                )}
              </ScrollView>
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.secondaryButton, { flex: 1 }]}
                  onPress={() => setShowDeliveryDetails(null)}
                >
                  <Text style={styles.secondaryButtonText}>Fechar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, { flex: 1, marginLeft: 8 }]}
                  onPress={() => {
                    openWhatsApp(showDeliveryDetails.phone, `Olá ${showDeliveryDetails.customerName}, sua entrega está a caminho!`);
                    setShowDeliveryDetails(null);
                  }}
                >
                  <Ionicons name="logo-whatsapp" size={16} color={colors.textLight} />
                  <Text style={styles.actionButtonText}>WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
      
      {/* Overlay for notifications */}
      {showNotifications && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'transparent'
          }}
          onPress={() => setShowNotifications(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default MotoTrackApp;
