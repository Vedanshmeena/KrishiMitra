# Crop Recommendation System

The Crop Recommendation System uses Groq AI to provide intelligent crop suggestions based on soil and weather parameters.

## Setup

1. Install the Groq SDK:
   ```
   npm install groq-sdk
   ```

2. Set up your API key:
   - Create a `.env` file in your project root
   - Add the following line: `VITE_GROQ_API_KEY=your-groq-api-key-here`
   - Replace `your-groq-api-key-here` with your actual API key from [Groq's console](https://console.groq.com/keys)

## How to Use

1. Navigate to the Farmer Dashboard
2. Click on "Crop Recommendation" in the sidebar
3. Enter the following parameters:
   - Location (City/Region/Country)
   - Nitrogen content (kg/ha)
   - Phosphorus content (kg/ha)
   - Potassium content (kg/ha)
   - Temperature (°C)
   - Humidity (%)
   - pH value
   - Rainfall (mm)
4. Select your preferred language:
   - English: Get recommendations in English only
   - Hindi: Get recommendations in Hindi only
   - Both: Get recommendations in both English and Hindi
5. Click "Get Crop Recommendations"
6. The system will analyze your input and provide personalized crop suggestions in your chosen language(s)

## How It Works

The system uses the Groq AI API to generate intelligent crop recommendations. It:

1. Takes the soil and weather parameters you provide along with your location
2. Formats them into a prompt for the AI
3. Sends the prompt to Groq's llama3-70b-8192 model
4. Processes the response and displays the recommendations

The recommendations include:
- 3-5 suitable crops for your conditions and location
- Explanations for why each crop is suitable
- Basic growing instructions for each recommendation

## Troubleshooting

If you encounter issues:

1. Make sure your API key is correctly set up in the `.env` file
2. Check your internet connection
3. Verify that all input fields are filled in with valid values
4. If you get an error about "running in a browser-like environment", ensure that the Groq client is initialized with the `dangerouslyAllowBrowser: true` option
5. If the problem persists, check the browser console for error messages 