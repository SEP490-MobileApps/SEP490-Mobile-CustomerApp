// hooks/useServicePackage.ts
import { useState, useEffect } from 'react';
import useSaleAxios from '../utils/useSaleAxios';
import { useGlobalState } from '../contexts/GlobalProvider';
import { ServicePackage } from '../models/ServicePackage'; // Import kiểu

const useServicePackages = (pageIndex: number = 1, pageSize: number = 8) => {
  const { fetchData, error } = useSaleAxios();
  const { loading, setLoading } = useGlobalState();
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await fetchData({
          url: '/service-package/5',
          method: 'GET',
          params: {
            PageIndex: pageIndex,
            Pagesize: pageSize,
            Status: false, // Only fetch non-cancelled packages
          },
        });
        if (response) {
          console.log('API Response:', response); // Để kiểm tra dữ liệu phản hồi
          setPackages(response[0] || []);
          setTotalCount(response[1] || 0);
        }
      } catch (error) {
        console.error('Error fetching service packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [pageIndex, pageSize]); // Đảm bảo rằng chỉ chạy khi pageIndex hoặc pageSize thay đổi  

  return { packages, totalCount, loading, error };
};

export default useServicePackages;
