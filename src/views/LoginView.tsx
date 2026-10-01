import React, { useState } from 'react';

interface LoginViewProps {
  onLoginSuccess: (userData: { name: string; role: string; warehouse: string }) => void;
  onTriggerToast: (msg: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onTriggerToast }) => {
  const [identifier, setIdentifier] = useState('admin@gudangku.id');
  const [password, setPassword] = useState('admin');
  const [warehouse, setWarehouse] = useState('Gudang Utama (Cakung - Jakarta)');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fillDemo = (idVal: string, pwdVal: string, whVal: string) => {
    setIdentifier(idVal);
    setPassword(pwdVal);
    setWarehouse(whVal);
    onTriggerToast(`Kredensial demo terisi: ${idVal}`);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const isSuperAdmin = identifier.includes('admin');
      onLoginSuccess({
        name: isSuperAdmin ? 'Andi Pratama, S.Log' : 'Rian Triyadi',
        role: isSuperAdmin ? 'Admin Gudang' : 'Operator Hub',
        warehouse,
      });
      onTriggerToast(`Otentikasi Berhasil! Terhubung ke node ${warehouse}.`);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-space-md">
      <div className="w-full max-w-md bg-surface">
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-xl p-space-xl flex flex-col relative overflow-hidden border border-surface-container/60">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-container/5 rounded-full blur-xl pointer-events-none"></div>

          {/* Logo & Headline */}
          <div className="flex flex-col items-center text-center space-y-space-xs relative z-10">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-on-secondary shadow-md mb-space-xs">
              <span className="material-symbols-outlined text-display-lg">warehouse</span>
            </div>
            <div className="inline-flex items-center gap-space-xs">
              <span className="font-display-lg text-headline-md font-bold tracking-tight text-on-surface">
                GudangKu
              </span>
              <span className="bg-secondary-fixed text-on-secondary-fixed font-table-header text-table-header px-space-xs py-space-xxs rounded font-semibold">
                ENTERPRISE
              </span>
            </div>
            <h1 className="font-headline-md text-headline-sm font-semibold text-on-surface pt-space-xs">
              Masuk ke Sistem GudangKu
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
              Masukkan kredensial Anda untuk mengelola inventaris gudang
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-space-lg flex flex-col space-y-space-md relative z-10">
            {/* Identifier */}
            <div className="flex flex-col space-y-space-xxs">
              <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="identifier">
                Email / NIP Operator
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-md text-outline text-headline-sm pointer-events-none">
                  badge
                </span>
                <input
                  id="identifier"
                  required
                  type="text"
                  placeholder="admin@gudangku.id atau NIP"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md pl-10 pr-space-md py-space-sm rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col space-y-space-xxs">
              <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="password">
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-md text-outline text-headline-sm pointer-events-none">
                  lock
                </span>
                <input
                  id="password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md pl-10 pr-10 py-space-sm rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all duration-200"
                />
                <button
                  type="button"
                  id="togglePassword"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-space-sm text-outline hover:text-on-surface transition-colors p-space-xxs flex items-center justify-center rounded cursor-pointer"
                  title="Tampilkan / Sembunyikan Kata Sandi"
                >
                  <span className="material-symbols-outlined text-headline-sm">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Warehouse Selector */}
            <div className="flex flex-col space-y-space-xxs">
              <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="warehouse">
                Pilih Gudang Operasional
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-md text-outline text-headline-sm pointer-events-none">
                  location_on
                </span>
                <select
                  id="warehouse"
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md pl-10 pr-space-lg py-space-sm rounded-lg appearance-none focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary cursor-pointer transition-all duration-200"
                >
                  <option value="Gudang Utama (Cakung - Jakarta)">Gudang Utama (Cakung - Jakarta)</option>
                  <option value="DC Cikarang Barat - Hub 1">DC Cikarang Barat - Hub 1</option>
                  <option value="Hub Surabaya (Rungkut)">Hub Surabaya (Rungkut)</option>
                  <option value="Hub Medan (KIM Belawan)">Hub Medan (KIM Belawan)</option>
                </select>
                <span className="material-symbols-outlined absolute right-space-md text-outline text-headline-sm pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between pt-space-xxs">
              <label className="flex items-center space-x-space-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-secondary focus:ring-0 focus:outline-none cursor-pointer accent-secondary"
                />
                <span className="font-body-sm text-body-sm text-on-surface-variant">Ingat saya</span>
              </label>
              <button
                type="button"
                onClick={() => onTriggerToast('Silakan hubungi IT Support (ext. 104) untuk reset kredensial akun.')}
                className="font-label-sm text-label-sm font-semibold text-secondary hover:underline cursor-pointer"
              >
                Lupa kata sandi?
              </button>
            </div>

            {/* Submit Button */}
            <button
              id="submitBtn"
              type="submit"
              disabled={isLoading}
              className={`w-full bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md font-semibold py-space-sm px-space-md rounded-lg shadow flex items-center justify-center space-x-space-xs transition duration-200 hover:shadow-md active:scale-[0.99] cursor-pointer ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-headline-sm animate-spin">
                    progress_activity
                  </span>
                  <span>Menghubungkan ke Node WMS...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <span className="material-symbols-outlined text-headline-sm">arrow_forward</span>
                </>
              )}
            </button>

            {/* Demo Quick Access */}
            <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col space-y-space-xxs">
              <div className="flex items-center justify-between">
                <span className="font-table-header text-table-header uppercase text-secondary font-bold tracking-wider flex items-center gap-space-xxs">
                  <span className="material-symbols-outlined text-code-sm">info</span>
                  Akses Cepat Demo
                </span>
              </div>
              <div className="grid grid-cols-2 gap-space-xs pt-space-xxs">
                <button
                  type="button"
                  onClick={() => fillDemo('admin@gudangku.id', 'admin', 'Gudang Utama (Cakung - Jakarta)')}
                  className="text-left bg-surface-container-lowest hover:bg-surface-container-high px-space-sm py-space-xs rounded transition-all duration-150 flex flex-col cursor-pointer border border-surface-container/40"
                >
                  <span className="font-label-sm text-label-sm font-semibold text-on-surface">Super Admin</span>
                  <span className="font-code-sm text-code-sm text-outline">admin / admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('OP-7821', '12345', 'Hub Surabaya (Rungkut)')}
                  className="text-left bg-surface-container-lowest hover:bg-surface-container-high px-space-sm py-space-xs rounded transition-all duration-150 flex flex-col cursor-pointer border border-surface-container/40"
                >
                  <span className="font-label-sm text-label-sm font-semibold text-on-surface">Operator Hub</span>
                  <span className="font-code-sm text-code-sm text-outline">karyawan / 12345</span>
                </button>
              </div>
            </div>
          </form>

          {/* Footer Security Badge */}
          <div className="mt-space-lg pt-space-md flex flex-col items-center text-center space-y-space-xs">
            <div className="inline-flex items-center gap-space-xs bg-surface-container-low text-on-surface-variant px-space-sm py-space-xxs rounded-full font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-code-sm text-secondary">verified_user</span>
              <span>256-bit SSL Encrypted WMS System</span>
            </div>
            <p className="font-body-sm text-body-sm text-outline max-w-xs leading-tight">
              Butuh bantuan teknis? Hubungi IT Support GudangKu di{' '}
              <span className="font-medium text-on-surface-variant">ext. 104</span> atau{' '}
              <span className="text-secondary hover:underline cursor-pointer">support@gudangku.id</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
