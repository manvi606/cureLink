import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  // ✅ Generate available time slots for next 7 days
  const getAvailableSlot = async () => {
    setDocSlots([])
    let today = new Date()

    for (let i = 0; i < 7; i++) {
      let curr = new Date(today)
      curr.setDate(today.getDate() + i)

      let endtime = new Date(curr)
      endtime.setHours(21, 0, 0, 0)

      if (today.getDate() === curr.getDate()) {
        curr.setHours(curr.getHours() > 10 ? curr.getHours() + 1 : 10)
        curr.setMinutes(curr.getMinutes() > 30 ? 30 : 0)
      } else {
        curr.setHours(10)
        curr.setMinutes(0)
      }

      let timeSlots = []
      while (curr < endtime) {
        let format = curr.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        timeSlots.push({
          datetime: new Date(curr),
          time: format
        })
        curr.setMinutes(curr.getMinutes() + 30)
      }

      setDocSlots(prev => [...prev, timeSlots])
    }
  }

  useEffect(() => {
    const doctor = doctors.find(doc => doc._id === docId)
    setDocInfo(doctor)
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) getAvailableSlot()
  }, [docInfo])

  if (!docInfo) return <p>Loading...</p>

  return (
    <div className='mt-10'>
      <div className='flex flex-col sm:flex-row gap-4'>
        {/* Doctor Image */}
        <div className="flex gap-4 items-center">
          <img
            className='bg-primary w-full sm:max-w-72 rounded-lg'
            src={docInfo.image}
            alt={docInfo.name}
          />
        </div>

        {/* Doctor Details */}
        <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="Verified" />
          </p>

          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>
              {docInfo.experience}
            </button>
          </div>

          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>
              About
              <img src={assets.info_icon} alt="Info" className="inline w-4 h-4" />
            </p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>

          <p className='text-gray-600 font-medium mt-4'>
            Appointment fee: <span className='text-gray-800'>
              {currencySymbol}{docInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* Booking Slots Section */}
      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
        <p>Booking slots</p>

        {/* Date Selector */}
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots.length > 0 && docSlots.map((item, index) => (
            <div
              key={index}
              onClick={() => { setSlotIndex(index); setSlotTime('') }}
              className={`text-center py-4 px-3 min-w-16 rounded-full cursor-pointer transition-all ${
                slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200 text-gray-700'
              }`}
            >
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        {/* Available Times */}
        <div className="mt-6">
          <p className="font-medium mb-2 text-gray-700">Available Times:</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {docSlots[slotIndex]?.map((slot, idx) => (
              <button
                key={idx}
                onClick={() => setSlotTime(slot.time)}
                className={`border px-2 py-1 rounded text-sm transition-all ${
                  slotTime === slot.time
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              className='text-sm font-light px-20 py-3 rounded-full my-6 transition-all duration-300 bg-primary text-white hover:bg-blue-600 
                cursor-pointer'
            >
              Book an appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Appointment
