// hooks/useUser.ts
import { useCallback, useState } from 'react';
import useAuthAxios from '../utils/useAuthAxios';
import { User } from '../models/User';
import { Leader } from '../models/LeaderInfo';

const useUser = () => {
  const { fetchData } = useAuthAxios();
  const [user, setUser] = useState<User | null>(null);
  const [leaderInfo, setLeaderInfo] = useState<Leader | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchUserAndLeader = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      // Fetch user data
      const userResponse = await fetchData({ url: '/account/3', method: 'GET' });
      if (userResponse) {
        const { customer } = userResponse.response;
        setUser({
          accountId: customer.accountId,
          fullName: customer.fullName,
          email: customer.email,
          avatarUrl: customer.avatarUrl,
          phoneNumber: customer.phoneNumber,
          dateOfBirth: customer.dateOfBirth,
          role: customer.role,
        });
      }

      // Fetch leader data
      const leaderResponse = await fetchData({ url: '/account/20', method: 'GET' });
      if (leaderResponse) {
        const { leaderInfo } = leaderResponse;
        setLeaderInfo({
          accountId: leaderInfo.accountId,
          fullName: leaderInfo.fullName,
          email: leaderInfo.email,
          password: leaderInfo.password,
          phoneNumber: leaderInfo.phoneNumber,
          avatarUrl: leaderInfo.avatarUrl,
          dateOfBirth: leaderInfo.dateOfBirth,
        });
      }
    } catch (error: any) {
      setApiError('Không thể tải thông tin.');
      console.error('Lỗi tải thông tin:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  return { user, leaderInfo, fetchUserAndLeader, loading, apiError };
};

export default useUser;
