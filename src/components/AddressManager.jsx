import React, { useState } from 'react';
import { Plus, MapPin, Edit2, Trash2 } from 'lucide-react';

const AddressManager = ({ addresses, selectedAddress, onAddressSelect, onAddNewClick, onEditAddress, onDeleteAddress }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Delivery Address</h2>
        <button
          onClick={onAddNewClick}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Plus size={20} />
          <span>Add New Address</span>
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No addresses saved yet</p>
          <p className="text-sm text-gray-400">Add a new address to proceed with checkout</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedAddress?.id === address.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => onAddressSelect(address)}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <input
                    type="radio"
                    checked={selectedAddress?.id === address.id}
                    onChange={() => onAddressSelect(address)}
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{address.fullName}</span>
                      {address.type && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                          {address.type}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{address.street}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.pincode}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Mobile: {address.phone}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditAddress(address);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAddress(address.id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressManager; 