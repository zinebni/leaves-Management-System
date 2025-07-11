import React, { useEffect, useState } from 'react'
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";

export default function DarkMode() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const element = document.documentElement // html element

  useEffect(() => {
    theme === 'dark' ? element.classList.add('dark') : element.classList.remove('dark');
  }, [theme]);

  const changeMode = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  return (
    <div className='text-2xl cursor-pointer'
          onClick={changeMode}
    >
      {
        theme === 'light' ?
        <MdDarkMode/> :
        <MdLightMode />
      }
    </div>
    
  )
}
