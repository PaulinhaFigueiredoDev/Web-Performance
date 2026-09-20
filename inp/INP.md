# INP — Interaction to Next Paint

## Sumário

1. [O que é INP?](#1-o-que-é-inp)
2. [Como interpretar o resultado?](#2-como-interpretar-o-resultado)
3. [O que o INP mede?](#3-o-que-o-inp-mede)
4. [Principais fatores que influenciam o INP](#4-principais-fatores-que-influenciam-o-inp)
5. [Como o INP é decomposto?](#5-como-o-inp-é-decomposto)
6. [Como investigar um INP alto?](#6-como-investigar-um-inp-alto)
7. [Ferramentas](#7-ferramentas)
8. [FID x INP](#8-fid-x-inp)
9. [Modelo mental](#9-modelo-mental)
10. [Resumo](#10-resumo)

---

# 1. O que é INP?

**INP (Interaction to Next Paint)** é um **Core Web Vital** que mede a responsividade de uma página às interações do usuário.

Em termos simples:

> **Quanto tempo passa entre uma interação do usuário e a próxima atualização visual da interface?**

Exemplo:

```text
Usuário interage
       ↓
Navegador recebe a interação
       ↓
Processamento
       ↓
Renderização
       ↓
Próximo Paint
```

O INP representa a **responsividade da página durante seu uso**, considerando as interações realizadas pelo usuário.

---

# 2. Como interpretar o resultado?

| INP                     | Classificação    |
| ----------------------- | ---------------- |
| **≤ 200 ms**            | Bom              |
| **> 200 ms e ≤ 500 ms** | Precisa melhorar |
| **> 500 ms**            | Ruim             |

Exemplos:

```text
120 ms → Bom
250 ms → Precisa melhorar
700 ms → Ruim
```

Um INP alto não significa necessariamente que o JavaScript demorou o mesmo tempo.

O resultado pode envolver diferentes etapas da interação:

```text
Interação
    ↓
Input Delay
    ↓
Processing Time
    ↓
Presentation Delay
    ↓
Next Paint
```

Por isso, o valor do INP é o **ponto de partida para a investigação**.

---

# 3. O que o INP mede?

O INP mede a **responsividade da interface**, observando o tempo entre uma interação e a próxima atualização visual.

Exemplos de interações:

* clique;
* toque;
* pressionamento de tecla;
* digitação;
* seleção de controles.

O INP **não mede**:

* carregamento inicial da página;
* estabilidade visual;
* tempo para todas as imagens carregarem;
* tamanho da página;
* apenas o JavaScript da aplicação.

É possível ter:

```text
LCP → Bom
INP → Ruim
```

Nesse caso, o conteúdo inicial pode aparecer rapidamente, mas a interface pode demorar para responder às interações.

---

# 4. Principais fatores que influenciam o INP

| Fator           | Exemplos                                   |
| --------------- | ------------------------------------------ |
| **JavaScript**  | código pesado, loops, event handlers       |
| **Main Thread** | Long Tasks, processamento concorrente      |
| **Framework**   | atualização de estado, renderização        |
| **DOM**         | muitas alterações, estruturas complexas    |
| **CSS**         | cálculo de estilos, layout, paint          |
| **Terceiros**   | analytics, anúncios, widgets               |
| **Dispositivo** | CPU, memória e capacidade de processamento |

Um ponto importante é que o problema pode acontecer **antes da interação começar a ser processada**.

Exemplo:

```text
Long Task
████████████████████

        usuário clica
               ↓
        interação espera
               ↓
        processamento
```

Mesmo que o `click` tenha um handler rápido, a interação pode apresentar um INP alto se a Main Thread estiver ocupada.

---

# 5. Como o INP é decomposto?

Para investigação, podemos dividir uma interação em três etapas principais:

```text
Interação
    ↓
Input Delay
    ↓
Processing Time
    ↓
Presentation Delay
    ↓
Next Paint
```

### Input Delay

É o tempo entre a interação do usuário e o início do processamento.

Pode aumentar quando a **Main Thread está ocupada**.

Principais causas:

* Long Tasks;
* JavaScript executando anteriormente;
* scripts de terceiros;
* processamento pesado.

Pergunta para investigação:

> **O que estava ocupando a Main Thread quando o usuário interagiu?**

---

### Processing Time

É o tempo gasto processando os eventos relacionados à interação.

Pode envolver:

* event handlers;
* JavaScript da aplicação;
* atualização de estado;
* framework;
* manipulação do DOM;
* scripts de terceiros.

Pergunta para investigação:

> **O que foi executado durante o processamento da interação?**

---

### Presentation Delay

É o tempo entre o fim do processamento e a apresentação da próxima atualização visual.

Pode envolver:

* cálculo de estilos;
* layout;
* paint;
* atualização do DOM;
* renderização do framework;
* trabalho adicional na Main Thread.

Pergunta para investigação:

> **O que atrasou a atualização visual depois que o processamento terminou?**

---

### Modelo simplificado

```text
INP
 ↓
Input Delay
+
Processing Time
+
Presentation Delay
```

Essa decomposição é principalmente um **modelo de investigação** para entender onde o tempo da interação foi gasto.

---

# 6. Como investigar um INP alto?

Use esta sequência:

```text
INP alto
   ↓
Qual interação foi lenta?
   ↓
Input Delay
   ↓
O que estava ocupando a Main Thread?
   ↓
Processing Time
   ↓
Qual código/processamento executou?
   ↓
Presentation Delay
   ↓
O que atrasou a atualização visual?
```

Durante a investigação, procure:

* Long Tasks;
* JavaScript pesado;
* event handlers demorados;
* atualizações grandes do DOM;
* renderização do framework;
* cálculo de estilos;
* Layout;
* Paint;
* scripts de terceiros.

A pergunta principal é:

> **Em qual etapa a interação perdeu tempo?**

---

# 7. Ferramentas

### Chrome DevTools — Performance

Principal ferramenta para investigar a causa de um INP alto.

Permite observar:

* interações;
* Main Thread;
* Long Tasks;
* JavaScript;
* Event Handlers;
* Style Calculation;
* Layout;
* Paint;
* Rendering.

O objetivo não é apenas encontrar o valor do INP, mas entender **o que aconteceu durante a interação**.

### PageSpeed Insights

Útil para consultar os dados de performance de uma página e verificar Core Web Vitals, incluindo dados de campo quando disponíveis.

### Lighthouse

Útil para testes de laboratório e análise de performance em um ambiente controlado.

### CrUX

Fornece dados de experiência de usuários reais para páginas e origens elegíveis.

---

# 8. FID x INP

**FID (First Input Delay)** foi a métrica utilizada anteriormente para avaliar a responsividade inicial.

O FID focava principalmente no atraso até o navegador conseguir começar a processar a **primeira interação**.

O INP oferece uma visão mais abrangente da responsividade durante o uso da página.

```text
FID
 ↓
Primeira interação
 ↓
Atraso até iniciar o processamento


INP
 ↓
Interações durante o uso
 ↓
Input Delay
 ↓
Processing Time
 ↓
Presentation Delay
 ↓
Next Paint
```

O **FID foi substituído pelo INP como Core Web Vital de responsividade em março de 2024**.

Para estudos atuais de Web Performance, o foco deve ser o **INP**.

---

# 9. Modelo mental

Quando encontrar um INP alto, pense:

```text
INP alto
   ↓
Qual interação?
   ↓
A Main Thread estava ocupada?
   ↓
Input Delay
   ↓
O processamento demorou?
   ↓
Processing Time
   ↓
A atualização visual demorou?
   ↓
Presentation Delay
```

De forma ainda mais simples:

```text
Usuário interagiu
       ↓
A Main Thread estava ocupada?
       ↓
O processamento demorou?
       ↓
A renderização demorou?
       ↓
Next Paint
```

O INP é o **resultado**.

A investigação consiste em descobrir **onde a interação perdeu tempo**.

---

# 10. Resumo

```text
INP
 ↓
Responsividade
 ↓
Interação do usuário
 ↓
Next Paint
```

Para investigar:

```text
Input Delay
      ↓
Processing Time
      ↓
Presentation Delay
      ↓
Next Paint
```

> **INP é uma métrica de resultado. Para entender um INP alto, precisamos investigar onde a interação perdeu tempo.**

## Core Web Vitals

| Métrica | O que representa    | Unidade       |
| ------- | ------------------- | ------------- |
| **LCP** | Carregamento        | segundos      |
| **INP** | Responsividade      | milissegundos |
| **CLS** | Estabilidade visual | sem unidade   |
