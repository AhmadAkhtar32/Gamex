const priceFormatter =
  new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  });

export function formatPrice(
  price: number
) {
  if (!price || price <= 0) {
    return "Price on request";
  }

  return `Rs. ${priceFormatter.format(
    price
  )}`;
}