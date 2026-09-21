# Web Performance

Repositório de estudos e experimentação prática sobre Web Performance, com uma aplicação demonstrativa em Next.js, documentação sobre Core Web Vitals e testes automatizados de qualidade.

## Sumário

- [Objetivo](#objetivo)
- [Core Web Vitals](#core-web-vitals)
- [Stack utilizada](#stack-utilizada)
- [O que foi implementado](#o-que-foi-implementado)
- [Estrutura principal](#estrutura-principal)
- [Como executar](#como-executar)
- [Testes e auditorias](#testes-e-auditorias)
- [Dashboard de qualidade](#dashboard-de-qualidade)
- [Critérios de qualidade](#critérios-de-qualidade)
- [Documentação das métricas](#documentação-das-métricas)
- [Limitações conhecidas](#limitações-conhecidas)

## Objetivo

O projeto tem como objetivo estudar, medir e investigar o desempenho de aplicações web.

A aplicação permite validar, em um ambiente controlado:

- carregamento e renderização de uma interface web;
- responsividade e navegação;
- acessibilidade;
- comportamento em diferentes contextos WebView;
- métricas de performance;
- consolidação dos resultados em uma dashboard de qualidade.

## Core Web Vitals

Core Web Vitals são métricas utilizadas para avaliar aspectos importantes da experiência do usuário em aplicações web.

As principais métricas são:

| Métrica | Nome | O que mede | Unidade |
| --- | --- | --- | --- |
| [LCP](docs/lcp/LCP.md) | Largest Contentful Paint | Velocidade de carregamento do conteúdo principal | Segundos |
| [INP](docs/inp/INP.md) | Interaction to Next Paint | Responsividade às interações do usuário | Milissegundos |
| [CLS](docs/cls/CLS.md) | Cumulative Layout Shift | Estabilidade visual do layout | Pontuação |

Classificação considerada boa:

| Métrica | Resultado bom |
| --- | ---: |
| LCP | Até 2,5 s |
| INP | Até 200 ms |
| CLS | Até 0,1 |

O projeto também acompanha métricas complementares:

- FCP — First Contentful Paint;
- TTFB — Time to First Byte.

Essas métricas ajudam a entender onde o tempo é utilizado durante o carregamento e a renderização da aplicação.

## Stack utilizada

- Next.js 16;
- React 19;
- Material UI;
- JavaScript com ES Modules;
- Playwright;
- Lighthouse;
- axe-core;
- ESLint;
- Chromium.

## O que foi implementado

### Aplicação web

- aplicação criada com Next.js App Router;
- página principal renderizada com componentes React;
- hero responsivo para diferentes tamanhos de viewport;
- navegação com header e footer;
- menu mobile;
- barra de seleção de país;
- seção de produtos em destaque;
- seção com todos os produtos;
- formulário de newsletter;
- páginas de loading e erro;
- imagens locais para os produtos e hero;
- fallback local quando a API externa de produtos não está disponível;
- desativação de scripts de terceiros durante os testes.

### Dashboard de qualidade

A aplicação possui uma dashboard disponível em `/dashboard`.

Ela apresenta:

- visão geral da saúde do projeto;
- resultados dos testes E2E;
- resultados de performance;
- resultados de acessibilidade do Lighthouse;
- resultados de acessibilidade do axe-core;
- resultados dos perfis WebView;
- status, pontuações, falhas e dados ausentes;
- origem e data dos relatórios;
- atualização dos dados sem reiniciar a aplicação.

### Testes automatizados

Foram implementados testes para:

- homepage;
- navegação;
- teclado e acessibilidade básica;
- newsletter;
- menu responsivo;
- dashboard;
- performance com Lighthouse;
- acessibilidade com Lighthouse;
- acessibilidade com axe-core;
- contexto WebView em três perfis Android simulados.

## Estrutura principal

```text
app/
├── api/quality/          # API dos dados consolidados
├── dashboard/            # Página da dashboard
├── error.js              # Tela de erro
├── layout.js             # Layout principal
├── loading.js            # Estado de carregamento
└── page.js               # Página inicial

components/
├── dashboard/            # Componentes da dashboard
└── *.js                  # Componentes da aplicação

data/                     # Produtos e fixtures de teste
docs/                     # Documentação das métricas
lib/                      # Integrações e acesso aos dados
public/images/            # Imagens da aplicação
scripts/                  # Agregação e execução dos testes
tests/
├── audits/               # Lighthouse e axe-core
├── e2e/                  # Testes funcionais
├── pages/                # Page Objects
├── support/              # Utilitários dos testes
└── webview/              # Testes de contexto WebView
```

## Como executar

### Instalar dependências

```bash
npm install
npx playwright install chromium
```

### Executar em desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

### Validar o build de produção

```bash
npm run build
npm run start
```

### Executar o lint

```bash
npm run lint
```

## Testes e auditorias

Os testes utilizam um build controlado da aplicação, com produtos locais e scripts de terceiros desabilitados.

### Testes E2E

```bash
npm run test:e2e
```

Cobre homepage, navegação, newsletter, teclado, menu responsivo e dashboard.

### Testes WebView

```bash
npm run test:webview
```

A suíte simula três perfis:

- low-end;
- mid-end;
- high-end.

Cada perfil possui configurações próprias de viewport, densidade de pixels, user agent, touch, CPU, memória e rede.

### Auditoria de performance

```bash
npm run test:performance
```

A auditoria executa três coletas independentes do Lighthouse e aplica os thresholds sobre a mediana dos resultados.

### Auditorias de acessibilidade

Executar Lighthouse e axe-core:

```bash
npm run test:accessibility
```

Executar somente Lighthouse:

```bash
npm run test:accessibility:lighthouse
```

Executar somente axe-core:

```bash
npm run test:accessibility:axe
```

### Executar todas as auditorias

```bash
npm run test:audits
```

### Executar a suíte completa

```bash
npm run test:all
```

O comando executa a suíte completa e consolida os resultados utilizados pela dashboard.

O alias abaixo possui o mesmo comportamento:

```bash
npm run test:quality
```

## Dashboard de qualidade

Primeiro, gere os relatórios:

```bash
npm run test:quality
```

Depois, inicie a dashboard:

```bash
npm run dashboard
```

Acesse:

```text
http://localhost:3000/dashboard
```

Para apenas reconstruir o resumo consolidado a partir dos relatórios existentes:

```bash
npm run dashboard:generate
```

Os relatórios são armazenados localmente em `reports/`. Esses arquivos não são versionados pelo Git.

## Critérios de qualidade

| Validação | Critério |
| --- | --- |
| Lighthouse Accessibility | Nota mínima 90 |
| axe-core | Nenhuma violação crítica ou séria |
| FCP | Menor que 1800 ms |
| LCP | Menor que 2500 ms |
| CLS | Menor que 0,1 |
| TTFB | Menor que 800 ms |

A pontuação geral da dashboard considera:

- E2E: 35%;
- performance: 30%;
- acessibilidade Lighthouse: 15%;
- acessibilidade axe-core: 20%.

Os testes WebView funcionam como um gate complementar e não alteram a pontuação ponderada.

## Documentação das métricas

A documentação detalhada das principais métricas está disponível em:

- [LCP — Largest Contentful Paint](docs/lcp/LCP.md);
- [INP — Interaction to Next Paint](docs/inp/INP.md);
- [CLS — Cumulative Layout Shift](docs/cls/CLS.md).

Cada documento explica:

- o que a métrica mede;
- como interpretar o resultado;
- os thresholds de classificação;
- como a métrica é calculada ou decomposta;
- principais causas de resultados ruins;
- como investigar problemas;
- ferramentas de medição e diagnóstico.

As principais ferramentas abordadas são:

- Lighthouse;
- Chrome DevTools;
- PageSpeed Insights;
- CrUX;
- Web Vitals;
- Playwright.

## Limitações conhecidas

- Os testes WebView são uma emulação determinística no Chromium.
- A emulação não substitui testes em um dispositivo Android real.
- A integração com uma WebView Android real exige emulador ou dispositivo e uma ferramenta nativa, como Appium.
- Os relatórios são gerados localmente e ignorados pelo Git.
- A API externa de produtos pode falhar; nesse caso, a aplicação utiliza dados locais.
- Os testes desabilitam scripts de terceiros para manter os resultados determinísticos.
