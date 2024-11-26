// hooks/useServicePackage.ts
import { useCallback, useState } from 'react';
import useSaleAxios from '../utils/useSaleAxios';
import { ServicePackage } from '../models/ServicePackage';

const useServicePackages = () => {
  const { fetchData } = useSaleAxios();
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [servicePackageDetail, setServicePackageDetail] = useState<ServicePackage | null>(null);
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [draftContract, setDraftContract] = useState<any | null>(null); // Thêm state để lưu hợp đồng nháp
  const servicePackageCache = new Map(); // Cache for service package details to avoid redundant calls
  const [pendingContracts, setPendingContracts] = useState<any[]>([]);

  // Fetch list of service packages
  const fetchPackages = useCallback(async (pageIndex: number = 1, pageSize: number = 8, searchByName: string = '') => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await fetchData({
        url: '/service-package/5',
        method: 'GET',
        params: {
          PageIndex: pageIndex,
          PageSize: pageSize,
          Status: false,
          SearchByName: searchByName,
        },
      });
      if (response) {
        setPackages(response[0] || []);
        setTotalCount(response[1] || 0);
      }
    } catch (error) {
      setApiError('Không thể tải dữ liệu gói dịch vụ.');
      console.error('Lỗi tải dữ liệu gói dịch vụ:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  // Fetch detailed information about a service package
  const fetchServicePackageDetail = useCallback(async (servicePackageId: string) => {
    setLoading(true);
    setApiError(null);
    try {
      // Check cache first
      if (servicePackageCache.has(servicePackageId)) {
        setServicePackageDetail(servicePackageCache.get(servicePackageId));
        return;
      }

      const response = await fetchData({
        url: '/service-package/4',
        method: 'GET',
        params: { ServicePackageId: servicePackageId },
      });

      if (response) {
        setServicePackageDetail(response);
        // Cache the response for future use
        servicePackageCache.set(servicePackageId, response);
      }
    } catch (error) {
      setApiError('Không thể tải thông tin chi tiết gói dịch vụ.');
      console.error('Lỗi tải thông tin chi tiết gói dịch vụ:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  // Fetch customer contracts and enrich with service package details
  const fetchCustomerContracts = useCallback(async (customerId: string, startDate?: string, endDate?: string) => {
    setLoading(true);
    setApiError(null);

    try {
      // Chuẩn bị tham số API
      const params: any = { CustomerId: customerId };
      if (startDate) params.StartDate = startDate;
      if (endDate) params.EndDate = endDate;

      const response = await fetchData({
        url: '/service-package/12',
        method: 'GET',
        params,
      });

      if (response) {
        // Kết hợp logic enrich từ phiên bản cũ
        const enrichedContracts = await Promise.all(
          response.map(async (contract: any) => {
            let packageDetails = servicePackageCache.get(contract.servicePackageId);
            if (!packageDetails) {
              // Fetch package details nếu không có trong cache
              const packageResponse = await fetchData({
                url: '/service-package/4',
                method: 'GET',
                params: { ServicePackageId: contract.servicePackageId },
              });

              if (packageResponse) {
                packageDetails = packageResponse;
                servicePackageCache.set(contract.servicePackageId, packageResponse);
              }
            }

            return {
              ...contract,
              ...packageDetails,
            };
          })
        );

        setContracts(enrichedContracts);
      }
    } catch (error) {
      setApiError('Không thể tải dữ liệu hợp đồng.');
      console.error('Lỗi tải dữ liệu hợp đồng:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const createDraftContract = useCallback(async (servicePackageId: string) => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await fetchData({
        url: '/service-package/6',
        method: 'GET',
        params: { servicePackageId },
      });
      if (response) {
        setDraftContract(response); // Lưu dữ liệu hợp đồng nháp
      }
    } catch (error) {
      setApiError('Không thể tạo hợp đồng nháp.');
      console.error('Lỗi tạo hợp đồng nháp:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const handlePaymentMethod = useCallback(async (servicePackageId: string, isOnlinePayment: boolean) => {
    setLoading(true);
    setApiError(null);
    try {
      const formData = new FormData();
      formData.append('servicePackageId', servicePackageId);
      formData.append('isOnlinePayment', isOnlinePayment.toString()); // Chuyển boolean thành chuỗi

      const response = await fetchData({
        url: '/service-package/7',
        method: 'POST',
        header: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      });

      // Trả về đúng loại dữ liệu
      if (isOnlinePayment && response.startsWith('http')) {
        return { type: 'link', data: response }; // Link thanh toán
      } else if (!isOnlinePayment && typeof response === 'string') {
        return { type: 'message', data: response }; // Thông báo
      }

      throw new Error('Dữ liệu từ API không hợp lệ');
    } catch (error) {
      setApiError('Không thể xử lý phương thức thanh toán.');
      console.error('Lỗi xử lý phương thức thanh toán:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const finalizePayment = useCallback(
    async ({
      servicePackageId,
      orderCode,
      contractId,
    }: {
      servicePackageId: string;
      orderCode: number;
      contractId: string;
    }) => {
      setLoading(true);
      setApiError(null);
      try {
        const formData = new FormData();
        formData.append('servicePackageId', servicePackageId);
        formData.append('orderCode', orderCode.toString());
        formData.append('contractId', contractId);

        const response = await fetchData({
          url: '/service-package/8',
          method: 'POST',
          header: {
            'Content-Type': 'multipart/form-data',
          },
          data: formData,
        });

        return response; // Xử lý dữ liệu trả về nếu cần
      } catch (error) {
        setApiError('Không thể hoàn tất thanh toán.');
        console.error('Error finalizing payment:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  const fetchPendingContracts = useCallback(async () => {
    setLoading(true);
    setApiError(null);

    try {
      const response = await fetchData({
        url: '/service-package/17',
        method: 'GET',
      });

      if (response) {
        setPendingContracts(response);
        return response;
      }
    } catch (error) {
      setApiError('Không thể tải dữ liệu hợp đồng đang chờ xử lý.');
      console.error('Lỗi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  return {
    packages,
    totalCount,
    servicePackageDetail,
    contracts,
    draftContract,
    fetchPackages,
    fetchServicePackageDetail,
    fetchCustomerContracts,
    createDraftContract,
    handlePaymentMethod,
    finalizePayment,
    fetchPendingContracts,
    pendingContracts,
    loading,
    apiError
  };
};

export default useServicePackages;
