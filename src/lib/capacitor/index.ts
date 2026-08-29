/**
 * Capacitor & Native Device Abstraction Layer
 * Wraps Web APIs and allows seamless drop-in for @capacitor/camera,
 * @capacitor/push-notifications, @capacitor/share, @capacitor/preferences, etc.
 */

export interface CameraResult {
  dataUrl?: string;
  blob?: Blob;
  file?: File;
  uploadedUrl?: string;
}

export const NativeCamera = {
  async pickImage(): Promise<CameraResult | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        const reader = new FileReader();
        reader.onload = async () => {
          const dataUrl = reader.result as string;

          // Upload real file to server
          let uploadedUrl: string | undefined;
          try {
            const formData = new FormData();
            formData.append('file', file);
            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });
            if (uploadRes.ok) {
              const uploadJson = await uploadRes.json();
              uploadedUrl = uploadJson.url;
            }
          } catch {
            // fallback to dataUrl
          }

          resolve({
            dataUrl,
            file,
            uploadedUrl: uploadedUrl || dataUrl,
          });
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  },

  async uploadFile(file: File | Blob, filename = 'recording.webm'): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('file', file, filename);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        return json.url;
      }
      return null;
    } catch {
      return null;
    }
  }
};

export const NativeMicrophone = {
  async requestPermission(): Promise<boolean> {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
      return `push_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
    return null;
  }
};
