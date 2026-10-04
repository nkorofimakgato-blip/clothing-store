export interface ShippingInfo {
  fullName: string
  email: string
  address: string
  city: string
  zip: string
  country: string
}

export interface PaymentInfo {
  cardNumber: string
  cardName: string
  expiry: string
  cvc: string
}