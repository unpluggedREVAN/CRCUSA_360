'use client';

import { MainLayout } from '@/components/Layout/MainLayout';
import { ContactosContent } from '@/components/Contactos/ContactosContent';

export default function ContactosPage() {
  return (
    <MainLayout>
      <ContactosContent />
    </MainLayout>
  );
}