export interface OrderDetail {
  result: {
    product: {
      productId: string;
      name: string;
      imageUrl: string;
      description: string;
      warantyMonths: number;
    };
    orderDetail: {
      orderId: string;
      productId: string;
      quantity: number;
      price: number;
      totalPrice: number;
      warrantyCards: {
        getWarrantyCards: {
          warrantyCardId: string;
          customerId: string;
          productId: string;
          startDate: string;
          expireDate: string;
        }[];
        remainingDays: number[];
      };
    };
  }[];
  sum: number;
  purchaseTime: string;
  fileUrl: string;
}