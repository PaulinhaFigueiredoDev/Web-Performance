import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import StatusChip from './StatusChip';

const checkLabels = {
  webViewUserAgent: 'User agent identificado como Android WebView',
  touchEnabled: 'Suporte a interação por toque',
  viewportMatches: 'Viewport correspondente ao perfil',
  bridgeAvailable: 'Bridge JavaScript disponível',
  bridgeMessageDelivered: 'Mensagem entregue pela bridge',
  responsiveLayout: 'Layout sem overflow horizontal',
  mobileNavigation: 'Navegação mobile funcional'
};

function formatMs(value) {
  return value == null ? '—' : `${Math.round(value)} ms`;
}

export default function WebViewResults({ data }) {
  return (
    <section aria-labelledby="webview-results-title">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Typography id="webview-results-title" component="h2" variant="h5" fontWeight={700}>
          Contexto WebView
        </Typography>
        <StatusChip status={data.status} />
      </Box>

      {!data.available ? (
        <Alert severity="info">Execute `npm run test:webview` para gerar os resultados dos três perfis.</Alert>
      ) : (
        <>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Emulação Android WebView com touch, bridge JavaScript e restrições de CPU e rede.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
            {data.profiles.map((profile) => (
              <Card component="article" variant="outlined" key={profile.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
                    <div>
                      <Typography component="h3" variant="h6" fontWeight={700}>
                        {profile.profile?.label || `${profile.id}-end`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {profile.profile?.device || 'Sem relatório'}
                      </Typography>
                    </div>
                    <StatusChip status={!profile.available ? 'unavailable' : profile.passed ? 'healthy' : 'critical'} />
                  </Box>

                  {!profile.available ? (
                    <Typography>Relatório ainda não gerado.</Typography>
                  ) : (
                    <Box sx={{ display: 'grid', gap: 1 }}>
                      <Typography variant="body2">
                        {profile.profile.viewport.width}×{profile.profile.viewport.height} · DPR {profile.profile.deviceScaleFactor}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip size="small" label={`CPU ${profile.profile.cpuSlowdownMultiplier}×`} />
                        <Chip size="small" label={profile.profile.network.label} />
                      </Box>
                      <Typography variant="body2">
                        DCL: {formatMs(profile.navigation?.domContentLoadedMs)} · Load: {formatMs(profile.navigation?.loadMs)}
                      </Typography>
                      <Typography variant="body2">
                        {Object.values(profile.checks || {}).filter(Boolean).length}/{Object.keys(profile.checks || {}).length} validações aprovadas
                      </Typography>
                      <details className="quality-details" open={!profile.passed}>
                        <summary>Visualizar validações</summary>
                        <Box component="ul" sx={{ display: 'grid', gap: 1, pl: 2.5, mb: 0 }}>
                          {Object.entries(profile.checks || {}).map(([check, result]) => (
                            <Box
                              component="li"
                              key={check}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 1
                              }}
                            >
                              <Typography variant="body2">
                                {checkLabels[check] || check}
                              </Typography>
                              <StatusChip status={result ? 'passed' : 'failed'} />
                            </Box>
                          ))}
                        </Box>
                      </details>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}
    </section>
  );
}
