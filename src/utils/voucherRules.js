export const AVAILABLE_VOUCHERS = [
  {
    id: "v1",
    code: "MERDEKA79",
    title: "Diskon Kemerdekaan 79%",
    minSpend: 1500,
    maxDiscount: 250,
    expiryDate: "2026-08-17",
    description: 'Diskon hingga £250 dengan minimal belanja £1500.',
  },
  {
    id: "v2",
    code: "GRATISONGKIR",
    title: "Gratis Ongkir se-Indonesia",
    minSpend: 5000,
    maxDiscount: 200,
    expiryDate: "2026-08-31",
    description: 'Potongan ongkir hingga £200 untuk minimal belanja £5000.',
  },
  {
    id: "v3",
    code: "CASHBACK20",
    title: "Cashback 20% Koin",
    minSpend: 2000,
    maxDiscount: 100,
    expiryDate: "2026-08-20",
    description: 'Dapatkan cashback 20% hingga 100 koin.',
  },
];

export const calculateOrderPricing = ({ orderItems, voucherCode }) => {
  const amountWithoutTax = Number(
    orderItems
      .reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0)
      .toFixed(2)
  );

  const taxAmount = Number((amountWithoutTax * 0.15).toFixed(2));
  const baseTotal = Number((amountWithoutTax + taxAmount).toFixed(2));

  let voucherInfo = null;
  let discountAmount = 0;

  if (voucherCode) {
    const selectedVoucher = AVAILABLE_VOUCHERS.find(
      (voucher) => voucher.code.toUpperCase() === voucherCode.toUpperCase()
    );

    if (!selectedVoucher) {
      return {
        isValid: false,
        message: "Voucher tidak ditemukan.",
      };
    }

    const today = new Date();
    const expiryDate = new Date(selectedVoucher.expiryDate);

    if (expiryDate < today) {
      return {
        isValid: false,
        message: "Voucher sudah kadaluarsa.",
      };
    }

    if (amountWithoutTax < selectedVoucher.minSpend) {
      return {
        isValid: false,
        message: `Minimal belanja untuk voucher ${selectedVoucher.code} adalah £${selectedVoucher.minSpend.toLocaleString(
          "id-ID"
        )}.`,
      };
    }

    discountAmount = Math.min(selectedVoucher.maxDiscount, baseTotal);

    voucherInfo = {
      id: selectedVoucher.id,
      code: selectedVoucher.code,
      title: selectedVoucher.title,
      minSpend: selectedVoucher.minSpend,
      maxDiscount: selectedVoucher.maxDiscount,
      expiryDate: selectedVoucher.expiryDate,
      description: selectedVoucher.description,
    };
  }

  const totalAmount = Number(Math.max(0, baseTotal - discountAmount).toFixed(2));

  return {
    isValid: true,
    amountWithoutTax,
    taxAmount,
    baseTotal,
    voucherInfo,
    discountAmount,
    totalAmount,
  };
};