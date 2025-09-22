'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Search,
  Filter,
  Building2,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

// Mock data for affiliates
const mockAffiliates = [
  {
    id: '1',
    name: 'Luis Bolaños',
    email: 'luis@landocean.com',
    phone: '(920) 626-3063',
    company: 'Land & Ocean Costa Rican Restaurant',
    companyId: '1',
    status: 'Activo',
    conversionDate: '2024-03-15',
    originalLead: 'Lead #001',
    convertedBy: 'admin@crcusa.com',
    createdAt: '2024-03-15',
    updatedAt: '2024-09-21',
    owner: 'admin@crcusa.com'
  },
  {
    id: '2',
    name: 'Jorge Arturo Barahona',
    email: 'jorge@tacanes.com',
    phone: '(973) 787-4200',
    company: 'Tacanes Restaurant',
    companyId: '2',
    status: 'Activo',
    conversionDate: '2024-02-20',
    originalLead: 'Lead #002',
    convertedBy: 'admin@crcusa.com',
    createdAt: '2024-02-20',
    updatedAt: '2024-09-21',
    owner: 'admin@crcusa.com'
  },
  {
    id: '3',
    name: 'Byron Gómez',
    email: 'byron@pollotico.com',
    phone: '(720) 343-7757',
    company: 'Pollo Tico',
    companyId: '3',
    status: 'Inactivo',
    conversionDate: '2024-01-10',
    originalLead: 'Lead #003',
    convertedBy: 'manager@crcusa.com',
    createdAt: '2024-01-10',
    updatedAt: '2024-08-15',
    owner: 'manager@crcusa.com'
  },
  {
    id: '4',
    name: 'Miriam Cerdas',
    email: 'miriam@irazu.com',
    phone: '(773) 252-5067',
    company: 'Irazu Costa Rican Restaurant',
    companyId: '6',
    status: 'Suspendido',
    conversionDate: '2023-12-05',
    originalLead: 'Lead #006',
    convertedBy: 'admin@crcusa.com',
    createdAt: '2023-12-05',
    updatedAt: '2024-07-20',
    owner: 'admin@crcusa.com'
  }
];

export function AffiliatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter affiliates
  const filteredAffiliates = mockAffiliates.filter(affiliate => {
    const matchesSearch = affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || affiliate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalAffiliates = mockAffiliates.length;
  const activeCount = mockAffiliates.filter(a => a.status === 'Activo').length;
  const inactiveCount = mockAffiliates.filter(a => a.status === 'Inactivo').length;
  const suspendedCount = mockAffiliates.filter(a => a.status === 'Suspendido').length;

  const stats = [
    { label: 'Total Afiliados', value: totalAffiliates.toString(), color: 'text-gray-900', icon: User },
    { label: 'Activos', value: activeCount.toString(), color: 'text-green-600', icon: CheckCircle },
    { label: 'Inactivos', value: inactiveCount.toString(), color: 'text-orange-600', icon: Clock },
    { label: 'Suspendidos', value: suspendedCount.toString(), color: 'text-red-600', icon: XCircle }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Activo':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case 'Inactivo':
        return <Badge className="bg-orange-100 text-orange-800">Inactivo</Badge>;
      case 'Suspendido':
        return <Badge className="bg-red-100 text-red-800">Suspendido</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <PageHeader 
          title="Afiliados"
          description="Gestiona los miembros activos de la cámara de comercio."
        >
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            Convertir Lead a Afiliado
          </Button>
        </PageHeader>
        
        <div className="p-8 space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar afiliados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
                <SelectItem value="Suspendido">Suspendido</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Más Filtros
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color.replace('text-', 'text-').replace('-600', '-500')}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Affiliates Table */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lista de Afiliados</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Afiliado</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha Conversión</TableHead>
                      <TableHead>Lead Original</TableHead>
                      <TableHead>Convertido Por</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAffiliates.map((affiliate) => (
                      <TableRow key={affiliate.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center text-sm font-medium">
                              {affiliate.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{affiliate.name}</p>
                              <p className="text-sm text-gray-500">{affiliate.email}</p>
                              <p className="text-sm text-gray-500">{affiliate.phone}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{affiliate.company}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(affiliate.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{affiliate.conversionDate}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-blue-600">{affiliate.originalLead}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{affiliate.convertedBy}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              Ver
                            </Button>
                            <Button variant="ghost" size="sm">
                              Editar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredAffiliates.length === 0 && (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No se encontraron afiliados que coincidan con los filtros.</p>
                </div>
              )}
            </div>
          </div>

          {/* Development Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}