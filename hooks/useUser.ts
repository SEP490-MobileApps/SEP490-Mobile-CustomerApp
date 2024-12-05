// hooks/useUser.ts
import { useCallback, useState } from 'react';
import useAuthAxios from '@/utils/useAuthAxios';
import { User } from '@/models/User';
import { Leader } from '@/models/LeaderInfo';
import { useToast } from 'native-base';

const useUser = () => {
  const { fetchData } = useAuthAxios();
  const toast = useToast();
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
        const { customer, apartment, rooms } = userResponse.response;
        setUser({
          accountId: customer.accountId,
          fullName: customer.fullName,
          email: customer.email,
          avatarUrl: customer.avatarUrl,
          phoneNumber: customer.phoneNumber,
          dateOfBirth: customer.dateOfBirth,
          role: customer.role,
          apartmentAvatarUrl: apartment.avatarUrl,
          apartmentName: apartment.name,
          apartmentAddress: apartment.address,
          areaId: apartment.avatarUrl,
          rooms: rooms
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
          leaderId: leaderInfo.leaderId,
        });
      }
    } catch (error: any) {
      setApiError('Không thể tải thông tin.');
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const updateUserAvatar = useCallback(async (photoUri: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: photoUri,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      } as any); // Casting to any to bypass TypeScript issue

      await fetchData({
        url: '/account/5',
        method: 'PUT',
        data: formData,
        header: { 'Content-Type': 'multipart/form-data' },
      });

      // Show success toast
      toast.show({
        description: 'Cập nhật ảnh đại diện thành công',
        duration: 3000,
        bg: 'green.500',
      });
    } catch (error) {
      setApiError('Không thể cập nhật ảnh đại diện.');
      toast.show({
        description: 'Không thể cập nhật ảnh đại diện',
        duration: 3000,
        bg: 'red.500',
      });
    } finally {
      setLoading(false);
    }
  }, [fetchData, toast]);

  const updateUserInfo = useCallback(async (fullName: string, email: string, dateOfBirth: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('dateOfBirth', dateOfBirth);

      await fetchData({
        url: '/account/4',
        method: 'PUT',
        data: formData,
        header: { 'Content-Type': 'multipart/form-data' },
      });

      toast.show({
        description: 'Cập nhật thông tin thành công',
        duration: 3000,
        bg: 'green.500',
      });

      // Refresh user data after update
      await fetchUserAndLeader();
    } catch (error) {
      setApiError('Không thể cập nhật thông tin người dùng.');
      toast.show({
        description: 'Không thể cập nhật thông tin người dùng',
        duration: 3000,
        bg: 'red.500',
      });
    } finally {
      setLoading(false);
    }
  }, [fetchData, toast]);


  return { user, leaderInfo, fetchUserAndLeader, loading, apiError, updateUserAvatar, updateUserInfo };
};

export default useUser;