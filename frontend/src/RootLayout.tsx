import Navbar from "./components/Navbar";
import {Outlet} from "react-router-dom";
import Footer from "./components/Footer.tsx";
import './styles.css'

export const RootLayout = () => {
  return (
      <div className="root-layout">
        <Navbar/>
        <main id={"content"} className="content">
          <Outlet/>
        </main>
        <Footer />
      </div>
  );
};