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
