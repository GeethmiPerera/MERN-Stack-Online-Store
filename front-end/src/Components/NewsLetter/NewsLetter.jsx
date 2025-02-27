import React from 'react'
import './NewsLetter.css'

export const NewsLetter = () => {
  return (
    <div className='newsLetter'>
        <h1>Get Exclusive Ofers On Your Email</h1>
        <p>Subscribe to our newletter and stay updated</p>
        <div>
            <input type="email" placeholder='Your email id' />
            <button>Subscribe</button>
        </div>

    </div>
  )
}
