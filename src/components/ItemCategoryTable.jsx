import React from 'react'
import edit from "../assets/editIcon.svg"

const ItemCategoryTable = ({ itemCategory }) => {
  console.log(itemCategory)
  return (

    <div className='flex flex-col bg-white items-center pb-4 rounded-b-md'>

      {
        itemCategory.map((iCat) => (
          <div className='w-full flex flex-col items-center'>
            <div className='w-[80%] py-4'>
              <div className='flex w-full justify-between '>
                <p className='text-lg'>{iCat.item_category_name}</p>
                <img src={edit} alt="" className='h-5 w-5' />
              </div>
            </div>
            <hr className='h-1 w-[85%] border-button' />
          </div>
        ))
      }
    </div>
  )
}

export default ItemCategoryTable
