import React, { useState, useEffect } from "react";
import axios from "axios";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    axios
      .get("http://localhost:8000/categories") // Adjust URL if necessary
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleAddCategory = (e) => {
    e.preventDefault();

    // Prepare data to send to the backend
    const categoryData = {
      name,
      isActive,
    };

    axios
      .post("http://localhost:8000/categories", categoryData) // Adjust URL if necessary
      .then((response) => {
        setCategories([...categories, response.data]); // Add new category to list
        setName(""); // Clear the form
        setIsActive(true); // Reset the checkbox
      })
      .catch((error) => console.error("Error adding category:", error));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Category Manager</h1>

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium">Category Name</label>
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Active</label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
            className="mr-2"
          />
          Active
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Category
        </button>
      </form>

      {/* Display Categories */}
      <h2 className="text-xl font-bold">Categories</h2>
      <ul className="list-disc pl-5">
        {categories.map((category) => (
          <li key={category.id} className="mb-2">
            <span className="font-semibold">{category.name}</span> -{" "}
            <span
              className={category.isActive ? "text-green-500" : "text-red-500"}>
              {category.isActive ? "Active" : "Inactive"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;
