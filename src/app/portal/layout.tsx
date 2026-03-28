'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  User, 
  LogOut, 
  Home,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (err) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', href: '/portal', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/portal/bookings', icon: Calendar },
    { name: 'Profile', href: '/portal/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b px-4 py-4 flex justify-between items-center">
        <span className="font-serif font-bold text-xl">Omakhair</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 transition-transform duration-200 ease-in-out
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white border-r flex flex-col
      `}>
        <div className="p-6 hidden md:block border-b">
          <span className="font-serif font-bold text-2xl tracking-tight">Omakhair</span>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-medium">Customer Portal</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-black text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'}
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t mt-auto">
          <div className="px-4 py-3 flex items-center mb-4 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs mr-3">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="truncate">
              <p className="text-sm font-bold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-black rounded-xl transition-all mb-1"
          >
            <Home className="w-5 h-5 mr-3" />
            <span className="font-medium">Home Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4 md:p-10 pb-24">
          {children}
        </div>
      </main>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
