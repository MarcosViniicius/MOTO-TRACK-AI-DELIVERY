
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const openWhatsApp = async (phone, message = '') => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const url = `whatsapp://send?phone=55${phone}&text=${encodeURIComponent(message)}`;
    await Linking.openURL(url);
  } catch (error) {
    console.error('Erro ao abrir WhatsApp:', error);
  }
};

export const openMaps = async (address) => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    await Linking.openURL(url);
  } catch (error) {
    console.error('Erro ao abrir Maps:', error);
  }
};

export const makeCall = async (phone) => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const url = `tel:${phone}`;
    await Linking.openURL(url);
  } catch (error) {
    console.error('Erro ao fazer ligação:', error);
  }
};

export const copyToClipboard = async (text) => {
  try {
    await Clipboard.setStringAsync(text);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.error('Erro ao copiar:', error);
  }
};

export const shareText = async (text) => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await Sharing.shareAsync(text);
  } catch (error) {
    console.error('Erro ao compartilhar:', error);
  }
};

export const getStatusColor = (status) => {
  const colors = {
    pendente: '#F59E0B',
    em_rota: '#3B82F6',
    entregue: '#10B981',
    cancelada: '#EF4444'
  };
  return colors[status] || '#6B7280';
};

export const getStatusText = (status) => {
  const texts = {
    pendente: 'Pendente',
    em_rota: 'Em Rota',
    entregue: 'Entregue',
    cancelada: 'Cancelada'
  };
  return texts[status] || 'Desconhecido';
};

export const getPaymentMethodText = (method) => {
  const methods = {
    pix: 'PIX',
    dinheiro: 'Dinheiro',
    cartao: 'Cartão',
    loja: 'Pago na Loja'
  };
  return methods[method] || 'Não informado';
};

export const generateId = () => {
  return Date.now() + Math.random();
};
