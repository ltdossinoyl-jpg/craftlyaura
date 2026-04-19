"use client";
import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import styles from './ChatWidget.module.css';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai' | 'admin';
    timestamp: number;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [isIdentified, setIsIdentified] = useState(false);
    const [showHelpPopup, setShowHelpPopup] = useState(false);
    const [idleCount, setIdleCount] = useState(0);
    const [isHelpDisabled, setIsHelpDisabled] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('chat_help_disabled') === 'true';
        }
        return false;
    });

    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastActivityRef = useRef<number>(Date.now());
    const idleIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Initial setup
    useEffect(() => {
        // 1. Manage Session
        let currentSessionId = localStorage.getItem('chat_session_id');
        if (!currentSessionId) {
            currentSessionId = uuidv4();
            localStorage.setItem('chat_session_id', currentSessionId);
        }
        setSessionId(currentSessionId);

        // 2. Load User Info
        const savedName = localStorage.getItem('chat_user_name');
        const savedEmail = localStorage.getItem('chat_user_email');
        if (savedName && savedEmail) {
            setUserName(savedName);
            setUserEmail(savedEmail);
            setIsIdentified(true);
        }

        // 3. Load History
        const savedMessages = localStorage.getItem('chat_messages');
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        } else {
            // Initial AI Greeting
            const welcomeMsg: Message = {
                id: uuidv4(),
                text: "Hi there! I'm Sara from Handmade Bestseller. I can help you choose the perfect bag or decor piece 😊",
                sender: 'ai',
                timestamp: Date.now()
            };
            setMessages([welcomeMsg]);
            localStorage.setItem('chat_messages', JSON.stringify([welcomeMsg]));
        }
    }, []);

    useEffect(() => {
        if (!isHelpDisabled) {
            const initialTimer = setTimeout(() => {
                setShowHelpPopup(true);
                setTimeout(() => setShowHelpPopup(false), 10000);
            }, 2000);

            const interval = setInterval(() => {
                setShowHelpPopup(true);
                setTimeout(() => setShowHelpPopup(false), 10000);
            }, 5 * 60 * 1000);

            return () => {
                clearTimeout(initialTimer);
                clearInterval(interval);
            };
        }
    }, [isHelpDisabled]);

    // Idle Monitor (checks every 10 seconds)
    useEffect(() => {
        if (!isOpen || !isIdentified) {
            if (idleIntervalRef.current) clearInterval(idleIntervalRef.current);
            return;
        }

        lastActivityRef.current = Date.now();
        setIdleCount(0);

        const checkIdle = () => {
            const now = Date.now();
            const idleTime = now - lastActivityRef.current;
            const idleThreshold = 30000; // 30 seconds for quick testing

            if (idleTime > idleThreshold) {
                setIdleCount(prev => {
                    const newCount = prev + 1;

                    if (newCount === 3) {
                        const closeMsg: Message = {
                            id: uuidv4(),
                            text: "Since you haven't answered for a while, we will close this chat and see you another time.",
                            sender: 'ai',
                            timestamp: Date.now()
                        };
                        setMessages(msgs => {
                            const updated = [...msgs, closeMsg];
                            localStorage.setItem('chat_messages', JSON.stringify(updated));
                            return updated;
                        });

                        setTimeout(() => {
                            setIsOpen(false);
                        }, 5000);

                        return 0; // reset local state 
                    } else if (newCount < 3) {
                        const askMsg: Message = {
                            id: uuidv4(),
                            text: "Are you still online?",
                            sender: 'ai',
                            timestamp: Date.now()
                        };
                        setMessages(msgs => {
                            const updated = [...msgs, askMsg];
                            localStorage.setItem('chat_messages', JSON.stringify(updated));
                            return updated;
                        });
                        lastActivityRef.current = Date.now(); // reset timer for next prompt
                        return newCount;
                    }
                    return prev;
                });
            }
        };

        idleIntervalRef.current = setInterval(checkIdle, 10000);

        return () => {
            if (idleIntervalRef.current) clearInterval(idleIntervalRef.current);
        };
    }, [isOpen, isIdentified]);

    useEffect(() => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
        socketRef.current = io(backendUrl);

        socketRef.current.on('connect', () => {
            console.log("Connected to remote chat server");
            socketRef.current?.emit('register_session', sessionId || uuidv4());
        });

        socketRef.current.on('receive_message', (msg: Omit<Message, 'id'>) => {
            setIsTyping(false);
            setMessages((prev) => {
                const newMessages = [...prev, { ...msg, id: uuidv4() }];
                localStorage.setItem('chat_messages', JSON.stringify(newMessages));
                return newMessages;
            });
            try {
                const audio = new Audio('/notification.mp3');
                audio.play().catch(() => { });
            } catch (e) { }
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [sessionId]);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        lastActivityRef.current = Date.now();
        setIdleCount(0);

        const newMsg: Message = {
            id: uuidv4(),
            text: input,
            sender: 'user',
            timestamp: Date.now()
        };

        const updatedMessages = [...messages, newMsg];
        setMessages(updatedMessages);
        localStorage.setItem('chat_messages', JSON.stringify(updatedMessages));
        setInput('');
        setIsTyping(true);

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
        try {
            await fetch(`${backendUrl}/chat/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    userName,
                    userEmail,
                    text: newMsg.text
                })
            });
        } catch (error) {
            console.error("Failed to send message:", error);
            setIsTyping(false);
        }
    };

    const handleIdentify = (e: React.FormEvent) => {
        e.preventDefault();
        if (userName.trim() && userEmail.trim()) {
            localStorage.setItem('chat_user_name', userName);
            localStorage.setItem('chat_user_email', userEmail);
            setIsIdentified(true);
            lastActivityRef.current = Date.now();
        }
    };

    const abandonChat = () => {
        setIsOpen(false);
        setMessages([]);
        setIsIdentified(false);
        setUserName('');
        setUserEmail('');
        localStorage.removeItem('chat_messages');
        localStorage.removeItem('chat_user_name');
        localStorage.removeItem('chat_user_email');
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
        localStorage.setItem('chat_session_id', newSessionId);

        // Setup initial greeting again
        const welcomeMsg: Message = {
            id: uuidv4(),
            text: "Hi there! I'm Sara from Handmade Bestseller. I can help you choose the perfect bag or decor piece 😊",
            sender: 'ai',
            timestamp: Date.now()
        };
        setMessages([welcomeMsg]);
        localStorage.setItem('chat_messages', JSON.stringify([welcomeMsg]));
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setShowHelpPopup(false);
        if (!isHelpDisabled) {
            localStorage.setItem('chat_help_disabled', 'true');
            setIsHelpDisabled(true);
        }
    };

    return (
        <div className={styles.widgetContainer}>
            {showHelpPopup && !isOpen && (
                <div className={styles.helpPopup}>
                    <p>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}>
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        if you need help 3 agents online now
                    </p>
                    <div className={styles.helpArrow}></div>
                </div>
            )}
            {isOpen && (
                <div className={`${styles.chatWindow} slide-up`}>
                    <div className={styles.chatHeader}>
                        <div className={styles.headerInfo}>
                            <div className={styles.avatar}>
                                <div className={styles.onlineBadge}></div>
                            </div>
                            <div>
                                <h3>Sara</h3>
                                <p>Customer Success</p>
                            </div>
                        </div>
                        <div className={styles.headerActions}>
                            {idleCount > 0 && (
                                <button onClick={abandonChat} className={styles.abandonBtn} title="Abandon Chat">
                                    Abandon Chat
                                </button>
                            )}
                            <button onClick={toggleChat} className={styles.closeBtn}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {!isIdentified ? (
                        <div className={styles.identificationForm}>
                            <div className={styles.formHeader}>
                                <h3>Introduce Yourself</h3>
                                <p>Please provide your details so we can assist you better.</p>
                            </div>
                            <form onSubmit={handleIdentify}>
                                <div className={styles.inputBox}>
                                    <label>Name or Business Name</label>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="e.g. John Doe / Atlas Design"
                                        required
                                    />
                                </div>
                                <div className={styles.inputBox}>
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                                <button type="submit" className={styles.identifyBtn}>
                                    Start Chatting
                                </button>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div className={styles.messagesContainer}>
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.userMsg : styles.agentMsg}`}
                                    >
                                        <div className={styles.bubble}>
                                            <p>{msg.text}</p>
                                            <span className={styles.time}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className={`${styles.messageWrapper} ${styles.agentMsg}`}>
                                        <div className={styles.typingIndicator}>
                                            <span></span><span></span><span></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSend} className={styles.inputArea}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className={styles.inputField}
                                />
                                <button type="submit" className={styles.sendBtn} disabled={!input.trim()}>
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                    </svg>
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}

            {!isOpen && (
                <button onClick={toggleChat} className={`${styles.floatingBtn} fade-in`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            )}
        </div>
    );
}
