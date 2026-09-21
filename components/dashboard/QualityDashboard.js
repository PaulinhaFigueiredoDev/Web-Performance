'use client';

import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import ClientLink from '@/components/ClientLink';
import AccessibilityResults from './AccessibilityResults';
import E2EResults from './E2EResults';
import HealthOverview from './HealthOverview';
import PerformanceResults from './PerformanceResults';
import WebViewResults from './WebViewResults';

function formatDate(value) {
  if (!value) return 'Sem execução registrada';
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium'
  }).format(new Date(value));
}

export default function QualityDashboard({ initialData }) {
  const [data, setData] = useState(initialData);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  async function refresh() {
    setRefreshing(true);
    setError(null);

    try {
      const response = await fetch('/api/quality', { cache: 'no-store' });
      if (!response.ok) throw new Error('A API de qualidade não respondeu corretamente.');
      setData(await response.json());
    } catch (refreshError) {
      setError(refreshError.message);
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <Box className="quality-dashboard" sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap', py: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography component="h1" variant="h5" fontWeight={700}>
              Dashboard de Qualidade
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Última leitura: {formatDate(data.generatedAt)}
            </Typography>
          </Box>
          <Button component={ClientLink} href="/" color="inherit">Ver aplicação</Button>
          <Button variant="contained" color="secondary" onClick={refresh} disabled={refreshing}>
            {refreshing ? <CircularProgress size={20} color="inherit" aria-label="Atualizando" /> : 'Atualizar dados'}
          </Button>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="xl" sx={{ py: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {data.overall.missingCategories.length > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Existem categorias sem relatório: {data.overall.missingCategories.join(', ')}.
            Execute <code>npm run test:quality</code>.
          </Alert>
        )}

        <HealthOverview data={data} />
        <Box sx={{ display: 'grid', gap: 4 }}>
          <E2EResults data={data.categories.e2e} />
          <WebViewResults data={data.categories.webview} />
          <PerformanceResults data={data.categories.performance} />
          <AccessibilityResults data={data.categories.accessibility} />
        </Box>
      </Container>
    </Box>
  );
}
