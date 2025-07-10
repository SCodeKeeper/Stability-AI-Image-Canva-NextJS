'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function GenerateTab() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImage(data.image);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="prompt">Enter your prompt</label>
            <textarea
              id="prompt"
              className="form-control"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A serene landscape with mountains and a lake..."
              required
            />
          </div>

          <button
            type="submit"
            className="btn"
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <>
                <svg className="loading-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate Image'
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="error">
          <ExclamationCircleIcon className="error-icon" />
          <span>{error}</span>
        </div>
      )}

      {generatedImage && (
        <div className="card">
          <h3>Result</h3>
          <div className="image-container">
            <Image
              src={generatedImage}
              alt="Generated image"
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