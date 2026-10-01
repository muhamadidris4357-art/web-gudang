import React, { useState } from 'react';
import { WAREHOUSE_LOCATIONS } from '../data/mockData';

interface HeaderProps {
  activeLocation: string;
  onSelectLocation: (loc: string) => void;
  onNewTransaction: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNotificationClick: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeLocation,
  onSelectLocation,
  onNewTransaction,
  searchQuery,
  onSearchChange,
  onNotificationClick,
  unreadCount = 3,
}) => {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-xl no-print">
      {/* Search Input Bar */}
      <div className="flex items-center gap-space-md flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            className="w-full h-10 pl-10 pr-space-md bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest transition-colors"
            placeholder="Cari SKU, nama barang, atau no. transaksi..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-space-sm top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-space-md">
        {/* Active Warehouse Location Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            className="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-secondary text-[18px]">
              warehouse
            </span>
            <div className="flex flex-col text-left">
              <span className="font-table-header text-table-header uppercase text-on-surface-variant">
                Lokasi Aktif
              </span>
              <span className="font-label-sm text-label-sm text-on-surface font-semibold max-w-[190px] truncate">
                {activeLocation}
              </span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[16px] ml-space-xs">
              expand_more
            </span>
          </button>

          {showLocationDropdown && (
            <div className="absolute right-0 mt-1 w-64 bg-surface-container-lowest rounded-xl shadow-lg border border-surface-container py-1 z-50">
              <div className="px-space-md py-1 border-b border-surface-container">
                <span className="font-table-header text-[10px] uppercase text-on-surface-variant">
                  Ganti Node Gudang
                </span>
              </div>
              {WAREHOUSE_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    onSelectLocation(loc);
                    setShowLocationDropdown(false);
                  }}
                  className={`w-full text-left px-space-md py-2 text-sm flex items-center justify-between hover:bg-surface-container-low transition-colors ${
                    activeLocation === loc
                      ? 'text-secondary font-semibold bg-surface-container-low/50'
                      : 'text-on-surface'
                  }`}
                >
                  <span className="truncate">{loc}</span>
                  {activeLocation === loc && (
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      check
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          className="relative p-space-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
          type="button"
          onClick={onNotificationClick}
          title="Notifikasi & Peringatan Stok"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-on-error font-label-sm text-[10px] flex items-center justify-center rounded-full font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        {/* New Transaction Button */}
        <button
          className="flex items-center gap-space-xs px-space-md py-space-sm bg-secondary text-on-secondary rounded-lg font-label-md text-label-md hover:bg-on-secondary-container transition-colors shadow-[0_1px_8px_rgba(0,0,0,0.04)] font-medium cursor-pointer"
          type="button"
          onClick={onNewTransaction}
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Transaksi Baru</span>
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center pl-space-xs">
          <img
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-container cursor-pointer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsTyykbdjGNN15T6D4qDoQFMPkX2OkVXlgGafy8Uvi_J1XjxTROkAx3nu4ldAeshjAJecNnasFFrRhjE6AOPYrRmfhvrCmucXNP8OJT1mcIjlw3UXcYS5S5upjewG4shMGEkOB-pvYTFM6w33KOLPLp4KZ1AmU05ZNawDE0dXhA31-jhd-DvbU8NwhTWGtusI8hrLfXeoVJ9szDvQBHO45I4DgTCOv6qkGOiZ_86-CcAcqAaGmDco"
            title="Andi Pratama - Admin Gudang"
          />
        </div>
      </div>
    </header>
  );
};
