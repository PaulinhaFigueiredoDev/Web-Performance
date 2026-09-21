import Chip from '@mui/material/Chip';

const statusConfig = {
  healthy: { label: 'Saudável', color: 'success' },
  attention: { label: 'Atenção', color: 'warning' },
  critical: { label: 'Crítico', color: 'error' },
  passed: { label: 'Aprovado', color: 'success' },
  failed: { label: 'Reprovado', color: 'error' },
  flaky: { label: 'Instável', color: 'warning' },
  skipped: { label: 'Ignorado', color: 'default' },
  unavailable: { label: 'Sem dados', color: 'default' }
};

export default function StatusChip({ status, label, size = 'small' }) {
  const config = statusConfig[status] || statusConfig.unavailable;

  return (
    <Chip
      size={size}
      color={config.color}
      variant={config.color === 'default' ? 'outlined' : 'filled'}
      label={label || config.label}
    />
  );
}
