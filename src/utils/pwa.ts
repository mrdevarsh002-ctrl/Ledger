// PWA Registration Utility
// This registers the service worker for offline support and PWA functionality

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('✅ Service Worker registered successfully:', registration);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch((error) => {
          console.log('❌ Service Worker registration failed:', error);
        });
    });
  }
}

// Check if app is installed as PWA
export function isInstalled() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

// Prompt user to install PWA (if not already installed)
export function promptInstall() {
  let deferredPrompt: any;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show your custom install button
    console.log('💡 App can be installed!');
  });

  // Return function to trigger install prompt
  return () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('✅ User accepted the install prompt');
        } else {
          console.log('❌ User dismissed the install prompt');
        }
        deferredPrompt = null;
      });
    }
  };
}

// Handle PWA updates
export function handleUpdates() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Service worker has been updated, refresh the page
      console.log('🔄 New version available! Reloading...');
      window.location.reload();
    });
  }
}
