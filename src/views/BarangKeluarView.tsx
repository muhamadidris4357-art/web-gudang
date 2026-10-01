import React, { useState } from 'react';
import { OutboundRecord, InventoryItem } from '../types';

interface BarangKeluarViewProps {
  records: OutboundRecord[];
  items: InventoryItem[];
  onAddOutbound: (record: OutboundRecord, itemToDeduct: { itemId: string; qty: number }) => void;
  onViewDocument: (docNumber: string, docType: 'outbound', data: any) => void;
  onTriggerToast: (msg: string) => void;
}

export const BarangKeluarView: React.FC<BarangKeluarViewProps> = ({
  records,
  items,
  onAddOutbound,
  onViewDocument,
  onTriggerToast,
}) => {
  const [docNumber] = useState(`OUT-20231024-${String(records.length + 43).padStart(3, '0')}`);
  const [dispatchDate, setDispatchDate] = useState('24 Okt 2023');
  const [customer, setCustomer] = useState('Toko Berkah Jaya - Cabang Tangerang');
  const [courier, setCourier] = useState('Armada Internal Box B-9122-TX');

  const [selectedItemId, setSelectedItemId] = useState(items[0]?.id || '1');
  const [qtyKeluar, setQtyKeluar] = useState(25);
  const [destinationNote, setDestinationNote] = useState('Penyaluran Reguler Restock Gerai Cabang Barat');

  // Filter state for history table
  const [searchTable, setSearchTable] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState<'Semua' | 'Dispatched' | 'Terkirim' | 'Menunggu Pickup'>('Semua');

  // Tracking Modal State
  const [trackingModalItem, setTrackingModalItem] = useState<OutboundRecord | null>(null);

  const currentSelectedItem = items.find((i) => i.id === selectedItemId) || items[0];
  const maxAvailable = currentSelectedItem ? currentSelectedItem.stock : 0;

  // Anti-Minus Protocol Evaluation
  const isDeficit = qtyKeluar > maxAvailable;
  const isZeroOrNegative = qtyKeluar <= 0;
  const isFormValid = !isDeficit && !isZeroOrNegative;

  const handleItemSelectChange = (itemId: string) => {
    setSelectedItemId(itemId);
    const item = items.find((i) => i.id === itemId);
    if (item && qtyKeluar > item.stock) {
      setQtyKeluar(Math.min(item.stock, 10) || 1);
    }
  };

  const handleResetForm = () => {
    setQtyKeluar(25);
    setDestinationNote('Penyaluran Reguler Restock Gerai Cabang Barat');
    onTriggerToast('Form pengeluaran berhasil direset');
  };

  const handleSubmitOutbound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      onTriggerToast('Tidak dapat menerbitkan Surat Jalan: Terjadi defisit stok!');
      return;
    }

    const newRecord: OutboundRecord = {
      id: `out-${Date.now()}`,
      docNumber,
      date: '24 Okt 2023',
      time: '14:50 WIB',
      customer,
      itemName: currentSelectedItem.name,
      sku: currentSelectedItem.sku,
      qty: qtyKeluar,
      unit: currentSelectedItem.unit,
      status: 'Dispatched',
      courier,
      notes: destinationNote,
    };

    onAddOutbound(newRecord, { itemId: currentSelectedItem.id, qty: qtyKeluar });
    onTriggerToast(
      `Surat Jalan ${docNumber} diterbitkan! Stok ${currentSelectedItem.name} berkurang sebanyak ${qtyKeluar} ${currentSelectedItem.unit}.`
    );
  };

  const filteredHistory = records.filter((rec) => {
    if (activeFilterTab !== 'Semua') {
      if (activeFilterTab === 'Dispatched' && rec.status !== 'Dispatched') return false;
      if (activeFilterTab === 'Terkirim' && rec.status !== 'Terkirim') return false;
      if (activeFilterTab === 'Menunggu Pickup' && rec.status !== 'Menunggu Pickup') return false;
    }
    if (searchTable) {
      const q = searchTable.toLowerCase();
      const match =
        rec.docNumber.toLowerCase().includes(q) ||
        rec.customer.toLowerCase().includes(q) ||
        rec.itemName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-space-xl">
      {/* Header Context Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span>Gudang Utama Jakarta</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Operasional Outbound</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold">Pengeluaran Barang</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface mt-space-xxs tracking-tight">
            Pengeluaran Barang (Outbound)
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Proses Surat Jalan pengiriman, pesanan pelanggan/cabang, dan validasi pengurangan stok real-time.
          </p>
        </div>

        <div className="flex items-center gap-space-sm">
          <div className="flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container rounded-xl shadow-sm">
            <span className="material-symbols-outlined text-secondary text-[20px]">local_shipping</span>
            <div className="flex flex-col">
              <span className="font-table-header text-table-header uppercase text-on-surface-variant">
                Total Dispatch Hari Ini
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface">42 Dokumen</span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs px-space-md py-space-sm bg-secondary-fixed text-on-secondary-fixed rounded-xl shadow-sm">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <div className="flex flex-col">
              <span className="font-table-header text-table-header uppercase text-on-secondary-fixed-variant">
                Sinkronisasi ERP
              </span>
              <span className="font-label-sm text-label-sm font-semibold">Tersambung (Real-time)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Surat Jalan Pengeluaran Baru */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Header Card */}
        <div className="px-space-xl py-space-lg bg-surface-container-low flex flex-wrap items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-surface-bright flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[22px]">post_add</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  Form Surat Jalan Pengeluaran Baru
                </span>
                <span className="px-space-xs py-0.5 bg-secondary-fixed text-on-secondary-fixed font-table-header text-table-header uppercase rounded-lg">
                  Draft Aktif
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Isi parameter pengiriman dan verifikasi kuota logistik sebelum commit stok
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm text-on-surface-variant font-code-sm text-code-sm bg-surface-container-lowest px-space-md py-space-xs rounded-lg shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>MODUL DISPATCH: SIAP</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOutbound} className="p-space-xl flex flex-col gap-space-lg">
          {/* Row 1: Header Dokumen */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="flex flex-col gap-space-xxs">
              <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between">
                <span>No. Pengeluaran (Auto)</span>
                <span className="material-symbols-outlined text-secondary text-[16px]">lock</span>
              </label>
              <div className="flex items-center h-10 px-space-md bg-surface-container-low text-on-surface font-code-sm text-code-sm rounded-lg shadow-sm select-all">
                {docNumber}
              </div>
            </div>

            <div className="flex flex-col gap-space-xxs">
              <label className="font-label-md text-label-md text-on-surface font-semibold">Tanggal Kirim</label>
              <div className="relative">
                <input
                  className="w-full h-10 pl-space-md pr-10 bg-surface-container-lowest rounded-lg font-body-sm text-body-sm text-on-surface shadow-sm focus:outline-none"
                  type="text"
                  value={dispatchDate}
                  onChange={(e) => setDispatchDate(e.target.value)}
                />
                <span className="material-symbols-outlined absolute right-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                  calendar_today
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-space-xxs">
              <label className="font-label-md text-label-md text-on-surface font-semibold">
                Tujuan / Nama Pelanggan
              </label>
              <div className="relative">
                <input
                  className="w-full h-10 pl-space-md pr-10 bg-surface-container-lowest rounded-lg font-body-sm text-body-sm text-on-surface shadow-sm focus:outline-none"
                  list="customer-list"
                  placeholder="Ketik atau pilih pelanggan..."
                  type="text"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  required
                />
                <datalist id="customer-list">
                  <option value="Toko Berkah Jaya - Cabang Tangerang" />
                  <option value="Supermarket Harmoni - Pusat" />
                  <option value="Depot Berkah Alam - Bogor" />
                  <option value="Mitra Logistik Nusantara - DC Cikarang" />
                  <option value="PT Sinar Sentosa Distribusi" />
                </datalist>
                <span className="material-symbols-outlined absolute right-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-space-xxs">
              <label className="font-label-md text-label-md text-on-surface font-semibold">Kurir / Armada</label>
              <div className="relative">
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full h-10 px-space-md bg-surface-container-lowest rounded-lg font-body-sm text-body-sm text-on-surface shadow-sm appearance-none focus:outline-none cursor-pointer"
                >
                  <option value="Armada Internal Box B-9122-TX">Armada Internal Box B-9122-TX</option>
                  <option value="Armada Blind Van B-4309-PX">Armada Blind Van B-4309-PX</option>
                  <option value="Mitra Ekspedisi - JNE Trucking (JTR)">Mitra Ekspedisi - JNE Trucking (JTR)</option>
                  <option value="Mitra Ekspedisi - Lalamove Large Box">Mitra Ekspedisi - Lalamove Large Box</option>
                  <option value="Self Pickup (Pengambilan Mandiri)">Self Pickup (Pengambilan Mandiri)</option>
                </select>
                <span className="material-symbols-outlined absolute right-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Item Specification Group */}
          <div className="p-space-lg bg-surface-container-low rounded-xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[18px]">category</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  Spesifikasi Item Yang Dikeluarkan
                </span>
              </div>
              <span className="font-table-header text-table-header uppercase text-on-surface-variant">
                Line Item #1
              </span>
            </div>

            {/* Row 2: Barang & Kuantitas Input */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md">
              <div className="md:col-span-5 flex flex-col gap-space-xxs">
                <label className="font-label-sm text-label-sm text-on-surface font-medium">
                  Pemilihan Barang (SKU / Barcode)
                </label>
                <div className="relative">
                  <select
                    value={selectedItemId}
                    onChange={(e) => handleItemSelectChange(e.target.value)}
                    className="w-full h-10 pl-space-md pr-10 bg-surface-container-lowest rounded-lg font-body-sm text-body-sm text-on-surface shadow-sm appearance-none focus:outline-none cursor-pointer"
                  >
                    {items.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.sku} | {it.name} ({it.rackLocation})
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="md:col-span-3 flex flex-col gap-space-xxs">
                <div className="flex items-center justify-between">
                  <label className="font-label-sm text-label-sm text-on-surface font-medium">
                    Kuantitas Keluar
                  </label>
                  <span className="font-code-sm text-code-sm text-secondary font-bold">
                    Stok tersedia: {maxAvailable} Unit
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    className="w-full h-10 px-space-md bg-surface-container-lowest rounded-lg font-body-sm text-body-sm text-on-surface shadow-sm focus:outline-none font-code-sm font-bold text-right pr-24"
                    min="1"
                    type="number"
                    value={qtyKeluar}
                    onChange={(e) => setQtyKeluar(Number(e.target.value))}
                  />
                  <span className="absolute right-space-md font-table-header text-table-header uppercase text-on-surface-variant pointer-events-none">
                    {currentSelectedItem?.unit || 'Unit'}
                  </span>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col gap-space-xxs">
                <label className="font-label-sm text-label-sm text-on-surface font-medium">
                  Tujuan Divisi / Catatan Alokasi
                </label>
                <input
                  className="w-full h-10 px-space-md bg-surface-container-lowest rounded-lg font-body-sm text-body-sm text-on-surface shadow-sm focus:outline-none"
                  placeholder="Catatan internal..."
                  type="text"
                  value={destinationNote}
                  onChange={(e) => setDestinationNote(e.target.value)}
                />
              </div>
            </div>

            {/* Validasi Anti Minus Banner */}
            <div
              className={`flex items-center justify-between gap-space-md px-space-md py-space-sm rounded-lg shadow-sm transition-colors ${
                isDeficit
                  ? 'bg-error-container text-on-error-container'
                  : 'bg-surface-container-lowest'
              }`}
            >
              <div className="flex items-center gap-space-sm">
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isDeficit ? 'text-on-error-container' : 'text-secondary'
                  }`}
                >
                  {isDeficit ? 'warning' : 'verified_user'}
                </span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm font-semibold">
                    Protokol Anti-Minus Aktif
                  </span>
                  <span className="font-body-sm text-body-sm">
                    {isDeficit ? (
                      <strong className="text-on-error-container">
                        PERINGATAN DEFISIT: Kuantitas keluar ({qtyKeluar}) melebihi stok fisik ({maxAvailable}). Sistem menolak transaksi anti-minus.
                      </strong>
                    ) : isZeroOrNegative ? (
                      <span className="text-on-surface-variant">
                        Sistem otomatis menolak transaksi jika kuantitas bernilai 0 atau negatif.
                      </span>
                    ) : (
                      <span className="text-on-surface-variant">
                        Sistem otomatis menolak transaksi jika stok fisik &lt; jumlah pengeluaran. Kuota pemesanan {qtyKeluar} dari {maxAvailable} unit aman dialokasikan.
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <span
                className={`font-code-sm text-code-sm px-space-sm py-0.5 rounded font-bold ${
                  isDeficit ? 'bg-error text-white' : 'bg-surface-container text-on-surface'
                }`}
              >
                {isDeficit ? 'DEFISIT' : 'RESV-OK'}
              </span>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs">
            <button
              className="flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
              type="button"
              onClick={() => onTriggerToast('Form multi-line shipment siap')}
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>+ Tambah Item Pengiriman</span>
            </button>
            <div className="flex items-center gap-space-sm">
              <button
                className="flex items-center gap-space-xs px-space-lg py-space-sm bg-surface-container-low text-on-surface-variant hover:text-on-surface rounded-lg font-label-md text-label-md transition-colors cursor-pointer"
                type="button"
                onClick={handleResetForm}
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                <span>Reset</span>
              </button>
              <button
                className={`flex items-center gap-space-xs px-space-xl py-space-sm rounded-lg font-headline-sm text-headline-sm shadow-sm transition-all ${
                  isFormValid
                    ? 'bg-secondary text-on-secondary hover:bg-on-secondary-container cursor-pointer'
                    : 'bg-surface-container text-on-surface-variant opacity-50 cursor-not-allowed'
                }`}
                disabled={!isFormValid}
                type="submit"
              >
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                <span>Terbitkan Surat Jalan & Kurangi Stok</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Telemetry Strip Outbound 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
        <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant">
              Siap Muat (Staging)
            </span>
            <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
              <span className="material-symbols-outlined text-[18px]">forklift</span>
            </div>
          </div>
          <div className="mt-space-sm">
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">14 Palet</span>
            <p className="font-label-sm text-label-sm text-secondary mt-0.5">Staging Bay A1 - A4</p>
          </div>
        </div>

        <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant">
              Dalam Perjalanan (Transit)
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">route</span>
            </div>
          </div>
          <div className="mt-space-sm">
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
              {records.filter((r) => r.status === 'Dispatched').length} Pengiriman
            </span>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Estimasi on-time 98.4%</p>
          </div>
        </div>

        <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant">
              Selesai / Terkirim
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
            </div>
          </div>
          <div className="mt-space-sm">
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">34 DO</span>
            <p className="font-label-sm text-label-sm text-emerald-600 mt-0.5">+18% dari target shift 1</p>
          </div>
        </div>

        <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant">
              Rata-rata Lead Time
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">timer</span>
            </div>
          </div>
          <div className="mt-space-sm">
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">2.4 Jam</span>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Picking hingga departure</p>
          </div>
        </div>
      </div>

      {/* Tabel Riwayat Pengeluaran Barang */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Filter Toolbar */}
        <div className="p-space-lg bg-surface-container-low flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center gap-space-sm flex-1">
            {/* Search Box */}
            <div className="relative w-full sm:max-w-md">
              <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                className="w-full h-10 pl-10 pr-space-md bg-surface-container-lowest rounded-lg font-body-sm text-body-sm text-on-surface shadow-sm focus:outline-none"
                placeholder="Cari No. Dokumen (DO) atau Nama Penerima..."
                type="text"
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-space-xxs overflow-x-auto py-1">
              {(['Semua', 'Dispatched', 'Terkirim', 'Menunggu Pickup'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilterTab(tab)}
                  className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeFilterTab === tab
                      ? 'bg-secondary text-on-secondary shadow-sm font-semibold'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab === 'Dispatched' ? 'Dalam Perjalanan' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-space-xs self-end lg:self-auto">
            <button
              className="flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container-lowest text-on-surface rounded-lg font-label-md text-label-md shadow-sm hover:bg-surface-container transition-colors cursor-pointer"
              type="button"
              onClick={() => onTriggerToast('Filter parameter status delivery aktif')}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Filter Lanjutan</span>
            </button>
            <button
              className="flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container-lowest text-on-surface rounded-lg font-label-md text-label-md shadow-sm hover:bg-surface-container transition-colors cursor-pointer"
              type="button"
              onClick={() => onTriggerToast('Mengunduh rekap transaksi pengeluaran_outbound.csv...')}
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Unduh Rekap CSV</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container font-table-header text-table-header uppercase text-on-surface-variant tracking-wider">
                <th className="py-space-md px-space-lg">No. Pengeluaran (DO)</th>
                <th className="py-space-md px-space-lg">Waktu Keluar</th>
                <th className="py-space-md px-space-lg">Tujuan / Pelanggan</th>
                <th className="py-space-md px-space-lg">Barang / Komoditas</th>
                <th className="py-space-md px-space-lg text-right">Kuantitas</th>
                <th className="py-space-md px-space-lg text-center">Status</th>
                <th className="py-space-md px-space-lg text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm divide-y-0">
              {filteredHistory.map((rec) => (
                <tr
                  key={rec.id}
                  className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors group"
                >
                  <td className="py-space-md px-space-lg font-code-sm text-code-sm font-semibold text-secondary whitespace-nowrap">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                        description
                      </span>
                      <span>{rec.docNumber}</span>
                    </div>
                  </td>
                  <td className="py-space-md px-space-lg whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface font-medium">{rec.date}</span>
                      <span className="font-label-sm text-[11px] text-on-surface-variant">{rec.time}</span>
                    </div>
                  </td>
                  <td className="py-space-md px-space-lg font-label-md text-label-md text-on-surface font-semibold">
                    {rec.customer}
                  </td>
                  <td className="py-space-md px-space-lg">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                        inventory_2
                      </span>
                      <span className="font-label-md text-label-md text-on-surface">{rec.itemName}</span>
                    </div>
                  </td>
                  <td className="py-space-md px-space-lg text-right font-code-sm text-code-sm font-bold text-on-surface whitespace-nowrap">
                    {rec.qty} {rec.unit}
                  </td>
                  <td className="py-space-md px-space-lg text-center whitespace-nowrap">
                    {rec.status === 'Dispatched' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                        Dispatched
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-emerald-100 text-emerald-800 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        Terkirim
                      </span>
                    )}
                  </td>
                  <td className="py-space-md px-space-lg whitespace-nowrap text-center">
                    <div className="inline-flex items-center gap-space-xxs">
                      <button
                        className="p-1.5 text-on-surface-variant hover:text-secondary hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                        title="Cetak Surat Jalan (DO)"
                        type="button"
                        onClick={() => onViewDocument(rec.docNumber, 'outbound', rec)}
                      >
                        <span className="material-symbols-outlined text-[18px]">print</span>
                      </button>
                      <button
                        className="p-1.5 text-on-surface-variant hover:text-secondary hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                        title="Pelacakan Armada Driver"
                        type="button"
                        onClick={() => setTrackingModalItem(rec)}
                      >
                        <span className="material-symbols-outlined text-[18px]">near_me</span>
                      </button>
                      <button
                        className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                        title="Detail Dokumen"
                        type="button"
                        onClick={() => onViewDocument(rec.docNumber, 'outbound', rec)}
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

        {/* Table Footer / Pagination */}
        <div className="p-space-lg bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Menampilkan <span className="font-semibold text-on-surface">1 - {filteredHistory.length}</span> dari{' '}
            <span className="font-semibold text-on-surface">184</span> transaksi keluar
          </span>
          <div className="flex items-center gap-space-xs">
            <button
              className="px-space-md py-1.5 bg-surface-container-lowest text-on-surface rounded-lg font-label-md text-label-md shadow-sm hover:bg-surface-container transition-colors disabled:opacity-40"
              disabled
              type="button"
            >
              Sebelumnya
            </button>
            <button
              className="w-8 h-8 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md flex items-center justify-center font-bold"
              type="button"
            >
              1
            </button>
            <button
              className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md flex items-center justify-center shadow-sm hover:bg-surface-container transition-colors"
              type="button"
            >
              2
            </button>
            <button
              className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md flex items-center justify-center shadow-sm hover:bg-surface-container transition-colors"
              type="button"
            >
              3
            </button>
            <button
              className="px-space-md py-1.5 bg-surface-container-lowest text-on-surface rounded-lg font-label-md text-label-md shadow-sm hover:bg-surface-container transition-colors"
              type="button"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {/* Driver Tracking Modal */}
      {trackingModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-surface-container">
            <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">near_me</span>
                <h3 className="font-headline-sm font-semibold text-on-surface">Pelacakan Dispatch Driver</h3>
              </div>
              <button
                type="button"
                onClick={() => setTrackingModalItem(null)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="p-3 bg-surface-container-low rounded-xl">
                <div className="flex justify-between font-code-sm text-xs">
                  <span className="text-secondary font-bold">{trackingModalItem.docNumber}</span>
                  <span className="text-emerald-700 font-semibold">{trackingModalItem.status}</span>
                </div>
                <p className="font-semibold text-on-surface mt-1">{trackingModalItem.customer}</p>
                <p className="text-xs text-on-surface-variant">
                  Kurir: {trackingModalItem.courier}
                </p>
              </div>

              {/* Timeline */}
              <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-secondary/30">
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-secondary"></span>
                  <span className="text-xs text-on-surface-variant block">11:30 WIB</span>
                  <span className="font-semibold text-on-surface text-xs">Armada berangkat dari DC Cikarang Barat</span>
                </div>
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-secondary"></span>
                  <span className="text-xs text-on-surface-variant block">12:15 WIB</span>
                  <span className="font-semibold text-on-surface text-xs">Melintasi Gerbang Tol Cikupa (Km 31)</span>
                </div>
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs text-on-surface-variant block">Estimasi Tiba: 13:45 WIB</span>
                  <span className="font-semibold text-emerald-700 text-xs">Dalam perjalanan menuju titik bongkar</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-surface-container-low border-t border-surface-container flex justify-end">
              <button
                type="button"
                onClick={() => setTrackingModalItem(null)}
                className="px-4 py-2 bg-secondary text-on-secondary rounded-xl text-sm font-semibold"
              >
                Tutup Pelacakan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
