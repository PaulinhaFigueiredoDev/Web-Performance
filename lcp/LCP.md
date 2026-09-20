# LCP — Largest Contentful Paint

## Sumário

1. [O que é LCP?](#1-o-que-é-lcp)
2. [O que pode ser o elemento LCP?](#2-o-que-pode-ser-o-elemento-lcp)
3. [Como interpretar o resultado?](#3-como-interpretar-o-resultado)
4. [O que o LCP realmente mede?](#4-o-que-o-lcp-realmente-mede)
5. [Por que o LCP é importante?](#5-por-que-o-lcp-é-importante)
6. [O LCP depende apenas do frontend?](#6-o-lcp-depende-apenas-do-frontend)
7. [Principais fatores que podem influenciar o LCP](#7-principais-fatores-que-podem-influenciar-o-lcp)
8. [TTFB](#8-ttfb)
9. [Load Delay](#9-load-delay)
10. [Load Time](#10-load-time)
11. [Render Delay](#11-render-delay)
12. [As fases do LCP](#12-as-fases-do-lcp)
13. [Modelo mental para investigar LCP](#modelo-mental-para-investigar-lcp)

---

## 1. O que é LCP?

**LCP (Largest Contentful Paint)** é uma métrica dos **Core Web Vitals** que mede quanto tempo leva para o maior elemento de conteúdo relevante e visível na viewport aparecer.

Em termos simples:

> **Quanto tempo o usuário espera até o principal conteúdo visual da página aparecer?**

O LCP começa a ser medido durante o carregamento da página e considera os elementos elegíveis que aparecem na área visível.

---

## 2. O que pode ser o elemento LCP?

O elemento registrado como LCP pode variar de acordo com a página. Exemplos:

* imagem;
* imagem de capa/hero;
* banner;
* título;
* bloco de texto;
* conteúdo visual relevante;
* vídeo ou outro elemento elegível.

O candidato ao LCP pode mudar durante o carregamento. O navegador acompanha os candidatos e registra aquele que, entre os elegíveis, representa o maior conteúdo relevante visível.

> **Importante:** o LCP não significa simplesmente "o maior elemento da página".

---

## 3. Como interpretar o resultado?

Os valores de referência são:

| LCP                   | Classificação    |
| --------------------- | ---------------- |
| **≤ 2,5 s**           | Bom              |
| **> 2,5 s e ≤ 4,0 s** | Precisa melhorar |
| **> 4,0 s**           | Ruim             |

Exemplos:

* `1,8s` → bom
* `2,4s` → bom
* `2,9s` → precisa melhorar
* `3,8s` → precisa melhorar
* `4,5s` → ruim

### O resultado não explica a causa

Um LCP de `3,8s` informa **o que aconteceu**, mas não **por que aconteceu**.

Para investigar, precisamos descobrir onde o tempo foi gasto:

```text
LCP alto
   ↓
Onde o tempo foi gasto?
   ↓
┌─────────────────┐
│ TTFB            │ → resposta começou tarde?
├─────────────────┤
│ Load Delay      │ → recurso foi descoberto tarde?
├─────────────────┤
│ Load Time       │ → recurso demorou para baixar?
├─────────────────┤
│ Render Delay    │ → estava pronto, mas demorou para aparecer?
└─────────────────┘
```
---

## 4. O que o LCP realmente mede?

O LCP mede o tempo necessário para que o maior conteúdo elegível e visível seja renderizado.

Ele **não mede**:

* o carregamento completo da página;
* todas as imagens;
* todo o JavaScript;
* toda a aplicação;
* o momento em que tudo terminou de carregar;
* a responsividade da página;
* a estabilidade visual.

Por isso:

> **A página pode continuar carregando depois que o LCP aconteceu.**

O LCP é principalmente uma **métrica de resultado**.

A investigação vem depois:

```text
LCP
 ↓
Resultado
 ↓
Investigar causa
```
---

## 5. Por que o LCP é importante?

O LCP ajuda a avaliar a experiência de carregamento percebida pelo usuário.

Ele faz parte dos **Core Web Vitals**:

| Métrica | O que avalia                       |
| ------- | ---------------------------------- |
| **LCP** | Carregamento/percepção do conteúdo |
| **INP** | Responsividade às interações       |
| **CLS** | Estabilidade visual                |

Um LCP alto pode estar relacionado a diferentes partes da aplicação.

Não devemos assumir que:

> "LCP alto = problema de frontend."

Ele pode envolver:

* backend;
* rede;
* CDN;
* descoberta do recurso;
* tamanho do recurso;
* JavaScript;
* CSS;
* renderização;
* dispositivo.

---

## 6. O LCP depende apenas do frontend?

Não.

O carregamento pode ser entendido como uma cadeia:

```text
Navegação
   ↓
Servidor responde
   ↓
TTFB
   ↓
Recurso LCP é descoberto
   ↓
Recurso começa a carregar
   ↓
Download
   ↓
Processamento
   ↓
Renderização
   ↓
LCP
```
Por isso, investigar LCP significa olhar para diferentes camadas:

### Backend

* tempo de processamento;
* banco de dados;
* APIs;
* cache;
* CDN;
* infraestrutura.

### Rede

* latência;
* velocidade da conexão;
* localização;
* quantidade de dados transferidos.

### Frontend

* HTML;
* CSS;
* JavaScript;
* descoberta de recursos;
* renderização;
* tarefas longas.

### Dispositivo

* capacidade de processamento;
* memória;
* velocidade do CPU;
* condições reais do usuário.

---

## 7. Principais fatores que podem influenciar o LCP

Podemos organizar os fatores em quatro grupos:

| Grupo           | Exemplos                                  |
| --------------- | ----------------------------------------- |
| **Backend**     | TTFB, servidor, banco, APIs, cache        |
| **Rede**        | latência, conexão, CDN, transferência     |
| **Frontend**    | HTML, CSS, JS, React, renderização        |
| **Dispositivo** | CPU, memória, capacidade de processamento |

Também podemos investigar especificamente:

* quando o recurso LCP foi descoberto;
* quando começou a carregar;
* quanto tempo levou para baixar;
* tamanho do recurso;
* formato;
* compressão;
* bloqueios de renderização;
* tarefas longas no Main Thread;
* processamento de JavaScript;
* cálculo de estilos;
* layout;
* pintura.

---

## 8. TTFB

**TTFB (Time to First Byte)** mede quanto tempo passa desde o início da requisição até o recebimento do primeiro byte da resposta.

```text
Requisição
    ↓
Servidor processa
    ↓
Primeiro byte chega
    ↓
TTFB
```
### O que pode influenciar o TTFB?

* latência da rede;
* processamento do servidor;
* banco de dados;
* APIs externas;
* geração dinâmica do HTML;
* cache;
* CDN;
* localização do usuário;
* infraestrutura.

### TTFB ≠ LCP

TTFB não é o LCP.

Um TTFB alto pode **contribuir para um LCP alto**, porque o navegador precisa receber a resposta antes de continuar determinadas etapas do carregamento.

### Ao investigar

Pergunte:

* O servidor está demorando?
* Existe cache?
* A CDN está sendo utilizada?
* O usuário está distante da infraestrutura?
* O problema acontece apenas em determinadas regiões?
* O resultado é observado em laboratório ou em usuários reais?

---

## 9. Load Delay

**Load Delay** é o tempo entre o início do carregamento da página e o momento em que o recurso que se torna o LCP começa a ser carregado.

A pergunta principal é:

> **Por que o navegador demorou para começar a carregar o recurso LCP?**

Exemplo:

```text
Página começa
     ↓
HTML é processado
     ↓
Recurso LCP ainda não foi descoberto
     ↓
Recurso é descoberto
     ↓
Download começa
```
O período anterior ao início do download é o **Load Delay**.

### Possíveis causas

* recurso aparece tarde no HTML;
* recurso depende de JavaScript;
* elemento é criado dinamicamente;
* descoberta acontece após outros processamentos;
* prioridade de carregamento;
* recurso não está facilmente identificável pelo navegador.

### Ao investigar

Verifique:

* Quando o recurso foi descoberto?
* Quando a requisição começou?
* Ele estava no HTML inicial?
* Depende de JavaScript?
* Foi inserido dinamicamente?
* Existe algum processamento antes da descoberta?

---

## 10. Load Time

**Load Time** representa o tempo necessário para o recurso LCP ser transferido depois que seu carregamento começa.

```text
Requisição começa
      ↓
Download
      ↓
Recurso termina de chegar
```

### O que pode influenciar?

* tamanho do recurso;
* quantidade de dados transferidos;
* conexão;
* latência;
* servidor;
* CDN;
* compressão;
* formato do arquivo;
* versão do recurso entregue ao dispositivo.

### Importante

Um Load Time alto **não significa automaticamente que o arquivo é grande**.

A velocidade da conexão, a latência e a infraestrutura também influenciam.

### Ao investigar

Pergunte:

* Qual o tamanho do recurso?
* Qual o formato?
* Está comprimido?
* Está sendo servido pela CDN?
* Qual a conexão do usuário?
* O servidor está respondendo adequadamente?
* Existe uma versão adequada para diferentes dispositivos?

---

## 11. Render Delay

**Render Delay** representa o tempo entre o recurso estar disponível e o momento em que o navegador consegue apresentar o conteúdo como LCP.

Exemplo:

```text
Recurso terminou de carregar
        ↓
Browser ainda está processando
        ↓
Estilos / Layout / JavaScript / Renderização
        ↓
Elemento aparece
        ↓
LCP
```

### Possíveis fatores

* JavaScript executando no Main Thread;
* tarefas longas;
* cálculo de estilos;
* layout;
* pintura;
* processamento da aplicação;
* dependências que precisam ser concluídas antes da renderização.

### Importante

Não confunda:

```text
Load Time
→ tempo para o recurso chegar

Render Delay
→ tempo para o conteúdo aparecer depois que o recurso está disponível
```

### Ferramenta de investigação

No **Chrome DevTools → Performance**, podemos observar:

* Main Thread;
* JavaScript;
* Long Tasks;
* Style Calculation;
* Layout;
* Paint;
* Rendering.

---

## 12. As fases do LCP

Para investigação, podemos usar este modelo simplificado:

```text
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

Exemplo:

```text
TTFB          = 0,5s
Load Delay    = 0,4s
Load Time     = 1,0s
Render Delay  = 0,3s
-------------------
LCP           = 2,2s
```

Esse modelo ajuda a responder:

| Pergunta                                                   | Fase             |
| ---------------------------------------------------------- | ---------------- |
| A resposta começou tarde?                                  | **TTFB**         |
| O recurso foi descoberto tarde?                            | **Load Delay**   |
| O recurso demorou para baixar?                             | **Load Time**    |
| O recurso já estava disponível, mas demorou para aparecer? | **Render Delay** |

### Por que essa divisão é importante?

Duas páginas podem ter o mesmo LCP, mas problemas completamente diferentes.

```text
Página A

TTFB          ████████
Load Delay    ██
Load Time     ██
Render Delay  █
              ↓
             LCP
```

```text
Página B

TTFB          █
Load Delay    ██
Load Time     ████████
Render Delay  ██
              ↓
             LCP
```

As duas podem apresentar o mesmo resultado final, mas a investigação será diferente.

> **LCP responde "quanto tempo levou".**
>
> **A análise das fases ajuda a responder "onde esse tempo foi gasto".**

---

## Modelo mental para investigar LCP

Sempre que encontrar um LCP alto, siga esta sequência:

```text
1. Qual foi o valor do LCP?
          ↓
2. Qual elemento foi o LCP?
          ↓
3. Quando ele foi descoberto?
          ↓
4. Quando começou a carregar?
          ↓
5. Quanto tempo levou para baixar?
          ↓
6. Quando ficou disponível?
          ↓
7. O que atrasou a renderização?
          ↓
8. Qual camada está contribuindo?
          ↓
Backend / Rede / Frontend / Dispositivo
```
> **Não basta saber que o LCP está ruim. É preciso descobrir em qual etapa do carregamento o tempo está sendo gasto.**
