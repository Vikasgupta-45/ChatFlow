import React, { useEffect, useState } from 'react'
// Assuming you have 'assets' imported from your asset file
import { assets } from '../assets/assets' // <--- Add this import
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'



// Assuming you have useAppContext to get theme for the AI icon

const Message = ({ message, isTyping }) => {
    const [displayedContent, setDisplayedContent] = useState(isTyping ? "" : message.content);

    useEffect(() => {
        Prism.highlightAll()
    }, [displayedContent, message.content])

    useEffect(() => {
        if (!isTyping) {
            setDisplayedContent(message.content);
            return;
        }

        const words = message.content.split(/(\s+)/); // Split keeping whitespace
        let currentIndex = 0;
        setDisplayedContent("");

        const intervalId = setInterval(() => {
            if (currentIndex < words.length) {
                setDisplayedContent((prev) => prev + words[currentIndex]);
                currentIndex++;
            } else {
                clearInterval(intervalId);
            }
        }, 40);

        return () => clearInterval(intervalId);
    }, [isTyping, message.content]);

    return (
        <div>
            {/* 1. FIXED: Correctly check the role on the message prop */}
            {message.role === "user" ? (
                // --- USER MESSAGE (Right Alignment) ---
                <div className='flex items-start justify-end my-4 gap-2'>
                    <div className='flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl'>
                        <p className='text-sm dark:text-primary'>{message.content}</p>
                        <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>
                            {moment(message.timestamp).fromNow()}
                        </span>
                    </div>
                    {/* User Icon */}
                    <img src={assets.user_icon} alt="User" className='w-8 h-8 rounded-full' />
                </div>
            ) : (
                // --- AI/SYSTEM MESSAGE (Left Alignment) ---
                <div className='flex items-start justify-start my-4 gap-2'>
                    {/* AI Icon */}
                    {/* <img 
                        src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} 
                        alt="AI" 
                        className='w-8 h-8 rounded-full' // Add height to prevent stretching
                    /> */}

                    <div className='flex flex-col gap-2 p-2 px-4 max-w-2xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md'>
                        {message.isImage ?
                            (
                                <img
                                    src={message.content}
                                    alt="AI Image Response"
                                    className='w-full max-w-md mt-2 rounded-md'
                                />
                            ) : (
                                // Use a standard div for text content
                                <div className='text-sm dark:text-primary reset-tw'>
                                    <Markdown>
                                        {displayedContent}
                                    </Markdown>

                                </div>
                            )
                        }
                        <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>
                            {moment(message.timestamp).fromNow()}
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Message
