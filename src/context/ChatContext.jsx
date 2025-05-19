import { createContext, useState, useContext, useEffect } from 'react';

// Create the chat context
export const ChatContext = createContext();

// Create a provider component
export const ChatProvider = ({ children }) => {
  // State for chat options
  const [isChatEnabled, setIsChatEnabled] = useState(true);
  const [chatOptions, setChatOptions] = useState({
    showOnAllPages: true,
    rememberConversation: true,
    autoSuggestFeatures: false,
    availableModels: ['llama3-70b-8192', 'llama3-8b-8192'],
    selectedModel: 'llama3-70b-8192'
  });

  // Load chat settings from localStorage on component mount
  useEffect(() => {
    const savedChatEnabled = localStorage.getItem('agriChatEnabled');
    if (savedChatEnabled !== null) {
      setIsChatEnabled(JSON.parse(savedChatEnabled));
    }

    const savedChatOptions = localStorage.getItem('agriChatOptions');
    if (savedChatOptions) {
      setChatOptions(JSON.parse(savedChatOptions));
    }
  }, []);

  // Save chat settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('agriChatEnabled', JSON.stringify(isChatEnabled));
  }, [isChatEnabled]);

  useEffect(() => {
    localStorage.setItem('agriChatOptions', JSON.stringify(chatOptions));
  }, [chatOptions]);

  // Toggle chat visibility
  const toggleChat = () => {
    setIsChatEnabled(prev => !prev);
  };

  // Update a specific chat option
  const updateChatOption = (option, value) => {
    setChatOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  // Get available features for the current page
  const getAvailableFeatures = (pageName) => {
    const allFeatures = {
      home: [
        { name: 'Crop Information', description: 'Ask about any crop types and cultivation methods' },
        { name: 'Weather Insights', description: 'Get agricultural weather advice' },
      ],
      dashboard: [
        { name: 'Crop Recommendations', description: 'Based on your farm profile' },
        { name: 'Pest Control', description: 'Identify and manage agricultural pests' },
        { name: 'Yield Optimization', description: 'Tips to maximize your harvest' },
      ],
      property: [
        { name: 'Land Management', description: 'Advice on agricultural property usage' },
        { name: 'Soil Health', description: 'Recommendations for your soil type' },
      ],
      education: [
        { name: 'Training Resources', description: 'Find agricultural training programs' },
        { name: 'Latest Research', description: 'Updates on agricultural research' },
      ],
      default: [
        { name: 'General Assistance', description: 'Help with agricultural questions' },
        { name: 'Market Information', description: 'Current trends and prices' },
      ]
    };

    return allFeatures[pageName] || allFeatures.default;
  };

  return (
    <ChatContext.Provider 
      value={{ 
        isChatEnabled, 
        toggleChat, 
        chatOptions, 
        updateChatOption,
        getAvailableFeatures
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChatContext = () => {
  return useContext(ChatContext);
}; 