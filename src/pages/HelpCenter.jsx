import React from 'react'
import Header from '../components/Header';

function HelpCenter() {
  const title = "Support"
  const description = "Contact us to get any assistance"
  return (
    <div className='bg-gradient-to-r from-[#E9FAFF] to-[#EEF3F9] h-full'>
      <Header title={title} description={description} />
    </div>
  )
}

export default HelpCenter