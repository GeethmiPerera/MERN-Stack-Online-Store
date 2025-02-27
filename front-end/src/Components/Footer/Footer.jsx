import React from 'react'
import './Footer.css'
import footer_logo from '../Assests/logo_big.png'
import instergram_icon from '../Assests/instagram_icon.png'
import pintester_icon from '../Assests/pintester_icon.png'
import whatspp_icon from '../Assests/whatsapp_icon.png'

export const Footer = () => {
  return (
    <div className='footer'>
        <div className="footer-logo">
            <img src={footer_logo } alt="" />
            <p>SHOPPER</p>
        </div>
        <ul className="footer-links">
            <li>Company</li>
            <li>Products</li>
            <li>Offices</li>
            <li>About</li>
            <li>Contact</li>
        </ul>
        <div className="footer-social-icon">
             <div className="footer-icons-container">
                <img src={instergram_icon} alt="" />
             </div>
             <div className="footer-icons-container">
                <img src={pintester_icon} alt="" />
             </div>
             <div className="footer-icons-container">
                <img src={whatspp_icon} alt="" />
             </div>
        </div>
        <div className="footer-copywrite">
            <hr />
            <p>Copyright @ 2024 -All Right Recerved.</p>
        </div>

    </div>
  )
}
