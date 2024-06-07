const Header = () => {
    return (
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">My Dashboard</h1>
        <div>
          <button className="bg-blue-500 text-white p-2 rounded">Logout</button>
        </div>
      </header>
    );
  };
  
  export default Header;
  