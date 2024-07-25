import React from 'react'
import Navbar from '../components/Navbar'
import resource from "../assets/person.png"
import {Link} from "react-router-dom"

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
                    <Link to="/userRequest">
                    {/* request button */}
                        <button className='bg-blue-700 font-normal px-10 py-4 rounded-md text-xl text-white'>Request Now</button>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default UserHome
