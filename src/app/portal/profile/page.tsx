'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Scissors, 
  Heart,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    hairType: '',
    preferences: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        if (!user) throw new Error('Not logged in');

        // Get customer data
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${user.id}`, { // This might need updating if backend has a better /me endpoint
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            hairType: data.hairType || '',
            preferences: data.preferences || '',
          });
        }
      } catch (err) {
        setError('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        // Update local storage with new info
        const updatedUser = { ...user, firstName: formData.firstName, lastName: formData.lastName };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while saving profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-serif font-bold tracking-tight text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 text-lg">Update your information and style preferences.</p>
      </header>

      {success && (
        <div className="bg-green-50 p-6 rounded-3xl border border-green-100 flex items-center animate-in fade-in slide-in-from-top-4 duration-500">
          <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
          <p className="text-green-700 font-medium">Profile updated successfully!</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-center">
          <AlertCircle className="w-6 h-6 text-red-500 mr-4 flex-shrink-0" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        <section className="bg-white rounded-3xl p-8 md:p-10 border shadow-sm space-y-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-2.5 bg-gray-50 rounded-xl">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-50 border-gray-200 rounded-2xl focus:ring-black focus:border-black transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-50 border-gray-200 rounded-2xl focus:ring-black focus:border-black transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-4 py-3.5 bg-gray-100 border-gray-200 rounded-2xl text-gray-400 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-50 border-gray-200 rounded-2xl focus:ring-black focus:border-black transition-all"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-8 md:p-10 border shadow-sm space-y-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-2.5 bg-gray-50 rounded-xl">
              <Scissors className="w-5 h-5 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Hair & Style Preferences</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Hair Type</label>
              <input
                type="text"
                name="hairType"
                placeholder="e.g., 4C, Curly, Fine, Thick, Natural"
                value={formData.hairType}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-50 border-gray-200 rounded-2xl focus:ring-black focus:border-black transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Style Preferences & Notes</label>
              <textarea
                name="preferences"
                rows={4}
                placeholder="Share any details about your hair history, sensitivities, or preferred styles."
                value={formData.preferences}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-50 border-gray-200 rounded-2xl focus:ring-black focus:border-black transition-all"
              />
            </div>
          </div>
        </section>

        <div className="flex pt-6">
          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto px-12 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-all flex items-center justify-center shadow-lg"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
            ) : (
              <Save className="w-5 h-5 mr-3" />
            )}
            {saving ? 'Saving changes...' : 'Save Profile Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
