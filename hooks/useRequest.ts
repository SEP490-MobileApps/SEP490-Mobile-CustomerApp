// hooks/useRequest.ts
import { useCallback, useState } from 'react';
import useRequestAxios from '../utils/useRequestAxios';
import { RepairRequest } from '../models/RepairRequest';
import { Feedback } from '../models/Feedback';
import { Toast } from 'native-base';

const useRequest = () => {
  const { fetchData } = useRequestAxios();
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [allRequests, setAllRequests] = useState<RepairRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Theo dõi trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Theo dõi tổng số trang
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

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
      console.error('Lỗi tải dữ liệu yêu cầu:', error);
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
        console.error('Lỗi tải dữ liệu đánh giá:', error);
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
        if (status !== undefined) params.status = status; // Thêm trạng thái nếu được chỉ định

        const response = await fetchData({
          url: `/request/8`,
          method: 'GET',
          params,
        });

        if (response) {
          setAllRequests(response.map((item: any) => item.get)); // Lấy phần `get` từ response
        }
      } catch (error: any) {
        setApiError('Không thể tải dữ liệu yêu cầu.');
        console.error('Lỗi tải dữ liệu yêu cầu:', error);
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  // const submitFeedback = useCallback(async (requestId: string, content: string, rate: number) => {
  //   try {
  //     const response = await fetchData({
  //       url: '/feedback/3',
  //       method: 'POST',
  //       data: { requestId, content, rate },
  //     });

  //     setRequests((prev) =>
  //       prev.map((req) =>
  //         req.requestId === requestId
  //           ? { ...req, feedbacks: [...(req.feedbacks || []), { content, rate }] }
  //           : req
  //       )
  //     );

  //     Toast.show({
  //       description: 'Đã gửi đánh giá thành công!',
  //       bg: 'green.500',
  //     });
  //   } catch (error) {
  //     console.error('Lỗi gửi đánh giá:', error);
  //     Toast.show({
  //       description: 'Không thể gửi đánh giá.',
  //       bg: 'red.500',
  //     });
  //   }
  // }, [fetchData]);


  return { requests, feedbacks, fetchRecentRequests, fetchFeedbacks, loading, apiError, currentPage, totalPages, setCurrentPage, allRequests, fetchAllRequests };
};

export default useRequest;
