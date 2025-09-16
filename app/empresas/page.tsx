'use client';

import { MainLayout } from '@/components/Layout/MainLayout';
import { EmpresasContent } from '@/components/Empresas/EmpresasContent';

export default function EmpresasPage() {
  return (
    <MainLayout>
      <EmpresasContent />
    </MainLayout>
  );
}