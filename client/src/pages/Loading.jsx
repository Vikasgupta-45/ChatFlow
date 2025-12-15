import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';



export const Loading = () => {
    const navigate = useNavigate();
    useEffect(()=>{
        const timeout = setTimeout(()=>{
            navigate('/');
        },5000)
        return ()=>clearTimeout(timeout);
    },[])
  return (
    <div className='bg-gradient-to-b from-[#531881] to-[#291848] backdrop-opacity-60 flex items-center justify-center h-screen w-screen text-white text-2x1'>
        <div className='w-10 h-10 rounded-full border-3 border-white border-t-transparent animate-spin'>

        </div>
     </div>
  )
}
export default Loading