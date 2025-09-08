# PostMaker

A React Single Page Application (SPA) designed for small producers to create professional social media posts using AI assistance powered by Google Gemini API.

## Features

### ✨ CustomizationSection
- Edit text content (name, description, slogan)
- Upload product image or brand logo
- Change main color with preset palette
- AI-powered slogan and context generation using Google Gemini

### 👀 PreviewSection
- Live preview (with history)
- Real-time updates as you customize

## Tech Stack

- **React 18** with TypeScript
- **TailwindCSS** for responsive styling
- **Google Gemini AI** for content generation
- **Functional components** with React hooks
- **Persistent state** using localStorage to save customization data between sessions

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
REACT_APP_GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

### 3. Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

### 4. Start Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── CustomizationSection.tsx
├── hooks/              # Custom React hooks
│   └── useGemini.ts
├── types/              # TypeScript interfaces
│   └── index.ts
└── App.tsx             # Main application component
```

## Future Enhancements

- **Background removal**: Implement actual background removal for product images
- **Batch processing**: Process multiple products at once
- **Social media integration**: Direct posting to social platforms
- **Image cropping and resizing**: More control over image dimensions
- **Internationalization (i18n)**: Support for multiple languages

## API Integration

The application integrates with Google Gemini AI for:
- Slogan generation based on product information
- Contextual ideas for marketing posts
- Context-aware marketing copy

## Contributing

This is a freelance project template. For modifications or enhancements, please follow React and TypeScript best practices.

## License

This project is created for small producers and businesses. Feel free to customize according to your needs.
