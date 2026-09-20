# CLS — Cumulative Layout Shift

## Sumário

1. [O que é CLS?](#1-o-que-é-cls)
2. [Como interpretar o resultado?](#2-como-interpretar-o-resultado)
3. [O que o CLS mede?](#3-o-que-o-cls-mede)
4. [O que pode causar um CLS alto?](#4-o-que-pode-causar-um-cls-alto)
5. [Como o CLS é calculado?](#5-como-o-cls-é-calculado)
6. [Como investigar um CLS alto?](#6-como-investigar-um-cls-alto)
7. [Ferramentas](#7-ferramentas)
8. [Modelo mental](#8-modelo-mental)
9. [Resumo](#9-resumo)

---

# 1. O que é CLS?

**CLS (Cumulative Layout Shift)** é um **Core Web Vital** que mede a **estabilidade visual** de uma página.

Em termos simples:

> **Quanto o conteúdo visível da página se desloca inesperadamente durante a experiência do usuário?**

Um **Layout Shift** acontece quando um elemento visível muda de posição entre frames renderizados.

Exemplo:

```text
Antes:

[Título]

[Botão]
```

Uma imagem aparece e empurra o botão:

```text
Depois:

[Título]

[Imagem]

[Botão]
```

O botão mudou de posição e ocorreu um **Layout Shift**.

### Importante

Nem toda alteração no DOM gera uma Layout Shift.

O que importa é se **elementos visíveis mudaram de posição**.

```text
Alteração
    ↓
Elemento visível muda de posição
    ↓
Layout Shift
    ↓
Pode contribuir para o CLS
```

---

# 2. Como interpretar o resultado?

O CLS é uma pontuação **sem unidade**.

|                CLS | Classificação    |
| -----------------: | ---------------- |
|          **≤ 0,1** | Bom              |
| **> 0,1 e ≤ 0,25** | Precisa melhorar |
|         **> 0,25** | Ruim             |

Exemplo:

```text
0,05 → Bom
0,15 → Precisa melhorar
0,30 → Ruim
```

Diferentemente de:

```text
LCP → segundos
INP → milissegundos
CLS → pontuação sem unidade
```

### O que significa um CLS alto?

Significa que houve **instabilidade visual relevante**.

A métrica indica **o resultado**, mas não a causa.

Por isso, diante de um CLS alto, a pergunta é:

> **Quais elementos se moveram e por que isso aconteceu?**

---

# 3. O que o CLS mede?

O CLS mede a **instabilidade visual causada por mudanças inesperadas de layout**.

O cálculo considera principalmente:

```text
Quanto da viewport foi afetado?
          +
Quanto os elementos se moveram?
```

Por isso, o CLS não é simplesmente a quantidade de mudanças ocorridas na página.

### O CLS não mede

* velocidade de carregamento;
* tempo de resposta de uma interação;
* quantidade de JavaScript;
* tamanho dos arquivos;
* quantidade de elementos no DOM;
* número bruto de alterações no DOM.

### CLS x outras métricas

```text
LCP
↓
Carregamento

INP
↓
Responsividade

CLS
↓
Estabilidade visual
```

---

# 4. O que pode causar um CLS alto?

As causas mais comuns estão relacionadas a conteúdo que aparece, muda de tamanho ou é reposicionado depois que a página já começou a ser exibida.

| Causa                 | Exemplo                                 |
| --------------------- | --------------------------------------- |
| **Imagens**           | dimensões não reservadas                |
| **Conteúdo dinâmico** | banners, mensagens, recomendações       |
| **Anúncios**          | espaço não reservado                    |
| **Iframes/embeds**    | tamanho definido posteriormente         |
| **Fontes**            | troca de fonte alterando o layout       |
| **CSS**               | alterações de tamanho ou posicionamento |
| **JavaScript**        | inserção ou alteração de elementos      |
| **Terceiros**         | scripts que inserem conteúdo            |

Um modelo simples:

```text
Recurso / conteúdo
        ↓
Carregamento ou atualização
        ↓
Elemento muda de tamanho/posição
        ↓
Outros elementos são deslocados
        ↓
Layout Shift
        ↓
CLS
```

### Exemplos importantes

**Imagem sem espaço reservado:**

```text
Imagem carrega
      ↓
Imagem ocupa espaço
      ↓
Conteúdo abaixo é empurrado
      ↓
Layout Shift
```

**Conteúdo dinâmico:**

```text
Página exibida
      ↓
Banner aparece
      ↓
Conteúdo existente é deslocado
      ↓
Layout Shift
```

**Fonte:**

```text
Fonte inicial
      ↓
Fonte Web carregada
      ↓
Texto muda de tamanho
      ↓
Layout pode mudar
```

---

# 5. Como o CLS é calculado?

Cada Layout Shift possui uma pontuação.

De forma simplificada:

```text
Layout Shift Score
        =
Impact Fraction × Distance Fraction
```

## Impact Fraction

Indica quanto da área visível foi afetada pelo deslocamento.

Pergunta:

> **Quanto conteúdo visível foi afetado?**

Quanto maior a área afetada, maior tende a ser o Impact Fraction.

---

## Distance Fraction

Indica quanto os elementos se deslocaram em relação à viewport.

Pergunta:

> **Quanto os elementos se moveram?**

O cálculo considera o maior deslocamento horizontal ou vertical em relação à maior dimensão da viewport.

---

## Session Window

Os Layout Shifts não são simplesmente somados durante toda a vida da página.

Eles são agrupados em **Session Windows**.

Uma Session Window:

* pode ter menos de **1 segundo entre shifts consecutivos**;
* pode durar no máximo **5 segundos**;
* soma os Layout Shifts dentro da janela.

O CLS considera a **maior soma encontrada em uma Session Window**.

```text
Shift → Shift → Shift
  └──────────────┘
   Session Window
```

### Modelo do cálculo

```text
Layout Shift
      ↓
Impact Fraction × Distance Fraction
      ↓
Layout Shift Score
      ↓
Session Window
      ↓
CLS
```

---

# 6. Como investigar um CLS alto?

O objetivo é sair de:

```text
CLS = 0,30
```

e descobrir:

```text
Qual elemento se moveu?
        ↓
Quanto foi afetado?
        ↓
Quanto se moveu?
        ↓
O que causou o deslocamento?
```

### Sequência de investigação

```text
CLS alto
   ↓
Qual Session Window teve a maior pontuação?
   ↓
Qual Layout Shift contribuiu?
   ↓
Qual elemento mudou de posição?
   ↓
Quanto da viewport foi afetado?
   ↓
Quanto o elemento se moveu?
   ↓
O que provocou o deslocamento?
   ↓
A mudança era esperada?
```

### Perguntas importantes

| Pergunta                    | O que investigar                      |
| --------------------------- | ------------------------------------- |
| **Qual elemento se moveu?** | elemento afetado pelo shift           |
| **Quanto foi afetado?**     | Impact Fraction                       |
| **Quanto se moveu?**        | Distance Fraction                     |
| **Por que se moveu?**       | imagem, conteúdo, fonte, CSS, JS etc. |
| **Era esperado?**           | relação com ação do usuário           |

### Exemplo

```text
CLS alto
   ↓
Layout Shift identificado
   ↓
Imagem carregou
   ↓
Espaço não estava reservado
   ↓
Conteúdo abaixo foi deslocado
```

Nesse ponto, a métrica deixou de ser apenas um número e passou a indicar **onde investigar o problema**.

---

# 7. Ferramentas

## Chrome DevTools — Performance

É uma das principais ferramentas para investigar o comportamento que gerou o CLS.

Pode ajudar a identificar:

* Layout Shifts;
* elementos afetados;
* momento do deslocamento;
* JavaScript executado;
* Main Thread;
* Style Calculation;
* Layout;
* Rendering.

Fluxo:

```text
Performance
    ↓
Layout Shift
    ↓
Elemento afetado
    ↓
O que aconteceu antes?
    ↓
Possível causa
```

---

## Lighthouse

Pode ser utilizado para avaliar problemas de estabilidade visual e outras métricas de performance.

---

## PageSpeed Insights

Pode apresentar dados de laboratório e, quando disponíveis, dados de usuários reais.

---

# 8. Modelo mental

Ao encontrar um CLS alto, pense:

```text
CLS alto
   ↓
Qual elemento se moveu?
   ↓
Quanto da viewport foi afetado?
   ↓
Quanto ele se moveu?
   ↓
O que causou o deslocamento?
   ↓
A mudança era esperada?
   ↓
Investigar no DevTools
```

A pergunta principal é:

> **O que fez esse conteúdo mudar de posição sem que o usuário esperasse?**

---

# 9. Resumo

### O que é?

**CLS mede a estabilidade visual da página.**

### Como interpretar?

```text
≤ 0,1       → Bom
> 0,1–0,25  → Precisa melhorar
> 0,25       → Ruim
```

### O que investigar?

```text
CLS
 ↓
Session Window
 ↓
Layout Shift
 ↓
Elemento afetado
 ↓
Impact Fraction
+
Distance Fraction
 ↓
Causa
```

### Quais ferramentas usar?

```text
Chrome DevTools
      ↓
Lighthouse
      ↓
PageSpeed Insights
```

### Pergunta principal

> **O que fez esse conteúdo mudar de posição e por que o usuário não esperava essa mudança?**

---

## Core Web Vitals

| Métrica | O que representa    | Unidade       |
| ------- | ------------------- | ------------- |
| **LCP** | Carregamento        | segundos      |
| **INP** | Responsividade      | milissegundos |
| **CLS** | Estabilidade visual | sem unidade   |
