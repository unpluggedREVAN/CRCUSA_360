import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Contactos from './components/Contactos';
import Empresas from './components/Empresas';

type ViewType = 'dashboard' | 'contactos' | 'empresas' | 'asistente';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'contactos':
        return <Contactos />;
      case 'empresas':
        return <Empresas />;
      case 'asistente':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Asistente IA</h2>
              <p className="text-gray-500">Funcionalidad en desarrollo...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 ml-64">
        {renderCurrentView()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute fallback={<Login />}>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;