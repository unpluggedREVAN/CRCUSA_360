import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ContactDetailPage } from '@/components/contacts/ContactDetailPage';

export const generateStaticParams = async () => {
  // Mock contact IDs for static generation
  const contactIds = ['1', '2', '3', '4', '5', '6', '7'];
  
  return contactIds.map((id) => ({
    id: id,
  }));
};

export default function ContactDetail({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <ContactDetailPage contactId={params.id} />
    </ProtectedRoute>
  );
}