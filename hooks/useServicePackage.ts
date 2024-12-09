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
  const [draftContract, setDraftContract] = useState<any | null>(null);
  const servicePackageCache = new Map();
  const [pendingContracts, setPendingContracts] = useState<any[]>([]);

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
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const fetchServicePackageDetail = useCallback(async (servicePackageId: string) => {
    setLoading(true);
    setApiError(null);
    try {
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
        servicePackageCache.set(servicePackageId, response);
      }
    } catch (error) {
      setApiError('Không thể tải thông tin chi tiết gói dịch vụ.');
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const fetchCustomerContracts = useCallback(async (customerId: string, startDate?: string, endDate?: string) => {
    setLoading(true);
    setApiError(null);

    try {
      const params: any = { CustomerId: customerId };
      if (startDate) params.StartDate = startDate;
      if (endDate) params.EndDate = endDate;

      const response = await fetchData({
        url: '/service-package/12',
        method: 'GET',
        params,
      });

      if (response) {
        const enrichedContracts = await Promise.all(
          response.map(async (contract: any) => {
            let packageDetails = servicePackageCache.get(contract.servicePackageId);
            if (!packageDetails) {
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
        setDraftContract(response);
      }
    } catch (error) {
      setApiError('Không thể tạo hợp đồng nháp.');
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
      formData.append('isOnlinePayment', isOnlinePayment.toString());

      const response = await fetchData({
        url: '/service-package/7',
        method: 'POST',
        header: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      });

      if (isOnlinePayment && response.startsWith('http')) {
        return { type: 'link', data: response };
      } else if (!isOnlinePayment && typeof response === 'string') {
        return { type: 'message', data: response };
      }

      throw new Error('Dữ liệu từ API không hợp lệ');
    } catch (error) {
      setApiError('Không thể xử lý phương thức thanh toán.');
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

        return response;
      } catch (error) {
        setApiError('Không thể hoàn tất thanh toán.');
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
