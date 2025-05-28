import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  ChevronRight,
  Edit,
  Phone,
  Mail,
  MapPin,
  X
} from 'lucide-react';
import useAuth from '../store/useAuth';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import MainTemplate from '../components/MainTemplate';

const Account = () => {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.patch(
        'http://192.168.29.92:3004/auth_user/user/update_profile',
        formData,
        {
          headers: {
            'accessToken': token
          }
        }
      );

      if (response.data.success) {
        updateUser(response.data.data);
        toast.success('Profile updated successfully');
        setIsModalOpen(false);
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      title: 'Profile Settings',
      icon: <User className="w-5 h-5" />,
      onClick: () => navigate('/profile-settings'),
      color: 'text-blue-500'
    },
    {
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      onClick: () => navigate('/notifications'),
      color: 'text-purple-500'
    },
    {
      title: 'Security',
      icon: <Shield className="w-5 h-5" />,
      onClick: () => navigate('/security'),
      color: 'text-green-500'
    },
    {
      title: 'Help & Support',
      icon: <HelpCircle className="w-5 h-5" />,
      onClick: () => navigate('/support'),
      color: 'text-orange-500'
    }
  ];

  return (
    <MainTemplate>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-800">Account</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{user?.name || 'User'}</h2>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">+91 {user?.phoneNumber}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">{user?.email || 'Not set'}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Location not set</span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-50 ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className="text-gray-700 font-medium">{item.title}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full mt-8 flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-4 rounded-xl font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-5 h-5" />
            <span>{loading ? 'Logging out...' : 'Logout'}</span>
          </button>

          {/* App Version */}
          <p className="text-center text-gray-400 text-sm mt-8">
            Version 1.0.0
          </p>

          {/* Profile Update Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Update Profile</h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainTemplate>
  );
};

export default Account; 