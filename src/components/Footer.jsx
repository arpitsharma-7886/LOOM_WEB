import React from 'react';
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#181818] text-white text-sm">
      {/* Main Row */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-wrap md:flex-nowrap justify-between border-b border-gray-700 gap-8">
        
        {/* Column 1: About */}
        <div className="min-w-[150px]">
          <h3 className="font-semibold mb-3 text-gray-400">ABOUT</h3>
          <ul className="space-y-1">
            <li>Contact Us</li>
            <li>About Us</li>
            <li>Careers</li>
            <li>Flipkart Stories</li>
            <li>Press</li>
            <li>Corporate Information</li>
          </ul>
        </div>

        {/* Column 2: Help */}
        <div className="min-w-[150px]">
          <h3 className="font-semibold mb-3 text-gray-400">HELP</h3>
          <ul className="space-y-1">
            <li>Payments</li>
            <li>Shipping</li>
            <li>Cancellation & Returns</li>
            <li>FAQ</li>
          </ul>
        </div>

        {/* Column 3: Consumer Policy */}
        <div className="min-w-[180px]">
          <h3 className="font-semibold mb-3 text-gray-400">CONSUMER POLICY</h3>
          <ul className="space-y-1">
            <li>Cancellation & Returns</li>
            <li>Terms Of Use</li>
            <li>Security</li>
            <li>Privacy</li>
            <li>Sitemap</li>
            <li>Grievance Redressal</li>
            <li>EPR Compliance</li>
          </ul>
        </div>

        {/* Vertical Divider */}
        <div className="w-px bg-gray-600 hidden md:block h-auto mx-2" />

        {/* Column 4: Mail Us & Social */}
        <div className="min-w-[250px]">
          <h3 className="font-semibold mb-3 text-gray-400">Mail Us:</h3>
          <p className="mb-4 text-sm">
            Flipkart Internet Private Limited,<br />
            Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli Village,<br />
            Bengaluru, 560103, Karnataka, India
          </p>
          <h3 className="font-semibold mb-3 text-gray-400">Social:</h3>
          <div className="flex space-x-4 text-xl">
            <FaFacebookF />
            <FaTwitter />
            <FaYoutube />
            <FaInstagram />
          </div>
        </div>

        {/* Column 5: Registered Address */}
        <div className="min-w-[250px]">
          <h3 className="font-semibold mb-3 text-gray-400">Registered Office Address:</h3>
          <p className="text-sm">
            Flipkart Internet Private Limited,<br />
            Buildings Alyssa, Begonia &<br />
            Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli Village,<br />
            Bengaluru, 560103, Karnataka, India<br />
            CIN : U51109KA2012PTC066107<br />
            Telephone: <span className="text-blue-400">044-45614700 / 044-67415800</span>
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-gray-400 text-xs">
        <div className="flex flex-wrap gap-4 mb-2 md:mb-0">
          <span className="flex items-center gap-1">🛒 Become a Seller</span>
          <span className="flex items-center gap-1">📢 Advertise</span>
          <span className="flex items-center gap-1">🎁 Gift Cards</span>
          <span className="flex items-center gap-1">❓ Help Center</span>
        </div>
        <div>© 2007–2025 Flipkart.com</div>
      </div>
    </footer>
  );
};

export default Footer;
