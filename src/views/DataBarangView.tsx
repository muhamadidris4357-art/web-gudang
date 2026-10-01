import React, { useState, useMemo } from 'react';
import { InventoryItem } from '../types';

interface DataBarangViewProps {
  items: InventoryItem[];
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  onUpdateItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onTriggerToast: (msg: string) => void;
  searchQuery: string;
}

export const DataBarangView: React.FC<DataBarangViewProps> = ({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onTriggerToast,
  searchQuery: externalSearch,
}) => {
  const [activeTab, setActiveTab] = useState<'semua' | 'tersedia' | 'menipis' | 'habis'>('semua');
  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Selected item for drawer
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(items[0] || null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form states for Add/Edit
  const [formSku, setFormSku] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Bahan Pokok');
  const [formRack, setFormRack] = useState('Rak A-01-1');
  const [formZone, setFormZone] = useState('Zona A');
  const [formStock, setFormStock] = useState(100);
  const [formMinStock, setFormMinStock] = useState(25);
  const [formUnit, setFormUnit] = useState('Sak');
  const [formPrice, setFormPrice] = useState(50000);
  const [formBarcode, setFormBarcode] = useState('899123456789');
  const [formSupplier, setFormSupplier] = useState('PT Pangan Nusantara Raya');

  const combinedSearch = (externalSearch || localSearch).toLowerCase();

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Tab filter
      if (activeTab === 'tersedia' && item.status !== 'Tersedia') return false;
      if (activeTab === 'menipis' && item.status !== 'Menipis') return false;
      if (activeTab === 'habis' && item.status !== 'Habis') return false;

      // Dropdown filters
      if (selectedCategory && item.category !== selectedCategory) return false;
      if (selectedStatus && item.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;
      if (selectedLocation) {
        if (!item.rackLocation.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      }

      // Search
      if (combinedSearch) {
        const match =
          item.name.toLowerCase().includes(combinedSearch) ||
          item.sku.toLowerCase().includes(combinedSearch) ||
          item.barcode.includes(combinedSearch) ||
          item.rackLocation.toLowerCase().includes(combinedSearch);
        if (!match) return false;
      }

      return true;
    });
  }, [items, activeTab, selectedCategory, selectedStatus, selectedLocation, combinedSearch]);

  const openAddModal = () => {
    setEditingItem(null);
    setFormSku(`SKU-NEW-${Math.floor(100 + Math.random() * 900)}`);
    setFormName('');
    setFormCategory('Bahan Pokok');
    setFormRack('Rak A-02-1');
    setFormZone('Zona A');
    setFormStock(100);
    setFormMinStock(20);
    setFormUnit('Sak');
    setFormPrice(45000);
    setFormBarcode(`899${Math.floor(100000000 + Math.random() * 900000000)}`);
    setFormSupplier('PT Pangan Nusantara Raya');
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setFormSku(item.sku);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormRack(item.rackLocation);
    setFormZone(item.zone);
    setFormStock(item.stock);
    setFormMinStock(item.minStock);
    setFormUnit(item.unit);
    setFormPrice(item.purchasePrice);
    setFormBarcode(item.barcode);
    setFormSupplier(item.supplier);
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const status: 'Tersedia' | 'Menipis' | 'Habis' =
      formStock === 0 ? 'Habis' : formStock <= formMinStock ? 'Menipis' : 'Tersedia';

    if (editingItem) {
      const updated: InventoryItem = {
        ...editingItem,
        sku: formSku,
        name: formName,
        category: formCategory,
        rackLocation: formRack,
        zone: formZone,
        stock: formStock,
        minStock: formMinStock,
        unit: formUnit,
        purchasePrice: formPrice,
        barcode: formBarcode,
        supplier: formSupplier,
        status,
      };
      onUpdateItem(updated);
      if (selectedItem?.id === updated.id) {
        setSelectedItem(updated);
      }
      onTriggerToast(`Data barang ${formSku} berhasil diperbarui.`);
    } else {
      onAddItem({
        sku: formSku,
        name: formName,
        category: formCategory,
        rackLocation: formRack,
        zone: formZone,
        stock: formStock,
        minStock: formMinStock,
        unit: formUnit,
        purchasePrice: formPrice,
        barcode: formBarcode,
        supplier: formSupplier,
        status,
        batch: `#BATCH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCFGEt5s8UshcogF399xF1wwCKudOAJqSMKaDG94Ia34UpGIrwu6zPdHIXwQLpkPdtZHE6W3LI-CrJTEJ_5qjCHbyhGg1_SqB4ecWewvtEc4tZz2KR2uUZ1NScEO2ADcKGT8PzNobJKe4CdAPPlF95qauY7Mtu5RfKaZUOSAPfAVjl_IqvWm2r66Kx9lEiOQ9528zoP-jMbReem63HN_2g49RhLtc5nKDRUPjNeRtC1H2WKPjbPgWI',
        storageTemp: 'Ambient / Kering (24°C)',
        leadTime: '2 - 3 Hari Kerja',
        initialStock: formStock,
        inbound: formStock,
        outbound: 0,
        opnameAdj: 0,
        turnoverSpeed: 'Fast Moving',
      });
      onTriggerToast(`Barang baru ${formName} berhasil ditambahkan ke inventaris.`);
    }
    setIsModalOpen(false);
  };

  const handleOpenDrawer = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleResetFilters = () => {
    setLocalSearch('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedLocation('');
    setActiveTab('semua');
    onTriggerToast('Filter berhasil dikembalikan ke standar bawaan');
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Title & Action Hub */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs font-table-header text-table-header uppercase text-secondary font-bold tracking-wider">
            <span>Master Data</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Inventaris Logistik</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Data Barang & Inventaris
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Kelola master data produk, status stok, SKU, dan alokasi rak gudang secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-space-xs flex-wrap">
          <button
            className="flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container-lowest text-on-surface hover:bg-surface-container-high rounded-xl font-label-md text-label-md transition-all shadow-sm cursor-pointer"
            type="button"
            onClick={() => onTriggerToast('Mengekspor spreadsheet CSV Master Data Inventaris...')}
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">file_download</span>
            <span>Export Data</span>
          </button>
          <button
            className="flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container-lowest text-on-surface hover:bg-surface-container-high rounded-xl font-label-md text-label-md transition-all shadow-sm cursor-pointer"
            type="button"
            onClick={() => onTriggerToast('Fitur impor spreadsheet Excel siap: Silakan unggah format template WMS.')}
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">upload_file</span>
            <span>Import Excel</span>
          </button>
          <button
            className="flex items-center gap-space-xs px-space-lg py-space-sm bg-secondary text-on-secondary rounded-xl font-label-md text-label-md hover:bg-on-secondary-container transition-all shadow-sm font-semibold cursor-pointer"
            type="button"
            onClick={openAddModal}
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Tambah Barang Baru</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant">Total Terdaftar</span>
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold mt-space-xxs">1.240</span>
            <span className="font-label-sm text-label-sm text-secondary flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">inventory</span> SKU Aktif
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
            <span className="material-symbols-outlined text-[20px]">layers</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant">Stok Aman</span>
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold mt-space-xxs">1.182</span>
            <span className="font-label-sm text-label-sm text-secondary flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">check_circle</span> 95.3% Rasio
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[20px]">verified</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant">Stok Menipis</span>
            <span className="font-headline-lg text-headline-lg text-on-tertiary-container font-bold mt-space-xxs">44</span>
            <span className="font-label-sm text-label-sm text-on-tertiary-container flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">warning</span> Perlu Reorder
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
            <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-table-header text-table-header uppercase text-on-surface-variant">Stok Kosong</span>
            <span className="font-headline-lg text-headline-lg text-error font-bold mt-space-xxs">14</span>
            <span className="font-label-sm text-label-sm text-error flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">error</span> Kritis
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm flex flex-col p-space-md gap-space-md">
        {/* Filter Tabs & Toolbar */}
        <div className="flex items-center justify-between overflow-x-auto pb-space-xs">
          <div className="flex items-center gap-space-xs">
            <button
              type="button"
              onClick={() => setActiveTab('semua')}
              className={`px-space-md py-space-xs rounded-xl font-label-md text-label-md transition-colors ${
                activeTab === 'semua'
                  ? 'bg-secondary text-on-secondary font-semibold'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Semua (1.240)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tersedia')}
              className={`px-space-md py-space-xs rounded-xl font-label-md text-label-md transition-colors ${
                activeTab === 'tersedia'
                  ? 'bg-secondary text-on-secondary font-semibold'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Tersedia (1.182)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('menipis')}
              className={`px-space-md py-space-xs rounded-xl font-label-md text-label-md transition-colors ${
                activeTab === 'menipis'
                  ? 'bg-on-tertiary-container text-white font-semibold'
                  : 'bg-surface-container-low text-on-tertiary-container hover:bg-surface-container-high'
              }`}
            >
              Stok Menipis (44)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('habis')}
              className={`px-space-md py-space-xs rounded-xl font-label-md text-label-md transition-colors ${
                activeTab === 'habis'
                  ? 'bg-error text-white font-semibold'
                  : 'bg-surface-container-low text-error hover:bg-surface-container-high'
              }`}
            >
              Habis (14)
            </button>
          </div>

          <div className="flex items-center gap-space-xs">
            <button
              className="p-space-xs bg-surface-container-low text-on-surface-variant hover:text-on-surface rounded-lg transition-colors cursor-pointer"
              title="Muat Ulang Data"
              type="button"
              onClick={() => onTriggerToast('Memperbarui sinkronisasi master data...')}
            >
              <span className="material-symbols-outlined text-[20px]">refresh</span>
            </button>
            <button
              className="p-space-xs bg-surface-container-low text-on-surface-variant hover:text-on-surface rounded-lg transition-colors cursor-pointer"
              title="Kustomisasi Kolom"
              type="button"
              onClick={() => onTriggerToast('Pengaturan tata letak kolom tabel')}
            >
              <span className="material-symbols-outlined text-[20px]">view_column</span>
            </button>
          </div>
        </div>

        {/* Search & Selectors Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
          <div className="relative md:col-span-5">
            <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              className="w-full h-10 pl-10 pr-space-md bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest transition-colors shadow-inner"
              placeholder="Cari nama barang, kode SKU, barcode..."
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 px-space-md bg-surface-container-low text-on-surface rounded-xl font-body-sm text-body-sm focus:outline-none cursor-pointer"
            >
              <option value="">Semua Kategori</option>
              <option value="Bahan Pokok">Bahan Pokok</option>
              <option value="Minyak & Bumbu">Minyak & Bumbu</option>
              <option value="Kemasan">Kemasan</option>
              <option value="Elektronik">Elektronik</option>
              <option value="Cairan">Cairan</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-10 px-space-md bg-surface-container-low text-on-surface rounded-xl font-body-sm text-body-sm focus:outline-none cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="tersedia">Tersedia</option>
              <option value="menipis">Menipis</option>
              <option value="habis">Habis</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full h-10 px-space-md bg-surface-container-low text-on-surface rounded-xl font-body-sm text-body-sm focus:outline-none cursor-pointer"
            >
              <option value="">Semua Lokasi</option>
              <option value="Rak A">Zona Rak A (A-01 - A-10)</option>
              <option value="Rak B">Zona Rak B (B-01 - B-10)</option>
              <option value="Rak C">Zona Rak C (C-01 - C-10)</option>
              <option value="Rak D">Zona Rak D (D-01 - D-10)</option>
            </select>
          </div>

          <div className="md:col-span-1 flex justify-end">
            <button
              className="w-full h-10 flex items-center justify-center gap-space-xs bg-surface-container-low text-on-surface hover:bg-surface-container-high rounded-xl font-label-sm text-label-sm transition-colors cursor-pointer"
              type="button"
              onClick={handleResetFilters}
            >
              <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto w-full rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-table-header text-table-header uppercase">
                <th className="py-space-sm px-space-md w-10">
                  <input className="rounded accent-secondary w-4 h-4 cursor-pointer" type="checkbox" />
                </th>
                <th className="py-space-sm px-space-md">Kode SKU</th>
                <th className="py-space-sm px-space-md">Nama Barang & Varian</th>
                <th className="py-space-sm px-space-md">Kategori</th>
                <th className="py-space-sm px-space-md">Lokasi Rak</th>
                <th className="py-space-sm px-space-md text-right">Stok Fisik</th>
                <th className="py-space-sm px-space-md">Satuan</th>
                <th className="py-space-sm px-space-md text-right">Harga Beli</th>
                <th className="py-space-sm px-space-md text-center">Status</th>
                <th className="py-space-sm px-space-md text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm divide-y divide-surface-container">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleOpenDrawer(item)}
                  className={`hover:bg-surface-container-low/50 transition-colors group cursor-pointer ${
                    item.status === 'Habis' ? 'bg-error-container/10' : ''
                  }`}
                >
                  <td className="py-space-md px-space-md" onClick={(e) => e.stopPropagation()}>
                    <input className="rounded accent-secondary w-4 h-4 cursor-pointer" type="checkbox" />
                  </td>
                  <td className="py-space-md px-space-md">
                    <span className="font-code-sm text-code-sm text-secondary font-semibold bg-surface-container-low px-space-xs py-space-xxs rounded">
                      {item.sku}
                    </span>
                  </td>
                  <td className="py-space-md px-space-md">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 text-on-surface-variant overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          alt={item.name}
                          src={item.image}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface font-semibold group-hover:text-secondary transition-colors">
                          {item.name}
                        </span>
                        <span className="font-label-sm text-[11px] text-on-surface-variant">
                          Batch: {item.batch} • Barcode: {item.barcode}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md">
                    <span className="px-space-xs py-space-xxs bg-surface-container-low rounded text-on-surface-variant font-label-sm text-label-sm">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-space-md px-space-md">
                    <div className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-[16px] text-secondary">shelves</span>
                      <span className="font-semibold">{item.rackLocation}</span>
                    </div>
                  </td>
                  <td className={`py-space-md px-space-md text-right font-headline-sm text-headline-sm font-bold ${
                    item.status === 'Habis' ? 'text-error' : item.status === 'Menipis' ? 'text-on-tertiary-container' : 'text-on-surface'
                  }`}>
                    {item.stock}
                  </td>
                  <td className="py-space-md px-space-md text-on-surface-variant font-medium">
                    {item.unit}
                  </td>
                  <td className="py-space-md px-space-md text-right font-code-sm text-code-sm font-semibold text-on-surface">
                    Rp {item.purchasePrice.toLocaleString('id-ID')}
                  </td>
                  <td className="py-space-md px-space-md text-center">
                    {item.status === 'Tersedia' ? (
                      <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full text-[11px] font-semibold bg-surface-container text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                        Tersedia
                      </span>
                    ) : item.status === 'Menipis' ? (
                      <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full text-[11px] font-semibold bg-tertiary-fixed text-on-tertiary-container">
                        <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container animate-pulse"></span>
                        Menipis
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full text-[11px] font-semibold bg-error-container text-on-error-container">
                        <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                        Habis
                      </span>
                    )}
                  </td>
                  <td className="py-space-md px-space-md text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-space-xs">
                      <button
                        className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant hover:text-secondary transition-colors cursor-pointer"
                        title="Edit Data"
                        type="button"
                        onClick={() => openEditModal(item)}
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant hover:text-secondary transition-colors cursor-pointer"
                        title="Riwayat & Info Detail"
                        type="button"
                        onClick={() => handleOpenDrawer(item)}
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button
                        className="p-1 hover:bg-error-container rounded text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                        title="Hapus SKU"
                        type="button"
                        onClick={() => {
                          if (confirm(`Yakin ingin menghapus SKU ${item.sku}?`)) {
                            onDeleteItem(item.id);
                            onTriggerToast(`SKU ${item.sku} telah dihapus.`);
                          }
                        }}
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs">
          <div className="flex items-center gap-space-md">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Menampilkan <strong className="text-on-surface">1 - {filteredItems.length}</strong> dari{' '}
              <strong className="text-on-surface">1.240</strong> barang
            </span>
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Tampilkan:</span>
              <select className="h-8 px-space-xs bg-surface-container-low text-on-surface rounded font-label-sm text-label-sm focus:outline-none">
                <option value="10">10</option>
                <option defaultValue="25" value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-space-xxs">
            <button
              className="px-space-sm py-space-xs rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high font-label-sm text-label-sm flex items-center transition-colors disabled:opacity-50"
              disabled
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              <span>Prev</span>
            </button>
            <button
              className="w-8 h-8 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md font-semibold flex items-center justify-center"
              type="button"
            >
              1
            </button>
            <button
              className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-md text-label-md flex items-center justify-center transition-colors"
              type="button"
            >
              2
            </button>
            <button
              className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-md text-label-md flex items-center justify-center transition-colors"
              type="button"
            >
              3
            </button>
            <span className="px-space-xs text-on-surface-variant font-label-sm">...</span>
            <button
              className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-md text-label-md flex items-center justify-center transition-colors"
              type="button"
            >
              208
            </button>
            <button
              className="px-space-sm py-space-xs rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-sm text-label-sm flex items-center transition-colors cursor-pointer"
              type="button"
            >
              <span>Next</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Drawer / Detail Panel */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 transition-opacity duration-300"
            onClick={() => setIsDrawerOpen(false)}
          />
          <aside
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-surface-container-lowest shadow-2xl z-50 transition-transform duration-300 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right"
          >
            {selectedItem && (
              <>
                <div className="flex flex-col">
                  {/* Drawer Header */}
                  <div className="p-space-lg bg-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-[24px]">inventory_2</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-code-sm text-code-sm font-semibold text-secondary">
                            {selectedItem.sku}
                          </span>
                          <span className="px-space-xs py-0.5 rounded text-[10px] uppercase font-bold bg-surface-container text-secondary">
                            Aktif
                          </span>
                        </div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
                          {selectedItem.name}
                        </h2>
                      </div>
                    </div>
                    <button
                      className="p-space-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
                      onClick={() => setIsDrawerOpen(false)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[22px]">close</span>
                    </button>
                  </div>

                  {/* Drawer Content */}
                  <div className="p-space-lg flex flex-col gap-space-lg">
                    {/* Catalog Image */}
                    <div className="relative w-full h-44 rounded-xl overflow-hidden bg-surface-container">
                      <img
                        className="w-full h-full object-cover"
                        alt={selectedItem.name}
                        src={selectedItem.image}
                      />
                      <div className="absolute bottom-space-sm left-space-sm px-space-sm py-1 bg-primary-container/80 backdrop-blur text-surface-bright rounded text-[11px] font-mono flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                        <span>EAN-13: {selectedItem.barcode}</span>
                      </div>
                    </div>

                    {/* Stock & Valuation Stats */}
                    <div className="grid grid-cols-2 gap-space-sm">
                      <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col">
                        <span className="font-table-header text-table-header uppercase text-on-surface-variant">
                          Sisa Stok Fisik
                        </span>
                        <span className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">
                          {selectedItem.stock}{' '}
                          <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">
                            {selectedItem.unit}
                          </span>
                        </span>
                        <span className="font-label-sm text-label-sm text-secondary mt-1">
                          Stok Minimum: {selectedItem.minStock} {selectedItem.unit}
                        </span>
                      </div>
                      <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col">
                        <span className="font-table-header text-table-header uppercase text-on-surface-variant">
                          Harga Acuan Beli
                        </span>
                        <span className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">
                          Rp {selectedItem.purchasePrice.toLocaleString('id-ID')}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                          Estimasi Valuasi: Rp{' '}
                          {((selectedItem.stock * selectedItem.purchasePrice) / 1000000).toFixed(2)} Jt
                        </span>
                      </div>
                    </div>

                    {/* Logistics & Placement Info */}
                    <div className="flex flex-col gap-space-xs">
                      <span className="font-label-md text-label-md font-bold text-on-surface">
                        Informasi Penempatan & Logistik
                      </span>
                      <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col gap-space-sm font-body-sm text-body-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-on-surface-variant">Zona / Rak Alokasi</span>
                          <span className="font-semibold text-on-surface flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-secondary">shelves</span>
                            {selectedItem.zone} • {selectedItem.rackLocation}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-on-surface-variant">Penyimpanan Suhu</span>
                          <span className="font-semibold text-on-surface">{selectedItem.storageTemp}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-on-surface-variant">Lead Time Pengiriman</span>
                          <span className="font-semibold text-on-surface">{selectedItem.leadTime}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-on-surface-variant">Pemasok Utama</span>
                          <span className="font-semibold text-secondary">{selectedItem.supplier}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stock Movement History Card */}
                    <div className="flex flex-col gap-space-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-label-md text-label-md font-bold text-on-surface">
                          Riwayat Aktivitas Terakhir
                        </span>
                        <span
                          className="font-label-sm text-label-sm text-secondary font-semibold cursor-pointer"
                          onClick={() => onTriggerToast(`Membuka riwayat kartu stok buku besar SKU: ${selectedItem.sku}`)}
                        >
                          Lihat Kartu Stok
                        </span>
                      </div>
                      <div className="flex flex-col divide-y divide-surface-container bg-surface-container-low rounded-xl px-space-md">
                        <div className="py-space-sm flex items-center justify-between">
                          <div className="flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-secondary text-[18px]">add_box</span>
                            <div className="flex flex-col">
                              <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                                Penerimaan Barang Masuk
                              </span>
                              <span className="font-table-header text-[10px] text-on-surface-variant">
                                PO-2024-00918 • 24 Okt 10:15
                              </span>
                            </div>
                          </div>
                          <span className="font-code-sm text-code-sm font-bold text-secondary">
                            +{selectedItem.inbound || 50} {selectedItem.unit}
                          </span>
                        </div>
                        <div className="py-space-sm flex items-center justify-between">
                          <div className="flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-on-tertiary-container text-[18px]">
                              outbox
                            </span>
                            <div className="flex flex-col">
                              <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                                Pengeluaran - DO Toko Mitra
                              </span>
                              <span className="font-table-header text-[10px] text-on-surface-variant">
                                DO-2024-04112 • 23 Okt 16:40
                              </span>
                            </div>
                          </div>
                          <span className="font-code-sm text-code-sm font-bold text-error">
                            -{selectedItem.outbound || 15} {selectedItem.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Drawer Footer Actions */}
                <div className="p-space-lg bg-surface-container-low flex items-center gap-space-sm">
                  <button
                    className="flex-1 py-space-sm px-space-md bg-secondary text-on-secondary rounded-xl font-label-md text-label-md font-semibold hover:bg-on-secondary-container transition-colors shadow-sm flex items-center justify-center gap-space-xs cursor-pointer"
                    type="button"
                    onClick={() => {
                      openEditModal(selectedItem);
                      setIsDrawerOpen(false);
                    }}
                  >
                    <span className="material-symbols-outlined text-[18px]">edit_note</span>
                    <span>Edit Spesifikasi</span>
                  </button>
                  <button
                    className="py-space-sm px-space-md bg-surface-container text-on-surface hover:bg-surface-container-high rounded-xl font-label-md text-label-md font-semibold transition-colors flex items-center gap-space-xs cursor-pointer"
                    type="button"
                    onClick={() => onTriggerToast(`Mencetak label thermal barcode SKU: ${selectedItem.barcode}`)}
                  >
                    <span className="material-symbols-outlined text-[18px]">print</span>
                    <span>Cetak Barcode</span>
                  </button>
                </div>
              </>
            )}
          </aside>
        </>
      )}

      {/* Add / Edit SKU Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-surface-container">
            <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">
                    {editingItem ? 'edit_note' : 'add_box'}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-on-surface font-semibold">
                    {editingItem ? 'Edit Data Barang' : 'Tambah Master Barang Baru'}
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    {editingItem ? `Memperbarui SKU: ${formSku}` : 'Daftarkan SKU baru ke katalog WMS'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-table-header uppercase text-on-surface-variant text-[11px] block mb-1">
                    Kode SKU
                  </label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm font-code-sm font-semibold rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="font-table-header uppercase text-on-surface-variant text-[11px] block mb-1">
                    Barcode EAN-13
                  </label>
                  <input
                    type="text"
                    required
                    value={formBarcode}
                    onChange={(e) => setFormBarcode(e.target.value)}
                    className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm font-code-sm rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="font-table-header uppercase text-on-surface-variant text-[11px] block mb-1">
                  Nama Barang & Spesifikasi
                </label>
                <input
                  type="text"
                  required
                  placeholder="cth: Beras Premium Ramos 5 kg"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-table-header uppercase text-on-surface-variant text-[11px] block mb-1">
                    Kategori Komoditas
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                  >
                    <option value="Bahan Pokok">Bahan Pokok</option>
                    <option value="Minyak & Bumbu">Minyak & Bumbu</option>
                    <option value="Kemasan">Kemasan</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Cairan">Cairan</option>
                  </select>
                </div>
                <div>
                  <label className="font-table-header uppercase text-on-surface-variant text-[11px] block mb-1">
                    Lokasi Rak Tujuan
                  </label>
                  <input
                    type="text"
                    required
                    value={formRack}
                    onChange={(e) => setFormRack(e.target.value)}
                    className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-table-header uppercase text-on-surface-variant text-[11px] block mb-1">
                    Stok Fisik
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm font-code-sm font-bold rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="font-table-header uppercase text-on-surface-variant text-[11px] block mb-1">
                    Stok Minimum
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formMinStock}
                    onChange={(e) => setFormMinStock(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm font-code-sm rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="font-table-header uppercase text-on-surface-variant text-[11px] block mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    required
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-table-header uppercase text-on-surface-variant text-[11px] block mb-1">
                    Harga Acuan Beli (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm font-code-sm rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="font-table-header uppercase text-on-surface-variant text-[11px] block mb-1">
                    Pemasok / Supplier
                  </label>
                  <input
                    type="text"
                    required
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-secondary text-on-secondary hover:bg-on-secondary-container rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>{editingItem ? 'Simpan Perubahan' : 'Daftarkan Barang'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
