import React from'react';

interface ChatBubbleProps {
 message: string;
 isUser?: boolean;
 timestamp?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
 message,
 isUser = false,
 timestamp
}) => {
 return (
 <div className={`flex mb-6 ${isUser ?'justify-end' :'justify-start'}`}>
 <div
 className={`max-w-[80%] rounded-3xl px-6 py-4 ${
 isUser
 ?'bg-[#682bd7] rounded-br-none text-white'
 :'bg-[#e6ddd6] rounded-bl-none text-[#682bd7]'
}`}
 >
 <p className="text-lg">{message}</p>
 {timestamp && (
 <p className={`text-xs mt-2 ${isUser ?'text-white/70' :'text-[#682bd7]/70'}`}>
 {timestamp}
 </p>
 )}
 </div>
 </div>
 );
};

export default ChatBubble;