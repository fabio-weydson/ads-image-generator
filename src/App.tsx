import { useState } from 'react';
import { CustomizationSection } from './components/CustomizationSection';
import { CustomizationData } from './types';

function App() {
  const [customizationData, setCustomizationData] = useState<CustomizationData>({
    slogan: '',
    logo: null,
    mainColor: null,
    imageUrl: '',
    resultImages: [],
    usePeople: false,
  });

  return (
    <div className="min-h-screen bg-gray-100">

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ad Maker</h1>
              <p className="text-sm text-gray-600 mt-1">
                Create stunning media for your product posts using Gemini AI
              </p>
            </div>
          </div>        
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <section id="upload">
            <CustomizationSection
              customizationData={customizationData}
              onCustomizationChange={setCustomizationData}
            />
          </section>
          <section id="warnings" className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <h2 className="font-semibold">Be Aware of AI Limitations and Guidelines</h2>
            <p className="mt-2 text-sm text-yellow-800">
              AI-generated content may not always be accurate or appropriate. Please consider the following:
            </p>
            <ul className="list-disc mt-3 text-sm list-inside">
              <li><b>Do not use images of children and avoid sensitive content. </b></li>
              <li>Review and edit content before use. AI may produce unexpected or inappropriate content.</li>
              <li>Do not upload copyrighted or sensitive images.</li>
              <li>Results may vary; refine as needed.</li>
              <li>Use high-quality images for best results.</li>
              <li>We do not store, retain or share any user-uploaded images.</li>
              <li>This tool shares Google AI Guidelines and policies: <a href="https://policies.google.com/terms/generative-ai/use-policy" target="_blank" rel="noreferrer" className="underline">https://ai.google/responsible-ai/</a></li>
            </ul>
          </section>
        </div>
      </main>

   

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              AdMaker - Empowering small producers with professional social media content
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Built with React, TailwindCSS, and powered by Google Gemini AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
