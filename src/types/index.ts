export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Bahan Pokok' | 'Minyak & Bumbu' | 'Kemasan' | 'Elektronik' | 'Cairan' | string;
  rackLocation: string;
  zone: string;
  stock: number;
  minStock: number;
  unit: string;
  purchasePrice: number;
  status: 'Tersedia' | 'Menipis' | 'Habis';
  batch: string;
  barcode: string;
  image: string;
  supplier: string;
  storageTemp: string;
  leadTime: string;
  initialStock?: number;
  inbound?: number;
  outbound?: number;
  opnameAdj?: number;
  turnoverSpeed?: 'Fast Moving' | 'Slow Moving';
}

export interface InboundRecord {
  id: string;
  docNumber: string;
  date: string;
  supplier: string;
  supplierDocNumber: string;
  itemName: string;
  sku: string;
  rackLocation: string;
  qty: number;
  unit: string;
  receiver: {
    name: string;
    initials: string;
  };
  notes: string;
  status: 'Selesai' | 'Diproses' | 'Verifikasi QC';
}

export interface OutboundRecord {
  id: string;
  docNumber: string;
  date: string;
  time: string;
  customer: string;
  itemName: string;
  sku: string;
  qty: number;
  unit: string;
  status: 'Dispatched' | 'Terkirim' | 'Menunggu Pickup';
  courier: string;
  notes: string;
}

export type ActiveScreen = 'dashboard' | 'data-barang' | 'barang-masuk' | 'barang-keluar' | 'laporan' | 'pengaturan' | 'login';
