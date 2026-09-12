import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Download, RefreshCw, X } from 'lucide-react';

export function PWABadge() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const installPwa = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  // Only show the badge if there's an update, if the app is ready for offline, or if it can be installed
  if (!offlineReady && !needRefresh && !installPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {/* Install App Prompt */}
      {installPrompt && (
        <div className="bg-[#121218] border border-white/10 rounded-xl p-4 shadow-2xl flex items-center gap-4 max-w-sm animate-in slide-in-from-bottom-5">
          <div className="w-10 h-10 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 text-[#00E5FF]" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">Install App</h3>
            <p className="text-xs text-white/60">Install Pankaj Edit Pro for a better experience</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInstallPrompt(null)}
              className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={installPwa}
              className="px-3 py-1.5 bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-black text-xs font-semibold rounded-lg transition-colors"
            >
              Install
            </button>
          </div>
        </div>
      )}

      {/* Update/Offline Ready Notification */}
      {(offlineReady || needRefresh) && (
        <div className="bg-[#121218] border border-white/10 rounded-xl p-4 shadow-2xl flex items-center gap-4 max-w-sm animate-in slide-in-from-bottom-5">
          <div className="w-10 h-10 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center shrink-0">
            <RefreshCw className={`w-5 h-5 text-[#00E5FF] ${needRefresh ? 'animate-spin' : ''}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">
              {needRefresh ? 'Update Available' : 'App Ready Offline'}
            </h3>
            <p className="text-xs text-white/60">
              {needRefresh
                ? 'A new version of the app is available.'
                : 'You can now use this app without an internet connection.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={close}
              className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {needRefresh && (
              <button
                onClick={() => updateServiceWorker(true)}
                className="px-3 py-1.5 bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-black text-xs font-semibold rounded-lg transition-colors"
              >
                Reload
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
