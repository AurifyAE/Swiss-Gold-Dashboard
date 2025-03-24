import React from 'react'
import Header from '../components/Header';
import StatisticsPanel from "../components/StatisticsPanel"

function Dashboard() {
  const title = "Dashboard"
  const description = "Overview information about your store"
  return (
    <div className='bg-gradient-to-r from-[#E9FAFF] to-[#EEF3F9] h-full'>
      <Header title={title} description={description} />
      <StatisticsPanel/>
    </div>
  )
}

export default Dashboard