import React from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const kpis = [
    {
      title: 'Leads este Mes',
      value: '0',
      icon: TrendingUp,
      color: 'blue',
      trend: 'up'
    },
    {
      title: 'Tasa de Conversión',
      value: '0%',
      icon: Activity,
      color: 'orange',
      trend: 'neutral'
    },
    {
      title: 'Clientes Activos',
      value: '0',
      icon: Users,
      color: 'green',
      trend: 'up'
    },
    {
      title: 'Clientes Inactivos',
      value: '0',
      icon: Users,
      color: 'gray',
      trend: 'neutral'
    },
    {
      title: 'Pipeline de Ingresos',
      value: '$1.5k',
      icon: DollarSign,
      color: 'green',
      trend: 'up'
    },
    {
      title: 'Valor de Leads Clientes',
      value: '$0.0k',
      icon: TrendingDown,
      color: 'red',
      trend: 'down'
    }
  ];

  const chartData = [
    { month: 'Abr', value: 0 },
    { month: 'May', value: 0 },
    { month: 'Jun', value: 0 },
    { month: 'Jul', value: 0 },
    { month: 'Ago', value: 40 },
    { month: 'Sep', value: 0 }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      orange: 'bg-orange-100 text-orange-600',
      green: 'bg-green-100 text-green-600',
      gray: 'bg-gray-100 text-gray-600',
      red: 'bg-red-100 text-red-600'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Aquí tienes un resumen en tiempo real del rendimiento de tu marketing y ventas.</p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-600 font-medium">{kpi.title}</h3>
                <div className={`p-2 rounded-lg ${getColorClasses(kpi.color)}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-800">{kpi.value}</span>
                {kpi.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                {kpi.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leads por Origen */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Leads por Origen</h3>
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full mb-4 mx-auto flex items-center justify-center">
                <span className="text-gray-400">No hay datos</span>
              </div>
              <p className="text-gray-500">Sin leads registrados</p>
            </div>
          </div>
        </div>

        {/* Nuevos Leads en los Últimos 6 Meses */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Nuevos Leads en los Últimos 6 Meses</h3>
          <div className="h-48">
            <div className="flex items-end justify-between h-full px-4">
              {chartData.map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div 
                    className={`w-8 rounded-t ${data.value > 0 ? 'bg-teal-500' : 'bg-gray-200'}`}
                    style={{ height: `${Math.max(data.value * 2, 8)}px` }}
                  ></div>
                  <span className="text-xs text-gray-500">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500">Leads generados por mes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;