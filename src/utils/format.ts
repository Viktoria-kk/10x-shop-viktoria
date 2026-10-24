const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function discountedPrice(price: number, percentage: number): number {
  return price * (1 - percentage / 100)
}

export function formatPrice(amount: number): string {
  return usdFormatter.format(amount)
}
