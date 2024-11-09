// hooks/useProduct.ts
import { useState, useEffect } from 'react';
import useSaleAxios from '../utils/useSaleAxios';
import { Product } from '../models/Product';

const useProduct = (
  pageIndex: number = 1,
  pageSize: number = 8,
  searchByName: string = '',
  increasingPrice: boolean | null = null
) => {
  const { fetchData, error } = useSaleAxios();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [productDetail, setProductDetail] = useState<Product | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  // Function to fetch product details by ProductId
  const fetchProductDetail = async (productId: string) => {
    setDetailLoading(true);
    try {
      const response = await fetchData({
        url: '/product/4',
        method: 'GET',
        params: { ProductId: productId },
      });

      if (response) {
        setProductDetail(response);
      } else {
        setProductDetail(null);
      }
    } catch (error) {
      console.error('Error fetching product detail:', error);
      setProductDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = {
          PageIndex: pageIndex,
          Pagesize: pageSize,
          SearchByName: searchByName,
        };
        if (increasingPrice !== null) params.IncreasingPrice = increasingPrice;

        const response = await fetchData({
          url: '/product/5',
          method: 'GET',
          params,
        });

        if (response && response.results) {
          const filteredProducts = response.results.filter(
            (product: Product) => product.status === false
          );

          if (isMounted) {
            setProducts((prevProducts) =>
              pageIndex === 1 ? filteredProducts : [...prevProducts, ...filteredProducts]
            );
            setTotalCount(response.count || filteredProducts.length);
          }
        } else {
          if (isMounted) {
            setProducts([]);
            setTotalCount(0);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching products:', err);
          setProducts([]);
          setTotalCount(0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [pageIndex, pageSize, searchByName, increasingPrice]);

  return { products, totalCount, loading, error, fetchProductDetail, productDetail, detailLoading };
};

export default useProduct;
