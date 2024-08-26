import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <Link to="/" className="block py-2 px-4 hover:bg-blue-700">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/categories"
                className="block py-2 px-4 hover:bg-blue-700">
                Categories
              </Link>
            </li>
            <li>
              <Link
                to="/add-category"
                className="block py-2 px-4 hover:bg-blue-700">
                Add Category
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="block py-2 px-4 hover:bg-blue-700">
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/add-product"
                className="block py-2 px-4 hover:bg-blue-700">
                Add Product
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-400">
              Logout
            </button>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Dashboard;
