import { ServicePackage } from '../models/ServicePackage';
import { Review } from '../models/Review';

export const servicePackages: ServicePackage[] = [
  {
    id: '1',
    name: 'Gói dịch vụ 9 lần',
    price: 600000,
    imageUrl: require('../assets/images/package1.png'),
  },
  {
    id: '2',
    name: 'Gói dịch vụ 18 lần',
    price: 1200000,
    imageUrl: require('../assets/images/package2.png'),
  },
  {
    id: '3',
    name: 'Gói dịch vụ 36 lần',
    price: 2100000,
    imageUrl: require('../assets/images/package3.png'),
  },
  {
    id: '4',
    name: 'Gói dịch vụ 50 lần',
    price: 3800000,
    imageUrl: require('../assets/images/package4.png'),
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    userName: 'Võ Hoàng Vũ',
    avatarUrl: require('../assets/images/user1.png'), // Đảm bảo sử dụng require()
    rating: 5,
    comment: 'Tôi rất hài lòng với dịch vụ sửa chữa...',
  },
  {
    id: '2',
    userName: 'Lê Hoàng Hà',
    avatarUrl: require('../assets/images/user2.png'),
    rating: 4,
    comment:
      'Tôi đã yêu cầu sửa chữa qua ứng dụng và quy trình rất dễ dàng. Tuy nhiên, có một chút chậm trễ khi xử lý yêu cầu, phải chờ đến 2 ngày sau mới có nhân viên đến kiểm tra.',
  },
  {
    id: '3',
    userName: 'Nguyễn Thị Lan',
    avatarUrl: require('../assets/images/user3.png'),
    rating: 5,
    comment:
      'Dịch vụ sửa chữa của hệ thống là tốt nhất. Nhân viên sửa chữa đã đến đúng giờ, kiểm tra kỹ lưỡng và giải quyết vấn đề điện nước trong nhà tôi một cách nhanh chóng',
  },
  {
    id: '4',
    userName: 'Trần Văn Đức',
    avatarUrl: require('../assets/images/user4.png'),
    rating: 4,
    comment:
      'Dịch vụ sửa chữa của hệ thống là tốt nhất. Nhân viên sửa chữa đã đến đúng giờ, kiểm tra kỹ lưỡng và giải quyết vấn đề điện nước trong nhà tôi một cách nhanh chóng',
  },
  {
    id: '5',
    userName: 'Phạm Thị Mai',
    avatarUrl: require('../assets/images/user5.png'),
    rating: 5,
    comment:
      'Dịch vụ sửa chữa của hệ thống là tốt nhất. Nhân viên sửa chữa đã đến đúng giờ, kiểm tra kỹ lưỡng và giải quyết vấn đề điện nước trong nhà tôi một cách nhanh chóng',
  },
];
