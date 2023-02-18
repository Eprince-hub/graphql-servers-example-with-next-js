import ApolloClientProvider from '@/app/ApolloClientProvider';
import AdminDashboard from './AdminDashboard';

export default function AnimalsAdminPage() {
  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <AdminDashboard />
    </ApolloClientProvider>
  );
}
