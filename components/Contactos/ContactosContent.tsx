'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactoForm } from './ContactoForm';

// Datos ficticios
const contactosFicticios = [
  {
    id: 1,
    nombre: 'María González',
    correo: 'maria.gonzalez@empresa.com',
    telefono: '+1 (555) 123-4567',
    empresa: 'Tech Solutions SA'
  },
  {
    id: 2,
    nombre: 'Carlos Rodríguez',
    correo: 'carlos.rodriguez@commerce.com',
    telefono: '+1 (555) 234-5678',
    empresa: 'Commerce Group'
  },
  {
    id: 3,
    nombre: 'Ana Martínez',
    correo: 'ana.martinez@innovations.com',
    telefono: '+1 (555) 345-6789',
    empresa: 'Innovation Labs'
  },
  {
    id: 4,
    nombre: 'Luis Herrera',
    correo: 'luis.herrera@consulting.com',
    telefono: '+1 (555) 456-7890',
    empresa: 'Business Consulting'
  },
];

export function ContactosContent() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContactos = contactosFicticios.filter(contacto =>
    contacto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contacto.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contacto.empresa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contactos</h1>
          <p className="text-sm text-gray-500">Gestiona los contactos de la cámara de comercio</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Contacto
        </Button>
      </div>

      {/* Search bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, email o empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contactos table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Contactos ({filteredContactos.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Nombre</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Correo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Teléfono</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Empresa</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredContactos.map((contacto) => (
                  <tr key={contacto.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{contacto.nombre}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {contacto.correo}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {contacto.telefono}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{contacto.empresa}</td>
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
        <ContactoForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}