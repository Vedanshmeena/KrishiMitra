import { useChatContext } from '../context/ChatContext';

const ChatToggle = () => {
  const { isChatEnabled, toggleChat } = useChatContext();

  return (
    <button 
      onClick={toggleChat}
      className={`flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
        isChatEnabled 
          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`}
      aria-label={isChatEnabled ? "Disable AI Assistant" : "Enable AI Assistant"}
      title={isChatEnabled ? "Disable AI Assistant" : "Enable AI Assistant"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-4 w-4 mr-1 ${isChatEnabled ? 'text-green-600' : 'text-gray-600'}`} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
        />
      </svg>
      <span>{isChatEnabled ? 'AI On' : 'AI Off'}</span>
    </button>
  );
};

export default ChatToggle; 