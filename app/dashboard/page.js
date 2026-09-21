import QualityDashboard from '@/components/dashboard/QualityDashboard';
import { aggregateQualityReports } from '@/scripts/aggregate-quality-reports';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard de Qualidade - Tech Shop',
  description: 'Saúde dos testes E2E, performance e acessibilidade da aplicação.'
};

export default async function DashboardPage() {
  const initialData = await aggregateQualityReports();
  return <QualityDashboard initialData={initialData} />;
}
