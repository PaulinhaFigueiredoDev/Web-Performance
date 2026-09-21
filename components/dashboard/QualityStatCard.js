import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import StatusChip from './StatusChip';

export default function QualityStatCard({ title, value, caption, status }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start' }}>
          <Typography component="h3" variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <StatusChip status={status} />
        </Box>
        <Typography variant="h4" component="p" sx={{ mt: 2, fontWeight: 700 }}>
          {value}
        </Typography>
        {caption && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {caption}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
