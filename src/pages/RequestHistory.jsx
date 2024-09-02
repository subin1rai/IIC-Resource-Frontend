import React from 'react'
import Navbar from "../components/Navbar";

const RequestHistory = () => {
  return (
    <div className="h-screen w-screen">
      <Navbar />
      <div className="flex flex-col items-center h-[87.5vh]">
        
        <div className="w-[80%] p-8 gap-3">
          <h1 className="font-medium text-2xl">History</h1>
          <p>You can view your request here.</p>
          <hr className="mt-4 border-2 border-blue-600" />
        </div>
        
        
        <div className="flex flex-col w-[80%] justify-between">
          <div className="flex flex-col bg-gray w-[50%] p-5 rounded-lg ml-8 gap-4">
            <h1 className="text-lg font-bold">Charger</h1>
                <div className='flex flex-col gap-4'>
                  <p className='font-medium'>Issued item:</p>
                  <p className='font-medium'>Quantity:</p>
                </div>

                <div className='flex flex-col gap-4'>
                  <p className='font-medium'>Requested For:</p>
                  <p className='font-medium'>Purpose:</p>
                </div>
            </div>


            <div className="flex flex-col bg-gray w-[50%] p-5 rounded-lg ml-8 gap-4">
            <h1 className="text-lg font-bold">Charger</h1>
                <div className='flex flex-col gap-4'>
                  <p className='font-medium'>Issued item:</p>
                  <p className='font-medium'>Quantity:</p>
                </div>

                <div className='flex flex-col gap-4'>
                  <p className='font-medium'>Requested For:</p>
                  <p className='font-medium'>Purpose:</p>
                </div>
            </div>
            </div>
        
        
        </div>

    </div>
  )
}

export default RequestHistory
