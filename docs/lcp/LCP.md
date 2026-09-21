# LCP — Largest Contentful Paint

## Sumário

1. [O que é LCP?](#1-o-que-é-lcp)
2. [Como interpretar o resultado?](#2-como-interpretar-o-resultado)
3. [O que o LCP mede?](#3-o-que-o-lcp-mede)
4. [Principais fatores que influenciam o LCP](#4-principais-fatores-que-influenciam-o-lcp)
5. [Como o LCP é decomposto?](#5-como-o-lcp-é-decomposto)
6. [Como investigar um LCP alto?](#6-como-investigar-um-lcp-alto)
7. [Ferramentas](#7-ferramentas)
8. [Modelo mental](#8-modelo-mental)
9. [Resumo](#9-resumo)

---

# 1. O que é LCP?

**LCP (Largest Contentful Paint)** é um **Core Web Vital** que mede o tempo até que o maior elemento de conteúdo elegível e visível na viewport seja renderizado.

Em termos simples:

> **Quanto tempo o usuário espera até o principal conteúdo visual aparecer?**

Exemplo:

```text id="xq7v2m"
Navegação
    ↓
Carregamento
    ↓
Processamento
    ↓
Renderização
    ↓
LCP
```

O LCP é uma métrica de **carregamento percebido**, não de carregamento completo da página.

---

# 2. Como interpretar o resultado?

| LCP                   | Classificação    |
| --------------------- | ---------------- |
| **≤ 2,5 s**           | Bom              |
| **> 2,5 s e ≤ 4,0 s** | Precisa melhorar |
| **> 4,0 s**           | Ruim             |

Exemplos:

```text id="5e3q0c"
1,8 s → Bom
2,4 s → Bom
2,9 s → Precisa melhorar
3,8 s → Precisa melhorar
4,5 s → Ruim
```

O valor do LCP mostra **quanto tempo levou**, mas não explica a causa.

Por exemplo:

```text id="g7y4pa"
LCP = 3,8 s
```

Para investigar, precisamos descobrir **onde esses 3,8 segundos foram gastos**.

---

# 3. O que o LCP mede?

O LCP mede o tempo até que o maior conteúdo **elegível e visível** seja renderizado.

O elemento LCP pode variar durante o carregamento. Alguns exemplos de candidatos incluem:

* imagem;
* imagem de destaque;
* bloco de texto;
* título;
* banner;
* outros elementos elegíveis.

> **LCP não significa simplesmente "o maior elemento da página".**

O LCP **não mede**:

* carregamento completo da página;
* todas as imagens;
* todo o JavaScript;
* tempo para toda a aplicação terminar;
* responsividade;
* estabilidade visual.

Por isso:

```text id="v1s6qr"
LCP
 ↓
Conteúdo principal apareceu
```

A página pode continuar carregando depois que o LCP acontece.

Também é possível ter:

```text id="9l5xmw"
LCP → Bom
INP → Ruim
```

Nesse caso, o conteúdo pode aparecer rapidamente, mas a interface ainda pode responder lentamente às interações.

---

# 4. Principais fatores que influenciam o LCP

O LCP pode ser influenciado por diferentes camadas da aplicação.

| Fator            | Exemplos                                  |
| ---------------- | ----------------------------------------- |
| **Backend**      | servidor, banco, APIs, cache              |
| **Rede**         | latência, conexão, CDN                    |
| **Frontend**     | HTML, CSS, JavaScript, React              |
| **Recursos**     | imagens, fontes, tamanho, formato         |
| **Renderização** | estilos, layout, paint                    |
| **Dispositivo**  | CPU, memória, capacidade de processamento |

Também podemos investigar:

* quando o recurso LCP foi descoberto;
* quando começou a carregar;
* quanto tempo levou para baixar;
* se dependia de JavaScript;
* se havia bloqueio de renderização;
* se existiam Long Tasks;
* se o Main Thread estava ocupado.

> **LCP alto não significa automaticamente problema de frontend.**

A investigação deve considerar **backend, rede, frontend e dispositivo**.

---

# 5. Como o LCP é decomposto?

Para investigar um LCP alto, podemos dividir o carregamento em etapas:

```text id="q7a5nk"
Navegação
    ↓
TTFB
    ↓
Load Delay
    ↓
Load Time
    ↓
Render Delay
    ↓
LCP
```

Essa decomposição ajuda a descobrir **onde o tempo foi gasto**.

### TTFB

**TTFB (Time to First Byte)** representa o tempo até o primeiro byte da resposta chegar ao navegador.

Pode ser influenciado por:

* latência;
* processamento do servidor;
* banco de dados;
* APIs;
* cache;
* CDN;
* infraestrutura.

> **TTFB não é um Core Web Vital e não é o LCP.**

Um TTFB alto pode contribuir para um LCP alto.

---

### Load Delay

É o período entre o início do carregamento e o momento em que o recurso que se torna o LCP começa a ser carregado.

Pergunta principal:

> **Por que o recurso LCP demorou para ser descoberto?**

Possíveis causas:

* recurso descoberto tarde;
* dependência de JavaScript;
* elemento criado dinamicamente;
* processamento anterior à descoberta;
* prioridade de carregamento.

---

### Load Time

Representa o tempo necessário para transferir o recurso depois que seu carregamento começou.

Pode ser influenciado por:

* tamanho do recurso;
* conexão;
* latência;
* CDN;
* compressão;
* formato;
* servidor.

Um Load Time alto não significa necessariamente que o recurso é apenas "grande".

---

### Render Delay

É o tempo entre o recurso estar disponível e o momento em que o navegador consegue apresentar o conteúdo como LCP.

Pode envolver:

* JavaScript;
* Long Tasks;
* cálculo de estilos;
* Layout;
* Paint;
* renderização do framework;
* processamento na Main Thread.

A diferença principal é:

```text id="xv0j5z"
Load Time
→ recurso demorou para chegar

Render Delay
→ recurso chegou, mas demorou para aparecer
```

### Modelo simplificado

```text id="2m3q7w"
LCP
 ↓
TTFB
+
Load Delay
+
Load Time
+
Render Delay
```

Essa decomposição é um **modelo de investigação**. Ela ajuda a identificar a etapa que mais contribuiu para o tempo observado.

---

# 6. Como investigar um LCP alto?

Use esta sequência:

```text id="l3w8ca"
LCP alto
   ↓
Qual foi o valor?
   ↓
Qual elemento foi o LCP?
   ↓
Quando ele foi descoberto?
   ↓
Quando começou a carregar?
   ↓
Quanto tempo levou para baixar?
   ↓
Quando ficou disponível?
   ↓
O que atrasou a renderização?
   ↓
Qual camada está contribuindo?
```

Durante a investigação, procure:

### Backend

* TTFB;
* processamento do servidor;
* cache;
* APIs;
* CDN.

### Rede

* latência;
* conexão;
* transferência;
* tamanho dos recursos.

### Frontend

* JavaScript;
* CSS;
* descoberta de recursos;
* renderização;
* Long Tasks.

### Dispositivo

* CPU;
* memória;
* capacidade de processamento.

A pergunta principal é:

> **Em qual etapa o LCP está perdendo tempo?**

---

# 7. Ferramentas

### PageSpeed Insights

Permite consultar dados de performance e Core Web Vitals, incluindo dados de campo quando disponíveis.

### Lighthouse

Útil para testes de laboratório e análise de performance em um ambiente controlado.

### Chrome DevTools — Performance

Ajuda a investigar o que aconteceu durante o carregamento.

Podemos observar:

* Main Thread;
* JavaScript;
* Long Tasks;
* Rendering;
* Layout;
* Paint;
* eventos de carregamento.

### Chrome DevTools — Network

Ajuda a investigar:

* requisições;
* TTFB;
* tamanho dos recursos;
* tempo de transferência;
* prioridade;
* recursos bloqueados ou atrasados.

### CrUX

Fornece dados de experiência de usuários reais para páginas e origens elegíveis.

### Web Vitals

Pode ser utilizado para medir Core Web Vitals no contexto da aplicação e coletar dados de usuários reais.

---

# 8. Modelo mental

Quando encontrar um LCP alto, pense:

```text id="m0h7xs"
LCP alto
   ↓
Qual elemento foi o LCP?
   ↓
Foi descoberto tarde?
   ↓
Load Delay
   ↓
Demorou para chegar?
   ↓
Load Time
   ↓
Demorou para aparecer?
   ↓
Render Delay
   ↓
O servidor começou tarde?
   ↓
TTFB
```

De forma ainda mais simples:

```text id="q4d8np"
LCP alto
   ↓
Resposta começou tarde?
   ↓
Recurso foi descoberto tarde?
   ↓
Recurso demorou para chegar?
   ↓
Recurso demorou para aparecer?
```

> **LCP é o resultado. A investigação consiste em descobrir onde o tempo foi gasto.**

---

# 9. Resumo

```text id="w6z1rf"
LCP
 ↓
Carregamento percebido
 ↓
Maior conteúdo elegível e visível
 ↓
Tempo até o conteúdo aparecer
```

Para investigar:

```text id="p2c9va"
TTFB
  ↓
Load Delay
  ↓
Load Time
  ↓
Render Delay
  ↓
LCP
```

> **LCP responde "quanto tempo levou". A decomposição ajuda a responder "onde esse tempo foi gasto".**

## Core Web Vitals

| Métrica | O que representa    | Unidade       |
| ------- | ------------------- | ------------- |
| **LCP** | Carregamento        | segundos      |
| **INP** | Responsividade      | milissegundos |
| **CLS** | Estabilidade visual | sem unidade   |
