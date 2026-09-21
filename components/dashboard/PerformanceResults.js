import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import StatusChip from './StatusChip';

function formatMetric(name, value) {
  if (value == null) return '—';
  if (name === 'CLS') return value.toFixed(3);
  return `${value.toFixed(2)} ms`;
}

export default function PerformanceResults({ data }) {
  return (
    <section aria-labelledby="performance-results-title">
      <Typography id="performance-results-title" component="h2" variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Performance
      </Typography>

      {!data.available ? (
        <Alert severity="info">Nenhum resumo do Lighthouse Performance foi encontrado.</Alert>
      ) : (
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <div>
                <Typography variant="h4" component="p" fontWeight={700}>
                  {data.lighthouseScore}/100
                </Typography>
                <Typography color="text.secondary">
                  Lighthouse · {data.aggregation} de {data.runCount} execuções
                </Typography>
              </div>
              <StatusChip status={data.status} size="medium" />
            </Box>

            <TableContainer>
              <Table size="small" aria-label="Métricas de performance">
                <TableHead>
                  <TableRow>
                    <TableCell>Métrica</TableCell>
                    <TableCell>Resultado</TableCell>
                    <TableCell>Threshold</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(data.metrics).map(([name, metric]) => (
                    <TableRow key={name}>
                      <TableCell><strong>{name}</strong></TableCell>
                      <TableCell>{formatMetric(name, metric.value)}</TableCell>
                      <TableCell>&lt; {formatMetric(name, metric.threshold)}</TableCell>
                      <TableCell><StatusChip status={metric.passed ? 'passed' : 'failed'} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {data.samples.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography component="h3" variant="h6">Amostras</Typography>
                <TableContainer>
                  <Table size="small" aria-label="Amostras do Lighthouse Performance">
                    <TableHead>
                      <TableRow>
                        <TableCell>Execução</TableCell>
                        <TableCell>Nota</TableCell>
                        <TableCell>FCP</TableCell>
                        <TableCell>LCP</TableCell>
                        <TableCell>CLS</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.samples.map((sample) => (
                        <TableRow key={sample.run}>
                          <TableCell>{sample.run}</TableCell>
                          <TableCell>{sample.score}/100</TableCell>
                          <TableCell>{formatMetric('FCP', sample.metrics.FCP.value)}</TableCell>
                          <TableCell>{formatMetric('LCP', sample.metrics.LCP.value)}</TableCell>
                          <TableCell>{formatMetric('CLS', sample.metrics.CLS.value)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </section>
  );
}
