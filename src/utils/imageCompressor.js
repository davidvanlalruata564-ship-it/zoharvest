/**
 * High-performance client-side image compression and resizing utility.
 * Downscales high-resolution camera photos (e.g. 5MB-10MB phone images)
 * to lightweight, web-optimized JPEG data URLs (~40KB-90KB) before saving.
 */

export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1000,
    maxHeight = 1000,
    quality = 0.78,
    cropToSquare = false,
    mimeType = 'image/jpeg'
  } = options;

  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Provided file is not a valid image.');
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let srcX = 0;
      let srcY = 0;
      let srcWidth = img.naturalWidth || img.width;
      let srcHeight = img.naturalHeight || img.height;

      // Handle 1:1 center square crop for avatars
      if (cropToSquare) {
        const minDim = Math.min(srcWidth, srcHeight);
        srcX = (srcWidth - minDim) / 2;
        srcY = (srcHeight - minDim) / 2;
        srcWidth = minDim;
        srcHeight = minDim;
      }

      // Calculate proportional downscaled dimensions
      let targetWidth = srcWidth;
      let targetHeight = srcHeight;

      if (targetWidth > maxWidth || targetHeight > maxHeight) {
        const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
        targetWidth = Math.round(targetWidth * ratio);
        targetHeight = Math.round(targetHeight * ratio);
      }

      // Create canvas and draw image
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get 2D rendering context.'));
        return;
      }

      // Enable high quality bicubic interpolation
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        img,
        srcX, srcY, srcWidth, srcHeight,
        0, 0, targetWidth, targetHeight
      );

      // Export compressed image
      const dataUrl = canvas.toDataURL(mimeType, quality);
      
      // Calculate approximate size in bytes from Base64
      const stringLength = dataUrl.length - dataUrl.indexOf(',') - 1;
      const compressedSize = Math.round((stringLength * 3) / 4);
      const originalSize = file.size;
      const savedPercent = originalSize > 0 
        ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
        : 0;

      resolve({
        dataUrl,
        originalSize,
        compressedSize,
        savedPercent,
        width: targetWidth,
        height: targetHeight
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for compression.'));
    };

    img.src = objectUrl;
  });
}

/**
 * Format bytes into human-readable string (e.g. 4.2 MB, 68 KB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
