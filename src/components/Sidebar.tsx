import React from 'react';
import { ActiveScreen } from '../types';

interface SidebarProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  onLogout: () => void;
  userName?: string;
  userRole?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  onLogout,
  userName = 'Andi Pratama',
  userRole = 'Admin Gudang',
}) => {
  const navItems: { id: ActiveScreen; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'data-barang', label: 'Data Barang', icon: 'inventory_2' },
    { id: 'barang-masuk', label: 'Barang Masuk', icon: 'move_to_inbox' },
    { id: 'barang-keluar', label: 'Barang Keluar', icon: 'outbox' },
    { id: 'laporan', label: 'Laporan', icon: 'assessment' },
    { id: 'pengaturan', label: 'Pengaturan', icon: 'settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-primary-container text-surface-bright z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] no-print">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-space-lg flex items-center justify-between bg-primary-container">
          <div
            className="flex items-center gap-space-sm cursor-pointer"
            onClick={() => onNavigate('dashboard')}
          >
            <img
              alt="Logo GudangKu WMS"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UBwbcccmjO7vpJYXF6P3xGiVmJYsj_tMd3WMBQlxUMjeBNAM0EwvsQe9ju2zDg5GQgp0rHY02fWNdj7T2IUkb6IjVJXfHVjHCmVlRFSGP3n97K0TycT_6eWk42jU3ynlLVPM7KAK6sjOf0fhsnqs-veUei9BrBI6ei8ZstlHG3Q2_XTIz6vf2ucEP887c009_nJq7FKOu5u9lfv6woK2OQDEMOhc8bl9JOZhC-gcc-Y1mqZ75Xd21FXQ"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-surface-bright tracking-tight leading-none">
                GudangKu
              </span>
              <span className="font-label-sm text-[10px] text-surface-dim uppercase tracking-wider">
                Enterprise WMS
              </span>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="px-space-md py-space-sm">
          <span className="px-space-sm font-table-header text-table-header uppercase text-surface-dim tracking-wider">
            Menu Utama
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="px-space-sm flex flex-col gap-space-xxs">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-colors font-label-md text-label-md w-full text-left ${
                  isActive
                    ? 'bg-surface-bright text-on-surface font-headline-sm shadow-sm'
                    : 'text-surface-dim hover:bg-inverse-surface hover:text-surface-bright'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-space-md bg-inverse-surface/40 m-space-sm rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm overflow-hidden">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsTyykbdjGNN15T6D4qDoQFMPkX2OkVXlgGafy8Uvi_J1XjxTROkAx3nu4ldAeshjAJecNnasFFrRhjE6AOPYrRmfhvrCmucXNP8OJT1mcIjlw3UXcYS5S5upjewG4shMGEkOB-pvYTFM6w33KOLPLp4KZ1AmU05ZNawDE0dXhA31-jhd-DvbU8NwhTWGtusI8hrLfXeoVJ9szDvQBHO45I4DgTCOv6qkGOiZ_86-CcAcqAaGmDco"
            />
            <div className="flex flex-col truncate">
              <span className="font-label-md text-label-md text-surface-bright truncate">
                {userName}
              </span>
              <span className="font-label-sm text-[11px] text-surface-dim">
                {userRole}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="p-space-xs text-surface-dim hover:text-surface-bright hover:bg-inverse-surface rounded-lg transition-colors flex items-center"
            title="Keluar ke Layar Masuk"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
