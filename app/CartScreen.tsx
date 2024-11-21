// app/CartScreen.tsx
import React, { useCallback, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Button, Icon, AlertDialog, Toast } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { FormatPriceToVnd } from '../utils/PriceUtils';
import NoDataComponent from '../components/ui/NoDataComponent';
import useProducts from '../hooks/useProduct'; // Import hook useProducts
import { useFocusEffect } from '@react-navigation/native';

export default function CartScreen() {
  const { cartItems, totalAmount, fetchCartItems, deleteCartItem, handleOrderPayment } = useProducts(); // Add deleteCartItem function from hook
  const [isOpen, setIsOpen] = useState(false); // State for AlertDialog
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null); // Ref for least destructive action

  const handleCheckout = async () => {
    try {
      const result = await handleOrderPayment();
      if (result.type === 'link') {
        Linking.openURL(result.data); // Mở link thanh toán
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
      fetchCartItems(); // Fetch cart items when screen is focused
    }, [])
  );

  const handleDeleteItem = async () => {
    if (selectedProductId) {
      await deleteCartItem(selectedProductId); // Call API to delete product
      fetchCartItems(); // Refresh the cart items
      onClose(); // Close the AlertDialog
    }
  };

  const updateQuantity = (id: string, action: 'increase' | 'decrease') => {
    // Logic to update product quantity (if necessary)
  };

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <NoDataComponent
          imageUrl={require('../assets/images/empty-cart.png')}
          title="Giỏ hàng trống"
          description="Hãy thêm sản phẩm để tiếp tục mua sắm nhé."
        />
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.productId}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <View style={styles.detailsContainer}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>{FormatPriceToVnd(item.priceByDate)}</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => updateQuantity(item.productId, 'decrease')}>
                      <Text style={styles.quantityButton}>−</Text>
                    </TouchableOpacity>
                    <View style={styles.quantityBox}>
                      <Text style={styles.quantity}>{item.quantity}</Text>
                    </View>
                    <TouchableOpacity onPress={() => updateQuantity(item.productId, 'increase')}>
                      <Text style={styles.quantityButton}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedProductId(item.productId);
                    setIsOpen(true); // Open AlertDialog
                  }}
                >
                  <FontAwesome name="remove" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
            ListFooterComponent={() => (
              <View style={styles.footer}>
                <Text style={styles.totalText}>Tổng cộng</Text>
                <Text style={styles.totalAmount}>{FormatPriceToVnd(totalAmount)}</Text>
              </View>
            )}
          />
          <Button style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>THANH TOÁN</Text>
          </Button>
        </>
      )}

      {/* AlertDialog for delete confirmation */}
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false} // Đảm bảo việc bấm ra ngoài sẽ không đóng dialog
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
