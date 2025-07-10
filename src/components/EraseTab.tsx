'use client';

import { useState } from 'react';
import Image from 'next/image';
import CanvasBrush from './CanvasBrush';
import { dataURLtoFile } from '../utils/maskUtils';

export default function EraseTab() {
  const [image, setImage] = useState<File | null>(null);
  const [maskDataUrl, setMaskDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState(20);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMaskDataUrl(null); // Reset mask when new image is uploaded
    }
  };

  const handleMaskGenerated = (maskDataUrl: string) => {
    setMaskDataUrl(maskDataUrl);
  };

  const handleErase = async () => {
    if (!image) {
      setError('Please provide an image');
      return;
    }

    if (!maskDataUrl) {
      setError('Please generate a mask by painting the area you want to erase');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', image);
      
      // Convert mask data URL to File
      const maskFile = dataURLtoFile(maskDataUrl, 'mask.png');
      formData.append('mask', maskFile);

      const response = await fetch('/api/erase', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to erase image');
      }

      const data = await response.json();
      setResultImage(data.image);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <label className="form-group">
          Original Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="form-control"
        />
                  {previewUrl && (
            <div className="image-container">
              <Image
                src={previewUrl}
                alt="Original image"
                width={800}
                height={500}
                className="image"
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}
      </div>

      {previewUrl && (
        <div className="card">
          <label className="form-group">
            Paint Area to Erase
          </label>
          <div className="brush-size-control">
            <label htmlFor="brushSize">Brush Size: {brushSize}px</label>
            <input
              id="brushSize"
              type="range"
              min="5"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="form-control"
            />
          </div>
          <CanvasBrush
            imageUrl={previewUrl}
            onMaskGenerated={handleMaskGenerated}
            brushSize={brushSize}
            className="canvas-brush"
          />
          {maskDataUrl && (
            <div className="mask-preview">
              <p>Mask generated successfully!</p>
            </div>
          )}
        </div>
      )}

      <div className="card">
        <div>
          <button
            type="button"
            onClick={handleErase}
            disabled={loading || !maskDataUrl}
            className="btn"
          >
            {loading ? (
              <>
                <svg className="loading-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Erasing...
              </>
            ) : (
              'Erase Image'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="error">
          <div>
            <div>
              <svg className="error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3>Error</h3>
              <div>{error}</div>
            </div>
          </div>
        </div>
      )}

      {resultImage && (
        <div className="card">
          <h3>Result</h3>
          <div className="image-container">
            <Image
              src={resultImage}
              alt="Erased image"
              width={800}
              height={500}
              className="image"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 