import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Divider, Modal } from 'native-base';
import useProduct from '@/hooks/useProduct';
import LottieView from 'lottie-react-native';
import NoData from '@/components/ui/NoData';
import { useGlobalState } from "@/contexts/GlobalProvider";
import ShippingActionSheet from '@/components/ShippingActionSheet';
import { formatDate } from '@/utils/formatDate';
import LinearGradient from 'react-native-linear-gradient';

type WarrantyCard = {
  warrantyCardId: string;
  customerId: string;
  productId: string;
  startDate: string;
  expireDate: string;
};

const OrderDetailScreen = () => {

  const { isActionSheetOpen, setIsActionSheetOpen } = useGlobalState();
  const { orderId } = useLocalSearchParams();
  const { fetchOrderDetail, orderDetail, loading, apiError, fetchShipping, shipping } = useProduct();
  const [isWarrantyModalVisible, setWarrantyModalVisible] = useState(false);
  const [selectedWarrantyCard, setSelectedWarrantyCard] = useState<WarrantyCard | null>(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);

  React.useEffect(() => {
    if (orderId) {
      fetchOrderDetail(orderId as string);
      fetchShipping(orderId as string);
    }
  }, [orderId]);

  const calculateRemainingDays = (expireDate: string) => {
    const today = new Date();
    const expire = new Date(expireDate);
    const timeDiff = expire.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const openWarrantyModal = (productIndex: number, warrantyCards: WarrantyCard[]) => {
    setSelectedProductIndex(productIndex);
    setSelectedWarrantyCard(warrantyCards[0]);
    setWarrantyModalVisible(true);
  };

  const handleWarrantyCardSelect = (card: WarrantyCard) => {
    setSelectedWarrantyCard(card);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
        <LottieView
          source={require('@/assets/animations/loading.json')}
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
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
    return <NoData />;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9F7F7', padding: 16 }}>

      <ShippingActionSheet
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        shipping={shipping}
        onRefresh={() => fetchShipping(orderId as string)}
      />

      <Text style={{ fontSize: 16, color: '#112D4E', marginBottom: 4 }}>
        Mã đơn hàng:
      </Text>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#112D4E', marginBottom: 16 }}>
        {orderId}
      </Text>
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
            <Text style={{ color: '#3F72AF', marginBottom: 4 }}>
              Tổng giá: {item.orderDetail.totalPrice.toLocaleString()}đ
            </Text>
            <TouchableOpacity
              onPress={() => openWarrantyModal(index, item.orderDetail.warrantyCards.getWarrantyCards)}
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
          <Modal.CloseButton />
          <Modal.Header style={{ backgroundColor: '#3F72AF' }}>
            <Text style={{ color: '#f9f7f7', fontWeight: 'bold', fontSize: 18 }}>Chi tiết thẻ bảo hành</Text>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#DBE2EF', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            {selectedWarrantyCard && (
              <>
                <View>
                  <LinearGradient
                    colors={['#DBE2EF', '#3F72AF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      width: '100%',
                      borderRadius: 15,
                      marginVertical: 10,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5
                    }}
                  >
                    <View style={{
                      borderRadius: 15,
                      padding: 16,
                    }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Image
                          source={require('@/assets/images/logo-nobg.png')}
                          alt="Logo"
                          style={{
                            width: 100,
                            height: 80,
                            marginBottom: 10
                          }}
                        />
                        <Text style={{ color: '#112D4E', fontWeight: 'bold' }}>THẺ BẢO HÀNH</Text>
                      </View>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: 'bold',
                            color: '#112D4E',
                          }}
                        >
                          Mã: {selectedWarrantyCard.warrantyCardId}
                        </Text>
                      </View>
                    </View>

                  </LinearGradient>
                </View>
                <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Chọn thẻ bảo hành khác:</Text>
                <View style={{ flexDirection: 'row' }}>
                  {orderDetail.result[selectedProductIndex!]?.orderDetail.warrantyCards.getWarrantyCards.map((card, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleWarrantyCardSelect(card)}
                      style={{
                        backgroundColor: selectedWarrantyCard?.warrantyCardId === card.warrantyCardId ? '#3F72AF' : '#DBE2EF',
                        borderRadius: 10,
                        padding: 8,
                        marginHorizontal: 5,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                      }}
                    >
                      <Text style={{ color: selectedWarrantyCard?.warrantyCardId === card.warrantyCardId ? '#fff' : '#112D4E' }}>
                        Thẻ {idx + 1}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Divider orientation="horizontal" bg="#112D4E" thickness={1} style={{ marginVertical: 8 }} />
                <Text>Tên sản phẩm: {orderDetail.result[selectedProductIndex!]?.product.name}</Text>
                <Divider orientation="horizontal" bg="#112D4E" thickness={1} style={{ marginVertical: 8 }} />
                <Text>Ngày bắt đầu: {formatDate(selectedWarrantyCard.startDate)}</Text>
                <Divider orientation="horizontal" bg="#112D4E" thickness={1} style={{ marginVertical: 8 }} />
                <Text>Ngày hết hạn: {formatDate(selectedWarrantyCard.expireDate)}</Text>
                <Divider orientation="horizontal" bg="#112D4E" thickness={1} style={{ marginVertical: 8 }} />
                <Text>Số ngày còn lại: {calculateRemainingDays(selectedWarrantyCard.expireDate)} ngày</Text>


              </>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>

    </ScrollView>
  );
};

export default OrderDetailScreen;
