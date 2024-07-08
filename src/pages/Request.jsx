import React from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

const Request = () => {
  return (
    <div className="request">
      {/* Importing sidebar */}
      <Sidebar/>

      <div className="request-main">
        {/* Importing Topbar */}
        <Topbar/>
      </div>
    </div>
  )
}

export default Request
