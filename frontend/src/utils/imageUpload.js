/**
 * Utility functions for image uploading
 */

// Convert file to base64 string
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Validate image file (type and size)
export const validateImage = (file, maxSizeMB = 2) => {
  // Check if file is an image
  if (!file.type.match('image.*')) {
    return {
      valid: false,
      error: 'Please select an image file (JPEG, PNG, GIF, etc.)'
    };
  }
  
  // Check file size (default max: 2MB)
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Image size should be less than ${maxSizeMB}MB`
    };
  }
  
  return { valid: true };
};

// Compress image if needed
export const compressImage = async (file, maxSizeMB = 1, quality = 0.7) => {
  // This is a simple implementation
  // For a production app, you might want to use a library like browser-image-compression
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Determine new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        // Maximum dimensions
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round(height * MAX_WIDTH / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round(width * MAX_HEIGHT / height);
            height = MAX_HEIGHT;
          }
        }
        
        // Resize the canvas
        canvas.width = width;
        canvas.height = height;
        
        // Draw the resized image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get the compressed data URL
        const dataUrl = canvas.toDataURL(file.type, quality);
        
        // Convert base64 string to a File
        const base64String = dataUrl.split(',')[1];
        const compressedFile = base64ToFile(
          base64String,
          file.name,
          file.type
        );
        
        resolve(compressedFile);
      };
    };
  });
};

// Convert base64 string to File object
export const base64ToFile = (base64String, filename, mimeType) => {
  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  const blob = new Blob(byteArrays, { type: mimeType });
  return new File([blob], filename, { type: mimeType });
};
