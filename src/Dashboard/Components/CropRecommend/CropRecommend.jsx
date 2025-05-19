import React, { useState } from 'react';
import { Groq } from 'groq-sdk';

function CropRecommend() {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
    location: ''
  });
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('english');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY || 'your-api-key',
        dangerouslyAllowBrowser: true
      });
      
      // Format the soil and weather data for the AI prompt
      let prompt = `Based on the following soil and weather conditions for location ${formData.location}, recommend the best crops to grow:
      - Location: ${formData.location}
      - Nitrogen content: ${formData.nitrogen} kg/ha
      - Phosphorus content: ${formData.phosphorus} kg/ha
      - Potassium content: ${formData.potassium} kg/ha
      - Temperature: ${formData.temperature}°C
      - Humidity: ${formData.humidity}%
      - pH value: ${formData.ph}
      - Rainfall: ${formData.rainfall} mm
      
      Please provide 3-5 recommended crops along with a brief explanation for each recommendation. For each crop, explain why it's suitable for these conditions and include basic growing instructions. Consider the geographic location (${formData.location}) when making recommendations.`;
      
      if (language === 'hindi') {
        prompt += " Please provide the entire response in Hindi language.";
      } else if (language === 'both') {
        prompt += " Please provide the response in both English and Hindi languages. First give the recommendations in English, then translate the same recommendations into Hindi with the heading 'हिंदी अनुवाद (Hindi Translation)'.";
      }
      
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          }
        ],
        model: "llama3-70b-8192",
      });
      
      setRecommendation(response.choices[0].message.content);
    } catch (err) {
      console.error('Error getting crop recommendation:', err);
      setError('Failed to get recommendation. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Crop Recommendation System</h2>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Location (City/Region/Country)</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Punjab, India"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nitrogen (kg/ha)</label>
            <input
              type="number"
              name="nitrogen"
              value={formData.nitrogen}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 90"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phosphorus (kg/ha)</label>
            <input
              type="number"
              name="phosphorus"
              value={formData.phosphorus}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 40"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Potassium (kg/ha)</label>
            <input
              type="number"
              name="potassium"
              value={formData.potassium}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 45"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
            <input
              type="number"
              step="0.1"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 25.5"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Humidity (%)</label>
            <input
              type="number"
              step="0.1"
              name="humidity"
              value={formData.humidity}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 80.5"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">pH Value</label>
            <input
              type="number"
              step="0.1"
              name="ph"
              value={formData.ph}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 6.5"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rainfall (mm)</label>
            <input
              type="number"
              step="0.1"
              name="rainfall"
              value={formData.rainfall}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 200.5"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Language Preference</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="language"
                value="english"
                checked={language === 'english'}
                onChange={handleLanguageChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">English</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="language"
                value="hindi"
                checked={language === 'hindi'}
                onChange={handleLanguageChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">Hindi</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="language"
                value="both"
                checked={language === 'both'}
                onChange={handleLanguageChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">Both Languages</span>
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`mt-6 w-full py-3 px-4 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Getting Recommendations...' : 'Get Crop Recommendations'}
        </button>
      </form>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      {recommendation && (
        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-xl font-bold text-green-800 mb-4">
            Recommended Crops for {formData.location}
            {language === 'hindi' && ' (हिंदी में)'}
            {language === 'both' && ' (English & हिंदी)'}
          </h3>
          <div className="whitespace-pre-line">
            {recommendation}
          </div>
        </div>
      )}
    </div>
  );
}

export default CropRecommend;
