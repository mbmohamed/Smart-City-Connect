import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';

const ORCHESTRATOR_URL = 'http://localhost:8085';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: '👋 Bonjour ! Je suis l\'assistant Smart City Connect. Comment puis-je vous aider aujourd\'hui ?\n\nVous pouvez me poser des questions sur :\n• 🚌 Le transport urbain\n• 🌬️ La qualité de l\'air\n• 🚨 Les alertes d\'urgence\n• 📅 Les événements citoyens'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch(`${ORCHESTRATOR_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response || 'Désolé, je n\'ai pas pu traiter votre demande.',
                workflow: data.workflow,
                results: data.results
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '❌ Erreur de connexion au service. Veuillez réessayer plus tard.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-blue to-accent-orange rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
            >
                <MessageCircle className="w-7 h-7 text-white" />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 w-96 bg-bg-card rounded-2xl shadow-2xl border border-gray-700 z-50 transition-all ${isMinimized ? 'h-14' : 'h-[500px]'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-primary-blue/20 to-accent-orange/20 rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <Bot className="w-6 h-6 text-primary-blue" />
                    <span className="font-semibold text-white">Assistant Smart City</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="text-gray-400 hover:text-white">
                        {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-red-400">
                        <X size={18} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(500px - 140px)' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-primary-blue/20 flex items-center justify-center flex-shrink-0">
                                        <Bot size={16} className="text-primary-blue" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-primary-blue text-white rounded-br-none'
                                        : 'bg-gray-700 text-gray-100 rounded-bl-none'
                                    }`}>
                                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                                    {msg.workflow && (
                                        <details className="mt-2 text-xs">
                                            <summary className="cursor-pointer text-gray-400 hover:text-white">
                                                📊 Détails du workflow
                                            </summary>
                                            <pre className="mt-1 p-2 bg-black/30 rounded text-gray-300 overflow-x-auto">
                                                {JSON.stringify(msg.workflow, null, 2)}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-accent-orange/20 flex items-center justify-center flex-shrink-0">
                                        <User size={16} className="text-accent-orange" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-2 justify-start">
                                <div className="w-8 h-8 rounded-full bg-primary-blue/20 flex items-center justify-center">
                                    <Bot size={16} className="text-primary-blue" />
                                </div>
                                <div className="bg-gray-700 p-3 rounded-2xl rounded-bl-none">
                                    <Loader2 className="w-5 h-5 animate-spin text-primary-blue" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Posez votre question..."
                                className="flex-1 bg-bg-dark border border-gray-600 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:border-primary-blue focus:outline-none"
                                disabled={isLoading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || isLoading}
                                className="w-10 h-10 bg-primary-blue rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-blue/80 transition-colors"
                            >
                                <Send size={18} className="text-white" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatBot;
