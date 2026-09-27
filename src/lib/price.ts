export function formatPrice(
  price: number | null | undefined
) {
  if (
    price === null ||
    price === undefined
  ) {
    return "Price on request";
  }

  return `Rs. ${new Intl.NumberFormat(
    "en-PK",
    {
      maximumFractionDigits: 0,
    }
  ).format(price)}`;
}