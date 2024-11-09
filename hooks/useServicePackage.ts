// hooks/useServicePackage.ts
import { useState, useEffect } from 'react';
import useSaleAxios from '../utils/useSaleAxios';
import { ServicePackage } from '../models/ServicePackage';

const useServicePackages = (pageIndex: number = 1, pageSize: number = 8, searchByName: string = '') => {
  const { fetchData, error } = useSaleAxios();
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [servicePackageDetail, setServicePackageDetail] = useState<ServicePackage | null>(null);
  const [draftContract, setDraftContract] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch list of service packages with pagination and optional search
  useEffect(() => {
    let isMounted = true;
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await fetchData({
          url: '/service-package/5',
          method: 'GET',
          params: {
            PageIndex: pageIndex,
            PageSize: pageSize,
            Status: false,
            SearchByName: searchByName, // New search parameter added
          },
        });
        if (response && isMounted) {
          setPackages((prev) => (pageIndex === 1 ? response[0] || [] : [...prev, ...(response[0] || [])]));
          setTotalCount(response[1] || 0);
        }
      } catch (error) {
        console.error('Error fetching service packages:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPackages();
    return () => {
      isMounted = false;
    };
  }, [pageIndex, pageSize, searchByName]);

  // Fetch detailed information about a service package
  const fetchServicePackageDetail = async (servicePackageId: string) => {
    setLoading(true);
    try {
      const response = await fetchData({
        url: '/service-package/4',
        method: 'GET',
        params: { ServicePackageId: servicePackageId },
      });

      if (response) {
        setServicePackageDetail(response);
      }
    } catch (error) {
      console.error('Error fetching service package detail:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a draft contract for a service package
  const createDraftContract = async (servicePackageId: string) => {
    setLoading(true);
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
      console.error('Error creating draft contract:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    packages,
    totalCount,
    servicePackageDetail,
    draftContract,
    fetchServicePackageDetail,
    createDraftContract,
    loading,
    error,
  };
};

export default useServicePackages;
