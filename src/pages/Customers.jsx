import React from 'react'
import Header from '../components/Header';

function Customers() {
  const title = "Customer Management"
  const description = "Add, organize, and manage customers effortlessly"
  return (
    <div className='bg-gradient-to-r from-[#E9FAFF] to-[#EEF3F9] h-full'>
      <Header title={title} description={description} />
    </div>
  )
}

export default Customers