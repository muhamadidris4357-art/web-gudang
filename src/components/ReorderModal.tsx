import React, { useState } from 'react';
import { InventoryItem } from '../types';

interface ReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onConfirmReorder: (item: InventoryItem, qty: number, supplier: string) => void;
}

export const ReorderModal: React.FC<ReorderModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirmReorder,
}) => {
  if (!isOpen || !item) return null;

  const [qty, setQty] = useState(item.minStock * 2 || 50);
  const [supplier, setSupplier] = useState(item.supplier || 'PT Pangan Nusantara Raya');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-surface-container">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">shopping_cart_checkout</span>
            </div>
            <div>
              <span className="font-code-sm text-secondary font-bold text-xs">{item.sku}</span>
              <h3 className="font-headline-sm text-on-surface font-semibold">Pesan Ulang (Restock PO)</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onConfirmReorder(item, Number(qty), supplier);
            onClose();
          }}
          className="p-6 space-y-4"
        >
          <div className="p-3 bg-surface-container-low rounded-xl flex items-center gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded-lg object-cover bg-surface-container"
            />
            <div>
              <h4 className="font-semibold text-on-surface text-sm">{item.name}</h4>
              <p className="text-xs text-on-surface-variant">
                Stok saat ini: <strong className="text-error">{item.stock} {item.unit}</strong> (Min: {item.minStock})
              </p>
            </div>
          </div>

          <div>
            <label className="font-table-header uppercase text-on-surface-variant text-[11px] block mb-1">
              Jumlah Pesanan Reorder
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                min="1"
                required
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full h-10 pl-3 pr-16 bg-surface-container-low text-on-surface font-semibold rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
              />
              <span className="absolute right-3 text-xs font-semibold text-on-surface-variant">
                {item.unit}
              </span>
            </div>
          </div>

          <div>
            <label className="font-table-header uppercase text-on-surface-variant text-[11px] block mb-1">
              Vendor / Supplier Pemasok
            </label>
            <input
              type="text"
              required
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl text-xs text-on-surface-variant flex items-center justify-between">
            <span>Estimasi Nilai PO:</span>
            <span className="font-code-sm font-bold text-on-surface">
              Rp {(qty * item.purchasePrice).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-sm transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-secondary text-on-secondary hover:bg-on-secondary-container rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Terbitkan Purchase Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
