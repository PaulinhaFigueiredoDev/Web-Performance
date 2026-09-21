import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import StatusChip from './StatusChip';

export default function LighthouseAccessibility({ data }) {
  if (!data.available) {
    return (
      <Card component="section" aria-labelledby="lighthouse-accessibility-title" variant="outlined">
        <CardContent>
          <Typography id="lighthouse-accessibility-title" component="h3" variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Lighthouse
          </Typography>
          <Alert severity="info">Nenhum resumo do Lighthouse Accessibility foi encontrado.</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card component="section" aria-labelledby="lighthouse-accessibility-title" variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
          <div>
            <Typography id="lighthouse-accessibility-title" component="h3" variant="h6" fontWeight={700}>
              Lighthouse
            </Typography>
            <Typography variant="h4" component="p" fontWeight={700}>
              {data.score}/100
            </Typography>
          </div>
          <StatusChip status={data.status} />
        </Box>

        <Typography variant="body2">
          Threshold: {data.threshold}/100 · {data.failedAudits.length} auditorias reprovadas.
        </Typography>

        {data.failedAudits.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography component="h4" variant="subtitle1" fontWeight={700}>Falhas</Typography>
            <ul>
              {data.failedAudits.map((audit) => (
                <li key={audit.id}>
                  <strong>{audit.title}</strong> ({audit.nodes.length} elementos)
                </li>
              ))}
            </ul>
          </Box>
        )}

        <details className="quality-details">
          <summary>{data.manualAudits.length} verificações manuais recomendadas</summary>
          <ul>
            {data.manualAudits.map((audit) => (
              <li key={audit.id}>
                <Link href={`https://developer.chrome.com/docs/lighthouse/accessibility/`} target="_blank" rel="noreferrer">
                  {audit.title}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      </CardContent>
    </Card>
  );
}
