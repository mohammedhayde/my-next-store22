import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>
      <nav className="mt-4">
        <ul>
          <li>
            <Link href="/dashboard">
              <a className="block p-4 text-gray-700">Dashboard</a>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/users">
              <a className="block p-4 text-gray-700">Users</a>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/products">
              <a className="block p-4 text-gray-700">Products</a>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/categories">
              <a className="block p-4 text-gray-700">Categories</a>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/orders">
              <a className="block p-4 text-gray-700">Orders</a>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/settings">
              <a className="block p-4 text-gray-700">Settings</a>
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <a className="block p-4 text-gray-700">Profile</a>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
