// hooks/useRequest.ts
import { useCallback, useState } from 'react';
import useRequestAxios from '../utils/useRequestAxios';
import { RepairRequest } from '../models/RepairRequest';
import { Feedback } from '../models/Feedback';
import { useToast } from 'native-base';

const useRequest = () => {
  const { fetchData } = useRequestAxios();
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [allRequests, setAllRequests] = useState<RepairRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Theo dõi trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Theo dõi tổng số trang
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const toast = useToast();

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
          setTotalPages(Math.ceil(response.count / pageSize)); // Giả sử API trả về tổng số feedbacks trong `count`
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

  return { requests, feedbacks, fetchRecentRequests, fetchFeedbacks, loading, apiError, currentPage, totalPages, setCurrentPage, allRequests, fetchAllRequests, submitFeedback };
};

export default useRequest;
