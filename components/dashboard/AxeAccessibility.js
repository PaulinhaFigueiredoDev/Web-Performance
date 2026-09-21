import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import StatusChip from './StatusChip';

function FindingList({ title, items }) {
  if (items.length === 0) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography component="h5" variant="subtitle2" fontWeight={700}>{title}</Typography>
      {items.map((item) => (
        <details className="quality-details" key={item.id}>
          <summary>
            {item.id} · {item.impact || 'impacto não definido'} · {item.nodes?.length || 0} elementos
          </summary>
          <Typography variant="body2" sx={{ mt: 1 }}>{item.help}</Typography>
          {item.helpUrl && (
            <Link href={item.helpUrl} target="_blank" rel="noreferrer">Como corrigir</Link>
          )}
          <ul>
            {(item.nodes || []).map((node, index) => (
              <li key={`${item.id}-${index}`}>
                <code>{node.target?.join(' ') || node.html}</code>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </Box>
  );
}

export default function AxeAccessibility({ data }) {
  if (!data.available) {
    return (
      <Card component="section" aria-labelledby="axe-accessibility-title" variant="outlined">
        <CardContent>
          <Typography id="axe-accessibility-title" component="h3" variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            axe
          </Typography>
          <Alert severity="info">Nenhum resumo do axe foi encontrado.</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card component="section" aria-labelledby="axe-accessibility-title" variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
          <div>
            <Typography id="axe-accessibility-title" component="h3" variant="h6" fontWeight={700}>axe</Typography>
            <Typography variant="h4" component="p" fontWeight={700}>{data.score}/100</Typography>
          </div>
          <StatusChip status={data.status} />
        </Box>

        <Typography variant="body2">
          {data.totals.violations} violações · {data.totals.blocking} bloqueadoras · {data.totals.incomplete} verificações manuais.
        </Typography>

        {data.targets.map((target) => (
          <Box key={target.name} sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography component="h4" variant="subtitle1" fontWeight={700}>{target.name}</Typography>
            {!target.available ? (
              <Typography color="text.secondary">Sem dados.</Typography>
            ) : (
              <>
                <Typography variant="body2">
                  {target.counts.violations || 0} violações · {target.incomplete.length} incompletas
                </Typography>
                <FindingList title="Violações" items={target.violations} />
                <FindingList title="Revisão manual" items={target.incomplete} />
              </>
            )}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
