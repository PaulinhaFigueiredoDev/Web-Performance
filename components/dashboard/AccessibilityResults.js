import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AxeAccessibility from './AxeAccessibility';
import LighthouseAccessibility from './LighthouseAccessibility';

export default function AccessibilityResults({ data }) {
  return (
    <section aria-labelledby="accessibility-results-title">
      <Typography id="accessibility-results-title" component="h2" variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Acessibilidade
      </Typography>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Resultados separados por ferramenta para distinguir a auditoria do Lighthouse
          da análise automatizada e das revisões manuais indicadas pelo axe.
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
          <LighthouseAccessibility data={data.lighthouse} />
          <AxeAccessibility data={data.axe} />
        </Box>
      </Paper>
    </section>
  );
}
