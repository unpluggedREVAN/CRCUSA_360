'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmpresaForm } from './EmpresaForm';



export function EmpresasContent() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmpresas = empresasFicticias.filter(empresa =>
    empresa.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empresas</h1>
          <p className="text-sm text-gray-500">Gestiona las empresas afiliadas a la cámara de comercio</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Empresa
        </Button>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Empresas</p>
                <p className="text-2xl font-bold text-gray-900">{empresasFicticias.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Activas</p>
                <p className="text-2xl font-bold text-gray-900">{empresasFicticias.filter(e => e.estado === 'Activa').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Ciudades</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Building2 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Empleados Total</p>
                <p className="text-2xl font-bold text-gray-900">{empresasFicticias.reduce((acc, emp) => acc + emp.empleados, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por razón social, sector o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Empresas table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Empresas ({filteredEmpresas.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Razón Social</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Sector</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Ciudad</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Empleados</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmpresas.map((empresa) => (
                  <tr key={empresa.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="font-medium text-gray-900">{empresa.razonSocial}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{empresa.sector}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {empresa.ciudad}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{empresa.empleados}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {empresa.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="p-2">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="p-2 text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Form modal */}
      {showForm && (
        <EmpresaForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}