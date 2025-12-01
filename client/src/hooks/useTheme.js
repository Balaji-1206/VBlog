import { useEffect, useState } from 'react'

const KEY = 'vblog_theme'
const DEFAULT = 'dark'

export function useTheme(){
  const [theme, setTheme] = useState(DEFAULT)

  useEffect(()=>{
    try{
      const saved = localStorage.getItem(KEY)
      if (saved) setTheme(saved)
    }catch{}
  },[])

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme)
    try{ localStorage.setItem(KEY, theme) }catch{}
  }, [theme])

  function toggle(){
    setTheme((t)=> t==='dark' ? 'aurora' : 'dark')
  }

  return { theme, toggle }
}
