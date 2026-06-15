'use client';

import React, { useEffect, useState } from 'react';

const mockVouchers = [
  {
    id: 'v1',
    code: 'MERDEKA79',
    title: 'Diskon Kemerdekaan 79%',
    minSpend: 1500,
    maxDiscount: 250,
    expiry: '17 Agustus 2026',
    description: 'Diskon hingga £250 dengan minimal belanja £1500.',
  },
  {
    id: 'v2',
    code: 'GRATISONGKIR',
    title: 'Gratis Ongkir se-Indonesia',
    minSpend: 5000,
    maxDiscount: 200,
    expiry: '31 Agustus 2026',
    description: 'Potongan ongkir hingga £200 untuk minimal belanja £5000.',
  },
  {
    id: 'v3',
    code: 'CASHBACK20',
    title: 'Cashback 20% Koin',
    minSpend: 2000,
    maxDiscount: 100,
    expiry: '20 Agustus 2026',
    description: 'Dapatkan cashback 20% hingga 100 koin.',
  },
];

export default function CheckoutVoucher({ onApplyVoucher, amountWithoutTax = null }) {
  const [inputCode, setInputCode] = useState('');
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedCode = localStorage.getItem('appliedPromoCode');

    if (savedCode) {
      const foundVoucher = mockVouchers.find(
        (voucher) => voucher.code.toUpperCase() === savedCode.toUpperCase()
      );

      if (foundVoucher) {
        setSelectedVoucherId(foundVoucher.id);
      }
    }
  }, []);

  const isVoucherEligible = (voucher) => {
    if (amountWithoutTax === null) return true;
    return amountWithoutTax >= voucher.minSpend;
  };

  const handleManualApply = () => {
    setMessage('');

    if (!inputCode.trim()) {
      setMessage('Masukkan kode voucher terlebih dahulu.');
      return;
    }

    const found = mockVouchers.find(
      (voucher) => voucher.code.toUpperCase() === inputCode.trim().toUpperCase()
    );

    if (!found) {
      setMessage('Voucher tidak ditemukan atau sudah kadaluarsa.');
      return;
    }

    if (!isVoucherEligible(found)) {
      setMessage(
        `Minimal belanja untuk voucher ini adalah £${found.minSpend.toLocaleString('id-ID')}.`
      );
      return;
    }

    setSelectedVoucherId(found.id);
    setMessage(`Voucher ${found.code} berhasil dipilih.`);
  };

  const handleSelectVoucher = (voucher) => {
    setMessage('');

    if (!isVoucherEligible(voucher)) {
      setMessage(
        `Minimal belanja untuk voucher ${voucher.code} adalah £${voucher.minSpend.toLocaleString(
          'id-ID'
        )}.`
      );
      return;
    }

    setSelectedVoucherId((prevId) => (prevId === voucher.id ? null : voucher.id));
  };

  const handleConfirm = () => {
    const selected = mockVouchers.find((voucher) => voucher.id === selectedVoucherId);

    if (!selected) {
      setMessage('Pilih voucher terlebih dahulu.');
      return;
    }

    if (onApplyVoucher) {
      onApplyVoucher(selected);
    }

    localStorage.setItem('appliedPromoCode', selected.code);
    setMessage(`Voucher ${selected.code} berhasil digunakan.`);
  };

  const handleRemoveVoucher = () => {
    setSelectedVoucherId(null);
    setInputCode('');
    setMessage('');
    localStorage.removeItem('appliedPromoCode');

    if (onApplyVoucher) {
      onApplyVoucher(null);
    }
  };

  const selectedVoucher = mockVouchers.find((voucher) => voucher.id === selectedVoucherId);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="bg-red-50 px-5 py-4 border-b border-red-100 flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
          <i className="fas fa-ticket-alt text-red-600"></i>
        </div>
        <h3 className="font-bold text-gray-800 text-lg leading-none">
          Makin Hemat Pakai Promo
        </h3>
      </div>

      <div className="p-5">
        <div className="flex flex-row items-stretch gap-2 mb-6 w-full">
          <input
            type="text"
            placeholder="Masukkan kode Voucher"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleManualApply();
              }
            }}
            className="flex-1 w-0 min-w-0 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 uppercase transition-all"
          />

          <button
            type="button"
            onClick={handleManualApply}
            className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex-shrink-0 whitespace-nowrap"
          >
            Pakai
          </button>
        </div>

        {message && <p className="text-sm text-red-600 mb-4">{message}</p>}

        <div className="space-y-4 max-h-80 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
          {mockVouchers.map((voucher) => {
            const isSelected = selectedVoucherId === voucher.id;
            const isEligible = isVoucherEligible(voucher);

            return (
              <button
                type="button"
                key={voucher.id}
                onClick={() => handleSelectVoucher(voucher)}
                className={`relative flex items-start text-left p-4 rounded-xl border-2 transition-all duration-200 w-full ${
                  isSelected
                    ? 'border-red-500 bg-red-50/50 shadow-sm'
                    : 'border-gray-200 hover:border-red-200 hover:bg-gray-50'
                } ${!isEligible ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex-shrink-0 mr-4 mt-1">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-red-600' : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>}
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex flex-col min-w-0 pr-0 sm:pr-2">
                    <h4 className="font-bold text-gray-800 text-base leading-snug mb-1.5">
                      {voucher.title}
                    </h4>

                    <p className="text-sm text-gray-600 leading-relaxed mb-3 break-words">
                      {voucher.description}
                    </p>

                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Minimal belanja: £{voucher.minSpend.toLocaleString('id-ID')}
                    </p>

                    <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                      <i className="far fa-clock"></i> Berakhir: {voucher.expiry}
                    </p>

                    {!isEligible && amountWithoutTax !== null && (
                      <p className="text-xs text-red-500 mt-2">
                        Tambahkan £{(voucher.minSpend - amountWithoutTax).toLocaleString('id-ID')}{' '}
                        lagi untuk memakai voucher ini.
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <span className="inline-block bg-white text-red-700 text-xs font-black tracking-wide px-3 py-1.5 rounded-md border border-red-200 border-dashed whitespace-nowrap">
                      {voucher.code}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600 flex items-center gap-2">
          {selectedVoucher ? (
            <>
              <i className="fas fa-check-circle text-green-500 text-lg flex-shrink-0"></i>
              <span className="leading-tight">
                1 Voucher dipilih -{' '}
                <strong className="text-gray-900 block sm:inline">
                  Potongan hingga £{selectedVoucher.maxDiscount.toLocaleString('id-ID')}
                </strong>
              </span>
            </>
          ) : (
            <span>Pilih voucher untuk menikmati diskon.</span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {selectedVoucher && (
            <button
              type="button"
              onClick={handleRemoveVoucher}
              className="w-full sm:w-auto px-5 py-3 rounded-lg font-bold bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all whitespace-nowrap"
            >
              Hapus
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedVoucher}
            className={`w-full sm:w-auto px-8 py-3 rounded-lg font-bold transition-all flex-shrink-0 whitespace-nowrap ${
              selectedVoucher
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
}