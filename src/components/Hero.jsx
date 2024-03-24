import React from 'react'
import { logo } from '../assets'

const Hero = () => {
  return (
    <header className='w-full flex justify-center items-center flex-col'>
        <nav className='flex justify-between items-center w-full mb-10 pt-3'>
           <span className='w-28 object-contain kaizen-logo'>&nbsp;&nbsp;改善 <span className='orange_gradient'> KAIZEN</span></span>
            <button
                type="button"  
                onClick={() => {}}  
                className='black_btn'
            >
                Signup
            </button>
        </nav>

        <h1 className='head_text'>
            Understand Lectures like <br className='max-md:hidden' />
            <span className='orange_gradient'>Magic</span>
        </h1>
        <h2 className='desc'>
            Summarize and generate recommended videos based on the input videos
        </h2>
    </header>
  )
}

export default Hero