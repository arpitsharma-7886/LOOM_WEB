import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import useSearch from '../store/useSearch';
import { useNavigate } from 'react-router-dom';

const SearchModal = ({ isOpen, onClose }) => {
  const { query, results, loading, setQuery, search, clearSearch } = useSearch();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query.length >= 2) {
        search(query);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  if (!isOpen) return null;

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    onClose();
    clearSearch();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl mx-4">
        <div className="p-4 border-b flex items-center gap-2">
          <Search size={20} className="text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 outline-none text-lg"
          />
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <div className="divide-y">
              {results.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product._id)}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <img
                    src={product.images[0]?.url}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{product.title}</h3>
                    <p className="text-sm text-gray-500">₹{product.lowestSellingPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">No products found</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;