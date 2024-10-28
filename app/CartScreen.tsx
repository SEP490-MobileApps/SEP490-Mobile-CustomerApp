// app/CartScreen.tsx
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { FormatPriceToVnd } from '../utils/PriceUtils';
import NoDataComponent from '../components/ui/NoDataComponent';

const initialCartItems = [
  {
    id: '1',
    name: 'Vòi chậu rửa nhôm cao cấp',
    price: 4600000,
    quantity: 2,
    imageUrl: 'https://inaxvn.com/uploads/shops/voi-lavabo/voi-chau-rua-lavabo-lanh-inax-lfv-21s.png',
  },
  {
    id: '2',
    name: 'Ổ cắm 3 lỗ hiện đại',
    price: 60000,
    quantity: 3,
    imageUrl: 'https://cdn.pixabay.com/photo/2016/04/01/12/05/socket-1300518_960_720.png',
  },
];

export default function CartScreen() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id: string, action: 'increase' | 'decrease') => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
            ...item,
            quantity: action === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1),
          }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <View style={styles.detailsContainer}>
                  <Text style={styles.name}>{item.name}</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, 'decrease')}>
                      <Text style={styles.quantityButton}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, 'increase')}>
                      <Text style={styles.quantityButton}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.price}>{FormatPriceToVnd(item.price)}</Text>
                </View>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
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
          <Button style={styles.checkoutButton} onPress={() => console.log('Proceed to Checkout')}>
            <Text style={styles.checkoutText}>THANH TOÁN</Text>
          </Button>
        </>
      )}
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityButton: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  quantity: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
  price: {
    fontSize: 16,
    color: '#3F72AF',
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
