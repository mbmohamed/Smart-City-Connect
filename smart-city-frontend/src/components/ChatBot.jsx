import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2, Minimize2, Maximize2, Sparkles } from 'lucide-react';

const ORCHESTRATOR_URL = 'http://localhost:8085';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: '👋 Bonjour ! Je suis l\'assistant IA de Smart City Connect.\n\nJe peux vous aider avec :\n• 🚌 Transport urbain\n• 🌬️ Qualité de l\'air\n• 🚨 Alertes d\'urgence\n• 📅 Événements citoyens'
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

            if (!response.ok) throw new Error('Network error');

            const data = await response.json();

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response || 'Désolé, je n\'ai pas pu traiter votre demande.',
                workflow: data.workflow,
                results: data.results
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '❌ Erreur de connexion. Veuillez réessayer.'
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
                className="fixed bottom-6 right-6 w-16 h-16 rounded-2xl flex items-center justify-center z-50 group"
                style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    boxShadow: '0 8px 32px -8px rgba(99, 102, 241, 0.5)'
                }}
            >
                <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-emerald rounded-full border-2 border-bg-dark animate-pulse" />
            </button>
        );
    }

    return (
        <div
            className={`fixed bottom-6 right-6 w-[400px] rounded-2xl z-50 transition-all duration-300 overflow-hidden ${isMinimized ? 'h-16' : 'h-[550px]'}`}
            style={{
                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(17, 24, 39, 0.95) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 border-b border-white/10"
                style={{ background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-violet flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <span className="font-semibold text-text-primary">Assistant IA</span>
                        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-emerald" />
                            En ligne
                        </div>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-2 rounded-lg hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors"
                    >
                        {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-lg hover:bg-rose-500/20 text-text-secondary hover:text-rose-400 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(550px - 144px)' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent-violet/20 flex items-center justify-center flex-shrink-0 border border-primary/20">
                                        <Bot size={16} className="text-primary-light" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] p-3.5 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-primary to-primary-dark text-white rounded-br-md'
                                        : 'bg-white/5 border border-white/10 text-text-primary rounded-bl-md'
                                    }`}>
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                                    {msg.workflow && (
                                        <details className="mt-3 text-xs">
                                            <summary className="cursor-pointer text-text-muted hover:text-text-secondary transition-colors">
                                                📊 Voir le workflow
                                            </summary>
                                            <pre className="mt-2 p-2 bg-black/30 rounded-lg text-text-muted overflow-x-auto text-[10px]">
                                                {JSON.stringify(msg.workflow, null, 2)}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-amber/20 to-accent-rose/20 flex items-center justify-center flex-shrink-0 border border-accent-amber/20">
                                        <User size={16} className="text-accent-amber" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 justify-start animate-in">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent-violet/20 flex items-center justify-center border border-primary/20">
                                    <Bot size={16} className="text-primary-light" />
                                </div>
                                <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl rounded-bl-md">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary-light" />
                                        <span className="text-sm text-text-secondary">Analyse en cours...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Posez votre question..."
                                className="input-field flex-1"
                                disabled={isLoading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || isLoading}
                                className="w-12 h-12 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                style={{
                                    background: input.trim() ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'rgba(255, 255, 255, 0.05)',
                                    boxShadow: input.trim() ? '0 4px 15px -3px rgba(99, 102, 241, 0.4)' : 'none'
                                }}
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
