import React from 'react'
import Navbar from '../components/Navbar'
import resource from "../assets/person.png"

const UserHome = () => {
    return (
        <>
            <Navbar />
            <div>
                {/* resource image */}
                <div className='flex justify-center w-screen h-[70vh] flex-col items-center'>
                    <img src={resource} alt="" className='max-w-xl' />
                    <p className='text-7xl font-semibold'>Find Resources For You</p>
                    <p className='text-xl py-5 font-medium'>One stop for all your needs</p>
                    <button className='bg-blue-700 font-normal px-10 py-4 rounded-md text-xl text-white'>Request Now</button>
                </div>
            </div>
        </>
    )
}

export default UserHome
