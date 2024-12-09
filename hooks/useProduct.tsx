import { useCallback, useState } from 'react';
import useSaleAxios from '@/utils/useSaleAxios';
import { Product } from '@/models/Product';
import { Box, useToast } from 'native-base';
import { CartItem } from '@/models/CartItem';
import { OrderDetail } from '@/models/OrderDetail';
import { Shipping } from '@/models/Shipping';
import { useGlobalState } from '@/contexts/GlobalProvider';
import LottieView from 'lottie-react-native';
import { Text, View } from 'react-native';

const useProducts = () => {
  const { fetchData } = useSaleAxios();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [productDetail, setProductDetail] = useState<Product | null>(null);
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [shipping, setShipping] = useState<Shipping | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const toast = useToast();
  const { setCartItemCount } = useGlobalState();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShipping = useCallback(async (orderId: string) => {
    setLoading(true);
    setApiError(null);
    try {
      console.log('Fetching order detail for orderId:', orderId);

      const response = await fetchData({
        url: '/shipping/3',
        method: 'GET',
        params: { ShippingId: orderId },
      });

      if (response) {
        setShipping(response);
      } else {
        console.warn('Không có chi tiết vận chuyển nào');
        setShipping(null);
      }
    } catch (error) {
      setApiError('Không thể tải chi tiết vận chuyển.');
      setShipping(null);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const fetchProducts = useCallback(async (pageIndex: number = 1, pageSize: number = 6, searchByName: string = '', increasingPrice: boolean | null = null) => {
    setLoading(true);
    setApiError(null);
    try {
      const params: any = {
        PageIndex: pageIndex,
        PageSize: pageSize,
        SearchByName: searchByName,
        Status: false,
      };
      if (increasingPrice !== null) {
        params.IncreasingPrice = increasingPrice;
      }

      const response = await fetchData({
        url: '/product/5',
        method: 'GET',
        params,
      });

      if (response) {
        setProducts(response.results || []);
        setTotalCount(response.count || 0);
      }
    } catch (error) {
      setApiError('Không thể tải dữ liệu sản phẩm.');
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const fetchProductDetail = useCallback(async (productId: string) => {
    setDetailLoading(true);
    setApiError(null);
    try {
      const response = await fetchData({
        url: '/product/4',
        method: 'GET',
        params: { ProductId: productId },
      });

      if (response) {
        setProductDetail(response);
      }
    } catch (error) {
      setApiError('Không thể tải chi tiết sản phẩm.');
    } finally {
      setDetailLoading(false);
    }
  }, [fetchData]);

  const addToCart = useCallback(async (productId: string, quantity: number) => {
    try {

      console.log('productId:', productId);
      console.log('quantity:', quantity);

      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('quantity', quantity.toString());
      await fetchData({
        url: '/order/1',
        method: 'POST',
        data: formData,
        header: { 'Content-Type': 'multipart/form-data' }
      });

      toast.show({
        duration: 1600,
        placement: 'top',
        render: () => {
          return <Box
            borderTopColor='#16a34a'
            borderTopWidth={5} bg="#bbf7d0"
            alignSelf='center'
            px="2"
            py="1"
            rounded="sm"
            mb={5}
            style={{ flexDirection: 'column', width: '98%', justifyContent: 'center' }}
          >
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#bbf7d0',
              marginHorizontal: 30,
              flexDirection: 'row'
            }}>
              <LottieView
                source={require('@/assets/animations/success.json')}
                autoPlay
                loop
                style={{ width: 52, height: 52 }}
              />
              <Text
                style={{
                  fontSize: 18,
                  color: '#112D4E',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                Thêm vào giỏ hàng thành công
              </Text>
            </View>
          </Box>;
        }
      });
    } catch (error) {
      toast.show({
        description: 'Không thể thêm vào giỏ hàng',
        placement: 'top',
        duration: 3000,
        bg: 'red.500',
      });
    }
  }, [fetchData, toast]);

  const fetchCartItems = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await fetchData({
        url: '/order/2',
        method: 'GET',
      });

      if (response) {
        if (!Array.isArray(response)) {
          setCartItems([]);
          setTotalAmount(0);
          setCartItemCount(0);
          return;
        }
        const items = response.filter((item: any) => item.productId) as CartItem[];
        setCartItems(items);
        const totalPrice = response.find((item: any) => item.orderId)?.totalPrice || 0;
        setTotalAmount(totalPrice);
        const totalProductCount = items.length;
        setCartItemCount(totalProductCount);
      }
    } catch (error) {
      setApiError('Không thể tải dữ liệu giỏ hàng.');
    } finally {
      setLoading(false);
    }
  }, [fetchData, setCartItemCount]);

  const deleteCartItem = useCallback(async (productId: string) => {
    try {
      const formData = new FormData();
      formData.append('productId', productId);

      await fetchData({
        url: '/order/3',
        method: 'DELETE',
        data: formData,
        header: { 'Content-Type': 'multipart/form-data' }
      });

      await fetchCartItems();

      toast.show({
        duration: 1600,
        placement: 'top',
        render: () => {
          return <Box
            borderTopColor='#16a34a'
            borderTopWidth={5} bg="#bbf7d0"
            alignSelf='center'
            px="2"
            py="1"
            rounded="sm"
            mb={5}
            style={{ flexDirection: 'column', width: '98%', justifyContent: 'center' }}
          >
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#bbf7d0',
              marginHorizontal: 30,
              flexDirection: 'row'
            }}>
              <LottieView
                source={require('@/assets/animations/success.json')}
                autoPlay
                loop
                style={{ width: 52, height: 52 }}
              />
              <Text
                style={{
                  fontSize: 18,
                  color: '#112D4E',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                Đã xóa thành công
              </Text>
            </View>
          </Box>;
        }
      });
    } catch (error) {
      toast.show({
        description: 'Không thể xóa sản phẩm khỏi giỏ hàng',
        placement: 'top',
        duration: 3000,
        bg: 'red.500',
      });
    }
  }, [fetchData, toast, fetchCartItems]);

  const fetchOrders = useCallback(async (customerId: string, startDate?: string, endDate?: string) => {
    setLoading(true);
    setApiError(null);
    try {
      const params: any = { customerId };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await fetchData({
        url: '/order/6',
        method: 'GET',
        params,
      });

      setOrders(response || []);
    } catch (error) {
      setApiError('Không thể tải đơn hàng.');
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const fetchOrderDetail = useCallback(async (orderId: string) => {
    setLoading(true);
    setApiError(null);
    try {
      console.log('Fetching order detail for orderId:', orderId);

      const response = await fetchData({
        url: '/order/8',
        method: 'GET',
        params: { OrderId: orderId },
      });

      if (response) {
        setOrderDetail(response.order);
      } else {
        console.warn('Không có chi tiết đơn hàng nào');
        setOrderDetail(null);
      }
    } catch (error) {
      setApiError('Không thể tải chi tiết đơn hàng.');
      setOrderDetail(null);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const handleOrderPayment = useCallback(async (customerNote: string) => {
    try {
      const formData = new FormData();
      formData.append('customerNote', customerNote);
      const paymentLink = await fetchData({
        url: '/order/4',
        method: 'POST',
        header: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      });

      if (paymentLink && typeof paymentLink === 'string') {
        return { type: 'link', data: paymentLink };
      }

      throw new Error('Lỗi khi lấy link thanh toán.');
    } catch (error) {
      throw error;
    }
  }, [fetchData]);

  const finalizeOrder = useCallback(
    async ({ orderCode, id1, customerNote }: { orderCode: number; id1: string, customerNote: string }) => {
      try {
        const formData = new FormData();
        formData.append('orderCode', orderCode.toString());
        formData.append('id1', id1);
        formData.append('customerNote', customerNote);

        const response = await fetchData({
          url: '/order/5',
          method: 'POST',
          header: {
            'Content-Type': 'multipart/form-data',
          },
          data: formData,
        });

        return response;
      } catch (error) {
        throw error;
      }
    },
    [fetchData]
  );

  return {
    products,
    totalCount,
    fetchProducts,
    productDetail,
    fetchProductDetail,
    fetchCartItems,
    addToCart,
    setIsAddingToCart,
    orderDetail,
    fetchOrderDetail,
    fetchShipping,
    shipping,
    error,
    isAddingToCart,
    loading,
    detailLoading,
    apiError,
    cartItems,
    totalAmount,
    deleteCartItem,
    handleOrderPayment,
    finalizeOrder,
    orders,
    fetchOrders
  };
};

export default useProducts;
