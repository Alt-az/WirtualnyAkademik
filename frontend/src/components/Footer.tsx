import React from 'react';

const Footer = () => {
  return (
      <footer className="bg-gradient-to-r from-gray-800 to-gray-800 text-gray-400 py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 px-4 text-sm">
          {/* Contact Section */}
          <div className="text-center md:text-left">
            <p>
              <span className="font-medium text-gray-300">Kontakt:</span>
              <a href="mailto:contact@example.com" className="hover:text-blue-400 ml-1">contact@example.com</a>
            </p>
            <p>
              <span className="font-medium text-gray-300">Telefon:</span>
              <a href="tel:+1234567890" className="hover:text-blue-400 ml-1">+123 456 7890</a>
            </p>
          </div>

          {/* Address Section */}
          <div className="text-center md:text-left">
            <p>
              <span className="font-medium text-gray-300">Adres: </span>
              aleje Politechniki 3B, Łódź, Polska
            </p>
          </div>

          {/* Follow Us Section */}
          <div className="text-center md:text-left">
            <p>
              <span className="font-medium text-gray-300">Zaobserwuj:</span>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 ml-1">Facebook</a>{" "}
              |{" "}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400">Instagram</a>
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        {/*<div className="mt-2 border-t border-gray-600 pt-2 text-center text-xs text-gray-500">*/}
        {/*  &copy; {new Date().getFullYear()} Politechnika Łódzka. Wszelkie prawa zastrzeżone.*/}
        {/*</div>*/}
      </footer>
  );
};

export default Footer;
