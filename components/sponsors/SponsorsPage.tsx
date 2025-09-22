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
  Award,
  Crown,
  Medal,
  Star
} from 'lucide-react';

// Mock data for sponsors
const mockSponsors = [
  {
    id: '1',
    name: 'Luis Bolaños',
    email: 'luis@landocean.com',
    phone: '(920) 626-3063',
    company: 'Land & Ocean Costa Rican Restaurant',
    companyId: '1',
    category: 'Oro',
    status: 'Activo',
    sponsorshipStart: '2024-01-01',
    sponsorshipEnd: '2024-12-31',
    createdAt: '2024-01-01',
    updatedAt: '2024-09-21',
    owner: 'admin@crcusa.com'
  },
  {
    id: '2',
    name: 'Byron Gómez',
    email: 'byron@pollotico.com',
    phone: '(720) 343-7757',
    company: 'Pollo Tico',
    companyId: '3',
    category: 'Plata',
    status: 'Activo',
    sponsorshipStart: '2024-02-15',
    sponsorshipEnd: '2025-02-14',
    createdAt: '2024-02-15',
    updatedAt: '2024-09-21',
    owner: 'admin@crcusa.com'
  },
  {
    id: '3',
    name: 'Jorge Arturo Barahona',
    email: 'jorge@tacanes.com',
    phone: '(973) 787-4200',
    company: 'Tacanes Restaurant',
    companyId: '2',
    category: 'Bronce',
    status: 'Activo',
    sponsorshipStart: '2024-03-01',
    sponsorshipEnd: '2024-12-31',
    createdAt: '2024-03-01',
    updatedAt: '2024-09-21',
    owner: 'manager@crcusa.com'
  },
  {
    id: '4',
    name: 'Miriam Cerdas',
    email: 'miriam@irazu.com',
    phone: '(773) 252-5067',
    company: 'Irazu Costa Rican Restaurant',
    companyId: '6',
    category: 'Bronce',
    status: 'Inactivo',
    sponsorshipStart: '2023-06-01',
    sponsorshipEnd: '2024-05-31',
    createdAt: '2023-06-01',
    updatedAt: '2024-06-01',
    owner: 'admin@crcusa.com'
  }
];

export function SponsorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter sponsors
  const filteredSponsors = mockSponsors.filter(sponsor => {
    const matchesSearch = sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sponsor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sponsor.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || sponsor.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || sponsor.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate stats
  const totalSponsors = mockSponsors.length;
  const activeCount = mockSponsors.filter(s => s.status === 'Activo').length;
  const goldCount = mockSponsors.filter(s => s.category === 'Oro').length;
  const silverCount = mockSponsors.filter(s => s.category === 'Plata').length;

  const stats = [
    { label: 'Total Patrocinadores', value: totalSponsors.toString(), color: 'text-gray-900', icon: Award },
    { label: 'Activos', value: activeCount.toString(), color: 'text-green-600', icon: CheckCircle },
    { label: 'Categoría Oro', value: goldCount.toString(), color: 'text-yellow-600', icon: Crown },
    { label: 'Categoría Plata', value: silverCount.toString(), color: 'text-gray-600', icon: Medal }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Activo':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case 'Inactivo':
        return <Badge className="bg-red-100 text-red-800">Inactivo</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Oro':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Crown className="h-3 w-3 mr-1" />
            Oro
          </Badge>
        );
      case 'Plata':
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <Medal className="h-3 w-3 mr-1" />
            Plata
          </Badge>
        );
      case 'Bronce':
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <Star className="h-3 w-3 mr-1" />
            Bronce
          </Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">{category}</Badge>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <PageHeader 
          title="Patrocinadores"
          description="Gestiona los patrocinadores y socios estratégicos de la cámara."
        >
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            Añadir Patrocinador
          </Button>
        </PageHeader>
        
        <div className="p-8 space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar patrocinadores..."
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
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="Oro">Oro</SelectItem>
                <SelectItem value="Plata">Plata</SelectItem>
                <SelectItem value="Bronce">Bronce</SelectItem>
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

          {/* Sponsors Table */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lista de Patrocinadores</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patrocinador</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSponsors.map((sponsor) => (
                      <TableRow key={sponsor.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-sm font-medium">
                              {sponsor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{sponsor.name}</p>
                              <p className="text-sm text-gray-500">{sponsor.email}</p>
                              <p className="text-sm text-gray-500">{sponsor.phone}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{sponsor.company}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getCategoryBadge(sponsor.category)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(sponsor.status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center space-x-1 text-gray-600">
                              <Calendar className="h-3 w-3" />
                              <span>{sponsor.sponsorshipStart}</span>
                            </div>
                            <div className="text-gray-500">
                              hasta {sponsor.sponsorshipEnd}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{sponsor.owner}</span>
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

              {filteredSponsors.length === 0 && (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No se encontraron patrocinadores que coincidan con los filtros.</p>
                </div>
              )}
            </div>
          </div>

          {/* Development Notice */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-purple-600" />
              </div>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}