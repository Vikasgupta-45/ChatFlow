import React, { useState } from 'react'
import SideBar from './components/SideBar.jsx'
import { Route,Routes ,useLocation} from 'react-router-dom';
import ChatBox from './components/ChatBox.jsx';
import Credits from './pages/Credits.jsx';
import Community from './pages/Community.jsx';
import { assets } from './assets/assets';
import './assets/prism.css'
import { Loading } from './pages/Loading.jsx';
import Login from './pages/Login.jsx';
import { useAppContext } from './context/AppContext.jsx';



const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {pathname} = useLocation();
  const { user } = useAppContext();
  if(pathname === '/loading'){
    return <Loading />
  }
  return (
    <>
    { !isMenuOpen && (
      <img
        src={assets.menu_icon}
        alt="open menu"
        className='absolute top-3 left-10 w-8 h-8 cursor-pointer not-dark:invert'
        onClick={()=>setIsMenuOpen(true)}
      />
    )}
    {user?(
       <div className="
      bg-white text-black
      dark:bg-gradient-to-b dark:from-[#242124] dark:to-[#000000]
      dark:text-white
      h-screen w-screen
    ">
      <div className="flex h-full w-full">
        <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
        <Routes>
          <Route path='/' element={<ChatBox />} />
          <Route path='/credits' element={<Credits />} />
          <Route path='/community' element={<Community />} />
        </Routes>
      </div>
    </div>
    ):(
      <div className="h-screen w-screen flex items-center justify-center">
        <Login />
      </div>
      
    )}
   
    </>
  );
};


export default App
