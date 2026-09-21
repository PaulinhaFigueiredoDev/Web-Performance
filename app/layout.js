import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import './globals.css';
import ThirdPartyScripts from '@/components/ThirdPartyScripts';
import theme from '@/theme';

export const metadata = {
  title: 'Home - Tech Shop',
  description: 'Discover VR headsets and accessories.'
};

export default function RootLayout({ children }) {
  const thirdPartyEnabled = process.env.DISABLE_THIRD_PARTY !== 'true';

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <a className="skip-link" href="#main-content">
              Skip to main content
            </a>
            {children}
            <ThirdPartyScripts enabled={thirdPartyEnabled} />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
