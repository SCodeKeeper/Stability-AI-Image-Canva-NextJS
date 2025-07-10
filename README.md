# Stability AI Image Editor

A modern, feature-rich image editing application built with Next.js that leverages the power of Stability AI's API. This application provides a seamless interface for generating, editing, and manipulating images using cutting-edge AI technology.

## Features

- **Image Generation**: Create stunning images from text prompts using Stability AI's text-to-image generation
- **Inpainting**: Selectively edit and modify specific areas of your images using an interactive canvas brush tool
- **Erase**: Remove unwanted elements from your images with precision using an interactive canvas brush tool
- **Modern UI**: Clean and intuitive interface with tabbed navigation
- **Real-time Preview**: See your changes instantly as you edit
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS for modern, responsive design
- **API Integration**: Stability AI API for image generation and manipulation
- **Type Safety**: TypeScript for robust development
- **State Management**: React Hooks for efficient state handling

## Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager
- Stability AI API key

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/stability-ai-image-editor-nextjs.git
cd stability-ai-image-editor-nextjs
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your Stability AI API key:
```env
STABILITY_API_KEY=your_api_key_here
API_HOST=https://api.stability.ai
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Image Generation
1. Navigate to the "Generate" tab
2. Enter your text prompt describing the image you want to create
3. Adjust generation parameters as needed
4. Click "Generate" to create your image

### Inpainting
1. Upload an image or use a generated one
2. Use the canvas brush tool to paint over the area you want to modify
3. Adjust brush size using the slider if needed
4. Click "Generate Mask" to create the mask from your brush strokes
5. Enter your prompt for the modification
6. Click "Inpaint" to apply the changes

### Erase
1. Upload an image or use a generated one
2. Use the canvas brush tool to paint over the area you want to remove
3. Adjust brush size using the slider if needed
4. Click "Generate Mask" to create the mask from your brush strokes
5. Click "Erase" to remove the selected content

## Environment Variables

The following environment variables are required:

- `STABILITY_API_KEY`: Your Stability AI API key

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Stability AI](https://stability.ai/) for providing the powerful API
- [Next.js](https://nextjs.org/) for the amazing framework
