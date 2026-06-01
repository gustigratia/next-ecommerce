// A pure utility function to test — price formatting
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

describe('formatPrice', () => {
  it('should format a number as USD currency string', () => {
    expect(formatPrice(29.99)).toBe('$29.99')
  })
})