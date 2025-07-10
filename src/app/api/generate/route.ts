import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

const engineId = 'stable-diffusion-xl-1024-v1-0';
const apiHost = process.env.API_HOST ?? 'https://api.stability.ai';
const apiKey = process.env.STABILITY_API_KEY;

interface StabilityResponse {
  artifacts: Array<{
    base64: string;
    seed: number;
    finishReason: string;
  }>;
}

export async function POST(request: Request) {
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing Stability API key' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { prompt, cfg_scale = 7, height = 1024, width = 1024, steps = 30, samples = 1 } = body;

    const response = await fetch(
      `${apiHost}/v1/generation/${engineId}/text-to-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          cfg_scale,
          height,
          width,
          steps,
          samples,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Non-200 response: ${await response.text()}`);
    }

    const data = await response.json() as StabilityResponse;
    
    // Extract the base64 image data from the first artifact
    const imageData = data.artifacts[0].base64;
    const imageUrl = `data:image/png;base64,${imageData}`;
    
    return NextResponse.json({ image: imageUrl });
  } catch (error) {
    console.error('Error in generate route:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
} 