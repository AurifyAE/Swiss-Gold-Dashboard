import React from 'react'
import Header from '../components/Header';

function Bank() {
  const title = "Bank Details"
  const description = "Update and manage your company bank details here."
  return (
    <div className='bg-gradient-to-r from-[#E9FAFF] to-[#EEF3F9] h-full'>
      <Header title={title} description={description} />
    </div>
  )
}

export default Bank