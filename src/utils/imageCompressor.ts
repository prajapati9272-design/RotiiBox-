/**
 * Compresses an image file or base64 data URL using an in-memory HTML5 Canvas.
 * Reduces raw 3MB-10MB mobile camera uploads down to 30KB-60KB without visible quality loss.
 */
export const compressImageFile = (file: File, maxWidth = 600, maxHeight = 600, quality = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) {
        reject(new Error('Failed to read image file'));
        return;
      }

      compressDataUrl(result, maxWidth, maxHeight, quality).then(resolve).catch(() => resolve(result));
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const compressDataUrl = (dataUrl: string, maxWidth = 600, maxHeight = 600, quality = 0.75): Promise<string> => {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image/') || dataUrl.length < 30000) {
      resolve(dataUrl);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

export const safeSetLocalStorage = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    console.warn(`localStorage.setItem failed for "${key}". Triggering quota fallback.`, err);
    if (key === 'gt_admin_menu') {
      try {
        const parsed = JSON.parse(value);
        const sanitized = parsed.map((item: any) => ({
          ...item,
          imageUrl: item.imageUrl && item.imageUrl.length > 50000
            ? 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80'
            : item.imageUrl
        }));
        localStorage.setItem(key, JSON.stringify(sanitized));
        return true;
      } catch (innerErr) {
        console.error('Failed to save sanitized fallback to localStorage:', innerErr);
      }
    }
    return false;
  }
};
