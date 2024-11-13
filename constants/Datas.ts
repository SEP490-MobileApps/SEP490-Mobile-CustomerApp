import { ServicePackage } from '../models/ServicePackage';
import { Review } from '../models/Review';
import { RepairRequest } from '../models/RepairRequest';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Leader } from "../models/LeaderInfo";
import { Order } from "../models/Order";

export const orders: Order[] = [
  { id: 1, productCount: 2, purchaseTime: "2024-09-04", price: "9.260.000" },
  { id: 2, productCount: 12, purchaseTime: "2024-12-04", price: "400.000" },
  { id: 3, productCount: 3, purchaseTime: "2024-03-04", price: "50.000" },
  { id: 4, productCount: 6, purchaseTime: "2024-07-04", price: "670.000" },
  { id: 5, productCount: 9, purchaseTime: "2024-06-04", price: "870.000" },
];


export const servicePackages: ServicePackage[] = [
  {
    servicePackageId: '1',
    purchaseTime: "2024-09-20",
    numOfRequest: 8,
    status: false,
    name: 'Gói dịch vụ 9 lần',
    priceByDate: 600000,
    imageUrl: require('../assets/images/package1.png'),
    description: 'Được sử dụng 9 lượt sửa chữa vĩnh viễn...',
    policy: 'Cam kết bảo hành 30 ngày cho mỗi lần sửa chữa...',
    servicesList: `
1. Điện
- Thay bóng đèn (âm tường, gắn ngoài)
- Lắp đặt thiết bị điện gia dụng như máy nước nóng, máy khử mùi...

2. Nước
- Lắp đặt/thay thế ống nước, vòi sen...
- Sửa chữa các sự cố về tắc nghẽn cống/bồn rửa...
    `,
  },

  {
    servicePackageId: '2',
    purchaseTime: "2024-09-25",
    numOfRequest: 8,
    status: false,
    name: 'Gói dịch vụ 3 lần',
    priceByDate: 400000,
    imageUrl: require('../assets/images/package2.png'),
    description: 'Được sử dụng 3 lượt sửa chữa vĩnh viễn...',
    policy: 'Cam kết bảo hành 30 ngày cho mỗi lần sửa chữa...',
    servicesList: `
1.Điện
- Thay bóng đèn (âm tường, gắn ngoài)
- Lắp đặt thiết bị điện gia dụng như máy nước nóng, máy khử mùi...

2.Nước
- Lắp đặt/thay thế ống nước, vòi sen...
- Sửa chữa các sự cố về tắc nghẽn cống/bồn rửa...
    `,
  },
  {
    servicePackageId: '3',
    purchaseTime: "2024-10-20",
    numOfRequest: 8,
    status: false,
    name: 'Gói dịch vụ 1 lần',
    priceByDate: 200000,
    imageUrl: require('../assets/images/package3.png'),
    description: 'Được sử dụng 1 lượt sửa chữa vĩnh viễn...',
    policy: 'Cam kết bảo hành 30 ngày cho mỗi lần sửa chữa...',
    servicesList: `
1. Điện
- Thay bóng đèn (âm tường, gắn ngoài)
- Lắp đặt thiết bị điện gia dụng như máy nước nóng, máy khử mùi...

2. Nước
- Lắp đặt/thay thế ống nước, vòi sen...
- Sửa chữa các sự cố về tắc nghẽn cống/bồn rửa...
    `,
  },

  {
    servicePackageId: '4',
    purchaseTime: "2024-09-02",
    name: 'Gói dịch vụ 2 lần',
    numOfRequest: 8,
    status: false,
    priceByDate: 300000,
    imageUrl: require('../assets/images/package4.png'),
    description: 'Được sử dụng 2 lượt sửa chữa vĩnh viễn...',
    policy: 'Cam kết bảo hành 30 ngày cho mỗi lần sửa chữa...',
    servicesList: `
1. Điện
- Thay bóng đèn (âm tường, gắn ngoài)
- Lắp đặt thiết bị điện gia dụng như máy nước nóng, máy khử mùi...

2. Nước
- Lắp đặt/thay thế ống nước, vòi sen...
- Sửa chữa các sự cố về tắc nghẽn cống/bồn rửa...
    `,
  },
  {
    servicePackageId: '5',
    purchaseTime: "2024-12-28",
    name: 'Gói dịch vụ 1 lần',
    numOfRequest: 8,
    status: false,
    priceByDate: 200000,
    imageUrl: require('../assets/images/package4.png'),
    description: 'Được sử dụng 1 lượt sửa chữa vĩnh viễn...',
    policy: 'Cam kết bảo hành 30 ngày cho mỗi lần sửa chữa...',
    servicesList: `
1. Điện
- Thay bóng đèn (âm tường, gắn ngoài)
- Lắp đặt thiết bị điện gia dụng như máy nước nóng, máy khử mùi...

2. Nước
- Lắp đặt/thay thế ống nước, vòi sen...
- Sửa chữa các sự cố về tắc nghẽn cống/bồn rửa...
    `,
  },
];
// export const leaderData: Leader | null = null;

export const leaderData: Leader | null = {
  name: "Võ Minh Thuận",
  phone: "0932757406",
  email: "thuanvm@gmail.com",
  avatarUrl: "https://via.placeholder.com/150", // Thay thế bằng URL ảnh thật nếu có
};

export const mockCustomer: User = {
  accountId: "001",
  fullName: "Võ Hoàng Vũ",
  email: "vuvhse172148@fpt.edu.vn",
  phoneNumber: "0123456789",
  avatarUrl: "https://cdn-icons-png.flaticon.com/512/219/219983.png",
  dateOfBirth: "1990-02-01",
  role: "CUSTOMER"
};

export const repairRequests: RepairRequest[] = [
  {
    requestId: '1',
    leaderId: 'L01',
    customerId: 'C01',
    contractId: 'CN01',
    roomId: 'R01',
    start: '2024-09-24T10:00:00Z',
    end: '2024-10-20T12:00:00Z',
    customerProblem: 'Điều hòa không mát',
    conclusion: 'Sửa quạt điều hòa',
    status: 'done',
    categoryRequest: 'free',
    purchaseTime: '2024-09-24T09:00:00Z',
    totalPrice: 500000,
    fileUrl: 'http://example.com/repair.pdf',
    orderCode: 1234567890,
    isOnlinePayment: true,
  },
  {
    requestId: '2',
    leaderId: 'L02',
    customerId: 'C02',
    contractId: 'CN02',
    roomId: 'R02',
    start: '2024-09-24T11:00:00Z',
    end: undefined,
    customerProblem: 'Bóng đèn bị cháy',
    conclusion: undefined,
    status: 'processing',
    categoryRequest: 'free',
    purchaseTime: undefined,
    totalPrice: undefined,
    fileUrl: undefined,
    orderCode: undefined,
    isOnlinePayment: false,
  },
  {
    requestId: '3',
    leaderId: 'L03',
    customerId: 'C03',
    contractId: 'CN03',
    roomId: 'R03',
    start: '2024-09-24T12:00:00Z',
    end: '2024-10-20T13:00:00Z',
    customerProblem: 'Nước chảy yếu',
    conclusion: 'Thay đường ống nước',
    status: 'canceled',
    categoryRequest: 'free',
    purchaseTime: '2024-09-24T12:30:00Z',
    totalPrice: undefined,
    fileUrl: undefined,
    orderCode: undefined,
    isOnlinePayment: false,
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    userName: 'Võ Hoàng Vũ',
    avatarUrl: require('../assets/images/user1.png'),
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
