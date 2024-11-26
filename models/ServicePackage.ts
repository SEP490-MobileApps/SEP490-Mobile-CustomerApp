// models/ServicePackage.ts
export interface ServicePackage {
  servicePackageId: string,
  name: string;
  numOfRequest: number,
  imageUrl: any,
  description: string,
  status: boolean,
  priceByDate: number,
  policy: string,
  purchaseTime: string;
  isOnlinePayment: boolean;
  servicesList: string;
}
