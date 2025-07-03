import reactLogo from "../assets/react.svg";

function Header() {
  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto">
          <a href="http://localhost:5173" className="flex items-center">
            <img
              src={reactLogo}
              className="mr-3 h-6 sm:h-9"
              alt="Flowbite Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              HMS
            </span>
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
