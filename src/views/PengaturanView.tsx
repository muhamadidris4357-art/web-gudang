import React, { useState } from 'react';

interface PengaturanViewProps {
  activeLocation: string;
  onSelectLocation: (loc: string) => void;
  onTriggerToast: (msg: string) => void;
}

export const PengaturanView: React.FC<PengaturanViewProps> = ({
  activeLocation,
  onSelectLocation,
  onTriggerToast,
}) => {
  const [scannerMode, setScannerMode] = useState('HID');
  const [printerPort, setPrinterPort] = useState('Zebra ZD420 (USB001 - 203 DPI)');
  const [autoDeductStock, setAutoDeductStock] = useState(true);
  const [antiMinusStrict, setAntiMinusStrict] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <div className="flex flex-col w-full gap-space-xl">
      <div className="flex flex-col gap-space-xxs">
        <div className="flex items-center gap-space-xs font-table-header text-table-header uppercase text-on-surface-variant">
          <span>GudangKu WMS</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span>Sistem & Perangkat</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          Pengaturan Perangkat & Konfigurasi WMS
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Konfigurasi pemindai barcode, printer label thermal, integrasi ERP, dan kebijakan protokol inventaris.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {/* Hardware & Peripherals */}
        <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col gap-space-md border border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">qr_code_scanner</span>
            <h3 className="font-headline-sm text-on-surface font-semibold">Integrasi Pemindai Barcode</h3>
          </div>
          <p className="text-xs text-on-surface-variant">
            Konfigurasi koneksi pemindai genggam nirkabel (Honeywell / Zebra).
          </p>

          <div className="space-y-3">
            <div>
              <label className="font-table-header uppercase text-on-surface-variant text-[11px] block mb-1">
                Mode Input Pemindai
              </label>
              <select
                value={scannerMode}
                onChange={(e) => setScannerMode(e.target.value)}
                className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg focus:ring-2 focus:ring-secondary"
              >
                <option value="HID">Mode USB Keyboard Emulation (HID) - Direkomendasikan</option>
                <option value="SPP">Mode Serial Bluetooth (SPP)</option>
                <option value="WEBSOCKET">Mode IoT Network Scanner Gateway</option>
              </select>
            </div>

            <div>
              <label className="font-table-header uppercase text-on-surface-variant text-[11px] block mb-1">
                Printer Label Thermal Aktif
              </label>
              <select
                value={printerPort}
                onChange={(e) => setPrinterPort(e.target.value)}
                className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg focus:ring-2 focus:ring-secondary"
              >
                <option value="Zebra ZD420 (USB001 - 203 DPI)">Zebra ZD420 (USB001 - 203 DPI)</option>
                <option value="Honeywell PC42t (Network 192.168.1.140)">Honeywell PC42t (Network 192.168.1.140)</option>
                <option value="TSC TE200 (USB Direct)">TSC TE200 (USB Direct)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => onTriggerToast('Uji cetak barcode berhasil dikirim ke printer thermal')}
              className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Uji Cetak Label Sampel</span>
            </button>
          </div>
        </div>

        {/* Operational Security Protocols */}
        <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col gap-space-md border border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">shield</span>
            <h3 className="font-headline-sm text-on-surface font-semibold">Kebijakan Protokol Inventaris</h3>
          </div>
          <p className="text-xs text-on-surface-variant">
            Aturan validasi sistem untuk menjaga keakuratan stok fisik vs buku besar.
          </p>

          <div className="space-y-4">
            <label className="flex items-start gap-3 p-3 bg-surface-container-low rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={antiMinusStrict}
                onChange={(e) => setAntiMinusStrict(e.target.checked)}
                className="w-4 h-4 mt-1 rounded text-secondary focus:ring-0 cursor-pointer accent-secondary"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-on-surface text-sm">Enforce Protokol Anti-Minus Ketat</span>
                <span className="text-xs text-on-surface-variant">
                  Memblokir penerbitan Surat Jalan jika stok fisik lebih kecil dari kuantitas order.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-surface-container-low rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={autoDeductStock}
                onChange={(e) => setAutoDeductStock(e.target.checked)}
                className="w-4 h-4 mt-1 rounded text-secondary focus:ring-0 cursor-pointer accent-secondary"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-on-surface text-sm">Otomatisasi Potong Saldo Saat Dispatch</span>
                <span className="text-xs text-on-surface-variant">
                  Mengurangi stok gudang seketika dokumen Surat Jalan berstatus "Dispatched".
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-surface-container-low rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 mt-1 rounded text-secondary focus:ring-0 cursor-pointer accent-secondary"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-on-surface text-sm">Pemberitahuan Safety Stock Kritis</span>
                <span className="text-xs text-on-surface-variant">
                  Kirim notifikasi otomatis ke tim procurement saat SKU menyentuh titik minimum.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
