import { Boxes, FileText } from 'lucide-react';
import React, { useState } from 'react'

export default function AddDept() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState({});
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState(false);

  const add = () => {

  }

  return (
    <div className='flex justify-center items-center mt-20 sm:mt-25'>
        <div className='bg-lightBlue/60 border-2 border-zinc-600 w-fit flex flex-col items-center justify-center px-5 sm:px-10 py-10 rounded-2xl'>
        <h2 className='mb-8 font-semibold text-xl'>
          Add departement
        </h2>
        <div className='text-base sm:text-[17px] w-3xs sm:w-xs mb-4'>
          {/* relative: This makes the container a reference point for absolutely positioning elements inside it. */}
          <div className="relative mb-2">
            {/* 
                *top-1/2 sets the top edge of the icon to 50% of the height of its container.
                *But that puts the top edge in the middle — so the icon appears slightly lower than centered.
                *-translate-y-1/2 shifts the icon up by 50% of its own height, which repositions it to be truly centered.
                * the first - in translate mean negative
             */}
            <>
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <Boxes size={20} />
              </span>
              <input 
                placeholder='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-2xl bg-zinc-200 border-gray-700 w-full"
              />
            </>
          </div>
          <p className='pl-5 text-red-700'>
            {error.name}
          </p>
        </div>
        <div className='text-base text-[17px] w-3xs sm:w-xs mb-10'>
          <div className="relative  mb-2">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              <FileText size={20} />
            </span>
            <textarea 
              placeholder='desc'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-2xl bg-zinc-200 border-gray-700 w-full"
            />
          </div>
        </div>
        <p className={`mb-5 text-base font-semibold ${statusMessage ? 'text-darkBlue' : 'text-red-600'}`}>
          {message}
        </p>
        <button className='text-base sm:text-lg font-semibold bg-mediumBlue w-3xs sm:w-xs py-2 text-white rounded-xl mb-2 cursor-pointer hover:bg-darkBlue'
          onClick={add}
        >
          Add
        </button>
      </div>
    </div>
  )
}
