import React from 'react'
import Navbar from "../components/Navbar";

const RequestHistory = () => {
  return (
    <div className="h-screen w-screen">
      <Navbar />
      <div className="flex flex-col items-center h-[87.5vh]">
        <div className="w-[78%] p-8 gap-4 ml-5">
          <h1 className="font-medium text-2xl">History</h1>
          <p>You can view your request here.</p>
          <hr className="mt-4 border-2 border-blue-600" />
        </div>

        
          <div className="flex flex-col w-[78%]">
            <div className="flex flex-wrap gap-8 ml-9">
            <div className="flex flex-col bg-gray w-[48%] p-5 rounded-lg gap-4">
                  <h1 className="text-lg font-bold">Charger</h1>
                  
                  <div className='flex justify-between'>
                    <div className="flex flex-col gap-4">
                      <p className='font-medium'>Issued item:</p>
                      <p className='font-medium'>Quantity:</p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <p className='font-medium'>Requested for:</p>
                      <p className='font-medium'>Purpose:</p>
                    </div>
                    <div className="flex justify-center items-center">
                      Approved
                    </div>
                  </div>
                </div>

                <div className="flex flex-col bg-gray w-[48%] p-5 rounded-lg gap-4">
                  <h1 className="text-lg font-bold">Charger</h1>
                  
                  <div className='flex justify-between'>
                    <div className="flex flex-col gap-4">
                      <p className='font-medium'>Issued item:</p>
                      <p className='font-medium'>Quantity:</p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <p className='font-medium'>Requested for:</p>
                      <p className='font-medium'>Purpose:</p>
                    </div>
                    <div className="flex justify-center items-center">
                      Pending
                    </div>
                  </div>
                </div>

              </div>
            </div>
        
        </div>

    </div>
  )
}

export default RequestHistory
