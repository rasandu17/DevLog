import { useState, useRef } from 'react';
import { validateImage, fileToBase64 } from '../utils/imageUpload';

function ImageUploader({ onImageSelect, initialImage = null }) {
  const [previewUrl, setPreviewUrl] = useState(initialImage);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError('');

    // Validate the file
    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.error);
      setIsLoading(false);
      return;
    }

    try {
      // Convert file to base64 string
      const base64 = await fileToBase64(file);
      
      setPreviewUrl(base64);
      onImageSelect(base64);
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Failed to process the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageSelect(null);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Blog Image (Optional)
        </label>
        {previewUrl && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        )}
      </div>

      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-300 mb-3">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-56 object-cover"
          />
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors mb-3"
        >
          <svg
            className="h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4h-4m-8-4l8-8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="mt-2 text-sm text-gray-600">
            Click to upload an image
          </p>
          <p className="mt-1 text-xs text-gray-500">
            PNG, JPG, GIF up to 2MB
          </p>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center mt-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">Processing image...</span>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default ImageUploader;
