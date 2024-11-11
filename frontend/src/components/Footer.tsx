import React from 'react';

const Footer = () => {
  return (
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h5 className="font-bold">Kontakt</h5>
            <p>Email: contact@example.com</p>
            <p>Telefon: +123 456 7890</p>
          </div>
          <div>
            <h5 className="font-bold">Adres</h5>
            <p>aleje Politechniki 3B</p>
            <p>Łódź, Polska</p>
          </div>
          <div>
            <h5 className="font-bold">Zaobserwuj</h5>
            <p>Facebook | Instagram</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
