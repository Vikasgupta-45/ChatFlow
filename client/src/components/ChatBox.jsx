import React from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import { useState, useEffect } from 'react'
import Message from './Message'
import { useRef } from 'react'
import { toast } from 'react-hot-toast'


const ChatBox = () => {
  const containerRef = useRef(null);
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('text');
  const [isPublished, setIsPublished] = useState(false);
  const [latestReplyId, setLatestReplyId] = useState(null)
  // Correctly destructure values from context (it returns an object)
  const { selectedChat, theme, user, axios, token, setUser } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isResponding, setIsResponding] = useState(false);


  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!user) return toast('Please login to continue')
      setLoading(true);
      const copyprompt = prompt;
      setPrompt('');
      setMessages(prev => [...prev, { role: 'user', content: prompt, timestamp: Date.now(), isImage: false }])
      setLatestReplyId(null) // Reset latest reply when sending new message
      const { data } = await axios.post(`/api/messages/${mode}`, { chatId: selectedChat._id, prompt, isPublished }, { headers: { 'Authorization': `Bearer ${token}` } })
      if (data.success) {
        // Ensure message has an ID for tracking
        const replyMessage = { ...data.reply, _id: data.reply._id || Date.now().toString() };
        setMessages(prev => [...prev, replyMessage])
        setLatestReplyId(replyMessage._id)
        // Set new message ID as latest reply
        setIsResponding(true)
        if (mode === 'image') {
          setUser(prev => ({ ...prev, credits: prev.credits - 2 }))
        } else {
          setUser(prev => ({ ...prev, credits: prev.credits - 1 }))
        }
      } else {
        toast.error(data.message)
        setPrompt(copyprompt)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setPrompt('')
      setLoading(false)
    }
  }
  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }

  }, [selectedChat])
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages])

  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>
      {/* chatmessages */}
      <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll'>
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-2'>
            <img
              src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark}
              alt='ChatFlow logo'
              className='w-full max-w-sm sm:max-w-md'
            />
            <p className='mt-2 text-2xl sm:text-6xl text-center text-gray-400 dark:text-white'>
              Ask me anything.
            </p>
          </div>
        )}
        {messages.map((message, index) => {
          const isLatestById = message._id && message._id === latestReplyId;
          const isLatestByIndex = !message._id && index === messages.length - 1 && latestReplyId != null;
          const isTyping = (isLatestById || isLatestByIndex) && message.role === 'assistant' && !message.isImage;
          return (
            <Message key={index} message={message} isTyping={isTyping} />
          )
        })}
        {loading && (
          <div className='loader flex items-center  gap-1.5'>
            <div className='w-2 h-2 bg-primary rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-2 h-2 bg-primary rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-2 h-2 bg-primary rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
          </div>
        )}
      </div>

      {mode === 'image' && (
        <label className='inline-flex items-center gap-2 mb-2 text-sm mx-auto'>
          <p className='text-xs'>Publish Generated Image to Community</p>
          <input type="checkbox" className='cursor-pointer' checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)} />
        </label>
      )}

      {/* prompt input box */}
      <form onSubmit={onSubmit} className='bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark: border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center'>
        <select onChange={(e) => setMode(e.target.value)} value={mode} className='text-sm pl-3  outline-none'>
          <option className='dark:bg-purple-900' value="text">Text</option>
          <option className='dark:bg-purple-900' value="image">Image</option>
        </select>
        <input onChange={(e) => setPrompt(e.target.value)} value={prompt} type="text"
          placeholder="Type your prompt here..." className='flex-1 w-full text-sm
            outline-none 'required />
        <button disabled={loading || isResponding}>
          <img src={loading ? assets.stop_icon : assets.send_icon} className='w-8
          cursor-pointer' alt="" />
        </button>
      </form>
    </div>
  )
}

export default ChatBox
