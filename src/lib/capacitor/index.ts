/**
 * Capacitor & Native Device Abstraction Layer
 * Wraps Web APIs and allows seamless drop-in for @capacitor/camera,
 * @capacitor/push-notifications, @capacitor/share, @capacitor/preferences, etc.
 */

export interface CameraResult {
  dataUrl?: string;
  blob?: Blob;
  file?: File;
}

export const NativeCamera = {
  async pickImage(): Promise<CameraResult | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve(null);
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            dataUrl: reader.result as string,
            file,
          });
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  }
};

export const NativeMicrophone = {
  async requestPermission(): Promise<boolean> {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop tracks immediately after permission check
        stream.getTracks().forEach((track) => track.stop());
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
};

export const NativeShare = {
  async share(data: { title: string; text?: string; url?: string }): Promise<boolean> {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch {
        return false;
      }
    }
    // Fallback: Copy link to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard && data.url) {
      await navigator.clipboard.writeText(data.url);
      return true;
    }
    return false;
  }
};

export const NativeStorage = {
  async get(key: string): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  async set(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  },
  async remove(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
};

export const NativePush = {
  async register(): Promise<string | null> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return null;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return 'web-push-token-demo';
    }
    return null;
  }
};
