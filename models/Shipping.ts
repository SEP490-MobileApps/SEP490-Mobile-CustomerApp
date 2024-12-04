export interface Shipping {
  shippingOrder: {
    status?: number;
    shipmentDate: string;
    deliveriedDate: string;
  }

  workerInfo: {
    avatarUrl: string;
    fullName: string;
    phoneNumber: string;
  } | null;
}
