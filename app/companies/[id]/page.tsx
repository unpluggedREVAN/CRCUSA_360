import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { CompanyDetailPage } from '@/components/companies/CompanyDetailPage';

// Mock companies data - same as in DataContext
const mockCompanies = [
  {
    id: '1',
    name: 'Land & Ocean Costa Rican Restaurant',
    tradeName: 'Land & Ocean',
    email: 'info@landocean.com',
    phone: '(920) 626-3063',
    website: 'https://landocean.com',
    sector: 'Restaurante',
    size: 'Pequeña (1-10)',
    location: 'Milwaukee, Wisconsin, Estados Unidos',
    address: '1532 N Farwell Ave, Milwaukee, WI 53202',
    description: 'Restaurante especializado en comida costarricense auténtica',
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'LO'
  },
  {
    id: '2',
    name: 'Tacanes Restaurant LLC',
    tradeName: 'Tacanes Restaurant',
    email: 'info@tacanes.com',
    phone: '(973) 787-4200',
    website: '',
    sector: 'Restaurante',
    size: 'Pequeña (1-10)',
    location: 'Newark, New Jersey, Estados Unidos',
    address: '123 Main St, Newark, NJ 07102',
    description: 'Restaurante familiar con especialidades costarricenses',
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'TR'
  },
  {
    id: '3',
    name: 'Pollo Tico Inc',
    tradeName: 'Pollo Tico',
    email: 'info@pollotico.com',
    phone: '(720) 343-7757',
    website: 'https://pollotico.com',
    sector: 'Restaurante',
    size: 'Mediana (11-50)',
    location: 'Denver, Colorado, Estados Unidos',
    address: '456 Denver Ave, Denver, CO 80202',
    description: 'Cadena de restaurantes especializados en pollo al estilo costarricense',
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'PT'
  },
  {
    id: '4',
    name: 'Qué Rica Restaurant Corp',
    tradeName: 'Qué Rica Restaurant',
    email: 'info@querica.com',
    phone: '(973) 821-5958',
    website: '',
    sector: 'Restaurante',
    size: 'Pequeña (1-10)',
    location: 'Newark, New Jersey, Estados Unidos',
    address: '789 Newark St, Newark, NJ 07103',
    description: 'Restaurante tradicional con ambiente familiar',
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'QR'
  },
  {
    id: '5',
    name: 'Iz Corners LLC',
    tradeName: 'Iz Corners',
    email: 'info@izcorners.com',
    phone: '(646) 490-5460',
    website: '',
    sector: 'Restaurante',
    size: 'Pequeña (1-10)',
    location: 'Nueva York, Estados Unidos',
    address: '321 NY Ave, New York, NY 10001',
    description: 'Restaurante boutique con fusión costarricense',
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'IC'
  },
  {
    id: '6',
    name: 'Irazu Costa Rican Restaurant Inc',
    tradeName: 'Irazu Costa Rican Restaurant',
    email: 'info@irazu.com',
    phone: '(773) 252-5067',
    website: '',
    sector: 'Restaurante',
    size: 'Pequeña (1-10)',
    location: 'Chicago, Illinois, Estados Unidos',
    address: '654 Chicago Blvd, Chicago, IL 60601',
    description: 'Restaurante tradicional costarricense en el corazón de Chicago',
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'IR'
  }
];

export const generateStaticParams = async () => {
  // Generate static params for all company IDs from mock data
  return mockCompanies.map((company) => ({
    id: company.id,
  }));
};

export default function CompanyDetail({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <CompanyDetailPage companyId={params.id} />
    </ProtectedRoute>
  );
}