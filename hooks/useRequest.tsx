import { useCallback, useState } from 'react';
import useRequestAxios from '../utils/useRequestAxios';
import { RepairRequest } from '../models/RepairRequest';
import { Feedback } from '../models/Feedback';
import { Box, useToast } from 'native-base';
import { Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

const useRequest = () => {
  const { fetchData } = useRequestAxios();
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [allRequests, setAllRequests] = useState<RepairRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const toast = useToast();

  const createRequest = useCallback(async (customerId: string, roomId: string, customerProblem: string, categoryRequest: number) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('customerId', customerId);
      formData.append('roomId', roomId);
      formData.append('customerProblem', customerProblem);
      formData.append('categoryRequest', categoryRequest.toString());

      await fetchData({
        url: '/request/29',
        method: 'POST',
        data: formData,
        header: { 'Content-Type': 'multipart/form-data' },
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
                Gởi yêu cầu thành công
              </Text>
            </View>
          </Box>;
        }
      });
    } catch (error) {
      setApiError('Không thể tạo yêu cầu.');
      toast.show({
        description: 'Không thể tạo yêu cầu',
        duration: 3000,
        bg: 'red.500',
      });
    } finally {
      setLoading(false);
    }
  }, [fetchData, toast]);

  const fetchRecentRequests = useCallback(async (quantity: number = 3) => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await fetchData({
        url: `/request/23`,
        method: 'GET',
        params: { quantity },
      });
      if (response) {
        setRequests(response);
      }
    } catch (error: any) {
      setApiError('Không thể tải dữ liệu yêu cầu.');
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const fetchFeedbacks = useCallback(
    async (pageIndex: number = 1, pageSize: number = 8, sortByStarOrder?: string, status: number = 1) => {
      setLoading(true);
      setApiError(null);
      try {
        const params: any = { pageIndex, pageSize, status };
        if (sortByStarOrder) params.sortByStarOrder = sortByStarOrder;

        const response = await fetchData({
          url: `/feedback/1`,
          method: 'GET',
          params,
        });

        if (response) {
          setFeedbacks(response.results || []);
          setTotalPages(Math.ceil(response.count / pageSize));
          setCurrentPage(pageIndex);
        }
      } catch (error: any) {
        setApiError('Không thể tải dữ liệu đánh giá.');
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  const submitFeedback = useCallback(
    async (requestId: string, content: string, rate: number) => {
      setLoading(true);
      setApiError(null);
      try {
        const response = await fetchData({
          url: '/feedback/3',
          method: 'POST',
          data: {
            requestId,
            content,
            rate,
          },
        });

        if (response) {
          toast.show({
            description: 'Đã tạo phản hồi thành công.',
            duration: 3000,
            bg: 'green.500',
          });
        }
      } catch (error: any) {
        setApiError('Không thể gửi phản hồi.');
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  const fetchAllRequests = useCallback(
    async (customerId: string, status?: number) => {
      setLoading(true);
      setApiError(null);
      try {
        const params: any = { customerId };
        if (status !== undefined) params.status = status;

        const response = await fetchData({
          url: `/request/8`,
          method: 'GET',
          params,
        });

        if (response) {
          setAllRequests(response.map((item: any) => item.get));
        }
      } catch (error: any) {
        setApiError('Không thể tải dữ liệu yêu cầu.');
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  return { requests, feedbacks, fetchRecentRequests, fetchFeedbacks, loading, apiError, currentPage, totalPages, setCurrentPage, allRequests, fetchAllRequests, submitFeedback, createRequest };
};

export default useRequest;
