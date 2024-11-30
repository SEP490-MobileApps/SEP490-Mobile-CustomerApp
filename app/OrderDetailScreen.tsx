import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Divider, Modal } from 'native-base';
import useProduct from '@/hooks/useProduct';
import { OrderDetail } from '@/models/OrderDetail';

// Type definition for Warranty Card
type WarrantyCard = {
  warrantyCardId: string;
  customerId: string;
  productId: string;
  startDate: string;
  expireDate: string;
};

const OrderDetailScreen = () => {
  const { orderId } = useLocalSearchParams();
  const { fetchOrderDetail, orderDetail, loading, apiError } = useProduct();
  const [isWarrantyModalVisible, setWarrantyModalVisible] = useState(false);
  const [selectedWarrantyCard, setSelectedWarrantyCard] = useState<WarrantyCard | null>(null);

  React.useEffect(() => {
    console.log('OrderDetailScreen - OrderId:', orderId);
    if (orderId) {
      fetchOrderDetail(orderId as string);
    }
  }, [orderId]);

  const calculateRemainingDays = (expireDate: string) => {
    const today = new Date();
    const expire = new Date(expireDate);
    const timeDiff = expire.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const openWarrantyModal = (warrantyCard: WarrantyCard) => {
    setSelectedWarrantyCard(warrantyCard);
    setWarrantyModalVisible(true);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3F72AF" />
        <Text>Đang tải chi tiết đơn hàng...</Text>
      </View>
    );
  }

  if (apiError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text style={{ color: 'red', textAlign: 'center' }}>{apiError}</Text>
      </View>
    );
  }

  if (!orderDetail || !orderDetail.result || orderDetail.result.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text style={{ textAlign: 'center' }}>Không tìm thấy chi tiết đơn hàng</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9F7F7', padding: 16 }}>
      {orderDetail.result.map((item, index) => (
        <View key={index} style={{
          flexDirection: 'row',
          marginBottom: 16,
          backgroundColor: '#DBE2EF',
          borderRadius: 10,
          padding: 16
        }}>
          <View style={{ flex: 1, marginRight: 16 }}>
            <Image
              source={{ uri: item.product.imageUrl }}
              style={{ width: 100, height: 100, borderRadius: 10 }}
            />
          </View>

          <Divider orientation="vertical" bg="#3F72AF" thickness={2} style={{ marginRight: 12 }} />

          <View style={{ flex: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#112D4E' }}>
              {item.product.name}
            </Text>
            <Text style={{ color: '#6C757D', marginVertical: 4 }}>
              Số lượng: {item.orderDetail.quantity} cái
            </Text>
            <Text style={{ color: '#6C757D', marginBottom: 4 }}>
              Tổng giá: {item.orderDetail.totalPrice.toLocaleString()}đ
            </Text>
            <TouchableOpacity
              onPress={() => openWarrantyModal(item.orderDetail.warrantyCards.getWarrantyCards[0])}
              style={{
                backgroundColor: '#3F72AF',
                padding: 8,
                borderRadius: 5,
                alignSelf: 'flex-start'
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Xem thẻ bảo hành</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Modal
        isOpen={isWarrantyModalVisible}
        onClose={() => setWarrantyModalVisible(false)}
      >
        <Modal.Content>
          <Modal.Header>Chi tiết thẻ bảo hành</Modal.Header>
          <Modal.Body>
            {selectedWarrantyCard && (
              <>
                <Text>Tên sản phẩm: {orderDetail.result.find(item =>
                  item.orderDetail.warrantyCards.getWarrantyCards.includes(selectedWarrantyCard)
                )?.product.name}</Text>
                <Text>Mã bảo hành: {selectedWarrantyCard.warrantyCardId}</Text>
                <Text>Ngày bắt đầu: {new Date(selectedWarrantyCard.startDate).toLocaleDateString()}</Text>
                <Text>Ngày hết hạn: {new Date(selectedWarrantyCard.expireDate).toLocaleDateString()}</Text>
                <Text>Còn lại: {calculateRemainingDays(selectedWarrantyCard.expireDate)} ngày</Text>
              </>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </ScrollView>
  );
};

export default OrderDetailScreen;