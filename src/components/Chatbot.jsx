import { useState, useEffect, useRef } from 'react';
import Groq from 'groq-sdk';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { useChatContext } from '../context/ChatContext';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('english');
  const [selectedTab, setSelectedTab] = useState('chat'); // 'chat', 'features', 'settings'
  const messagesEndRef = useRef(null);
  const location = useLocation();
  
  // Get current page name from location path
  const currentPage = location.pathname === '/' 
    ? 'home' 
    : location.pathname.split('/')[1];

  // Use our chat context
  const { isChatEnabled, chatOptions, updateChatOption, getAvailableFeatures } = useChatContext();
  
  // Get available features for the current page
  const availableFeatures = getAvailableFeatures(currentPage);

  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
  });

  // Load messages from localStorage on component mount if enabled
  useEffect(() => {
    if (chatOptions.rememberConversation) {
      const savedMessages = localStorage.getItem('agriChatMessages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    }
    
    const savedLanguage = localStorage.getItem('agriChatLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, [chatOptions.rememberConversation]);

  // Save messages to localStorage whenever they change if enabled
  useEffect(() => {
    if (chatOptions.rememberConversation && messages.length > 0) {
      localStorage.setItem('agriChatMessages', JSON.stringify(messages));
    }
  }, [messages, chatOptions.rememberConversation]);

  // Save language preference whenever it changes
  useEffect(() => {
    localStorage.setItem('agriChatLanguage', language);
  }, [language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('agriChatMessages');
    toast.success('Chat history cleared');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let systemPrompt = 'You are a helpful agricultural assistant that provides advice on farming, crops, and agricultural technology.';
      
      if (language === 'hindi') {
        systemPrompt += ' Please respond in Hindi language.';
      } else if (language === 'both') {
        systemPrompt += ' Please provide your responses in both English and Hindi languages. First in English, then translate to Hindi.';
      }

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
          { role: 'user', content: input }
        ],
        model: chatOptions.selectedModel,
      });

      const botReply = completion.choices[0]?.message?.content || "Sorry, I couldn't process your request.";
      setMessages((prev) => [...prev, { text: botReply, sender: 'bot' }]);
    } catch (error) {
      console.error('Error calling Groq API:', error);
      toast.error('Failed to get response from AI assistant');
      setMessages((prev) => [...prev, { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const useFeature = (feature) => {
    setInput(`Tell me about ${feature.name.toLowerCase()}: ${feature.description}`);
    setSelectedTab('chat');
  };

  // Don't render if chat is disabled
  if (!isChatEnabled && !isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
          aria-label="Open chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 flex flex-col overflow-hidden border border-gray-200 transition-all duration-300">
          <div className="bg-green-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-medium">Agri Assistant</h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={clearChat} 
                className="text-white hover:text-gray-200 transition-colors"
                title="Clear chat history"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white hover:text-gray-200 transition-colors"
                title="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Tab navigation */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-2 px-4 font-medium text-sm ${
                selectedTab === 'chat'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setSelectedTab('chat')}
            >
              Chat
            </button>
            <button
              className={`flex-1 py-2 px-4 font-medium text-sm ${
                selectedTab === 'features'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setSelectedTab('features')}
            >
              Features
            </button>
            <button
              className={`flex-1 py-2 px-4 font-medium text-sm ${
                selectedTab === 'settings'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setSelectedTab('settings')}
            >
              Settings
            </button>
          </div>
          
          {/* Chat tab */}
          {selectedTab === 'chat' && (
            <>
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-center space-x-3">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="chatLanguage"
                      value="english"
                      checked={language === 'english'}
                      onChange={handleLanguageChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">English</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="chatLanguage"
                      value="hindi"
                      checked={language === 'hindi'}
                      onChange={handleLanguageChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Hindi</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="chatLanguage"
                      value="both"
                      checked={language === 'both'}
                      onChange={handleLanguageChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Both</span>
                  </label>
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto max-h-80 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">
                    <p>Ask me anything about agriculture!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                    >
                      <div 
                        className={`inline-block rounded-lg py-2 px-3 max-w-[90%] ${
                          msg.sender === 'user' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-200 text-gray-800'
                        } ${msg.sender === 'bot' ? 'shadow-sm' : ''}`}
                      >
                        {msg.sender === 'bot' ? (
                          <div className="whitespace-pre-line text-sm">
                            {msg.text.split('\n').map((line, i) => {
                              // Handle numbered lists
                              if (line.match(/^\d+\.\s/)) {
                                return (
                                  <p key={i} className="mb-1 pl-4 relative">
                                    <span className="font-bold">{line.split('.')[0]}.</span>
                                    {line.split('.').slice(1).join('.')}
                                  </p>
                                );
                              }
                              // Handle bullet points
                              else if (line.match(/^\*\s/)) {
                                return (
                                  <p key={i} className="mb-1 pl-4 relative">
                                    <span className="absolute left-0">•</span>
                                    {line.substring(2)}
                                  </p>
                                );
                              }
                              // Handle headers or emphasis
                              else if (line.match(/\*\*.+\*\*/)) {
                                return (
                                  <p key={i} className="mb-1 font-bold">
                                    {line.replace(/\*\*(.+?)\*\*/g, '$1')}
                                  </p>
                                );
                              }
                              // Regular text
                              else {
                                return line ? <p key={i} className="mb-1">{line}</p> : <br key={i} />;
                              }
                            })}
                          </div>
                        ) : (
                          msg.text
                        )}
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="text-left mb-3">
                    <div className="inline-block bg-gray-200 text-gray-800 rounded-lg py-2 px-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 flex">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 text-white rounded-r-lg px-4 py-2 disabled:bg-green-400 transition-colors"
                  disabled={isLoading || !input.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </form>
            </>
          )}
          
          {/* Features tab */}
          {selectedTab === 'features' && (
            <div className="flex-1 p-4 overflow-y-auto max-h-80 bg-gray-50">
              <div className="mb-3">
                <h4 className="font-medium text-green-700 mb-2">Available on this page</h4>
                {availableFeatures.map((feature, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 mb-2 hover:shadow-sm transition-shadow">
                    <h5 className="font-medium text-gray-800">{feature.name}</h5>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    <button 
                      onClick={() => useFeature(feature)}
                      className="mt-2 text-sm text-green-600 hover:text-green-800 font-medium"
                    >
                      Ask about this
                    </button>
                  </div>
                ))}
              </div>
              
              <div>
                <h4 className="font-medium text-green-700 mb-2">Example questions</h4>
                <ul className="space-y-2 text-sm">
                  <li className="cursor-pointer hover:text-green-700" onClick={() => {setInput("What crops grow well in clay soil?"); setSelectedTab('chat');}}>
                    What crops grow well in clay soil?
                  </li>
                  <li className="cursor-pointer hover:text-green-700" onClick={() => {setInput("How to control aphids organically?"); setSelectedTab('chat');}}>
                    How to control aphids organically?
                  </li>
                  <li className="cursor-pointer hover:text-green-700" onClick={() => {setInput("Best irrigation methods for water conservation?"); setSelectedTab('chat');}}>
                    Best irrigation methods for water conservation?
                  </li>
                  <li className="cursor-pointer hover:text-green-700" onClick={() => {setInput("When is the best time to plant wheat?"); setSelectedTab('chat');}}>
                    When is the best time to plant wheat?
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Settings tab */}
          {selectedTab === 'settings' && (
            <div className="flex-1 p-4 overflow-y-auto max-h-80 bg-gray-50">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Chat Options</h4>
                  
                  <div className="space-y-2">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Remember conversations</span>
                      <input 
                        type="checkbox" 
                        checked={chatOptions.rememberConversation}
                        onChange={() => updateChatOption('rememberConversation', !chatOptions.rememberConversation)}
                        className="form-checkbox h-4 w-4 text-green-600 transition duration-150 ease-in-out"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Show on all pages</span>
                      <input 
                        type="checkbox" 
                        checked={chatOptions.showOnAllPages}
                        onChange={() => updateChatOption('showOnAllPages', !chatOptions.showOnAllPages)}
                        className="form-checkbox h-4 w-4 text-green-600 transition duration-150 ease-in-out"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Auto-suggest features</span>
                      <input 
                        type="checkbox" 
                        checked={chatOptions.autoSuggestFeatures}
                        onChange={() => updateChatOption('autoSuggestFeatures', !chatOptions.autoSuggestFeatures)}
                        className="form-checkbox h-4 w-4 text-green-600 transition duration-150 ease-in-out"
                      />
                    </label>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">AI Model</h4>
                  
                  <select
                    className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    value={chatOptions.selectedModel}
                    onChange={(e) => updateChatOption('selectedModel', e.target.value)}
                  >
                    {chatOptions.availableModels.map(model => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    The larger model (70b) provides more detailed responses but may be slower.
                  </p>
                </div>
                
                <div className="pt-2">
                  <button
                    onClick={clearChat}
                    className="w-full bg-red-50 text-red-600 hover:bg-red-100 py-2 px-4 rounded-md text-sm font-medium transition-colors"
                  >
                    Clear Chat History
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot; 