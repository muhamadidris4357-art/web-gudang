import React from 'react';
import { ActiveScreen } from '../types';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (screen: ActiveScreen) => void;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-surface-container">
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-secondary text-on-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">add</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-on-surface font-semibold">Transaksi Baru</h3>
              <p className="text-xs text-on-surface-variant">Pilih jenis operasional logistik</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-3">
          <button
            type="button"
            onClick={() => {
              onSelectAction('barang-masuk');
              onClose();
            }}
            className="w-full p-4 bg-surface-container-low hover:bg-surface-container rounded-xl flex items-center gap-4 text-left transition-all border border-transparent hover:border-secondary/30 group"
          >
            <div className="w-11 h-11 rounded-xl bg-secondary/10 group-hover:bg-secondary text-secondary group-hover:text-on-secondary flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[24px]">move_to_inbox</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-on-surface text-sm">Penerimaan Inbound (Barang Masuk)</h4>
              <p className="text-xs text-on-surface-variant">Entry Surat Jalan supplier, verifikasi QC, dan perbarui stok</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectAction('barang-keluar');
              onClose();
            }}
            className="w-full p-4 bg-surface-container-low hover:bg-surface-container rounded-xl flex items-center gap-4 text-left transition-all border border-transparent hover:border-secondary/30 group"
          >
            <div className="w-11 h-11 rounded-xl bg-on-tertiary-container/10 group-hover:bg-on-tertiary-container text-on-tertiary-container group-hover:text-white flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[24px]">outbox</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-on-surface text-sm">Pengeluaran Outbound (Barang Keluar)</h4>
              <p className="text-xs text-on-surface-variant">Terbitkan Surat Jalan (DO), protokol anti-minus, dan dispatch armada</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectAction('data-barang');
              onClose();
            }}
            className="w-full p-4 bg-surface-container-low hover:bg-surface-container rounded-xl flex items-center gap-4 text-left transition-all border border-transparent hover:border-secondary/30 group"
          >
            <div className="w-11 h-11 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[24px]">inventory_2</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-on-surface text-sm">Master Data & Stok Opname</h4>
              <p className="text-xs text-on-surface-variant">Daftarkan SKU baru atau sesuaikan alokasi zona rak gudang</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};
