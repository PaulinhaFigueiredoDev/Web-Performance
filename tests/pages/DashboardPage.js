export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1, name: /dashboard de qualidade/i });
    this.healthHeading = page.getByRole('heading', { level: 2, name: /saúde geral/i });
    this.e2eHeading = page.getByRole('heading', { level: 2, name: /testes e2e/i });
    this.webViewHeading = page.getByRole('heading', { level: 2, name: /contexto webview/i });
    this.performanceHeading = page.getByRole('heading', { level: 2, name: /performance/i });
    this.accessibilityHeading = page.getByRole('heading', { level: 2, name: /acessibilidade/i });
    this.accessibilitySection = page.getByRole('region', { name: /^acessibilidade$/i });
    this.lighthouseAccessibilityHeading = this.accessibilitySection.getByRole('heading', { level: 3, name: /^lighthouse$/i });
    this.axeAccessibilityHeading = this.accessibilitySection.getByRole('heading', { level: 3, name: /^axe$/i });
    this.webViewProfiles = {
      low: page.getByRole('heading', { level: 3, name: /low-end/i }),
      mid: page.getByRole('heading', { level: 3, name: /mid-end/i }),
      high: page.getByRole('heading', { level: 3, name: /high-end/i })
    };
    this.webViewValidationDetails = page.getByText('Visualizar validações', { exact: true });
    this.webViewBridgeCheck = page.getByText('Mensagem entregue pela bridge', { exact: true }).first();
    this.refreshButton = page.getByRole('button', { name: /atualizar dados/i });
  }

  async goto() {
    await this.page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await this.heading.waitFor();
  }
}
