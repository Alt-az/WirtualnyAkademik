import Navbar from "./components/Navbar";
import {Outlet} from "react-router-dom";

export const RootLayout = () => {
  return (
      <>
        <Navbar/>
        <main id={"content"}>
          <Outlet/>
        </main>
      </>
  );
};