import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import moment from 'moment'
// import { navigate } from 'react-router-dom'

const SideBar = ({isMenuOpen, setIsMenuOpen}) => {
  // Include navigate from context so click handlers work
  const { chats, setSelectedChat, theme, setTheme, user, navigate } = useAppContext();
  const [search, setSearch] = useState("");

  return (
    <div className={`flex flex-col 
      h-screen min-w-72  
      dark:bg-gradient-to-b p-5
      from-[#242124]/30 to-[#000000]/30 
      border-r border-[#80609F]/30 
      backdrop-blur-3xl
      transition-all duration-500
      max-md:absolute 
      left-0 z-1
      ${isMenuOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'} `}
      
    >
      <img 
        src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} 
        alt="logo" 
        className="w-full max-w-48 max-h-20 ml-4" 
      />
      
      
    {/* {New Chat Button}       */}
        <button className='flex justify-center text-xl active:scale-97
        w-full text-white py-2 mt-10 bg-gradient-to-r from-[#7e34ce] to-[#3D81F6] text-sm rounded-md cursor-pointer '>
            <span className='mr-2 text-xl'>+</span>New Chat
        </button>

        {/* {Search Box}       */}
        <div className='flex mt-4 pl-3 gap2 border border-gray-400 dark:border-white/20 rounded-md items-center'>
        <img src={assets.search_icon} alt="search" className='w-5 not-dark:invert '/>
       <input
        type="text"
        placeholder="Search chats..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='text-xs placeholder:text-gray-500 outline-none bg-transparent ml-2 w-full mb-4 pr-1 mt-4
        '
       />   
        </div>
         {/* {Chat List}       */}
         {chats.length>0 && <p className='mt-4 text-sm'>Recent chats</p>}

         <div className='flex-1 overflow-y-scroll mt-3 text-sm space-y-3'> 
            {
            chats.filter((chat) => chat.messages[0]?chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()):chat.name.toLowerCase().includes(search.toLowerCase())).map((chat) => (
                <div 
                onClick={()=>{navigate("/"); setSelectedChat(chat); setIsMenuOpen(false);}}
                  key={chat._id} className='p-2  mt-2 px-4  rounded-md cursor-pointer active:scale-98 flex hover:bg-gray-200 dark:hover:bg-gray-800 justify-between group'>
                    <div>
                        <p className='truncate w-full'>
                            {chat.messages.length>0? chat.messages[0].content.slice(0,30) + (chat.messages[0].content.length>30 ? "..." : "") : "New Chat"}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-[#B1A6C0]'>
                            {moment(chat.updatedAt).fromNow()}
                        </p>
                    </div>
                    <img src={assets.bin_icon} className='hidden group-hover:block w-4 cursor-pointer not-dark:invert' alt=''/>
                </div>
            ))}
         </div>
         {/* {community images} */}
          <div onClick={()=> {navigate('/community'); setIsMenuOpen(false);}} className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all'>
            <img src={assets.gallery_icon} className='w-4.5  not-dark:invert cursor-pointer' alt='gallery'/>
            <div className='flex flex-col text-sm'>
              <p> Community Images</p>
              </div>
          </div>

            {/* {credit purchase} */}
          <div onClick={()=> {navigate('/credits'); setIsMenuOpen(false);}} className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all'>
            <img src={assets.diamond_icon} className='w-4.5  dark:invert cursor-pointer' alt='gallery'/>
            <div className='flex flex-col text-sm'>
              <p> Credits:{user?.credits}</p>
              <p className='text-xs text-gray-400'>Purchase credits to use ChatFlow</p>
              </div>
          </div>
         
         {/* DARK MODE */}
         <div className='flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md '>
          <div className='flex item-center gap-2 text-sm'>
            <img src={assets.theme_icon} className='w-4.5  not-dark:invert cursor-pointer' alt=''/>
              <p>Drak Mode</p>
              </div>
              <label className="relative inline-flex cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={theme === 'dark'}
              onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
            <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all"></div>
             <span className="absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition-transform peer-checked:translate-x-4"></span>
              </label>
             
          </div>
          {/* User account */}
          
          <div  className='flex items-center gap-4 p-3 mt-3  border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 group transition-all'>
            <img src={assets.user_icon} className='w-7 rounded-full' alt=''/>
              <p className='flex-1 text-sm drak:text-primary truncate'>{user ? user.name :"Login your account"}</p>
             {user && <img src={assets.logout_icon} className='h-5  cursor-pointer hidden
              not-dark:invert group-hover:block'/>}
          </div>
          <img onClick={()=> setIsMenuOpen(false)} src={assets.close_icon} className='absolute top-8 right-5  w-6 h-6 cursor-pointer  md:hidden not-dark:invert' alt=''/>
    </div>
    
  )
}

export default SideBar
