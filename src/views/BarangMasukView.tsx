import React, { useState } from 'react';
import { InboundRecord, InventoryItem } from '../types';

interface BarangMasukViewProps {
  records: InboundRecord[];
  items: InventoryItem[];
  onAddInbound: (record: InboundRecord, lineItems: { itemId: string; qty: number }[]) => void;
  onViewDocument: (docNumber: string, docType: 'inbound', data: any) => void;
  onTriggerToast: (msg: string) => void;
}

interface InboundLineItem {
  id: string;
  itemId: string;
  sku: string;
  itemName: string;
  qty: number;
  unit: string;
  rackLocation: string;
  notes: string;
}

export const BarangMasukView: React.FC<BarangMasukViewProps> = ({
  records,
  items,
  onAddInbound,
  onViewDocument,
  onTriggerToast,
}) => {
  const [docNumber] = useState(`IN-20231024-${String(records.length + 19).padStart(3, '0')}`);
  const [receiveDate, setReceiveDate] = useState('24/10/2023');
  const [supplier, setSupplier] = useState('PT Sinar Pangan Abadi');
  const [supplierDocNumber, setSupplierDocNumber] = useState('');
  
  // Dynamic line items
  const [lineItems, setLineItems] = useState<InboundLineItem[]>([
    {
      id: 'line-1',
      itemId: items[0]?.id || '1',
      sku: items[0]?.sku || 'SKU-88219',
      itemName: items[0]?.name || 'Beras Premium Ramos 5 kg',
      qty: 100,
      unit: items[0]?.unit || 'Sak',
      rackLocation: items[0]?.rackLocation || 'Rak A-02-1',
      notes: 'Kondisi baik, segel utuh',
    },
  ]);

  // History filters
  const [searchHistory, setSearchHistory] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');
  const [filterDateRange, setFilterDateRange] = useState('today');

  const addLineItem = () => {
    const newItem = items[lineItems.length % items.length] || items[0];
    const newRow: InboundLineItem = {
      id: `line-${Date.now()}`,
      itemId: newItem.id,
      sku: newItem.sku,
      itemName: newItem.name,
      qty: 50,
      unit: newItem.unit,
      rackLocation: newItem.rackLocation,
      notes: 'Pemeriksaan fisik lolos QC',
    };
    setLineItems([...lineItems, newRow]);
    onTriggerToast('Baris barang inbound berhasil ditambahkan');
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length <= 1) {
      onTriggerToast('Minimal harus ada 1 baris item penerimaan');
      return;
    }
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof InboundLineItem, val: any) => {
    setLineItems(
      lineItems.map((row) => {
        if (row.id !== id) return row;
        if (field === 'itemId') {
          const selected = items.find((i) => i.id === val);
          if (selected) {
            return {
              ...row,
              itemId: val,
              sku: selected.sku,
              itemName: selected.name,
              unit: selected.unit,
              rackLocation: selected.rackLocation,
            };
          }
        }
        return { ...row, [field]: val };
      })
    );
  };

  const handleSubmitInbound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierDocNumber.trim()) {
      onTriggerToast('Harap masukkan Nomor Surat Jalan dari Supplier');
      return;
    }

    const firstLine = lineItems[0];
    const newRecord: InboundRecord = {
      id: `in-${Date.now()}`,
      docNumber,
      date: '24 Okt 2023 14:35',
      supplier,
      supplierDocNumber,
      itemName: firstLine.itemName,
      sku: firstLine.sku,
      rackLocation: firstLine.rackLocation,
      qty: lineItems.reduce((acc, curr) => acc + curr.qty, 0),
      unit: firstLine.unit,
      receiver: { name: 'Andi Pratama', initials: 'AP' },
      notes: firstLine.notes,
      status: 'Selesai',
    };

    onAddInbound(
      newRecord,
      lineItems.map((li) => ({ itemId: li.itemId, qty: li.qty }))
    );

    onTriggerToast(
      `Penerimaan ${docNumber} berhasil diverifikasi! Stok telah bertambah di gudang.`
    );
    setSupplierDocNumber('');
  };

  const filteredRecords = records.filter((rec) => {
    if (filterSupplier && rec.supplier !== filterSupplier) return false;
    if (searchHistory) {
      const q = searchHistory.toLowerCase();
      const match =
        rec.docNumber.toLowerCase().includes(q) ||
        rec.supplier.toLowerCase().includes(q) ||
        rec.itemName.toLowerCase().includes(q) ||
        rec.receiver.name.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-space-xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-md">
        <div className="flex flex-col gap-space-xxs">
          <div className="flex items-center gap-space-xs font-table-header text-table-header uppercase text-on-surface-variant">
            <span>Gudang Utama - Jakarta</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Operasional Inbound</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
            Penerimaan Barang Masuk (Inbound)
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Catat surat jalan penerimaan dari supplier, verifikasi fisik, dan perbarui stok otomatis.
          </p>
        </div>

        <div className="flex items-center gap-space-sm flex-wrap">
          <div className="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container rounded-lg">
            <span className="material-symbols-outlined text-secondary text-[20px]">qr_code_scanner</span>
            <div className="flex flex-col">
              <span className="font-table-header text-table-header uppercase text-on-surface-variant">Mode Scanner</span>
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">Barcode Ready (HID)</span>
            </div>
          </div>
          <button
            className="flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg font-label-md text-label-md transition-colors shadow-sm cursor-pointer"
            type="button"
            onClick={() => onTriggerToast('Sinkronisasi PO pusat selesai: 4 PO baru siap diproses.')}
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
            <span>Sinkronisasi PO</span>
          </button>
        </div>
      </div>

      {/* 4 Inbound Stat KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant">Masuk Hari Ini</span>
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
              1.450 <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">Pcs/Sak</span>
            </span>
            <span className="font-label-sm text-label-sm text-secondary flex items-center gap-space-xxs mt-space-xxs">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +18.4% vs kemarin
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[24px]">inventory</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant">Dokumen Diterima</span>
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
              {records.length} <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">Surat Jalan</span>
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-space-xxs">100% Verifikasi QC</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[24px]">description</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant">Supplier Aktif</span>
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
              4 <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">Vendor</span>
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-space-xxs">Jadwal On-Time 98%</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[24px]">local_shipping</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant">Kapasitas Rak</span>
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">78.2%</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-space-xxs">Sektor A, B & C Siap</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[24px]">warehouse</span>
          </div>
        </div>
      </div>

      {/* Form Card: Penerimaan Barang Baru */}
      <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col gap-space-lg">
        <div className="flex items-center justify-between pb-space-xs">
          <div className="flex items-center gap-space-sm">
            <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[22px]">note_add</span>
            </div>
            <div className="flex flex-col">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Form Penerimaan Barang Baru
              </h2>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Lengkapi data verifikasi fisik sebelum stok ditambahkan ke inventaris utama
              </span>
            </div>
          </div>
          <span className="font-label-sm text-label-sm px-space-md py-space-xxs bg-surface-container text-on-surface-variant rounded-full font-semibold">
            Tahap 1: Entry Surat Jalan
          </span>
        </div>

        <form onSubmit={handleSubmitInbound} className="flex flex-col gap-space-lg">
          {/* Header Metadata 4 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md p-space-md bg-surface-container-low rounded-lg">
            <div className="flex flex-col gap-space-xxs">
              <label className="font-table-header text-table-header uppercase text-on-surface-variant">
                No. Dokumen Otomatis
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                  tag
                </span>
                <input
                  className="w-full h-9 pl-9 pr-space-sm bg-surface-container-highest/60 rounded-lg font-code-sm text-code-sm text-on-surface cursor-not-allowed select-all focus:outline-none"
                  readOnly
                  type="text"
                  value={docNumber}
                />
              </div>
            </div>

            <div className="flex flex-col gap-space-xxs">
              <label className="font-table-header text-table-header uppercase text-on-surface-variant">
                Tanggal Terima
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                  calendar_today
                </span>
                <input
                  className="w-full h-9 pl-9 pr-space-sm bg-surface-container-lowest rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none shadow-sm"
                  type="text"
                  value={receiveDate}
                  onChange={(e) => setReceiveDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-space-xxs">
              <label className="font-table-header text-table-header uppercase text-on-surface-variant">
                Pemasok / Supplier
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                  factory
                </span>
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full h-9 pl-9 pr-space-xl bg-surface-container-lowest rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none appearance-none shadow-sm cursor-pointer"
                >
                  <option value="PT Sinar Pangan Abadi">PT Sinar Pangan Abadi</option>
                  <option value="PT Indofood Sukses Makmur">PT Indofood Sukses Makmur</option>
                  <option value="CV Makmur Packaging">CV Makmur Packaging</option>
                  <option value="PT Wilmar Nabati">PT Wilmar Nabati</option>
                  <option value="PT Sugar Group">PT Sugar Group Companies</option>
                </select>
                <span className="material-symbols-outlined absolute right-space-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-space-xxs">
              <label className="font-table-header text-table-header uppercase text-on-surface-variant">
                No. Surat Jalan Supplier
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                  receipt_long
                </span>
                <input
                  className="w-full h-9 pl-9 pr-space-sm bg-surface-container-lowest rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none placeholder:text-on-surface-variant shadow-sm"
                  placeholder="cth: SJ-SPA/X/2023/889"
                  type="text"
                  value={supplierDocNumber}
                  onChange={(e) => setSupplierDocNumber(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Dynamic Item Rows */}
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[18px]">playlist_add_check</span>
                Daftar Barang Diterima
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Tekan TAB atau Enter untuk pindah antar input
              </span>
            </div>

            <div className="flex flex-col gap-space-xs">
              {lineItems.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-space-sm p-space-md bg-surface-container-lowest rounded-lg shadow-sm items-center border border-surface-container"
                >
                  {/* Select Item */}
                  <div className="md:col-span-4 flex flex-col gap-space-xxs">
                    <label className="font-table-header text-table-header uppercase text-on-surface-variant">
                      Pemilihan Barang / Scan Barcode SKU
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                        barcode_scanner
                      </span>
                      <select
                        value={row.itemId}
                        onChange={(e) => updateLineItem(row.id, 'itemId', e.target.value)}
                        className="w-full h-9 pl-9 pr-space-sm bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none cursor-pointer"
                      >
                        {items.map((it) => (
                          <option key={it.id} value={it.id}>
                            {it.sku} - {it.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Qty */}
                  <div className="md:col-span-2 flex flex-col gap-space-xxs">
                    <label className="font-table-header text-table-header uppercase text-on-surface-variant">
                      Jumlah Masuk
                    </label>
                    <div className="relative flex items-center">
                      <input
                        className="w-full h-9 pl-space-md pr-12 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface text-right focus:outline-none font-code-sm font-semibold"
                        type="number"
                        min="1"
                        value={row.qty}
                        onChange={(e) => updateLineItem(row.id, 'qty', Number(e.target.value))}
                      />
                      <span className="absolute right-space-sm font-label-sm text-label-sm text-on-surface-variant font-medium">
                        {row.unit}
                      </span>
                    </div>
                  </div>

                  {/* Rack Location */}
                  <div className="md:col-span-2 flex flex-col gap-space-xxs">
                    <label className="font-table-header text-table-header uppercase text-on-surface-variant">
                      Lokasi Rak Tujuan
                    </label>
                    <div className="relative">
                      <select
                        value={row.rackLocation}
                        onChange={(e) => updateLineItem(row.id, 'rackLocation', e.target.value)}
                        className="w-full h-9 pl-space-md pr-8 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="Rak A-02-1">Rak A-02-1 (Sektor Basah)</option>
                        <option value="Rak A-02-2">Rak A-02-2 (Dry Bulk)</option>
                        <option value="Rak B-01-4">Rak B-01-4 (Pallet High)</option>
                        <option value="Rak C-05-1">Rak C-05-1 (Fast Moving)</option>
                        <option value="Rak D-08-1">Rak D-08-1 (Packaging Zone)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-space-xs top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">
                        arrow_drop_down
                      </span>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="md:col-span-3 flex flex-col gap-space-xxs">
                    <label className="font-table-header text-table-header uppercase text-on-surface-variant">
                      Catatan / Keterangan
                    </label>
                    <input
                      className="w-full h-9 px-space-md bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none"
                      type="text"
                      value={row.notes}
                      onChange={(e) => updateLineItem(row.id, 'notes', e.target.value)}
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="md:col-span-1 flex items-end justify-center pt-space-md">
                    <button
                      className="w-9 h-9 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-error flex items-center justify-center transition-colors cursor-pointer"
                      title="Hapus Baris"
                      type="button"
                      onClick={() => removeLineItem(row.id)}
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-md pt-space-xs">
            <button
              className="flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container text-on-surface hover:bg-surface-container-high rounded-lg font-label-md text-label-md transition-colors self-start cursor-pointer font-medium"
              type="button"
              onClick={addLineItem}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Tambah Baris Barang</span>
            </button>
            <div className="flex items-center gap-space-sm self-end">
              <button
                className="px-space-lg py-space-sm bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg font-label-md text-label-md transition-colors cursor-pointer"
                type="button"
                onClick={() => {
                  setSupplierDocNumber('');
                  onTriggerToast('Input penerimaan barang dibatalkan');
                }}
              >
                Batal
              </button>
              <button
                className="flex items-center gap-space-xs px-space-lg py-space-sm bg-secondary text-on-secondary rounded-lg font-label-md text-label-md hover:bg-on-secondary-container transition-colors shadow-sm font-semibold cursor-pointer"
                type="submit"
              >
                <span className="material-symbols-outlined text-[20px]">task_alt</span>
                <span>Simpan & Tambah Stok</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Riwayat Inbound Table Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col gap-space-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-md">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-[22px]">history</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Riwayat Penerimaan Barang Masuk
              </h2>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Daftar arsip dokumen surat jalan dan transaksi logistik yang telah diverifikasi
            </span>
          </div>
          <div className="flex items-center gap-space-xs">
            <button
              className="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container text-on-surface rounded-lg font-label-sm text-label-sm hover:bg-surface-container-high transition-colors cursor-pointer"
              type="button"
              onClick={() => onTriggerToast('Mengunduh rekap spreadsheet inbound_rekap.csv...')}
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Ekspor CSV</span>
            </button>
            <button
              className="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container text-on-surface rounded-lg font-label-sm text-label-sm hover:bg-surface-container-high transition-colors cursor-pointer"
              type="button"
              onClick={() => {
                window.print();
                onTriggerToast('Menyiapkan dokumen cetak riwayat inbound...');
              }}
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Cetak Laporan</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm p-space-md bg-surface-container-low rounded-lg items-center">
          <div className="md:col-span-5 relative">
            <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              className="w-full h-9 pl-9 pr-space-md bg-surface-container-lowest rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none shadow-sm"
              placeholder="Cari No. Dokumen, PO, nama barang, penerima..."
              type="text"
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
            />
          </div>

          <div className="md:col-span-3 relative">
            <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              store
            </span>
            <select
              value={filterSupplier}
              onChange={(e) => setFilterSupplier(e.target.value)}
              className="w-full h-9 pl-9 pr-space-xl bg-surface-container-lowest rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none appearance-none shadow-sm cursor-pointer"
            >
              <option value="">Semua Pemasok / Vendor</option>
              <option value="PT Sinar Pangan Abadi">PT Sinar Pangan Abadi</option>
              <option value="CV Makmur Packaging">CV Makmur Packaging</option>
              <option value="PT Wilmar Nabati">PT Wilmar Nabati</option>
              <option value="PT Sugar Group">PT Sugar Group</option>
            </select>
            <span className="material-symbols-outlined absolute right-space-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">
              arrow_drop_down
            </span>
          </div>

          <div className="md:col-span-3 relative">
            <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              date_range
            </span>
            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="w-full h-9 pl-9 pr-space-xl bg-surface-container-lowest rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none appearance-none shadow-sm cursor-pointer"
            >
              <option value="today">Hari Ini (24 Okt 2023)</option>
              <option value="7days">7 Hari Terakhir</option>
              <option value="this_month">Bulan Ini (Oktober 2023)</option>
            </select>
            <span className="material-symbols-outlined absolute right-space-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">
              arrow_drop_down
            </span>
          </div>

          <div className="md:col-span-1 flex justify-end">
            <button
              className="w-full h-9 bg-surface-container hover:bg-surface-container-high rounded-lg text-on-surface flex items-center justify-center transition-colors cursor-pointer"
              title="Reset Filter"
              type="button"
              onClick={() => {
                setSearchHistory('');
                setFilterSupplier('');
                setFilterDateRange('today');
                onTriggerToast('Filter riwayat inbound direset.');
              }}
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="w-full text-left bg-surface-container-lowest">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-table-header text-table-header uppercase">
                <th className="py-space-md px-space-md">No. Dokumen</th>
                <th className="py-space-md px-space-md">Waktu Terima</th>
                <th className="py-space-md px-space-md">Supplier</th>
                <th className="py-space-md px-space-md">Nama Barang</th>
                <th className="py-space-md px-space-md text-right">Volume / Qty</th>
                <th className="py-space-md px-space-md">Penerima (Staff)</th>
                <th className="py-space-md px-space-md text-center">Status</th>
                <th className="py-space-md px-space-md text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low font-body-sm text-body-sm">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-space-md px-space-md">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-[16px]">receipt</span>
                      <span className="font-code-sm text-code-sm font-semibold text-on-surface">
                        {rec.docNumber}
                      </span>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md text-on-surface-variant whitespace-nowrap">
                    {rec.date}
                  </td>
                  <td className="py-space-md px-space-md font-medium text-on-surface whitespace-nowrap">
                    {rec.supplier}
                  </td>
                  <td className="py-space-md px-space-md text-on-surface">
                    <div className="flex flex-col">
                      <span className="font-semibold text-on-surface">{rec.itemName}</span>
                      <span className="font-label-sm text-[11px] text-on-surface-variant">
                        {rec.sku} • {rec.rackLocation}
                      </span>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md text-right font-semibold text-on-surface whitespace-nowrap">
                    {rec.qty}{' '}
                    <span className="font-label-sm text-[11px] font-normal text-on-surface-variant">
                      {rec.unit}
                    </span>
                  </td>
                  <td className="py-space-md px-space-md text-on-surface whitespace-nowrap">
                    <div className="flex items-center gap-space-xs">
                      <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-label-sm text-[10px] font-bold">
                        {rec.receiver.initials}
                      </div>
                      <span>{rec.receiver.name}</span>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-space-xxs px-space-sm py-space-xxs rounded-full font-label-sm text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-space-md px-space-md text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-space-xs">
                      <button
                        className="p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-secondary transition-colors cursor-pointer"
                        title="Cetak Bukti Tanda Terima (PDF)"
                        type="button"
                        onClick={() => onViewDocument(rec.docNumber, 'inbound', rec)}
                      >
                        <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                      </button>
                      <button
                        className="p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                        title="Detail Inspeksi"
                        type="button"
                        onClick={() => onViewDocument(rec.docNumber, 'inbound', rec)}
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-sm pt-space-xs font-body-sm text-body-sm text-on-surface-variant">
          <div className="flex items-center gap-space-xs">
            <span>Menampilkan</span>
            <span className="font-semibold text-on-surface">1 - {filteredRecords.length}</span>
            <span>dari</span>
            <span className="font-semibold text-on-surface">128</span>
            <span>dokumen inbound</span>
          </div>
          <div className="flex items-center gap-space-xxs">
            <button
              className="p-space-xs rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container disabled:opacity-50"
              disabled
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              className="w-8 h-8 rounded-lg bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold flex items-center justify-center"
              type="button"
            >
              1
            </button>
            <button
              className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center justify-center cursor-pointer"
              type="button"
            >
              2
            </button>
            <button
              className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center justify-center cursor-pointer"
              type="button"
            >
              3
            </button>
            <span className="px-space-xs">...</span>
            <button
              className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center justify-center cursor-pointer"
              type="button"
            >
              32
            </button>
            <button
              className="p-space-xs rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
