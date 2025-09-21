import React from 'react';
import { BarChart3, Users, Building2, Bot, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type ViewType = 'dashboard' | 'contactos' | 'empresas' | 'asistente';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'contactos', label: 'Contactos', icon: Users },
    { id: 'empresas', label: 'Empresas', icon: Building2 },
    { id: 'asistente', label: 'Asistente IA', icon: Bot },
  ];

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
    }
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-100 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <img 
            src="https://i.postimg.cc/5y2ybnrY/imagen-2025-09-21-090313816.png" 
            alt="CRCUSA Logo" 
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h1 className="text-lg font-bold text-gray-800">Chamber of Commerce</h1>
            <p className="text-sm text-gray-600">USA/CR</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-1">Business Management System</p>
        <p className="text-xs text-gray-500">Usuario: {user?.email}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id as ViewType)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    currentView === item.id
                      ? 'bg-teal-500 text-white border-l-4 border-teal-600'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;