import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import QualityStatCard from './QualityStatCard';
import StatusChip from './StatusChip';

export default function HealthOverview({ data }) {
  const { overall, categories } = data;
  const score = overall.score ?? 0;

  return (
    <section aria-labelledby="quality-overview-title">
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <div>
              <Typography id="quality-overview-title" component="h2" variant="h5" fontWeight={700}>
                Saúde geral
              </Typography>
              <Typography color="text.secondary">
                Nota ponderada das quatro dimensões de qualidade, com WebView como gate complementar.
              </Typography>
            </div>
            <StatusChip status={overall.status} size="medium" />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 3 }}>
            <Typography component="p" variant="h2" fontWeight={700}>
              {overall.score ?? '—'}
            </Typography>
            <Typography color="text.secondary">/ 100</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={score}
            color={overall.status === 'critical' ? 'error' : overall.status === 'attention' ? 'warning' : 'success'}
            aria-label={`Nota geral de qualidade: ${overall.score ?? 'sem dados'} de 100`}
            sx={{ height: 10, borderRadius: 5, mt: 1 }}
          />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Quality gate: {overall.gatePassed ? 'aprovado' : 'requer atenção'}.
          </Typography>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' },
          gap: 2,
          mb: 4
        }}
      >
        <QualityStatCard
          title="E2E"
          value={categories.e2e.score == null ? '—' : `${categories.e2e.score}%`}
          caption="Peso de 35%"
          status={categories.e2e.status}
        />
        <QualityStatCard
          title="WebView"
          value={categories.webview.score == null ? '—' : `${categories.webview.totals.passed}/${categories.webview.totals.total}`}
          caption="Gate complementar em três perfis"
          status={categories.webview.status}
        />
        <QualityStatCard
          title="Performance"
          value={categories.performance.score == null ? '—' : `${categories.performance.score}%`}
          caption="Peso de 30% baseado nos thresholds"
          status={categories.performance.status}
        />
        <QualityStatCard
          title="Lighthouse A11y"
          value={categories.accessibility.lighthouse.score == null
            ? '—'
            : `${categories.accessibility.lighthouse.score}/100`}
          caption="Peso de 15%"
          status={categories.accessibility.lighthouse.status}
        />
        <QualityStatCard
          title="axe"
          value={categories.accessibility.axe.score == null
            ? '—'
            : `${categories.accessibility.axe.score}/100`}
          caption="Peso de 20%"
          status={categories.accessibility.axe.status}
        />
      </Box>
    </section>
  );
}
