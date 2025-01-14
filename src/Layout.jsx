import { Outlet } from "react-router-dom";
import Header from "./components/common/Header";

const Layout = () => {
  return (
    <div>
      <div className="grid-bg"></div>
      <main className="min-h-screen container w-full mx-auto p-5">
        <Header />
        <Outlet />
      </main>
      <div className="border-t border-white border-opacity-30 w-full lg:w-[90%] mx-auto">
        <footer className="text-center py-5">
          <h3 className="text-lg md:text-xl font-semibold">
            Made with 💛 by{" "}
            <a
              href="http://x.com/@ola_the_dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline italic"
            >
              ola_the_dev
            </a>{" "}
            | &copy; {new Date().getFullYear()}
          </h3>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
