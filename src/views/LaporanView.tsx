import React, { useState } from 'react';
import { InventoryItem } from '../types';

interface LaporanViewProps {
  items: InventoryItem[];
  onTriggerToast: (msg: string) => void;
}

export const LaporanView: React.FC<LaporanViewProps> = ({ items, onTriggerToast }) => {
  const [rangeTab, setRangeTab] = useState<'today' | '7days' | 'month' | 'custom'>('month');
  const [reportType, setReportType] = useState('Laporan Mutasi Stok (In/Out)');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [zoneFilter, setZoneFilter] = useState('Semua');
  const [searchTable, setSearchTable] = useState('');

  // 6 specific mutation items from the exact mockup
  const mutationRecords = [
    {
      sku: 'SKU-SEM-001',
      name: 'Beras Premium Ramos 5kg',
      rack: 'Rak A-01-04',
      category: 'Bahan Pokok',
      icon: 'grain',
      stokAwal: 2400,
      masuk: 12000,
      keluar: 10850,
      opname: 0,
      stokAkhir: 3550,
      nilaiAset: 248500000,
      turnover: 'Fast Moving',
    },
    {
      sku: 'SKU-MNY-014',
      name: 'Minyak Goreng Sania 2L',
      rack: 'Rak B-03-02',
      category: 'Minyak Nabati',
      icon: 'water_drop',
      stokAwal: 1850,
      masuk: 8500,
      keluar: 8200,
      opname: -12,
      stokAkhir: 2138,
      nilaiAset: 748300000,
      turnover: 'Fast Moving',
    },
    {
      sku: 'SKU-SEM-089',
      name: 'Gula Pasir Kristal Putih 1kg',
      rack: 'Rak A-02-11',
      category: 'Bahan Pokok',
      icon: 'egg_alt',
      stokAwal: 3100,
      masuk: 9000,
      keluar: 8950,
      opname: 5,
      stokAkhir: 3155,
      nilaiAset: 48892500,
      turnover: 'Fast Moving',
    },
    {
      sku: 'SKU-LOG-005',
      name: 'Kardus Box Ukuran M (Corrugated)',
      rack: 'Rak D-01-01',
      category: 'Kemasan Logistik',
      icon: 'package_2',
      stokAwal: 15000,
      masuk: 7000,
      keluar: 6400,
      opname: 0,
      stokAkhir: 15600,
      nilaiAset: 54600000,
      turnover: 'Slow Moving',
    },
    {
      sku: 'SKU-SEM-042',
      name: 'Tepung Terigu Serbaguna 1kg',
      rack: 'Rak A-03-05',
      category: 'Bahan Pokok',
      icon: 'bakery_dining',
      stokAwal: 2900,
      masuk: 3650,
      keluar: 3220,
      opname: 0,
      stokAkhir: 3330,
      nilaiAset: 39960000,
      turnover: 'Fast Moving',
    },
    {
      sku: 'SKU-BMB-033',
      name: 'Kecap Manis Pouch Refill 600ml',
      rack: 'Rak B-04-12',
      category: 'Bumbu & Rempah',
      icon: 'soup_kitchen',
      stokAwal: 1200,
      masuk: 2000,
      keluar: 1300,
      opname: -3,
      stokAkhir: 1897,
      nilaiAset: 41734000,
      turnover: 'Slow Moving',
    },
  ];

  const filteredMutations = mutationRecords.filter((rec) => {
    if (categoryFilter !== 'Semua' && rec.category !== categoryFilter) return false;
    if (searchTable) {
      const q = searchTable.toLowerCase();
      const match =
        rec.sku.toLowerCase().includes(q) ||
        rec.name.toLowerCase().includes(q) ||
        rec.rack.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-space-xl">
      {/* Top Utility Context Bar / Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-space-xxs">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span>GudangKu WMS</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Laporan & Analitik</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold">Rekap Mutasi Stok</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Laporan & Rekapitulasi Inventaris
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Analisis perputaran barang (turnover), rekap stok opname, dan ekspor laporan resmi operasional logistik.
          </p>
        </div>

        {/* Export Action Hub */}
        <div className="flex items-center flex-wrap gap-space-sm">
          <button
            className="flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container-lowest text-on-surface hover:bg-surface-container-high rounded-xl font-label-md text-label-md transition-all shadow-sm cursor-pointer"
            type="button"
            onClick={() => onTriggerToast('Menyiapkan file PDF Mutasi Stok...')}
          >
            <span className="material-symbols-outlined text-error text-[18px]">picture_as_pdf</span>
            <span>Ekspor PDF</span>
          </button>
          <button
            className="flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container-lowest text-on-surface hover:bg-surface-container-high rounded-xl font-label-md text-label-md transition-all shadow-sm cursor-pointer"
            type="button"
            onClick={() => onTriggerToast('Mengunduh spreadsheet Excel mutasi_stok_okt23.xlsx...')}
          >
            <span className="material-symbols-outlined text-secondary text-[18px]">table_view</span>
            <span>Ekspor Excel / CSV</span>
          </button>
          <button
            className="flex items-center gap-space-xs px-space-md py-space-sm bg-primary text-on-primary hover:bg-primary/90 rounded-xl font-label-md text-label-md transition-all shadow-sm cursor-pointer"
            type="button"
            onClick={() => window.print()}
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Cetak Laporan Lengkap</span>
          </button>
        </div>
      </div>

      {/* Filter Card Komprehensif */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
          {/* Quick Range Switcher */}
          <div className="flex items-center p-space-xxs bg-surface-container-low rounded-xl">
            <button
              className={`px-space-md py-space-xs rounded-lg font-label-sm text-label-sm transition-colors cursor-pointer ${
                rangeTab === 'today'
                  ? 'bg-surface-container-lowest text-secondary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => {
                setRangeTab('today');
                onTriggerToast('Rentang filter diubah: Hari Ini');
              }}
              type="button"
            >
              Hari Ini
            </button>
            <button
              className={`px-space-md py-space-xs rounded-lg font-label-sm text-label-sm transition-colors cursor-pointer ${
                rangeTab === '7days'
                  ? 'bg-surface-container-lowest text-secondary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => {
                setRangeTab('7days');
                onTriggerToast('Rentang filter diubah: 7 Hari Terakhir');
              }}
              type="button"
            >
              7 Hari Terakhir
            </button>
            <button
              className={`px-space-md py-space-xs rounded-lg font-label-sm text-label-sm transition-colors cursor-pointer ${
                rangeTab === 'month'
                  ? 'bg-surface-container-lowest text-secondary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => {
                setRangeTab('month');
                onTriggerToast('Rentang filter diubah: Bulan Ini (Oktober 2023)');
              }}
              type="button"
            >
              Bulan Ini (Oktober 2023)
            </button>
            <button
              className={`px-space-md py-space-xs rounded-lg font-label-sm text-label-sm transition-colors cursor-pointer ${
                rangeTab === 'custom'
                  ? 'bg-surface-container-lowest text-secondary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => {
                setRangeTab('custom');
                onTriggerToast('Rentang filter diubah: Kustom Tanggal');
              }}
              type="button"
            >
              Kustom Tanggal
            </button>
          </div>

          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>
              Sinkronisasi Terakhir: <strong className="text-on-surface">24 Okt 2023, 16:45 WIB</strong>
            </span>
          </div>
        </div>

        {/* Filter Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {/* Date Range */}
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Rentang Kalender
            </label>
            <div className="flex items-center px-space-md py-space-xs bg-surface-container-low rounded-lg focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-secondary transition-all">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-space-xs">
                date_range
              </span>
              <input
                className="w-full bg-transparent font-code-sm text-code-sm text-on-surface outline-none"
                type="text"
                defaultValue="01/10/2023 - 24/10/2023"
              />
            </div>
          </div>

          {/* Report Type */}
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Tipe Laporan
            </label>
            <div className="relative">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full h-9 pl-space-md pr-8 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg appearance-none cursor-pointer focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all outline-none"
              >
                <option value="Laporan Mutasi Stok (In/Out)">Laporan Mutasi Stok (In/Out)</option>
                <option value="Laporan Nilai Aset Inventaris">Laporan Nilai Aset Inventaris</option>
                <option value="Laporan Stok Minimum & Reorder">Laporan Stok Minimum & Reorder</option>
                <option value="Laporan Fast / Slow Moving SKU">Laporan Fast / Slow Moving SKU</option>
              </select>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Commodity Category */}
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Kategori Komoditas
            </label>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full h-9 pl-space-md pr-8 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg appearance-none cursor-pointer focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all outline-none"
              >
                <option value="Semua">Semua Kategori (Pangan & Kemasan)</option>
                <option value="Bahan Pokok">Bahan Pokok Sembako</option>
                <option value="Minyak Nabati">Minyak Nabati & Mentega</option>
                <option value="Bumbu & Rempah">Bumbu & Rempah Olahan</option>
                <option value="Kemasan Logistik">Kemasan & Logistik Box</option>
              </select>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Warehouse Zone */}
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Zona & Rak Penyimpanan
            </label>
            <div className="relative">
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="w-full h-9 pl-space-md pr-8 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg appearance-none cursor-pointer focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all outline-none"
              >
                <option value="Semua">Semua Rak (Aisle A - D)</option>
                <option value="Blok A">Blok A (Pallet Berat / Heavy Duty)</option>
                <option value="Blok B">Blok B (Medium Shelving - Pangan)</option>
                <option value="Blok C">Blok C (Cold Zone / Semi-Chilled)</option>
                <option value="Blok D">Blok D (Packaging & Non-Food)</option>
              </select>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Buttons Toolbar */}
        <div className="flex items-center justify-between pt-space-xs">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-secondary text-[16px]">info</span>
            <span>
              Parameter: <strong>{filteredMutations.length} Entri Terfilter</strong> dari 1.428 total SKU aktif
            </span>
          </div>
          <div className="flex items-center gap-space-sm">
            <button
              className="px-space-md py-space-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg font-label-md text-label-md transition-colors cursor-pointer"
              onClick={() => {
                setCategoryFilter('Semua');
                setZoneFilter('Semua');
                setSearchTable('');
                setReportType('Laporan Mutasi Stok (In/Out)');
                setRangeTab('month');
                onTriggerToast('Filter berhasil dikembalikan ke standar bawaan');
              }}
              type="button"
            >
              Reset Filter
            </button>
            <button
              className="flex items-center gap-space-xs px-space-lg py-space-xs bg-secondary text-on-secondary hover:bg-on-secondary-container rounded-lg font-label-md text-label-md transition-colors shadow-sm cursor-pointer font-semibold"
              onClick={() => onTriggerToast('Menghasilkan laporan berdasarkan kriteria terpilih...')}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">filter_alt</span>
              <span>Terapkan Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Stats & Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
        {/* Stat 1: Mutasi Masuk */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="w-1.5 h-full bg-secondary absolute left-0 top-0"></div>
          <div className="flex items-center justify-between pl-space-xs mb-space-sm">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant tracking-wider">
              Total Mutasi Masuk (IN)
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">south_east</span>
            </div>
          </div>
          <div className="pl-space-xs">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-display-lg text-display-lg text-on-surface tracking-tight">42.150</span>
              <span className="font-label-md text-label-md text-on-surface-variant">Unit</span>
            </div>
            <p className="font-code-sm text-code-sm text-secondary font-semibold mt-space-xxs">
              Rp 842.000.000
            </p>
          </div>
          <div className="pl-space-xs mt-space-md flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-secondary text-[16px]">trending_up</span>
            <span className="text-on-surface font-semibold">+14.2%</span> vs periode September
          </div>
        </div>

        {/* Stat 2: Mutasi Keluar */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="w-1.5 h-full bg-tertiary-fixed-dim absolute left-0 top-0"></div>
          <div className="flex items-center justify-between pl-space-xs mb-space-sm">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant tracking-wider">
              Total Mutasi Keluar (OUT)
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-tertiary-container">
              <span className="material-symbols-outlined text-[18px]">north_east</span>
            </div>
          </div>
          <div className="pl-space-xs">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-display-lg text-display-lg text-on-surface tracking-tight">38.920</span>
              <span className="font-label-md text-label-md text-on-surface-variant">Unit</span>
            </div>
            <p className="font-code-sm text-code-sm text-on-tertiary-container font-semibold mt-space-xxs">
              Rp 778.400.000
            </p>
          </div>
          <div className="pl-space-xs mt-space-md flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-on-tertiary-container text-[16px]">trending_up</span>
            <span className="text-on-surface font-semibold">+8.7%</span> pemenuhan pesanan retail
          </div>
        </div>

        {/* Stat 3: Total Valuasi Stok */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="w-1.5 h-full bg-primary absolute left-0 top-0"></div>
          <div className="flex items-center justify-between pl-space-xs mb-space-sm">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant tracking-wider">
              Total Nilai Valuasi Aset
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="pl-space-xs">
            <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight block">
              Rp 2.450.800.000
            </span>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-space-xxs">
              Metode Penilaian: FIFO Standar
            </p>
          </div>
          <div className="pl-space-xs mt-space-md flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>Akurasi Fisik vs Buku: <strong>99.4%</strong></span>
          </div>
        </div>

        {/* Stat 4: Visualisasi Komposisi Turnover */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant tracking-wider">
              Turnover Per Kategori
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">pie_chart</span>
          </div>
          <div className="flex items-center gap-space-md py-space-xs">
            {/* SVG Donut Chart */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="transparent" r="14" stroke="#eff4ff" strokeWidth="3.5" />
                <circle
                  cx="18"
                  cy="18"
                  fill="transparent"
                  r="14"
                  stroke="#006398"
                  strokeDasharray="54.5 100"
                  strokeDashoffset="0"
                  strokeWidth="3.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  fill="transparent"
                  r="14"
                  stroke="#5bb8fe"
                  strokeDasharray="18.5 100"
                  strokeDashoffset="-54.5"
                  strokeWidth="3.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  fill="transparent"
                  r="14"
                  stroke="#131b2e"
                  strokeDasharray="15 100"
                  strokeDashoffset="-73"
                  strokeWidth="3.5"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-code-sm text-[11px] font-bold text-on-surface">
                100%
              </div>
            </div>
            <div className="flex flex-col gap-space-xxs w-full">
              <div className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="flex items-center gap-space-xs text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  Bahan Pokok
                </span>
                <span className="font-code-sm font-semibold text-on-surface">62%</span>
              </div>
              <div className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="flex items-center gap-space-xs text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                  Minyak Nabati
                </span>
                <span className="font-code-sm font-semibold text-on-surface">21%</span>
              </div>
              <div className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="flex items-center gap-space-xs text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                  Kemasan Logistik
                </span>
                <span className="font-code-sm font-semibold text-on-surface">17%</span>
              </div>
            </div>
          </div>
          <div className="pt-space-xs font-label-sm text-[11px] text-on-surface-variant text-right">
            Rasio Perputaran Rata-rata: <strong className="text-on-surface">6.8x / Thn</strong>
          </div>
        </div>
      </div>

      {/* Operational Detail Banner */}
      <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md shadow-sm">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center flex-shrink-0 text-secondary">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-sm">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                Status Rekapitulasi: Terverifikasi Sistem
              </span>
              <span className="px-space-xs py-0.5 bg-surface-container-lowest font-code-sm text-[11px] text-secondary font-semibold rounded">
                BATCH-MUT-20231024
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Seluruh transaksi keluar masuk telah divalidasi dengan barcode scanner Honeywell & terotorisasi ERP Pusat.
            </p>
          </div>
        </div>

        {/* Physical DC Photo */}
        <div className="flex items-center gap-space-md flex-shrink-0">
          <div className="hidden xl:flex items-center gap-space-sm pr-space-md">
            <img
              className="w-16 h-10 object-cover rounded-lg"
              alt="DC Cikarang Barat - Hub 1"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtzNJYY5D8KRjg0nzCJjj3SzQhE1Ao9ALqBLCQPS4ULDOk3AKdUmQXR2dfiA_2bTpP_tE_4maPAfbo43f5VwTKqseW27owpojJp0h_J9yZv6-QcaMfTTcQHXggyJs627FnftBvoKG-W4ZH4dYLyojWOhbvWzzu8rtpYIZvQeOlEujmOd0f5sYBHSkCpOJKHcIKSeiZ5rnQnXErF5PgrubPyhm4KrPN41ZsvDQM0pRp46dGCrOXJD0"
            />
            <div className="flex flex-col text-left">
              <span className="font-table-header text-table-header uppercase text-on-surface-variant">
                Lokasi Fisik
              </span>
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                DC Cikarang Barat - Hub 1
              </span>
            </div>
          </div>
          <button
            className="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-lowest hover:bg-surface-container-high text-on-surface rounded-lg font-label-md text-label-md transition-colors cursor-pointer"
            type="button"
            onClick={() => onTriggerToast('Menjalankan kalkulasi ulang saldo real-time...')}
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>Rekonsiliasi Ulang</span>
          </button>
        </div>
      </div>

      {/* Detailed Data Table Section: Buku Besar Mutasi Stok */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Header Controls */}
        <div className="p-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest">
          <div className="flex flex-col">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Buku Besar Mutasi Stok & Valuasi Fisik
            </h2>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Rincian per SKU pergerakan barang periode berjalan (Unit & Nilai Rupiah)
            </span>
          </div>
          <div className="flex items-center gap-space-sm">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">
                search
              </span>
              <input
                className="h-8 pl-8 pr-space-md bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all w-56"
                placeholder="Cari nama atau SKU..."
                type="text"
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
              />
            </div>
            <button
              className="h-8 px-space-sm bg-surface-container-low hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-space-xxs font-label-sm text-label-sm cursor-pointer"
              type="button"
              onClick={() => onTriggerToast('Pengaturan visibilitas kolom buku besar')}
            >
              <span className="material-symbols-outlined text-[16px]">view_column</span>
              <span>Kolom</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-table-header text-table-header uppercase tracking-wider">
                <th className="py-space-md px-space-lg">Kode SKU</th>
                <th className="py-space-md px-space-md">Nama Produk</th>
                <th className="py-space-md px-space-md">Kategori</th>
                <th className="py-space-md px-space-md text-right">Stok Awal</th>
                <th className="py-space-md px-space-md text-right text-secondary">Masuk (+)</th>
                <th className="py-space-md px-space-md text-right text-on-tertiary-container">Keluar (-)</th>
                <th className="py-space-md px-space-md text-right">Opname/Adj</th>
                <th className="py-space-md px-space-md text-right font-bold text-on-surface">Stok Akhir</th>
                <th className="py-space-md px-space-lg text-right">Nilai Aset (Rp)</th>
                <th className="py-space-md px-space-lg text-center">Perputaran</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm divide-y divide-surface-container-low text-on-surface">
              {filteredMutations.map((row) => (
                <tr key={row.sku} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-space-md px-space-lg font-code-sm text-code-sm text-secondary font-semibold">
                    {row.sku}
                  </td>
                  <td className="py-space-md px-space-md">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-7 h-7 rounded bg-surface-container flex items-center justify-center text-on-surface-variant text-[14px]">
                        <span className="material-symbols-outlined text-[16px]">{row.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-on-surface">{row.name}</span>
                        <span className="font-label-sm text-[10px] text-on-surface-variant">{row.rack}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md">
                    <span className="px-space-xs py-0.5 rounded font-label-sm text-[11px] bg-surface-container text-on-surface-variant">
                      {row.category}
                    </span>
                  </td>
                  <td className="py-space-md px-space-md text-right font-code-sm">
                    {row.stokAwal.toLocaleString('id-ID')}
                  </td>
                  <td className="py-space-md px-space-md text-right font-code-sm text-secondary font-semibold">
                    +{row.masuk.toLocaleString('id-ID')}
                  </td>
                  <td className="py-space-md px-space-md text-right font-code-sm text-on-tertiary-container font-semibold">
                    -{row.keluar.toLocaleString('id-ID')}
                  </td>
                  <td
                    className={`py-space-md px-space-md text-right font-code-sm ${
                      row.opname < 0
                        ? 'text-error font-semibold'
                        : row.opname > 0
                        ? 'text-secondary font-semibold'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    {row.opname > 0 ? `+${row.opname}` : row.opname}
                  </td>
                  <td className="py-space-md px-space-md text-right font-code-sm font-bold text-on-surface">
                    {row.stokAkhir.toLocaleString('id-ID')}
                  </td>
                  <td className="py-space-md px-space-lg text-right font-code-sm font-semibold text-on-surface">
                    Rp {row.nilaiAset.toLocaleString('id-ID')}
                  </td>
                  <td className="py-space-md px-space-lg text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-[11px] font-semibold ${
                        row.turnover === 'Fast Moving'
                          ? 'bg-surface-container text-secondary'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {row.turnover === 'Fast Moving' ? 'bolt' : 'hourglass_empty'}
                      </span>
                      {row.turnover}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Table Summary Aggregate Footnote */}
            <tfoot>
              <tr className="bg-surface-container-low font-label-md text-label-md text-on-surface font-semibold">
                <td className="py-space-md px-space-lg" colSpan={3}>
                  Subtotal Halaman Ini ({filteredMutations.length} Item)
                </td>
                <td className="py-space-md px-space-md text-right font-code-sm text-on-surface">26.450</td>
                <td className="py-space-md px-space-md text-right font-code-sm text-secondary">+42.150</td>
                <td className="py-space-md px-space-md text-right font-code-sm text-on-tertiary-container">-38.920</td>
                <td className="py-space-md px-space-md text-right font-code-sm text-error">-10</td>
                <td className="py-space-md px-space-md text-right font-code-sm text-on-surface">29.670</td>
                <td className="py-space-md px-space-lg text-right font-code-sm text-secondary">
                  Rp 508.516.500
                </td>
                <td className="py-space-md px-space-lg text-center font-table-header uppercase text-[10px] text-on-surface-variant">
                  VALIDATED
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="px-space-lg py-space-md bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
            <span>Menampilkan</span>
            <select className="bg-surface-container-low text-on-surface px-space-xs py-0.5 rounded font-label-sm text-label-sm outline-none">
              <option value="10">10</option>
              <option defaultValue="20" value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>dari 1.428 entri</span>
          </div>
          <div className="flex items-center gap-space-xxs">
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low disabled:opacity-40"
              disabled
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold"
              type="button"
            >
              1
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low font-label-sm text-label-sm cursor-pointer"
              type="button"
            >
              2
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low font-label-sm text-label-sm cursor-pointer"
              type="button"
            >
              3
            </button>
            <span className="px-space-xs text-on-surface-variant font-label-sm">...</span>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low font-label-sm text-label-sm cursor-pointer"
              type="button"
            >
              72
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sign-off & Audit Verification Footer Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col gap-space-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface">
              Lembar Pengesahan Dokumen Operasional
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Tanda tangan digital berketetapan sah untuk pelaporan audit internal & kepatuhan inventaris WMS.
            </span>
          </div>
          <div className="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-low rounded-lg text-on-surface-variant font-code-sm text-code-sm">
            <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
            <span>
              ID Dokumen: <strong className="text-on-surface">DOC/WMS-RPT/202310/8942</strong>
            </span>
          </div>
        </div>

        {/* Dual Signatures & Seal Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {/* Signer 1: Supervisor Gudang */}
          <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between h-44 relative">
            <div className="flex items-center justify-between">
              <span className="font-table-header text-table-header uppercase text-on-surface-variant">
                Disiapkan & Diverifikasi
              </span>
              <span className="px-space-xs py-0.5 rounded font-code-sm text-[10px] bg-secondary-fixed text-on-secondary-fixed font-semibold">
                VALIDATED
              </span>
            </div>
            {/* Digital Stamp Mock */}
            <div className="flex items-center gap-space-sm py-space-xs">
              <div className="w-9 h-9 rounded-full bg-surface-container-lowest flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">fingerprint</span>
              </div>
              <div className="flex flex-col">
                <span className="font-code-sm text-[11px] text-secondary font-bold tracking-widest">
                  DIGITALLY SIGNED
                </span>
                <span className="font-code-sm text-[10px] text-on-surface-variant">
                  24/10/2023 17:02:11 WIB
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-bold">
                Andi Pratama, S.Log
              </span>
              <span className="font-body-sm text-[11px] text-on-surface-variant">
                Supervisor Operasional Gudang (ID: OP-8821)
              </span>
            </div>
          </div>

          {/* Signer 2: Kepala Logistik & Supply Chain */}
          <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between h-44 relative">
            <div className="flex items-center justify-between">
              <span className="font-table-header text-table-header uppercase text-on-surface-variant">
                Disetujui Otoritas
              </span>
              <span className="px-space-xs py-0.5 rounded font-code-sm text-[10px] bg-secondary-fixed text-on-secondary-fixed font-semibold">
                APPROVED
              </span>
            </div>
            {/* Digital Stamp Mock */}
            <div className="flex items-center gap-space-sm py-space-xs">
              <div className="w-9 h-9 rounded-full bg-surface-container-lowest flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">draw</span>
              </div>
              <div className="flex flex-col">
                <span className="font-code-sm text-[11px] text-secondary font-bold tracking-widest">
                  DIGITALLY SIGNED
                </span>
                <span className="font-code-sm text-[10px] text-on-surface-variant">
                  24/10/2023 17:15:40 WIB
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-bold">
                Ir. Hendra Gunawan, M.M.
              </span>
              <span className="font-body-sm text-[11px] text-on-surface-variant">
                Head of Supply Chain & Inventory Management
              </span>
            </div>
          </div>

          {/* Metadata & Print Stamp */}
          <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between h-44">
            <div className="flex items-center justify-between">
              <span className="font-table-header text-table-header uppercase text-on-surface-variant">
                Metadata Cetak
              </span>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">lock</span>
            </div>
            <div className="flex flex-col gap-space-xxs font-label-sm text-[11px] text-on-surface-variant">
              <div className="flex justify-between">
                <span>Tanggal Cetak:</span>
                <span className="font-code-sm text-on-surface font-semibold">24 Okt 2023 17:30 WIB</span>
              </div>
              <div className="flex justify-between">
                <span>Terminal Cetak:</span>
                <span className="font-code-sm text-on-surface">WRKSTN-JKT-09</span>
              </div>
              <div className="flex justify-between">
                <span>Integritas SHA-256:</span>
                <span className="font-code-sm text-on-surface truncate max-w-[130px]" title="e4b029cf12d8a631f4">
                  e4b029cf12...
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs font-label-sm text-[11px] text-on-surface-variant bg-surface-container-lowest p-space-xs rounded">
              <span className="material-symbols-outlined text-[14px] text-secondary">info</span>
              <span>Dokumen ini valid tanpa stempel basah.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
