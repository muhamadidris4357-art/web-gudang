import React from 'react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  docNumber: string;
  docType: 'inbound' | 'outbound' | 'report';
  data: any;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  title,
  docNumber,
  docType,
  data,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-surface-container">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">
                {docType === 'report' ? 'assessment' : docType === 'inbound' ? 'move_to_inbox' : 'local_shipping'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-code-sm text-secondary font-bold">{docNumber}</span>
              <h3 className="font-headline-sm text-on-surface font-semibold">{title}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body / Document Sheet */}
        <div className="p-6 overflow-y-auto space-y-6 font-body-sm text-on-surface">
          {/* Document Header Letterhead */}
          <div className="flex items-center justify-between pb-4 border-b border-surface-container">
            <div className="flex items-center gap-2">
              <span className="font-headline-md font-bold text-on-surface">GudangKu</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed">
                ENTERPRISE WMS
              </span>
            </div>
            <div className="text-right text-xs text-on-surface-variant">
              <p className="font-semibold text-on-surface">DC Cikarang Barat - Hub 1</p>
              <p>Jl. Industri Selatan Blok JJ, Cikarang</p>
              <p className="font-code-sm">Status: Terverifikasi Sistem</p>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-surface-container-low rounded-xl">
            <div>
              <span className="text-xs uppercase font-table-header text-on-surface-variant block">No. Dokumen</span>
              <span className="font-code-sm font-bold text-on-surface">{docNumber}</span>
            </div>
            <div>
              <span className="text-xs uppercase font-table-header text-on-surface-variant block">Tanggal Cetak</span>
              <span className="font-code-sm text-on-surface">24 Okt 2023, 17:30 WIB</span>
            </div>
            <div>
              <span className="text-xs uppercase font-table-header text-on-surface-variant block">
                {docType === 'inbound' ? 'Supplier / Pemasok' : docType === 'outbound' ? 'Tujuan / Penerima' : 'Kategori Laporan'}
              </span>
              <span className="font-semibold text-on-surface">
                {data?.supplier || data?.customer || 'Rekapitulasi Mutasi Bulanan'}
              </span>
            </div>
            <div>
              <span className="text-xs uppercase font-table-header text-on-surface-variant block">
                {docType === 'outbound' ? 'Armada / Kurir' : 'Petugas Otorisasi'}
              </span>
              <span className="text-on-surface">
                {data?.courier || 'Andi Pratama, S.Log (Supervisor)'}
              </span>
            </div>
          </div>

          {/* Line items details */}
          <div className="border border-surface-container rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-xs font-semibold text-on-surface-variant uppercase">
                <tr>
                  <th className="py-2.5 px-4">Nama Barang & SKU</th>
                  <th className="py-2.5 px-4">Lokasi Rak</th>
                  <th className="py-2.5 px-4 text-right">Kuantitas</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-xs">
                <tr>
                  <td className="py-3 px-4">
                    <span className="font-semibold block text-on-surface">
                      {data?.itemName || 'Beras Premium Ramos 5 kg'}
                    </span>
                    <span className="font-code-sm text-[11px] text-on-surface-variant">
                      {data?.sku || 'SKU-88219'}
                    </span>
                  </td>
                  <td className="py-3 px-4">{data?.rackLocation || 'Rak A-02-1'}</td>
                  <td className="py-3 px-4 text-right font-code-sm font-bold">
                    {data?.qty ? `${data.qty} ${data.unit || 'Unit'}` : '100 Sak'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                      Terverifikasi
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Digital Signature Stamp */}
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-secondary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">fingerprint</span>
              </div>
              <div>
                <span className="font-code-sm text-[11px] text-secondary font-bold tracking-widest block">
                  DIGITALLY SIGNED & SEALED
                </span>
                <span className="text-xs text-on-surface-variant">
                  Otorisasi WMS Enterprise • SHA-256 Validated
                </span>
              </div>
            </div>
            <span className="font-code-sm text-xs text-on-surface-variant">24/10/2023 17:15 WIB</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-surface-container flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-code-sm">
            DOC/WMS-VLD/202310/8942
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-secondary text-on-secondary hover:bg-on-secondary-container rounded-xl font-label-md text-sm font-semibold transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Cetak Dokumen</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-label-md text-sm transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
