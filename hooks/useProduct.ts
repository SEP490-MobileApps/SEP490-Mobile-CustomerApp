// hooks/useProduct.ts
import { useCallback, useState } from 'react';
import useSaleAxios from '../utils/useSaleAxios';
import { Product } from '../models/Product';
import { useToast } from 'native-base'; // Import Toast
import { CartItem } from '@/models/CartItem';

const useProducts = () => {
  const { fetchData } = useSaleAxios();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // State cho giỏ hàng
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [productDetail, setProductDetail] = useState<Product | null>(null);
  const [orders, setOrders] = useState([]);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const toast = useToast(); // Initialize Toast

  // Fetch products with pagination and filters
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
      console.error('Lỗi tải dữ liệu sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  // Fetch product detail by productId
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
      console.error('Lỗi tải chi tiết sản phẩm:', error);
    } finally {
      setDetailLoading(false);
    }
  }, [fetchData]);

  // Add product to cart
  const addToCart = useCallback(async (productId: string, quantity: number) => {
    try {

      console.log('productId:', productId);
      console.log('quantity:', quantity);

      // Sử dụng FormData để truyền dữ liệu đúng định dạng
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('quantity', quantity.toString()); // Đảm bảo quantity là chuỗi



      await fetchData({
        url: '/order/1',
        method: 'POST',
        data: formData, // Truyền dữ liệu vào data
        header: { 'Content-Type': 'multipart/form-data' }
      });



      // Hiển thị thông báo thành công
      toast.show({
        description: 'Đã thêm vào giỏ hàng thành công',
        placement: 'top',
        duration: 3000,
        bg: 'green.500',
      });
    } catch (error) {
      console.error('Lỗi thêm sản phẩm vào giỏ hàng:', error);
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

      if (response && Array.isArray(response)) {
        const items = response.filter((item: any) => item.productId) as CartItem[]; // Lọc các mục có productId
        setCartItems(items);
        const totalPrice = response.find((item: any) => item.orderId)?.totalPrice || 0;
        setTotalAmount(totalPrice);
      }
    } catch (error) {
      setApiError('Không thể tải dữ liệu giỏ hàng.');
      console.error('Lỗi tải dữ liệu giỏ hàng:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const deleteCartItem = useCallback(async (productId: string) => {
    try {
      // Sử dụng data thay vì params
      const formData = new FormData();
      formData.append('productId', productId); // Đảm bảo sử dụng đúng định dạng

      await fetchData({
        url: '/order/3',
        method: 'DELETE',
        data: formData, // Truyền vào formData
        header: { 'Content-Type': 'multipart/form-data' }
      });

      toast.show({
        description: 'Đã xóa sản phẩm khỏi giỏ hàng',
        placement: 'top',
        duration: 3000,
        bg: 'green.500',
      });
    } catch (error) {
      console.error('Lỗi xóa sản phẩm khỏi giỏ hàng:', error);
      toast.show({
        description: 'Không thể xóa sản phẩm khỏi giỏ hàng',
        placement: 'top',
        duration: 3000,
        bg: 'red.500',
      });
    }
  }, [fetchData, toast]);

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
      console.error('Lỗi tải đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const handleOrderPayment = useCallback(async () => {
    try {
      // Gọi API /order/4 để lấy link thanh toán
      const paymentLink = await fetchData({
        url: '/order/4',
        method: 'POST',
      });

      if (paymentLink && typeof paymentLink === 'string') {
        return { type: 'link', data: paymentLink };
      }

      throw new Error('Lỗi khi lấy link thanh toán.');
    } catch (error) {
      console.error('Error in handleOrderPayment:', error);
      throw error;
    }
  }, [fetchData]);

  const finalizeOrder = useCallback(async ({ orderCode, id1 }: { orderCode: number; id1: string }) => {
    try {
      // Gọi API /order/5 để hoàn tất đơn hàng
      const response = await fetchData({
        url: '/order/5',
        method: 'POST',
        data: {
          orderCode: orderCode.toString(),
          id1,
        },
        header: { 'Content-Type': 'application/json' },
      });

      return response;
    } catch (error) {
      console.error('Error in finalizeOrder:', error);
      throw error;
    }
  }, [fetchData]);

  return {
    products,
    totalCount,
    fetchProducts,
    productDetail,
    fetchProductDetail,
    fetchCartItems,
    addToCart,
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
