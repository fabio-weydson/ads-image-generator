import React, { useState } from 'react';
import { CustomizationData, ProductData } from '../types';
import { useGemini } from '../hooks/useGemini';

interface CustomizationSectionProps {
  customizationData: CustomizationData;
  onCustomizationChange: (data: CustomizationData) => void;
}

const colorPresets = [
  '#FF0000', // Red
  '#FFA500', // Orange
  '#FFFF00', // Yellow
  '#008000', // Green
  '#0000FF', // Blue
  '#4B0082', // Indigo
  '#EE82EE', // Violet
];

export const CustomizationSection: React.FC<CustomizationSectionProps> = ({
  customizationData,
  onCustomizationChange,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { generateSlogan, generateImagePostFromImage, generateContextForScene, loading, error } = useGemini();
  const [contextIdeas, setContextIdeas] = useState<string[]>([]);
  const [info, setInfo] = useState<string>('');

  const [productData, setProductData] = useState<ProductData>({
    name: '',
    price: '',
    description: '',
    image: null,
  });

  const handleInputChange = (field: keyof CustomizationData, value: string | string[] | boolean) => {
    onCustomizationChange({
      ...customizationData,
      [field]: value,
    });
  };

  const handleLogoUpload = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    fetch('https://generativelanguage.googleapis.com/upload/v1beta/files?key='+process.env.REACT_APP_GEMINI_API_KEY, {
      method: 'POST',
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Failed to upload file');
        }
        const data = await response.json();
        if (data.file.uri) {
          handleInputChange('imageUrl', data.file.uri);
        }
      })
      .catch((err) => {
        setInfo('Failed to upload image. Please try again.');
      });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleLogoUpload(files[0]);
    }
  };

  const handleGenerateSlogan = async () => {
    const { name: productName, description: productDescription } = productData;
    if (productName && productDescription) {
      const generatedSlogan = await generateSlogan(productName, productDescription);
      if (generatedSlogan) {
        handleInputChange('slogan', generatedSlogan);
      }
    }
  };

  const handleGenerateSceneIdeas = async () => {
    handleInputChange('context', '');
    setContextIdeas([]);
    if (productData.name && productData.description) {
      const generatedContext = await generateContextForScene(productData, customizationData);
      if (generatedContext) {
        setContextIdeas(generatedContext.split(';').map(idea => idea.trim()));
      }
    }
  }

  const handleGeneratePostsImageFromImage = async (customizationData: CustomizationData) => {
    setInfo('');
    if (customizationData.imageUrl) {
      const generatedPost = await generateImagePostFromImage(customizationData);
      if (!generatedPost) return;
      if (generatedPost.image) {
        return handleInputChange('resultImages', [ generatedPost.image, ...(customizationData.resultImages || []) ]);
      }
      setInfo(generatedPost.text);
    }
  };

  const handleColorSelect = (color: string) => {
    handleInputChange('mainColor', color);
    setShowColorPicker(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Customize Your Ad Image</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            value={productData.name}
            onChange={(e) => setProductData({ ...productData, name: e.target.value })}
            placeholder='e.g., "Organic Honey"'
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product brief description
          </label>
          <input
            type="text"
            value={productData.description}
            placeholder='e.g., "Pure, raw, and unfiltered honey from local farms."'
            onChange={(e) => setProductData({ ...productData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Slogan / Tagline
            </label>
            <button
              type="button"
              onClick={handleGenerateSlogan}
              className="text-sm text-blue-500 hover:underline flex items-center space-x-1"
            >
              { loading ? <>
                  <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Generating...</span>
                </>
                : <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Slogan
                  </> 
                }
            </button>
          </div>
          <textarea
            value={customizationData.slogan}
            onChange={(e) => handleInputChange('slogan', e.target.value)}
            placeholder="Enter a catchy slogan for your product..."
            disabled={loading}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          />
        </div>


         <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Focus on Product
              </label>
              <select
                value={customizationData.focusOnProduct ? 'yes' : 'no'}
                onChange={(e) => handleInputChange('focusOnProduct', e.target.value === 'yes')}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <>
            {customizationData.focusOnProduct &&
              <>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Zoom Level: {((customizationData.zoomLevel || 0.5) * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={customizationData.zoomLevel || 0.5}
                    onChange={(e) => handleInputChange('zoomLevel', e.target.value)}
                    className="w-full mt-3"
                  />
              </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Position
                  </label>
                  <select
                    value={customizationData.productPosition || 'center'}
                    onChange={(e) => handleInputChange('productPosition', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="center">Center</option>
                    <option value="center-left">Center Left</option>
                    <option value="center-right">Center Right</option>
                    <option value="left-bottom">Left Bottom</option>
                    <option value="right-bottom">Right Bottom</option>
                    <option value="left-top">Left Top</option>
                    <option value="right-top">Right Top</option>
                  </select>
                </div> 
              
              <div>
                <div className="block items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Main Color <i className='text-gray-500'>(optional)</i>
                  </label>
                  <div className="flex items-center space-x-2">
                    <div
                      id="square"
                      style={{ backgroundColor: customizationData.mainColor || '' }}
                      className="w-6 h-6 px-3 py-3 border border-gray-300 rounded-md"
                    ></div>
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className={`px-3 py-1 border border-gray-500 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                    >
                      Color Picker
                    </button>
                  </div>
                </div>
              </div>
            </>
          }
          {!customizationData.focusOnProduct && 
            <div className="">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Use people in the scene
              </label>
              <select
                value={customizationData?.usePeople ? 'yes' : 'no'}
                onChange={(e) => handleInputChange('usePeople', (e.target.value === 'yes'))}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          }
         </>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-md font-medium text-gray-700">
              Context for the scene
            </label>
            <button
                type="button"
                onClick={handleGenerateSceneIdeas}
                className="text-sm text-blue-500 hover:underline flex items-center space-x-1"
              >
                {loading ? <>
                        <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Generating...</span>
                      </>
                      : <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Generate contexts ideas
                        </> 
                }
            </button>
            
            </div>
            <div>
              {loading ? (
                <span className="text-gray-500 text-sm">Please wait...</span>
              ) : (
                contextIdeas.length > 0 && (
                  <div className="block mt-1 text-sm text-gray-600">
                    <strong>Ideas: </strong> (click to select)
                    <ul className="list-disc list-inside m-3">
                      {contextIdeas.map((idea, idx) => (
                        <li className='cursor-pointer hover:text-blue-500' key={idx} onClick={() => handleInputChange('context', idea)}>{idea}</li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
            <textarea
              value={customizationData.context}
              onChange={(e) => handleInputChange('context', e.target.value)}
              placeholder="Describe the scene or context for the image..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
        </div>


       
        <div>
         
          {showColorPicker && (
            <div className="mt-2 grid grid-cols-7 gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className="w-8 h-8 rounded-full border-2"
                >
                  <span
                    className="block w-full h-full rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Input Image file
          </label>
          <input
            type="file"
            onChange={handleFileSelect}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <button
              onClick={() => handleGeneratePostsImageFromImage(customizationData)}
              disabled={loading || !customizationData.imageUrl || !customizationData.slogan}
              className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              {loading ? (
                <>
                  <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate Image</span>
                </>
              )}
            </button>
        </div>


        

        {/* Preview Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview
            <button id="clear" onClick={() => handleInputChange('resultImages', [])} className="text-sm text-red-500 hover:underline float-right">
              (Clear)            
            </button>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <div className="text-sm text-gray-800">
                {info && <div className="mb-2 p-2 bg-blue-50 border border-blue-200 text-blue-800 rounded">{info}</div>}
                {customizationData.resultImages?.length && customizationData.resultImages.length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-4 justify-center">
                      {customizationData.resultImages.map((img, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <img
                            src={'data:image/png;base64,' + img}
                            alt={`Generated result ${idx + 1}`}
                            className="max-w-250 max-w-lg rounded border border-gray-200 object-contain bg-white"
                          />
                          <span className="mt-2 text-sm text-gray-500 text-center block">
                            Right click and save the image
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <span className="text-gray-400 text-center block">No image</span>
                )}
              </div>
            </div>
              {error && (
                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
