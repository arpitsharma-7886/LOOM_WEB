import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ShopByCategories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();


  const fetchCategories = async () => {
    const response = await axios.get('https://product-api.compactindiasolutions.com/product/admin/cat_sub/get_sucategories_user');
    const data = response?.data;


    if (data?.success) {
      setCategories(data?.data?.subcategories)
    }
  }

  useEffect(() => {
    fetchCategories();
  }, [])

  const handleCategory = (category) => {
    navigate(`/sub-category/${category?.name}/${category?._id}`)
  }

  return (
    <section className="py-10 bg-white">
      <h2 className="text-3xl font-bold text-center mb-10">FEATURED CATEGORIES</h2>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-md cursor-pointer"
              onClick={() => { handleCategory(category) }}
            >
              {/* Image with zoom effect */}
              <img
                src={category?.image}
                alt={category?.name}
                className="w-full h-[200px] object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay title */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center py-2 font-bold text-sm tracking-wide">
                {category?.name?.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ShopByCategories;
