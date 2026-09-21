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

function formatDuration(durationMs) {
  if (durationMs < 1000) return `${Math.round(durationMs)} ms`;
  return `${(durationMs / 1000).toFixed(2)} s`;
}

export default function E2EResults({ data }) {
  return (
    <section aria-labelledby="e2e-results-title">
      <Typography id="e2e-results-title" component="h2" variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Testes E2E
      </Typography>

      {!data.available ? (
        <Alert severity="info">Execute `npm run test:quality` para gerar os resultados E2E.</Alert>
      ) : (
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 2 }}>
              <Typography><strong>{data.totals.total}</strong> testes</Typography>
              <Typography color="success.main"><strong>{data.totals.passed}</strong> aprovados</Typography>
              <Typography color="error.main"><strong>{data.totals.failed}</strong> reprovados</Typography>
              <Typography><strong>{data.totals.skipped}</strong> ignorados</Typography>
              <Typography><strong>{formatDuration(data.durationMs)}</strong> de execução</Typography>
            </Box>

            <TableContainer>
              <Table size="small" aria-label="Resultados dos testes E2E">
                <TableHead>
                  <TableRow>
                    <TableCell>Cenário</TableCell>
                    <TableCell>Arquivo</TableCell>
                    <TableCell>Duração</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.tests.map((item) => (
                    <TableRow key={`${item.file}-${item.title}`}>
                      <TableCell>
                        {item.title}
                        {item.error && (
                          <details>
                            <summary>Ver erro</summary>
                            <pre className="quality-error">{item.error.message}</pre>
                          </details>
                        )}
                      </TableCell>
                      <TableCell>{item.file.replace(/^.*tests\//, 'tests/')}</TableCell>
                      <TableCell>{formatDuration(item.durationMs)}</TableCell>
                      <TableCell><StatusChip status={item.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
