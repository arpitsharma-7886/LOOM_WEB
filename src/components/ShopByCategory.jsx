import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ShopByCategories = () => {
  const [categories, setCategories] = useState([]);
  console.log(categories, "categories");


  const fetchCategories = async () => {
    const response = await axios.get('https://u6dwgkszzd.ap-south-1.awsapprunner.com/v3/home/featured-category/?platform=web');
    setCategories(response?.data)
  }

  useEffect(() => {
    fetchCategories();
  }, [])

  return (
    <section className="py-10 bg-white">
      <h2 className="text-3xl font-bold text-center mb-10">FEATURED CATEGORIES</h2>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-md cursor-pointer"
            >
              {/* Image with zoom effect */}
              <img
                src={category?.media_url}
                alt={category?.collection_name}
                className="w-full h-[200px] object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay title */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center py-2 font-bold text-sm tracking-wide">
                {category?.collection_name?.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ShopByCategories;
