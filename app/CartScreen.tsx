import React, { useCallback, useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { Button, AlertDialog, Toast, Modal, Input, Divider } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { FormatPriceToVnd } from '@/utils/PriceUtils';
import useProducts from '@/hooks/useProduct';
import { useFocusEffect } from '@react-navigation/native';
import Lottie from 'lottie-react-native';
import NoProduct from '@/components/ui/NoProduct';
import useUser from '@/hooks/useUser';


export default function CartScreen() {
  const { cartItems, totalAmount, fetchCartItems, deleteCartItem, handleOrderPayment } = useProducts();
  const { fetchUserAndLeader, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customerNote, setCustomerNote] = useState('');
  const [tempCustomerNote, setTempCustomerNote] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const handleCheckout = async () => {
    try {
      const result = await handleOrderPayment(customerNote, selectedRoom);
      if (result.type === 'link') {
        Linking.openURL(result.data);
      }
      console.log('gg cus note', customerNote)
      console.log('gg room', selectedRoom)
      setCustomerNote('');
      setSelectedRoom('');
    } catch (error) {
      Toast.show({
        description: 'Kiểm tra lại thông tin nhận hàng',
        placement: 'top',
        duration: 5000,
        bg: 'red.500',
      });
    }
  };

  const openModal = () => {
    setTempCustomerNote(customerNote);
    setIsOpen(true);
  };


  useFocusEffect(
    useCallback(() => {
      const loadCartItems = async () => {
        setIsLoading(true);
        await fetchCartItems();
        setIsLoading(false);
      };

      loadCartItems();

      fetchUserAndLeader();
    }, [])
  );

  const handleDeleteItem = async () => {
    if (selectedProductId) {
      await deleteCartItem(selectedProductId);
      closeDeleteModal();
    }
  };

  const openDeleteModal = (productId: string) => {
    setSelectedProductId(productId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };


  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
          <Lottie
            source={require('@/assets/animations/loading.json')}
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
              <Divider orientation="vertical" bg="#3F72AF" thickness={2} style={{ marginLeft: 12 }} />
              <View style={styles.detailsContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{FormatPriceToVnd(item.priceByDate)}</Text>
                <View style={styles.quantityContainer}>

                  <View style={styles.quantityBox}>
                    <Text style={styles.quantity}>Số lượng: {item.quantity}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => openDeleteModal(item.productId)}
              >
                <FontAwesome name="remove" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.totalText}>Tổng cộng</Text>
            <Text style={styles.totalAmount}>{FormatPriceToVnd(totalAmount)}</Text>
          </View>

          <Text style={styles.shippingInfoTitle}>Thông tin nhận hàng</Text>

          <TouchableOpacity
            style={[
              styles.apartmentContainer,
              selectedRoom ? styles.apartmentSelected : styles.apartmentDefault
            ]}
            onPress={() => setIsDropdownOpen(true)}
          >
            <Text style={styles.apartmentLabel}>Giao tới căn hộ</Text>
            <View
              style={[
                styles.apartmentTextContainer,
                selectedRoom ? styles.apartmentTextSelected : styles.apartmentTextDefault
              ]}
            >
              <Text
                style={styles.apartmentText}
              >
                {selectedRoom || "Chọn căn hộ"}
              </Text>
            </View>

            <FontAwesome name="angle-right" size={24} color="#112D4E" />
          </TouchableOpacity>


          <TouchableOpacity style={styles.noteContainer} onPress={openModal}>
            <View style={styles.noteContent}>
              <Text style={styles.noteLabel}>Ghi chú</Text>
              <Text
                style={styles.noteText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {customerNote || "Thêm ghi chú"}
              </Text>
              <FontAwesome name="angle-right" size={24} color="#112D4E" style={styles.noteIcon} />
            </View>
          </TouchableOpacity>



          <Button style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>THANH TOÁN</Text>
          </Button>
        </ScrollView>
      )}

      <Modal isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header style={{ backgroundColor: '#3F72AF' }}>
            <Text style={{ color: '#f9f7f7', fontWeight: 'bold', fontSize: 18 }}>Chọn căn hộ (*)</Text>
          </Modal.Header>
          <Modal.Body>
            {user?.rooms.map((room) => (
              <TouchableOpacity
                key={room}
                style={[
                  styles.dropdownItem,
                  selectedRoom === room && styles.dropdownItemSelected
                ]}
                onPress={() => {
                  setSelectedRoom(room);
                  setIsDropdownOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    selectedRoom === room && styles.dropdownTextSelected
                  ]}
                >
                  {room}
                </Text>
              </TouchableOpacity>
            ))}
          </Modal.Body>
        </Modal.Content>
      </Modal>


      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false) }} closeOnOverlayClick={false}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header style={{ backgroundColor: '#3F72AF' }}>
            <Text style={{ color: '#f9f7f7', fontWeight: 'bold', fontSize: 18 }}>Nhập ghi chú khách hàng</Text>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#DBE2EF' }}>
            <Input
              value={tempCustomerNote}
              onChangeText={setTempCustomerNote}
              placeholder="Nhập ghi chú (tối đa 200 ký tự)"
              maxLength={200}
            />
          </Modal.Body>
          <Modal.Footer style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#DBE2EF' }}>
            <Button style={{ width: '48%', backgroundColor: '#dc2626' }} onPress={() => { setIsOpen(false) }} >
              Hủy
            </Button>
            <Button
              style={{ width: '48%', backgroundColor: '#3F72AF' }}
              onPress={() => {
                setCustomerNote(tempCustomerNote);
                setIsOpen(false);
              }}
            >
              Xác nhận
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>


      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        closeOnOverlayClick={false}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header style={{ backgroundColor: '#3F72AF' }}>
            <Text style={{ color: '#f9f7f7', fontWeight: 'bold', fontSize: 18 }}>Xác nhận xóa</Text>
          </AlertDialog.Header>
          <AlertDialog.Body style={{ backgroundColor: '#DBE2EF' }}>
            Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?
          </AlertDialog.Body>
          <AlertDialog.Footer style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#DBE2EF' }}>
            <Button style={{ width: '48%', backgroundColor: '#dc2626' }} ref={cancelRef} onPress={closeDeleteModal}>
              Hủy
            </Button>
            <Button style={{ width: '48%', backgroundColor: '#3F72AF' }} onPress={handleDeleteItem} >
              Xóa
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </View>
  );
}

const styles = StyleSheet.create({
  shippingInfoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#112D4E',
    marginTop: 28,
    marginBottom: 20,
    textAlign: 'center',
  },

  dropdownItem: {
    borderBottomWidth: 1,
    borderColor: '#112D4E',
  },
  dropdownItemSelected: {
    backgroundColor: '#F9F7F7',
  },
  dropdownText: {
    fontSize: 16,
    color: '#112D4E',
    padding: 12
  },
  dropdownTextSelected: {
    color: '#3A9B7A',
    fontWeight: 'bold',
    backgroundColor: '#EEFAF6',
    padding: 12
  },

  apartmentTextContainer: {
    flex: 1,
    padding: 8,
  },
  apartmentTextDefault: {
    backgroundColor: '#F9F7F7',
  },
  apartmentTextSelected: {
    backgroundColor: '#F9F7F7',
  },
  apartmentText: {
    fontSize: 16,
    color: '#112D4E',
    textAlign: 'right',
  },

  apartmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    marginBottom: 12,
    backgroundColor: '#F9F7F7',
    paddingTop: 8,
    borderColor: '#112D4E',
    paddingBottom: 24,
  },
  apartmentDefault: {
    borderColor: '#112D4E',
    backgroundColor: '#F9F7F7',
  },
  apartmentSelected: {
    borderColor: '#112D4E',
    backgroundColor: '#F9F7F7',
  },
  apartmentLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#112D4E',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: '#F9F7F7',
  },
  noteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  noteLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#112D4E',
    marginRight: 40
  },
  noteText: {
    flex: 1,
    fontSize: 16,
    color: '#112D4E',
    textAlign: 'right',
    marginHorizontal: 8,
  },
  noteIcon: {
    marginLeft: 0,
  },

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
    marginLeft: 8
  },
  price: {
    fontSize: 16,
    color: '#3F72AF',
    marginBottom: 8,
    marginLeft: 8
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
    paddingTop: 16,
    paddingBottom: 32,
    borderColor: '#112D4E',
    borderBottomWidth: 1,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#112D4E'
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3F72AF',
  },
  checkoutButton: {
    backgroundColor: '#3F72AF',
    marginTop: 4,
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
