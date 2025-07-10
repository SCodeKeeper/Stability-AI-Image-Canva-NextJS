'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface CanvasBrushProps {
  imageUrl: string;
  onMaskGenerated: (maskDataUrl: string) => void;
  brushSize?: number;
  className?: string;
}

export default function CanvasBrush({ 
  imageUrl, 
  onMaskGenerated, 
  brushSize = 20,
  className = ''
}: CanvasBrushProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Initialize canvas when image loads
  useEffect(() => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Set canvas size to match image
      canvas.width = image.width;
      canvas.height = image.height;
      setCanvasSize({ width: image.width, height: image.height });

      // Clear canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // Semi-transparent white for mask
      }

      setIsImageLoaded(true);
    };
    image.src = imageUrl;
    setImageElement(image);
  }, [imageUrl]);

  // Get canvas coordinates from mouse event
  const getCanvasCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  // Start drawing
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoordinates(e);
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, brushSize / 2, 0, 2 * Math.PI);
    ctx.fill();
  }, [getCanvasCoordinates, brushSize]);

  // Draw while moving
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoordinates(e);
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, brushSize / 2, 0, 2 * Math.PI);
    ctx.fill();
  }, [isDrawing, getCanvasCoordinates, brushSize]);

  // Stop drawing
  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Generate mask from canvas
  const generateMask = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a new canvas for the mask
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext('2d');

    if (!maskCtx) return;

    // Get the brush strokes from the main canvas
    const brushData = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height);
    if (!brushData) return;

    // Create a black and white mask where white areas are the brush strokes
    const maskData = maskCtx.createImageData(canvas.width, canvas.height);
    
    for (let i = 0; i < brushData.data.length; i += 4) {
      const r = brushData.data[i];
      const g = brushData.data[i + 1];
      const b = brushData.data[i + 2];
      
      // If there's brush data (semi-transparent white), make it white in the mask
      // Otherwise, make it black (transparent in the final mask)
      if (r > 0 || g > 0 || b > 0) {
        maskData.data[i] = 255;     // White
        maskData.data[i + 1] = 255; // White
        maskData.data[i + 2] = 255; // White
        maskData.data[i + 3] = 255; // Opaque
      } else {
        maskData.data[i] = 0;       // Black
        maskData.data[i + 1] = 0;   // Black
        maskData.data[i + 2] = 0;   // Black
        maskData.data[i + 3] = 255; // Opaque
      }
    }

    maskCtx.putImageData(maskData, 0, 0);
    
    // Convert to data URL and pass to parent
    const maskDataUrl = maskCanvas.toDataURL('image/png');
    onMaskGenerated(maskDataUrl);
  }, [onMaskGenerated]);

  return (
    <div className={`canvas-brush-container ${className}`}>
      <div className="canvas-controls">
        <button 
          type="button" 
          onClick={clearCanvas}
          className="btn btn-secondary"
          disabled={!isImageLoaded}
        >
          Clear Mask
        </button>
        <button 
          type="button" 
          onClick={generateMask}
          className="btn btn-primary"
          disabled={!isImageLoaded}
        >
          Generate Mask
        </button>
      </div>
      
      <div className="canvas-wrapper">
        <img
          src={imageUrl}
          alt="Background image"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.7
          }}
        />
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            cursor: 'crosshair',
            position: 'relative',
            zIndex: 1,
            maxWidth: '100%',
            height: 'auto'
          }}
        />
        {!isImageLoaded && (
          <div className="canvas-loading">
            Loading image...
          </div>
        )}
      </div>
      
      <div className="brush-info">
        <p>Brush size: {brushSize}px</p>
        <p>Click and drag to paint the area you want to edit/erase</p>
      </div>
    </div>
  );
} 