import React, { useState } from 'react';
import { InventoryItem, ActiveScreen } from '../types';

interface DashboardViewProps {
  items: InventoryItem[];
  onNavigate: (screen: ActiveScreen) => void;
  onOpenReorder: (item: InventoryItem) => void;
  onViewDocument: (docNumber: string, docType: 'inbound' | 'outbound' | 'report', data: any) => void;
  onOpenNewTransaction: () => void;
  onTriggerToast: (msg: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  items,
  onNavigate,
  onOpenReorder,
  onViewDocument,
  onOpenNewTransaction,
  onTriggerToast,
}) => {
  const [activeTrendRange, setActiveTrendRange] = useState<'7' | '30' | 'year'>('30');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(4); // default week 4

  const lowStockItems = [
    {
      id: 'ls-1',
      name: 'Beras Rojolele 5kg',
      sku: 'RICE-ROJ-005',
      rack: 'Rak A-02',
      stock: 8,
      minStock: 50,
      unit: 'Sak',
      status: 'Kritis',
      percent: 16,
      purchasePrice: 65000,
      supplier: 'PT Pangan Nusantara Raya',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFGEt5s8UshcogF399xF1wwCKudOAJqSMKaDG94Ia34UpGIrwu6zPdHIXwQLpkPdtZHE6W3LI-CrJTEJ_5qjCHbyhGg1_SqB4ecWewvtEc4tZz2KR2uUZ1NScEO2ADcKGT8PzNobJKe4CdAPPlF95qauY7Mtu5RfKaZUOSAPfAVjl_IqvWm2r66Kx9lEiOQ9528zoP-jMbReem63HN_2g49RhLtc5nKDRUPjNeRtC1H2WKPjbPgWI',
    },
    {
      id: 'ls-2',
      name: 'Minyak Goreng Bimoli 2L',
      sku: 'OIL-BIM-002',
      rack: 'Rak B-05',
      stock: 15,
      minStock: 40,
      unit: 'Dus',
      status: 'Menipis',
      percent: 37.5,
      purchasePrice: 190000,
      supplier: 'PT Salim Ivomas Pratama',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNgN7HjdaG68w6L8Ey8ouq9zag0dmKBjvAMUrm4xK3Epe2P1qC972xcEqT-xDOi1iWinLbJBQUYtale3xGD6DRSVTGjsSIW2nlziohEhVlRG5YJggP8ROMdQxwWt3I9sgF00uNnaQqCpKHezusY2b64dty_PtMzni_uPw9FjSdo6AgLgyOKyK8wsHsFDnMt_f_wgWLWiUCwiaeYzEFI5zdEqLA_lb-b4pNYlEKGmhR8l0xAcZHASg',
    },
    {
      id: 'ls-3',
      name: 'Gula Pasir Gulaku 1kg',
      sku: 'SUG-GLK-001',
      rack: 'Rak A-04',
      stock: 0,
      minStock: 30,
      unit: 'Pak',
      status: 'Habis',
      percent: 0,
      purchasePrice: 14500,
      supplier: 'PT Sugar Group Companies',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUwjV44MoYsZc0GqujD2SFxqyU6D7cw26nFBKSBn1xE7ndaq-smW68bw7IUjrFzy2Dixpazht7Y-TKJ-_dLZ1F2VyEwMq5NRYnro36Q8rCncTwvxDk2rhQbrnrhgWoG4_Ncpttk2fSLcLXaaeBtOEtA02IlMWci0Kj4M4gZ9QXSerwVoJ2W-DQ2BWpyB6jB7NHoDBkietQvdDMVTvHXWfiDfo9024OKDxNVlZfc5Ot7tzPbSu-29A',
    },
    {
      id: 'ls-4',
      name: 'Kardus Box Double Wall',
      sku: 'PKG-BOX-DW01',
      rack: 'Rak D-01',
      stock: 45,
      minStock: 100,
      unit: 'Pcs',
      status: 'Menipis',
      percent: 45,
      purchasePrice: 5200,
      supplier: 'CV Makmur Packaging',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBP6h4eoE5xndRCIf4M8xnFb2RNKiHOxfnEaMGksfmKSYKxrGL9hSpf3dGXYyYluMZe9J-IJHamksNWoueGjI04ElsmdRqYHuxlwLgo0ZfoLPVl6RSPd3Hqe6_aD8nKaKNKkExbzAcGnWB6OK0wMf13UyQCjRf3j_zmmudk-hSoI57V-Q2oUNa8WMKheINaJISzQnzWMi2k3V8aFCmjAVeiIL56bTnO1aUl-YdYYjybgV43f6t1hrM',
    },
  ];

  const recentTransactions = [
    {
      doc: 'IN-20231024-001',
      time: '24/10 14:22',
      type: 'in',
      name: 'Minyak Goreng Bimoli 2L',
      sku: 'OIL-BIM-002',
      qty: '+450 Dus',
      operator: 'Andi Pratama',
      operatorInitials: 'AP',
      status: 'Selesai',
      rack: 'Rak B-05',
    },
    {
      doc: 'OUT-20231024-042',
      time: '24/10 13:58',
      type: 'out',
      name: 'Beras Rojolele Super 5kg',
      sku: 'RICE-ROJ-005',
      qty: '-120 Sak',
      operator: 'Budi Wibowo',
      operatorInitials: 'BW',
      status: 'Selesai',
      rack: 'Rak A-02',
    },
    {
      doc: 'OUT-20231024-041',
      time: '24/10 13:10',
      type: 'out',
      name: 'Kardus Box Double Wall L',
      sku: 'PKG-BOX-DW01',
      qty: '-500 Lembar',
      operator: 'Dian Santoso',
      operatorInitials: 'DS',
      status: 'Diproses',
      rack: 'Rak D-01',
    },
    {
      doc: 'IN-20231024-002',
      time: '24/10 11:45',
      type: 'in',
      name: 'Tepung Terigu Segitiga 1kg',
      sku: 'FLR-SEG-001',
      qty: '+800 Pak',
      operator: 'Andi Pratama',
      operatorInitials: 'AP',
      status: 'Selesai',
      rack: 'Rak A-03-3',
    },
    {
      doc: 'IN-20231024-003',
      time: '24/10 10:15',
      type: 'in',
      name: 'Kecap Manis Sedaap 550ml',
      sku: 'SOY-SDP-550',
      qty: '+300 Pouch',
      operator: 'Rian Triyadi',
      operatorInitials: 'RT',
      status: 'Diproses',
      rack: 'Rak B-03',
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Top Operational Banner & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg mb-space-xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs text-secondary mb-space-xxs">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span className="font-table-header text-table-header uppercase tracking-wider text-secondary">
              Telemetri Inventaris Aktif
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
            Ringkasan Operasional Gudang
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Pantauan real-time inventaris dan pergerakan stok hari ini, Selasa 24 Oktober 2023
          </p>
        </div>

        {/* Quick Operational Actions */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <button
            className="flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container-lowest text-on-surface rounded-lg font-label-md text-label-md shadow-sm hover:bg-surface-container-low transition-all cursor-pointer"
            type="button"
            onClick={() => {
              window.print();
              onTriggerToast('Menyiapkan pratinjau cetak ringkasan operasional harian...');
            }}
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">print</span>
            <span>Cetak Laporan Harian</span>
          </button>
          <button
            className="flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container-lowest text-on-surface rounded-lg font-label-md text-label-md shadow-sm hover:bg-surface-container-low transition-all cursor-pointer"
            type="button"
            onClick={() => onTriggerToast('Filter zona gudang aktif: DC Cikarang Barat')}
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">tune</span>
            <span>Filter Lokasi</span>
          </button>
          <button
            className="flex items-center gap-space-xs px-space-md py-space-sm bg-secondary text-on-secondary rounded-lg font-label-md text-label-md shadow-sm hover:bg-on-secondary-container transition-all cursor-pointer font-medium"
            type="button"
            onClick={onOpenNewTransaction}
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Buat Transaksi Cepat</span>
          </button>
        </div>
      </div>

      {/* Operational Alert Strip */}
      <div className="mb-space-xl p-space-md bg-tertiary-fixed rounded-xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-space-md">
          <div className="w-9 h-9 rounded-lg bg-on-tertiary-container flex items-center justify-center text-tertiary-fixed shrink-0">
            <span className="material-symbols-outlined text-[20px]">warning</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md font-semibold text-on-tertiary-fixed">
              Peringatan Kritis: 5 SKU Mencapai Titik Minimum Stok Hari Ini
            </span>
            <span className="font-body-sm text-body-sm text-on-tertiary-fixed-variant">
              Segera terbitkan Purchase Order (PO) darurat untuk menghindari bottleneck distribusi zona retail.
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('low-stock-panel');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="hidden sm:inline-flex items-center gap-space-xs font-label-sm text-label-sm font-semibold text-on-tertiary-container bg-surface-container-lowest px-space-md py-space-xs rounded-lg shadow-sm hover:bg-surface-container-low transition-colors"
        >
          <span>Tinjau SKU</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      {/* 4 KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-lg mb-space-xl">
        {/* Metric 1 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary"></div>
          <div className="flex items-center justify-between mb-space-md">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant tracking-wider">
              Total Stok Barang
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              142.850 <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">Unit</span>
            </div>
            <div className="flex items-center justify-between mt-space-sm pt-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant">1.240 SKU aktif</span>
              <span className="inline-flex items-center gap-0.5 px-space-xs py-0.5 rounded text-[11px] font-semibold bg-surface-container text-secondary">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>+3.2%
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-container"></div>
          <div className="flex items-center justify-between mb-space-md">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant tracking-wider">
              Barang Masuk Hari Ini
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">move_to_inbox</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              3.420 <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">Unit</span>
            </div>
            <div className="flex items-center justify-between mt-space-sm pt-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant">18 PO Selesai</span>
              <span className="inline-flex items-center gap-0.5 px-space-xs py-0.5 rounded text-[11px] font-semibold bg-surface-container text-secondary">
                <span className="material-symbols-outlined text-[14px]">arrow_downward</span>+12.0%
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-surface-container-highest"></div>
          <div className="flex items-center justify-between mb-space-md">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant tracking-wider">
              Barang Keluar Hari Ini
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">outbox</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              2.810 <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">Unit</span>
            </div>
            <div className="flex items-center justify-between mt-space-sm pt-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant">42 Surat Jalan terkirim</span>
              <span className="font-code-sm text-code-sm text-on-surface-variant font-medium">98.4% On-Time</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-tertiary-fixed-dim"></div>
          <div className="flex items-center justify-between mb-space-md">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant tracking-wider">
              Peringatan Stok Menipis
            </span>
            <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-container">
              <span className="material-symbols-outlined text-[20px]">report_problem</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-error font-bold tracking-tight">
              14 <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">SKU Terindikasi</span>
            </div>
            <div className="flex items-center justify-between mt-space-sm pt-space-xs">
              <span className="font-label-sm text-label-sm text-error font-semibold">5 SKU butuh restock segera!</span>
              <button
                type="button"
                onClick={() => onNavigate('data-barang')}
                className="font-code-sm text-code-sm text-error font-bold bg-error-container px-space-xs py-0.5 rounded cursor-pointer hover:opacity-80"
              >
                Action
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: 8 Cols Left + 4 Cols Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        {/* LEFT COLUMN: 8 of 12 */}
        <div className="lg:col-span-8 flex flex-col gap-space-xl">
          {/* Chart Card */}
          <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-lg">
              <div className="flex flex-col">
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Tren Pergerakan Stok
                </h2>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Komparasi volume Inbound (Penerimaan) vs Outbound (Pengiriman) mingguan
                </span>
              </div>
              {/* Filter Tabs */}
              <div className="inline-flex p-space-xxs bg-surface-container-low rounded-lg shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTrendRange('7')}
                  className={`px-space-md py-space-xs rounded-lg font-label-sm text-label-sm transition-colors ${
                    activeTrendRange === '7'
                      ? 'bg-surface-container-lowest text-secondary font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  7 Hari
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTrendRange('30')}
                  className={`px-space-md py-space-xs rounded-lg font-label-sm text-label-sm transition-colors ${
                    activeTrendRange === '30'
                      ? 'bg-surface-container-lowest text-secondary font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  30 Hari Terakhir
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTrendRange('year')}
                  className={`px-space-md py-space-xs rounded-lg font-label-sm text-label-sm transition-colors ${
                    activeTrendRange === 'year'
                      ? 'bg-surface-container-lowest text-secondary font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Tahun Ini
                </button>
              </div>
            </div>

            {/* Legend & Summary */}
            <div className="flex flex-wrap items-center justify-between py-space-sm px-space-md bg-surface-container-low rounded-lg mb-space-lg">
              <div className="flex items-center gap-space-lg">
                <div className="flex items-center gap-space-xs">
                  <span className="w-3 h-3 rounded-full bg-secondary"></span>
                  <span className="font-label-sm text-label-sm text-on-surface font-medium">Inbound (Masuk)</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="w-3 h-3 rounded-full bg-secondary-container"></span>
                  <span className="font-label-sm text-label-sm text-on-surface font-medium">Outbound (Keluar)</span>
                </div>
              </div>
              <div className="flex items-center gap-space-md font-code-sm text-code-sm text-on-surface-variant">
                <span>Rasio Keluar/Masuk: <strong className="text-on-surface font-semibold">82.1%</strong></span>
                <span>Rata-rata Harian: <strong className="text-on-surface font-semibold">3.115 Unit</strong></span>
              </div>
            </div>

            {/* Multi-Line SVG Chart */}
            <div className="relative w-full h-72 sm:h-80 select-none">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 740 260">
                <defs>
                  <linearGradient id="inboundGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#006398" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#006398" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="outboundGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#5bb8fe" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#5bb8fe" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines */}
                <line stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="730" y1="20" y2="20" />
                <line stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="730" y1="75" y2="75" />
                <line stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="730" y1="130" y2="130" />
                <line stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="730" y1="185" y2="185" />
                <line stroke="#CBD5E1" strokeWidth="1" x1="30" x2="730" y1="240" y2="240" />

                {/* Y-Axis Labels */}
                <text className="font-code-sm fill-on-surface-variant text-[10px]" textAnchor="end" x="24" y="24">5k</text>
                <text className="font-code-sm fill-on-surface-variant text-[10px]" textAnchor="end" x="24" y="79">4k</text>
                <text className="font-code-sm fill-on-surface-variant text-[10px]" textAnchor="end" x="24" y="134">3k</text>
                <text className="font-code-sm fill-on-surface-variant text-[10px]" textAnchor="end" x="24" y="189">2k</text>
                <text className="font-code-sm fill-on-surface-variant text-[10px]" textAnchor="end" x="24" y="244">0</text>

                {/* Inbound Area & Stroke */}
                <path d="M 40 160 Q 100 135 155 120 T 270 70 T 385 95 T 500 45 T 615 60 T 720 35 L 720 240 L 40 240 Z" fill="url(#inboundGrad)" />
                <path d="M 40 160 Q 100 135 155 120 T 270 70 T 385 95 T 500 45 T 615 60 T 720 35" fill="none" stroke="#006398" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />

                {/* Outbound Area & Stroke */}
                <path d="M 40 195 Q 100 180 155 170 T 270 140 T 385 115 T 500 130 T 615 90 T 720 80 L 720 240 L 40 240 Z" fill="url(#outboundGrad)" />
                <path d="M 40 195 Q 100 180 155 170 T 270 140 T 385 115 T 500 130 T 615 90 T 720 80" fill="none" stroke="#5bb8fe" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />

                {/* Inbound Nodes */}
                {[
                  { cx: 40, cy: 160, idx: 1 },
                  { cx: 155, cy: 120, idx: 2 },
                  { cx: 270, cy: 70, idx: 3 },
                  { cx: 385, cy: 95, idx: 4 },
                  { cx: 500, cy: 45, idx: 5 },
                  { cx: 615, cy: 60, idx: 6 },
                  { cx: 720, cy: 35, idx: 7 },
                ].map((pt) => (
                  <circle
                    key={pt.idx}
                    cx={pt.cx}
                    cy={pt.cy}
                    r={hoveredPoint === pt.idx ? 6 : 4}
                    fill="#FFFFFF"
                    stroke="#006398"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint(pt.idx)}
                  />
                ))}

                {/* Outbound Nodes */}
                {[
                  { cx: 40, cy: 195, idx: 1 },
                  { cx: 155, cy: 170, idx: 2 },
                  { cx: 270, cy: 140, idx: 3 },
                  { cx: 385, cy: 115, idx: 4 },
                  { cx: 500, cy: 130, idx: 5 },
                  { cx: 615, cy: 90, idx: 6 },
                  { cx: 720, cy: 80, idx: 7 },
                ].map((pt) => (
                  <circle
                    key={pt.idx}
                    cx={pt.cx}
                    cy={pt.cy}
                    r={hoveredPoint === pt.idx ? 5.5 : 3.5}
                    fill="#FFFFFF"
                    stroke="#5bb8fe"
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint(pt.idx)}
                  />
                ))}

                {/* Inspection Marker Line */}
                <line opacity="0.6" stroke="#006398" strokeDasharray="2 2" strokeWidth="1.5" x1="500" x2="500" y1="20" y2="240" />
              </svg>

              {/* Floating Tooltip Callout */}
              <div className="absolute top-4 left-[64%] transform -translate-x-1/2 bg-primary-container text-surface-bright px-space-md py-space-xs rounded-lg shadow-md hidden sm:flex flex-col gap-0.5 z-20">
                <span className="font-table-header text-[10px] text-surface-dim uppercase">
                  Minggu 4 (16 - 22 Okt)
                </span>
                <div className="flex items-center gap-space-md font-code-sm text-code-sm">
                  <span className="text-secondary-fixed">In: 4.620</span>
                  <span className="text-secondary-fixed-dim">Out: 3.100</span>
                </div>
              </div>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between px-6 pt-space-xs font-code-sm text-code-sm text-on-surface-variant">
              <span>Minggu 1</span>
              <span>Minggu 2</span>
              <span>Minggu 3</span>
              <span>Minggu 4</span>
              <span>Minggu 5</span>
              <span className="font-semibold text-on-surface">Hari Ini (Aktif)</span>
            </div>
          </div>

          {/* Recent Transactions Table Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-lowest">
              <div className="flex flex-col">
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Tabel Transaksi Terkini
                </h2>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  5 pergerakan material terbaru yang terekam pada pemindai barcode gudang
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('laporan')}
                className="px-space-md py-space-xs bg-surface-container-low text-on-surface rounded-lg font-label-sm text-label-sm hover:bg-surface-container transition-colors cursor-pointer self-start sm:self-auto"
              >
                Lihat Semua Log
              </button>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-table-header text-table-header uppercase tracking-wider">
                    <th className="py-space-sm px-space-md">No. Dokumen</th>
                    <th className="py-space-sm px-space-md">Waktu</th>
                    <th className="py-space-sm px-space-md">Tipe</th>
                    <th className="py-space-sm px-space-md">Nama Barang</th>
                    <th className="py-space-sm px-space-md text-right">Kuantitas</th>
                    <th className="py-space-sm px-space-md">Operator</th>
                    <th className="py-space-sm px-space-md text-center">Status</th>
                    <th className="py-space-sm px-space-md text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high/40 font-body-sm text-body-sm text-on-surface">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.doc} className="hover:bg-surface-container-low/70 transition-colors">
                      <td className="py-space-md px-space-md font-code-sm text-code-sm font-semibold text-secondary">
                        {tx.doc}
                      </td>
                      <td className="py-space-md px-space-md font-code-sm text-code-sm text-on-surface-variant whitespace-nowrap">
                        {tx.time}
                      </td>
                      <td className="py-space-md px-space-md">
                        {tx.type === 'in' ? (
                          <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded text-[11px] font-semibold bg-surface-container text-secondary">
                            <span className="material-symbols-outlined text-[12px]">arrow_downward</span>Masuk
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded text-[11px] font-semibold bg-surface-container-high text-on-surface">
                            <span className="material-symbols-outlined text-[12px]">arrow_upward</span>Keluar
                          </span>
                        )}
                      </td>
                      <td className="py-space-md px-space-md font-medium">
                        {tx.name}
                        <span className="block font-code-sm text-[11px] text-on-surface-variant font-normal">
                          SKU: {tx.sku}
                        </span>
                      </td>
                      <td className={`py-space-md px-space-md text-right font-code-sm font-semibold whitespace-nowrap ${
                        tx.type === 'in' ? 'text-on-surface' : 'text-error'
                      }`}>
                        {tx.qty}
                      </td>
                      <td className="py-space-md px-space-md whitespace-nowrap">
                        <div className="flex items-center gap-space-xs">
                          <span className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center font-label-sm text-[11px] font-bold">
                            {tx.operatorInitials}
                          </span>
                          <span>{tx.operator}</span>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md text-center whitespace-nowrap">
                        <span className={`inline-flex items-center px-space-xs py-0.5 rounded-full text-[11px] font-semibold ${
                          tx.status === 'Selesai'
                            ? 'bg-surface-container text-secondary'
                            : 'bg-tertiary-fixed text-on-tertiary-container'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-space-md px-space-md text-center">
                        <button
                          type="button"
                          onClick={() => onViewDocument(tx.doc, tx.type === 'in' ? 'inbound' : 'outbound', {
                            itemName: tx.name,
                            sku: tx.sku,
                            qty: tx.qty,
                            rackLocation: tx.rack,
                            customer: tx.type === 'out' ? 'Toko Rekanan Mitra' : undefined,
                            supplier: tx.type === 'in' ? 'Vendor Logistik' : undefined,
                          })}
                          className="p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                          title="Lihat Dokumen"
                        >
                          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 of 12 */}
        <div className="lg:col-span-4 flex flex-col gap-space-xl">
          {/* Low Stock Alert Panel */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col" id="low-stock-panel">
            <div className="flex items-center justify-between pb-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-error text-[20px]">notification_important</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Peringatan Stok Menipis
                </h2>
              </div>
              <span className="font-label-sm text-[11px] font-bold px-space-xs py-0.5 rounded bg-error-container text-on-error-container">
                4 Prioritas
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Daftar material gudang yang berada di bawah ambang safety-stock minimum:
            </p>

            <div className="flex flex-col gap-space-md">
              {lowStockItems.map((item) => (
                <div key={item.id} className="p-space-md bg-surface-container-low rounded-lg flex flex-col gap-space-xs">
                  <div className="flex items-start justify-between gap-space-xs">
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-semibold text-on-surface">
                        {item.name}
                      </span>
                      <span className="font-code-sm text-[11px] text-on-surface-variant">
                        {item.sku} • {item.rack}
                      </span>
                    </div>
                    <span className={`inline-flex px-space-xs py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.status === 'Habis' || item.status === 'Kritis'
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-tertiary-fixed text-on-tertiary-container'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-label-sm text-label-sm pt-space-xxs">
                    <span className="text-on-surface-variant">
                      Tersedia: <strong className={`font-bold font-code-sm ${item.stock === 0 ? 'text-error' : item.stock < 10 ? 'text-error' : 'text-on-tertiary-container'}`}>
                        {item.stock} {item.unit}
                      </strong> / Min: {item.minStock}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenReorder({
                        id: item.id,
                        sku: item.sku,
                        name: item.name,
                        stock: item.stock,
                        minStock: item.minStock,
                        unit: item.unit,
                        purchasePrice: item.purchasePrice,
                        supplier: item.supplier,
                        image: item.image,
                        category: 'Bahan Pokok',
                        rackLocation: item.rack,
                        zone: 'Zona A',
                        status: item.stock === 0 ? 'Habis' : 'Menipis',
                        batch: 'BATCH-PO',
                        barcode: '899999999',
                        storageTemp: '24°C',
                        leadTime: '2 Hari',
                      })}
                      className="px-space-sm py-1 bg-surface-container-lowest hover:bg-secondary hover:text-on-secondary text-secondary rounded font-label-sm text-[11px] font-semibold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">shopping_cart_checkout</span>
                      <span>Pesan Ulang</span>
                    </button>
                  </div>

                  <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${item.status === 'Habis' || item.status === 'Kritis' ? 'bg-error' : 'bg-tertiary-fixed-dim'}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Storage Capacity Widget */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">warehouse</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Utilitas Kapasitas Gudang
                </h2>
              </div>
              <span className="font-code-sm text-code-sm text-on-surface-variant">Zona A-C</span>
            </div>

            <div className="flex flex-col gap-space-md">
              {/* Rak A */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center font-label-sm text-label-sm">
                  <span className="font-semibold text-on-surface">Rak A (FMCG & Pangan Kering)</span>
                  <span className="font-code-sm text-code-sm font-bold text-error">88% (Padat)</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div className="bg-error h-2 rounded-full transition-all duration-500" style={{ width: '88%' }}></div>
                </div>
                <span className="text-[11px] text-on-surface-variant font-code-sm">Tersisa 12 palet kosong</span>
              </div>

              {/* Rak B */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center font-label-sm text-label-sm">
                  <span className="font-semibold text-on-surface">Rak B (Kemasan & Material)</span>
                  <span className="font-code-sm text-code-sm font-bold text-secondary">64% (Optimal)</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div className="bg-secondary h-2 rounded-full transition-all duration-500" style={{ width: '64%' }}></div>
                </div>
                <span className="text-[11px] text-on-surface-variant font-code-sm">Tersisa 48 palet kosong</span>
              </div>

              {/* Rak C */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center font-label-sm text-label-sm">
                  <span className="font-semibold text-on-surface">Rak C (Zona Penyangga Masuk)</span>
                  <span className="font-code-sm text-code-sm font-bold text-on-surface-variant">42% (Longgar)</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div className="bg-secondary-container h-2 rounded-full transition-all duration-500" style={{ width: '42%' }}></div>
                </div>
                <span className="text-[11px] text-on-surface-variant font-code-sm">Tersisa 82 palet kosong</span>
              </div>

              {/* Cold Storage Hub */}
              <div className="p-space-md bg-surface-container-low rounded-lg flex items-center justify-between mt-space-xs">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[18px]">ac_unit</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                      Cold Storage Hub #1
                    </span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">
                      Kapasitas: 55% • Kelembaban 85%
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-headline-sm text-headline-sm font-bold text-secondary font-code-sm">
                    4°C
                  </span>
                  <span className="inline-flex items-center text-[10px] font-semibold text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1 animate-pulse"></span>Aman
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-space-md pt-space-sm flex items-center gap-space-xs text-on-surface-variant text-[11px] font-body-sm">
              <span className="material-symbols-outlined text-[16px]">sync</span>
              <span>Sinkronisasi sensor IoT gudang diperbarui 3 menit lalu.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
