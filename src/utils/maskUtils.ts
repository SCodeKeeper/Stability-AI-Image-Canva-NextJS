// Convert data URL to File object
export function dataURLtoFile(dataURL: string, filename: string): File {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}

// Convert canvas to mask file
export function canvasToMaskFile(canvas: HTMLCanvasElement, filename: string = 'mask.png'): File {
  const dataURL = canvas.toDataURL('image/png');
  return dataURLtoFile(dataURL, filename);
} 