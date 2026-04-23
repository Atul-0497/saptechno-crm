export interface PurchaseOrderItem {
  productName?: string;
  quantity?: string | number;
  listPrice?: string | number;
  amount?: string | number;
  discount?: string | number;
  tax?: string | number;
  description?: string;
}

export interface PurchaseOrderRecord {
  id: string;
  purchaseTitle: string;
  purchaseNumber: string;
  vendorId: string;
  vendorName: string;
  purchaseDate: string;
  expectedDeliveryDate: string;
  status: string;
  referenceNumber?: string;
  paymentTerms?: string;
  billingCountry?: string;
  billingFlat?: string;
  billingStreet?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  billingLatitude?: string;
  billingLongitude?: string;
  shippingCountry?: string;
  shippingFlat?: string;
  shippingStreet?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPostalCode?: string;
  shippingLatitude?: string;
  shippingLongitude?: string;
  orderedItems: PurchaseOrderItem[];
  subTotal?: string | number;
  discount?: string | number;
  tax?: string | number;
  adjustment?: string | number;
  grandTotal?: string | number;
  termsAndConditions?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
