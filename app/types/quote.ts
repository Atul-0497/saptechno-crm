export interface QuoteItem {
  productName?: string;
  quantity?: string | number;
  listPrice?: string | number;
  amount?: string | number;
  discount?: string | number;
  tax?: string | number;
  description?: string;
}

export interface QuoteRecord {
  id: string;
  quoteTitle: string;
  quoteNumber: string;
  vendorId: string;
  vendorName: string;
  quoteDate: string;
  validUntil: string;
  status: string;
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
  quotedItems: QuoteItem[];
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
