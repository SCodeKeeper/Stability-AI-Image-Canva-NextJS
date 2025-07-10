import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const mask = formData.get('mask') as File | null;

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    const form = new FormData();
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    form.append('image', imageBuffer, {
      filename: image.name,
      contentType: image.type,
    });

    if (mask) {
      const maskBuffer = Buffer.from(await mask.arrayBuffer());
      form.append('mask', maskBuffer, {
        filename: mask.name,
        contentType: mask.type,
      });
    }

    form.append('output_format', 'webp');

    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/edit/erase',
      form,
      {
        validateStatus: undefined,
        responseType: 'arraybuffer',
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: 'image/*',
        },
      }
    );

    if (response.status === 200) {
      const buffer = Buffer.from(response.data);
      const base64Image = buffer.toString('base64');
      return NextResponse.json({ image: `data:image/webp;base64,${base64Image}` });
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }
  } catch (error) {
    console.error('Error in erase route:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
} 