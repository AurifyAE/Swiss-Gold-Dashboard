import React from 'react'
import Header from '../components/Header';

function Orders() {
  const title = "Order Management"
  const description = "Track, manage, and update your orders effortlessly in one place"
  return (
    <div className='bg-gradient-to-r from-[#E9FAFF] to-[#EEF3F9] h-full'>
      <Header title={title} description={description} />
    </div>
  )
}

export default Orders