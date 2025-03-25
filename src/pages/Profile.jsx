import React from 'react'
import Header from '../components/Header';

function Profile() {
  const title = "Company Profile"
  const description = "Update and manage your company profile details seamlessly."
  return (
    <div className='bg-gradient-to-r from-[#E9FAFF] to-[#EEF3F9] h-full'>
      <Header title={title} description={description} />
    </div>
  )
}

export default Profile