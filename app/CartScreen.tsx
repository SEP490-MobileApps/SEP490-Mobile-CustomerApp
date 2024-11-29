import React, { useCallback, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { Button, AlertDialog, Toast } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { FormatPriceToVnd } from '@/utils/PriceUtils';
import useProducts from '@/hooks/useProduct';
import { useFocusEffect } from '@react-navigation/native';
import Lottie from 'lottie-react-native';
import NoProduct from '@/components/ui/NoProduct';

export default function CartScreen() {
  const { cartItems, totalAmount, fetchCartItems, deleteCartItem, handleOrderPayment } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      const result = await handleOrderPayment();
      if (result.type === 'link') {
        Linking.openURL(result.data);
      }
    } catch (error) {
      Toast.show({
        description: 'Có lỗi khi tạo đơn hàng.',
        placement: 'top',
        duration: 5000,
        bg: 'red.500',
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadCartItems = async () => {
        setIsLoading(true);
        await fetchCartItems();
        setIsLoading(false);
      };

      loadCartItems();
    }, [])
  );

  const handleDeleteItem = async () => {
    if (selectedProductId) {
      await deleteCartItem(selectedProductId);
      fetchCartItems();
      onClose();
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
          <Lottie
            source={require('../assets/animations/loading.json')}
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
          />
        </View>
      ) : cartItems.length === 0 ? (
        <NoProduct />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {cartItems.map((item) => (
            <View key={item.productId} style={styles.itemContainer}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <View style={styles.detailsContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{FormatPriceToVnd(item.priceByDate)}</Text>
                <View style={styles.quantityContainer}>

                  <View style={styles.quantityBox}>
                    <Text style={styles.quantity}>số lượng: {item.quantity}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setSelectedProductId(item.productId);
                  setIsOpen(true);
                }}
              >
                <FontAwesome name="remove" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
          <View style={styles.footer}>
            <Text style={styles.totalText}>Tổng cộng</Text>
            <Text style={styles.totalAmount}>{FormatPriceToVnd(totalAmount)}</Text>
          </View>
          <Button style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>THANH TOÁN</Text>
          </Button>
        </ScrollView>
      )}

      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Xác nhận xóa</AlertDialog.Header>
          <AlertDialog.Body>
            Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button ref={cancelRef} onPress={onClose} variant="ghost" colorScheme="coolGray">
              Hủy
            </Button>
            <Button colorScheme="red" onPress={handleDeleteItem} ml={3}>
              Xóa
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9F7F7',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#3F72AF',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityButton: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  quantityBox: {
    borderWidth: 1,
    borderColor: '#112D4E',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  quantity: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3F72AF',
  },
  checkoutButton: {
    backgroundColor: '#3F72AF',
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 8,
  },
  checkoutText: {
    color: '#F9F7F7',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
