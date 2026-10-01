/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveScreen, InventoryItem, InboundRecord, OutboundRecord } from './types';
import { INITIAL_ITEMS, INITIAL_INBOUND, INITIAL_OUTBOUND } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { NewTransactionModal } from './components/NewTransactionModal';
import { ReorderModal } from './components/ReorderModal';
import { DocumentModal } from './components/DocumentModal';
import { DashboardView } from './views/DashboardView';
import { DataBarangView } from './views/DataBarangView';
import { BarangMasukView } from './views/BarangMasukView';
import { BarangKeluarView } from './views/BarangKeluarView';
import { LaporanView } from './views/LaporanView';
import { PengaturanView } from './views/PengaturanView';
import { LoginView } from './views/LoginView';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState({
    name: 'Andi Pratama, S.Log',
    role: 'Admin Gudang',
    id: 'OP-8821',
  });
  const [activeLocation, setActiveLocation] = useState('Gudang Utama - Jakarta Barat');

  // Application Data States
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_ITEMS);
  const [inboundRecords, setInboundRecords] = useState<InboundRecord[]>(INITIAL_INBOUND);
  const [outboundRecords, setOutboundRecords] = useState<OutboundRecord[]>(INITIAL_OUTBOUND);

  // UI Feedback States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'warning' | 'error' | 'info'>('success');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals States
  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);
  const [reorderItem, setReorderItem] = useState<InventoryItem | null>(null);
  const [documentModal, setDocumentModal] = useState<{
    isOpen: boolean;
    title: string;
    docNumber: string;
    docType: 'inbound' | 'outbound' | 'report';
    data: any;
  }>({
    isOpen: false,
    title: '',
    docNumber: '',
    docType: 'report',
    data: null,
  });

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const showToast = (msg: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  // Handlers for Data Mutations
  const handleAddItem = (newItem: Omit<InventoryItem, 'id'>) => {
    const itemWithId: InventoryItem = {
      ...newItem,
      id: `item-${Date.now()}`,
    };
    setItems((prev) => [itemWithId, ...prev]);
  };

  const handleUpdateItem = (updated: InventoryItem) => {
    setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddInbound = (
    newRecord: InboundRecord,
    lineItems: { itemId: string; qty: number }[]
  ) => {
    setInboundRecords((prev) => [newRecord, ...prev]);

    // Increase stock for corresponding items
    setItems((prev) =>
      prev.map((it) => {
        const found = lineItems.find((li) => li.itemId === it.id);
        if (found) {
          const newStock = it.stock + found.qty;
          const status =
            newStock === 0 ? 'Habis' : newStock <= it.minStock ? 'Menipis' : 'Tersedia';
          return {
            ...it,
            stock: newStock,
            status,
            inbound: (it.inbound || 0) + found.qty,
          };
        }
        return it;
      })
    );
  };

  const handleAddOutbound = (
    newRecord: OutboundRecord,
    deductInfo: { itemId: string; qty: number }
  ) => {
    setOutboundRecords((prev) => [newRecord, ...prev]);

    // Decrease stock for item
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === deductInfo.itemId) {
          const newStock = Math.max(0, it.stock - deductInfo.qty);
          const status =
            newStock === 0 ? 'Habis' : newStock <= it.minStock ? 'Menipis' : 'Tersedia';
          return {
            ...it,
            stock: newStock,
            status,
            outbound: (it.outbound || 0) + deductInfo.qty,
          };
        }
        return it;
      })
    );
  };

  const handleConfirmReorder = (item: InventoryItem, qty: number, supplier: string) => {
    showToast(`Purchase Order (${qty} ${item.unit}) diterbitkan ke ${supplier}`);
    // Simulate stock incoming
    setTimeout(() => {
      setItems((prev) =>
        prev.map((it) => {
          if (it.id === item.id) {
            const newStock = it.stock + qty;
            return {
              ...it,
              stock: newStock,
              status: newStock <= it.minStock ? 'Menipis' : 'Tersedia',
            };
          }
          return it;
        })
      );
      showToast(`Stok ${item.name} berhasil diperbarui (+${qty} ${item.unit}) dari PO`);
    }, 2000);
  };

  const handleOpenDocModal = (
    docNumber: string,
    docType: 'inbound' | 'outbound' | 'report',
    data: any
  ) => {
    const title =
      docType === 'inbound'
        ? 'Bukti Tanda Terima Barang (Inbound SJ)'
        : docType === 'outbound'
        ? 'Surat Jalan Pengeluaran (Delivery Order)'
        : 'Dokumen Rekapitulasi Mutasi Logistik';

    setDocumentModal({
      isOpen: true,
      title,
      docNumber,
      docType,
      data,
    });
  };

  if (!isLoggedIn || currentScreen === 'login') {
    return (
      <>
        <LoginView
          onLoginSuccess={(userData) => {
            setUser({
              name: userData.name,
              role: userData.role,
              id: 'OP-8821',
            });
            setActiveLocation(userData.warehouse);
            setIsLoggedIn(true);
            setCurrentScreen('dashboard');
          }}
          onTriggerToast={(msg) => showToast(msg, 'info')}
        />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} type={toastType} />
      </>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen antialiased">
      {/* Sidebar Persistent Frame */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onLogout={() => {
          setIsLoggedIn(false);
          setCurrentScreen('login');
          showToast('Anda telah keluar dari sesi WMS.');
        }}
        userName={user.name}
        userRole={user.role}
      />

      {/* Main Workspace Frame */}
      <div className="pl-64">
        {/* Top Header Rail */}
        <Header
          activeLocation={activeLocation}
          onSelectLocation={(loc) => {
            setActiveLocation(loc);
            showToast(`Node gudang dialihkan ke: ${loc}`);
          }}
          onNewTransaction={() => setIsNewTxModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNotificationClick={() => setIsNotificationOpen(!isNotificationOpen)}
          unreadCount={items.filter((i) => i.status !== 'Tersedia').length}
        />

        {/* Notification Popover Drawer */}
        {isNotificationOpen && (
          <div className="fixed top-16 right-6 w-80 bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container p-4 z-50 animate-in fade-in slide-in-from-top-2 no-print">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">notifications</span>
                <span className="font-headline-sm text-sm font-semibold">Notifikasi Gudang</span>
              </div>
              <button
                type="button"
                onClick={() => setIsNotificationOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="py-2 divide-y divide-surface-container max-h-72 overflow-y-auto">
              <div
                className="py-2.5 cursor-pointer hover:bg-surface-container-low rounded-lg p-1.5 transition-colors"
                onClick={() => {
                  setCurrentScreen('data-barang');
                  setIsNotificationOpen(false);
                }}
              >
                <span className="text-[10px] font-bold text-error uppercase block">Stok Kritis</span>
                <span className="text-xs font-semibold text-on-surface block">
                  Gula Pasir Kristal Putih (Habis - 0 Pack)
                </span>
                <span className="text-[11px] text-on-surface-variant">Rak A-04-2 • Butuh restock darurat</span>
              </div>
              <div
                className="py-2.5 cursor-pointer hover:bg-surface-container-low rounded-lg p-1.5 transition-colors"
                onClick={() => {
                  setCurrentScreen('barang-keluar');
                  setIsNotificationOpen(false);
                }}
              >
                <span className="text-[10px] font-bold text-secondary uppercase block">Dispatch Baru</span>
                <span className="text-xs font-semibold text-on-surface block">
                  DO-20231024-042 Dispatched ke Toko Sumber Rejeki
                </span>
                <span className="text-[11px] text-on-surface-variant">Armada Box B-9122-TX dalam perjalanan</span>
              </div>
              <div
                className="py-2.5 cursor-pointer hover:bg-surface-container-low rounded-lg p-1.5 transition-colors"
                onClick={() => {
                  setCurrentScreen('barang-masuk');
                  setIsNotificationOpen(false);
                }}
              >
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">Inbound Selesai</span>
                <span className="text-xs font-semibold text-on-surface block">
                  100 Sak Beras Ramos diverifikasi QC
                </span>
                <span className="text-[11px] text-on-surface-variant">Pemasok: PT Sinar Pangan Abadi</span>
              </div>
            </div>
          </div>
        )}

        {/* View Routing */}
        <main className="w-full pt-16 bg-surface min-h-screen px-space-xl py-space-xl">
          {currentScreen === 'dashboard' && (
            <DashboardView
              items={items}
              onNavigate={(s) => setCurrentScreen(s)}
              onOpenReorder={(item) => setReorderItem(item)}
              onViewDocument={handleOpenDocModal}
              onOpenNewTransaction={() => setIsNewTxModalOpen(true)}
              onTriggerToast={(m) => showToast(m)}
            />
          )}

          {currentScreen === 'data-barang' && (
            <DataBarangView
              items={items}
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
              onTriggerToast={(m) => showToast(m)}
              searchQuery={searchQuery}
            />
          )}

          {currentScreen === 'barang-masuk' && (
            <BarangMasukView
              records={inboundRecords}
              items={items}
              onAddInbound={handleAddInbound}
              onViewDocument={handleOpenDocModal}
              onTriggerToast={(m) => showToast(m)}
            />
          )}

          {currentScreen === 'barang-keluar' && (
            <BarangKeluarView
              records={outboundRecords}
              items={items}
              onAddOutbound={handleAddOutbound}
              onViewDocument={handleOpenDocModal}
              onTriggerToast={(m) => showToast(m)}
            />
          )}

          {currentScreen === 'laporan' && (
            <LaporanView items={items} onTriggerToast={(m) => showToast(m)} />
          )}

          {currentScreen === 'pengaturan' && (
            <PengaturanView
              activeLocation={activeLocation}
              onSelectLocation={setActiveLocation}
              onTriggerToast={(m) => showToast(m)}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <NewTransactionModal
        isOpen={isNewTxModalOpen}
        onClose={() => setIsNewTxModalOpen(false)}
        onSelectAction={(scr) => setCurrentScreen(scr)}
      />

      <ReorderModal
        isOpen={!!reorderItem}
        onClose={() => setReorderItem(null)}
        item={reorderItem}
        onConfirmReorder={handleConfirmReorder}
      />

      <DocumentModal
        isOpen={documentModal.isOpen}
        onClose={() => setDocumentModal((prev) => ({ ...prev, isOpen: false }))}
        title={documentModal.title}
        docNumber={documentModal.docNumber}
        docType={documentModal.docType}
        data={documentModal.data}
      />

      {/* Interactive Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} type={toastType} />
    </div>
  );
}
