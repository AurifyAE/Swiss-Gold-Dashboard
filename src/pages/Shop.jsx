import React from 'react'
import Header from '../components/Header';

function Shop() {
  const title = "Product Management"
  const description = "Add, update, and manage your products with ease"
  return (
    <div className='bg-gradient-to-r from-[#E9FAFF] to-[#EEF3F9] h-full'>
      <Header title={title} description={description} />
    </div>
  )
}

export default Shop