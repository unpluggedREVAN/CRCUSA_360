'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EmpresaFormProps {
  onClose: () => void;
}

const sectores = [
  'Tecnología',
  'Comercio',
  'Servicios Profesionales',
  'Manufactura',
  'Construcción',
  'Turismo',
  'Agricultura',
  'Energía Renovable',
  'Investigación y Desarrollo',
  'Transporte'
];

const ciudades = [
  'San José',
  'Cartago',
  'Alajuela',
  'Heredia',
  'Puntarenas',
  'Guanacaste',
  'Limón'
];

export function EmpresaForm({ onClose }: EmpresaFormProps) {
  const [formData, setFormData] = useState({
    razonSocial: '',
    sector: '',
    ciudad: '',
    empleados: '',
    telefono: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar la empresa
    console.log('Nueva empresa:', formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Agregar Nueva Empresa</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="razonSocial">Razón Social</Label>
              <Input
                id="razonSocial"
                name="razonSocial"
                value={formData.razonSocial}
                onChange={handleChange}
                placeholder="Ej: Tech Solutions SA"
                required
              />
            </div>

            <div>
              <Label htmlFor="sector">Sector</Label>
              <Select value={formData.sector} onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectores.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="ciudad">Ciudad</Label>
              <Select value={formData.ciudad} onValueChange={(value) => setFormData(prev => ({ ...prev, ciudad: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una ciudad" />
                </SelectTrigger>
                <SelectContent>
                  {ciudades.map((ciudad) => (
                    <SelectItem key={ciudad} value={ciudad}>
                      {ciudad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="empleados">Número de empleados</Label>
              <Input
                id="empleados"
                name="empleados"
                type="number"
                value={formData.empleados}
                onChange={handleChange}
                placeholder="Ej: 50"
                required
              />
            </div>

            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej: +506 2200-0000"
              />
            </div>

            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ej: info@empresa.com"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Guardar Empresa
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}