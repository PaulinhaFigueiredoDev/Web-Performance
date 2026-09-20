Claro — este é o `README.md` atualizado e alinhado ao padrão que definimos para LCP, INP e CLS.

# Web Performance

Repositório de estudos sobre **Web Performance**, com foco em entender como medir, interpretar e investigar o desempenho de aplicações web.

## Objetivo

Construir conhecimento prático sobre performance web, desde os principais conceitos e métricas até ferramentas de medição, análise, diagnóstico, monitoramento e automação.

O foco dos estudos é:

> **Entender a métrica → interpretar o resultado → saber o que investigar → saber quais ferramentas usar.**

## Conteúdos

### Core Web Vitals

* **LCP — Largest Contentful Paint**
* **INP — Interaction to Next Paint**
* **CLS — Cumulative Layout Shift**

Para cada métrica, os estudos abordam:

* O que a métrica representa
* Como interpretar o resultado
* O que ela mede
* Principais fatores que influenciam o resultado
* Como a métrica é calculada ou decomposta
* Como investigar resultados altos
* Ferramentas utilizadas na análise
* Modelo mental para investigação

### Métricas complementares

* **FCP — First Contentful Paint**
* **TTFB — Time to First Byte**
* **TBT — Total Blocking Time**
* Outras métricas relevantes de performance

Essas métricas complementam a análise dos Core Web Vitals e ajudam a identificar onde o tempo está sendo gasto.

## 📊 Dados de Performance

### Dados de laboratório

Medições realizadas em ambientes controlados para reproduzir e investigar problemas de performance.

Ferramentas:

* Lighthouse
* Chrome DevTools
* PageSpeed Insights
* WebPageTest

### Dados de campo

Medições coletadas a partir da experiência de usuários reais.

Conceitos estudados:

* RUM — Real User Monitoring
* CrUX — Chrome User Experience Report
* `web-vitals`
* Distribuição dos resultados
* Percentis
* Segmentação por dispositivo, conexão e outras condições

## 🛠️ Ferramentas

* **PageSpeed Insights**
* **Lighthouse**
* **Chrome DevTools**
* **Chrome UX Report (CrUX)**
* **WebPageTest**
* **Playwright**
* **Web Vitals**

## Automação

Estudos sobre automação de testes e coleta de métricas de performance utilizando **Playwright**, incluindo:

* Execução automatizada de páginas
* Coleta de métricas
* Repetição de cenários
* Comparação de resultados
* Identificação de regressões de performance

## Front-end e Performance

Estudos sobre o impacto das decisões de desenvolvimento no desempenho:

* HTML
* CSS
* JavaScript
* React
* Carregamento de recursos
* Imagens
* Fontes
* Renderização
* Network
* Cache
* Code splitting
* Lazy loading
* Bundle size
* SPA e navegação entre rotas

## WebView e Performance

Investigação de cenários específicos de aplicações **WebView**, considerando:

* Carregamento inicial
* Navegação
* Comunicação entre WebView e aplicação nativa
* Rede
* Dispositivo
* Renderização
* Impacto do ambiente de aplicação na experiência de performance

## Core Web Vitals

| Métrica | O que representa    | Unidade       |
| ------- | ------------------- | ------------- |
| **LCP** | Carregamento        | segundos      |
| **INP** | Responsividade      | milissegundos |
| **CLS** | Estabilidade visual | sem unidade   |

## Referências

* [Web.dev — Performance](https://web.dev/performance/)
* [Web.dev — Core Web Vitals](https://web.dev/explore/learn-core-web-vitals)
* [Web.dev — Web Vitals](https://web.dev/articles/vitals)
* [Google PageSpeed Insights](https://pagespeed.web.dev/)
* [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
* [Chrome UX Report](https://developer.chrome.com/docs/crux/)
* [Playwright](https://playwright.dev/)

## 🚧 Status

Repositório em construção.

Os estudos estão sendo organizados inicialmente pelos **Core Web Vitals**, seguidos por métricas complementares, ferramentas, automação e cenários específicos de Front-end e WebView.
