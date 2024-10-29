import { ServicePackage } from '../models/ServicePackage';
import { Review } from '../models/Review';
import { RepairRequest } from '../models/RepairRequest';
import { Customer } from '../models/Customer';
import { Product } from '../models/Product';

export const mockCustomer: Customer = {
  customerId: "001",
  fullName: "Võ Hoàng Vũ",
  email: "vuvhse172148@fpt.edu.vn",
  phoneNumber: "0123456789",
  avatarUrl: "https://cdn-icons-png.flaticon.com/512/219/219983.png",
  dateOfBirth: "1990-02-01",
  cmtCccd: "012345678",
};

export const products: Product[] = [
  {
    ProductId: "P001",
    Name: "Ổ Cắm 3 Lỗ",
    Description: `Ổ cắm 3 lỗ là thiết bị điện tiện dụng, cho phép kết nối nhiều thiết bị cùng lúc. Với thiết kế nhỏ gọn, chất liệu nhựa cách điện bền bỉ, và khả năng chịu tải cao, ổ cắm này phù hợp cho nhiều loại phích cắm khác nhau. Nó cũng có tính năng bảo vệ quá tải, đảm bảo an toàn khi sử dụng`,
    ImageUrl: "https://cdn.pixabay.com/photo/2016/04/01/12/05/socket-1300518_960_720.png",
    In_Of_Stock: 10,
    WarrantyMonths: 12,
    Status: true,
    Price: 20000, // Giá hiện tại của sản phẩm
  },
  {
    ProductId: "P002",
    Name: "Chuông cửa",
    Description: "Thiết bị báo hiệu khi có khách đến, với âm thanh rõ ràng và thiết kế hiện đại. Chuông cửa dễ lắp đặt và sử dụng, có thể kết nối không dây hoặc có dây tùy theo nhu cầu. Một số mẫu còn tích hợp camera để quan sát và ghi hình, tăng cường an ninh cho ngôi nhà của bạn.",
    ImageUrl: "https://png.pngtree.com/png-vector/20240518/ourmid/pngtree-smart-camera-doorbell-enhanced-home-security-solution-png-image_12491911.png",
    In_Of_Stock: 5,
    WarrantyMonths: 24,
    Status: true,
    Price: 300000, // Giá hiện tại của sản phẩm
  },

  {
    ProductId: "P003",
    Name: "Dây điện nhựa",
    Description: "Dây điện bọc nhựa cách điện, chịu nhiệt tốt, an toàn cho các công trình điện dân dụng và công nghiệp. Dây điện nhựa có nhiều loại kích thước và màu sắc khác nhau, phù hợp với nhiều mục đích sử dụng. Chất liệu nhựa bền bỉ giúp bảo vệ lõi dây khỏi các tác động bên ngoài, đảm bảo an toàn và độ bền cao.",
    ImageUrl: "https://png.pngtree.com/png-clipart/20231101/original/pngtree-coil-of-a-wire-pipe-photo-png-image_13474160.png",
    In_Of_Stock: 8,
    WarrantyMonths: 24,
    Status: true,
    Price: 45000, // Giá hiện tại của sản phẩm
  },

  {
    ProductId: "P004",
    Name: "Máy nước nóng cao cấp",
    Description: "Thiết bị làm nóng nước nhanh chóng, tiết kiệm năng lượng, với nhiều chế độ điều chỉnh nhiệt độ và tính năng an toàn cao. Máy nước nóng cao cấp thường có thiết kế sang trọng, dễ dàng lắp đặt và sử dụng. Một số mẫu còn tích hợp công nghệ chống giật và bảo vệ quá nhiệt, đảm bảo an toàn tuyệt đối cho người sử dụng.",
    ImageUrl: "https://daihiep.com/wp-content/uploads/2019/10/REI-A450AP-WB.png",
    In_Of_Stock: 2,
    WarrantyMonths: 6,
    Status: true,
    Price: 2000000, // Giá hiện tại của sản phẩm
  },


];

export const customers: Customer[] = [
  {
    customerId: '123',
    fullName: 'Võ Hoàng Vũ',
    email: 'vu@gmail.com',
    phoneNumber: '0898901823',
    avatarUrl: 'https://via.placeholder.com/150',
    dateOfBirth: '2024-09-24T10:00:00Z',
    cmtCccd: '067865444678',
  },

  {
    customerId: '456',
    fullName: 'Nguyễn Thị Bích',
    email: 'bich@gmail.com',
    phoneNumber: '0898901824',
    avatarUrl: 'https://via.placeholder.com/150',
    dateOfBirth: '2024-09-24T10:00:00Z',
    cmtCccd: '067865444679',
  },

];

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

export const servicePackages: ServicePackage[] = [
  {
    id: '1',
    name: 'Gói dịch vụ 9 lần',
    price: 600000,
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
    id: '2',
    name: 'Gói dịch vụ 3 lần',
    price: 400000,
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
    id: '3',
    name: 'Gói dịch vụ 1 lần',
    price: 200000,
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
    id: '4',
    name: 'Gói dịch vụ 2 lần',
    price: 300000,
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
