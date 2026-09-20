# INP — Interaction to Next Paint

## Sumário

1. [O que é INP?](#1-o-que-é-inp)
2. [O que é uma interação?](#2-o-que-é-uma-interação)
3. [Como interpretar o resultado?](#3-como-interpretar-o-resultado)
4. [O que o INP realmente mede?](#4-o-que-o-inp-realmente-mede)
5. [Por que o INP é importante?](#5-por-que-o-inp-é-importante)
6. [INP depende apenas do JavaScript?](#6-inp-depende-apenas-do-javascript)
7. [Principais fatores que influenciam o INP](#7-principais-fatores-que-influenciam-o-inp)
8. [Input Delay](#8-input-delay)
9. [Processing Time](#9-processing-time)
10. [Presentation Delay](#10-presentation-delay)
11. [As fases do INP](#11-as-fases-do-inp)
12. [Como investigar um INP alto](#12-como-investigar-um-inp-alto)
13. [FID x INP](#13-fid-x-inp)
14. [Modelo mental para investigar INP](#14-modelo-mental-para-investigar-inp)

---

# 1. O que é INP?

**INP (Interaction to Next Paint)** é um **Core Web Vital** que mede a capacidade de resposta de uma página às interações do usuário.

Em termos simples:

> **Quanto tempo passa desde uma interação do usuário até a próxima atualização visual da página?**

Exemplo:

```text
Usuário clica
     ↓
Navegador recebe a interação
     ↓
JavaScript é processado
     ↓
Browser atualiza a interface
     ↓
Próximo frame é apresentado
```

O INP procura representar a **responsividade da página durante seu uso**, considerando as interações que acontecem nela.

---

# 2. O que é uma interação?

Uma interação acontece quando o usuário realiza uma ação que pode provocar uma resposta da interface.

Exemplos:

* clicar em um botão;
* tocar em um elemento;
* pressionar uma tecla;
* digitar em um campo;
* selecionar uma opção;
* interagir com controles da interface.

Uma interação pode envolver vários eventos.

Por exemplo:

```text
Usuário clica
     ↓
pointerdown
     ↓
pointerup
     ↓
click
     ↓
processamento
     ↓
renderização
     ↓
próximo paint
```

O objetivo do INP é avaliar quanto tempo a interface leva para responder visualmente a essas interações.

---

# 3. Como interpretar o resultado?

Os valores de referência do INP são:

| INP                     | Classificação    |
| ----------------------- | ---------------- |
| **≤ 200 ms**            | Bom              |
| **> 200 ms e ≤ 500 ms** | Precisa melhorar |
| **> 500 ms**            | Ruim             |

Exemplos:

* `120 ms` → bom
* `180 ms` → bom
* `250 ms` → precisa melhorar
* `450 ms` → precisa melhorar
* `700 ms` → ruim

### O que o número significa?

Imagine:

```text
INP = 600 ms
```

Isso não significa simplesmente:

> "O JavaScript demorou 600 ms."

O valor pode envolver diferentes etapas da interação:

```text
Interação
    ↓
Input Delay
    ↓
Processing Time
    ↓
Presentation Delay
    ↓
Próximo Paint
```

Por isso, o resultado do INP é o **ponto de partida para a investigação**.

---

# 4. O que o INP realmente mede?

O INP mede o tempo entre uma interação do usuário e a próxima atualização visual apresentada pelo navegador.

Ele está relacionado à **responsividade da interface**.

O INP **não mede**:

* tempo de carregamento inicial;
* velocidade do servidor;
* tamanho da página;
* tempo para todas as imagens carregarem;
* estabilidade visual;
* apenas o JavaScript escrito pela aplicação.

Uma página pode ter:

```text
LCP → bom
INP → ruim
```

Isso significa que o conteúdo apareceu rapidamente, mas a interface pode estar demorando para responder às interações.

Da mesma forma:

```text
LCP → ruim
INP → bom
```

A página pode demorar para apresentar o conteúdo inicial, mas responder rapidamente depois que o usuário interage.

---

# 5. Por que o INP é importante?

O INP representa uma parte diferente da experiência de performance:

```text
LCP
↓
"Quando o conteúdo aparece?"

INP
↓
"Quando a interface responde?"

CLS
↓
"A interface permanece estável?"
```

Os três fazem parte dos **Core Web Vitals atuais**:

| Métrica | O que avalia        |
| ------- | ------------------- |
| **LCP** | Carregamento        |
| **INP** | Responsividade      |
| **CLS** | Estabilidade visual |

O INP é especialmente importante porque uma página pode parecer carregada e, ainda assim, apresentar interações lentas.

---

# 6. INP depende apenas do JavaScript?

Não.

O JavaScript é frequentemente importante na investigação, mas o INP pode ser afetado por diferentes etapas da interação.

Podemos pensar nesta cadeia:

```text
Usuário interage
       ↓
Main Thread está disponível?
       ↓
Evento pode começar?
       ↓
JavaScript/event handlers são executados
       ↓
DOM / estado / framework são processados
       ↓
Styles / Layout / Paint
       ↓
Próximo frame
```

Por isso, um INP alto pode estar relacionado a:

* tarefas longas;
* JavaScript;
* event handlers;
* código de terceiros;
* processamento de frameworks;
* atualizações do DOM;
* cálculo de estilos;
* layout;
* pintura;
* renderização complexa;
* Main Thread ocupado.

O próprio web.dev demonstra que tanto código dentro de listeners quanto trabalho que bloqueia a Main Thread pode aumentar a duração de uma interação.

---

# 7. Principais fatores que influenciam o INP

Podemos organizar os fatores em grupos:

| Grupo           | Exemplos                                           |
| --------------- | -------------------------------------------------- |
| **JavaScript**  | código pesado, event handlers, loops               |
| **Main Thread** | tarefas longas, processamento concorrente          |
| **Framework**   | renderização, atualização de estado, reconciliação |
| **DOM**         | muitas alterações, estruturas complexas            |
| **CSS**         | cálculo de estilos, layout, pintura                |
| **Terceiros**   | analytics, anúncios, widgets, scripts externos     |
| **Dispositivo** | CPU, memória, capacidade de processamento          |

### Um ponto importante

Não é apenas o código executado **dentro do clique** que pode causar um INP alto.

Imagine:

```text
Tarefa longa
████████████████████████

                Usuário clica
                       ↓
                interação espera
```

Mesmo que o `click` tenha um handler rápido, a interação pode ficar esperando a Main Thread ficar disponível.

O web.dev demonstra esse cenário como **input delay** causado por uma tarefa longa que já estava executando quando a interação ocorreu.

---

# 8. Input Delay

**Input Delay** é o tempo que a interação fica esperando antes que seu processamento possa começar.

Exemplo:

```text
Tarefa longa
████████████████████████

                 ↓
              usuário
               clica
                 ↓
          espera a tarefa
                 ↓
        processamento começa
```

A interação chegou, mas a Main Thread estava ocupada.

### Possíveis causas

* Long Tasks;
* JavaScript executando anteriormente;
* scripts de terceiros;
* processamento pesado;
* tarefas concorrentes.

### Ao investigar

Pergunte:

* O que estava executando quando o usuário interagiu?
* Existe uma Long Task?
* A Main Thread estava bloqueada?
* Existe JavaScript de terceiros executando?
* O problema acontece de forma intermitente?

---

# 9. Processing Time

**Processing Time** é o tempo gasto processando os eventos associados à interação.

Exemplo:

```text
Usuário interage
      ↓
Input Delay
      ↓
Event handlers
      ↓
JavaScript
      ↓
Atualização de estado
      ↓
Processamento
```

Pode envolver:

* event listeners;
* JavaScript da aplicação;
* código de frameworks;
* atualização de estado;
* manipulação do DOM;
* execução de scripts de terceiros.

### Exemplo

```javascript
button.addEventListener("click", () => {
  executarProcessamentoPesado();
  atualizarInterface();
});
```

Se `executarProcessamentoPesado()` bloquear a Main Thread, a interação pode ficar longa.

O web.dev demonstra que código executado dentro de listeners de eventos pode representar grande parte da duração de uma interação.

### Ao investigar

Pergunte:

* Qual listener está executando?
* Quanto tempo ele leva?
* Existe uma função pesada?
* Existe processamento desnecessário?
* O framework está realizando uma atualização grande?
* Existem scripts de terceiros envolvidos?

---

# 10. Presentation Delay

Depois que o processamento da interação termina, ainda pode existir trabalho necessário para que a atualização apareça na tela.

Esse período é o **Presentation Delay**.

```text
Processamento termina
        ↓
Styles
        ↓
Layout
        ↓
Paint
        ↓
Próximo frame
```

### Possíveis causas

* cálculo de estilos;
* layout;
* pintura;
* atualização grande do DOM;
* renderização do framework;
* efeitos visuais complexos;
* trabalho adicional na Main Thread.

Por isso:

> **Uma função de evento pode terminar rapidamente e, mesmo assim, a interação continuar lenta.**

O web.dev mostra, por exemplo, que trabalho executado próximo da próxima renderização pode aumentar o atraso de apresentação.

---

# 11. As fases do INP

Para investigação, podemos usar este modelo:

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

De forma simplificada:

```text
INP
 ↓
Input Delay
+
Processing Time
+
Presentation Delay
```

### Exemplo

Imagine uma interação:

```text
Input Delay        = 120 ms
Processing Time    = 100 ms
Presentation Delay = 80 ms
--------------------------------
INP                = 300 ms
```

Nesse caso:

```text
300 ms
   ↓
Precisa melhorar
```

Mas o mais importante para a investigação é perceber **qual etapa está consumindo o tempo**.

---

# 12. Como investigar um INP alto

Quando encontrar um INP alto, siga esta sequência:

```text
1. Qual foi o valor do INP?
          ↓
2. Qual interação foi lenta?
          ↓
3. O problema aconteceu no Input Delay?
          ↓
4. O problema aconteceu no Processing Time?
          ↓
5. O problema aconteceu no Presentation Delay?
          ↓
6. O que estava ocupando a Main Thread?
          ↓
7. Qual código estava sendo executado?
          ↓
8. Qual parte da interface precisava ser atualizada?
```

### Chrome DevTools

No **Chrome DevTools → Performance**, podemos investigar:

* registro de interações;
* Main Thread;
* Long Tasks;
* JavaScript;
* Event Handlers;
* Style Calculation;
* Layout;
* Paint;
* Rendering.

O web.dev recomenda usar o registro de interações do painel Performance para identificar interações lentas e, quando possível, gravar um trace para investigar a causa.

---

# 13. FID x INP

O **FID (First Input Delay)** foi a métrica anterior utilizada para avaliar a responsividade inicial.

O FID focava principalmente no atraso até o navegador conseguir começar a processar a **primeira interação**.

O INP foi adotado para representar a responsividade de forma mais abrangente.

```text
FID
 ↓
Primeira interação
 ↓
Atraso até começar o processamento


INP
 ↓
Interações durante a página
 ↓
Input Delay
 ↓
Processing Time
 ↓
Presentation Delay
 ↓
Next Paint
```

Por isso:

> **FID é uma métrica histórica; INP é o Core Web Vital atual para responsividade.**

---

# 14. Modelo mental para investigar INP

Sempre que encontrar um INP alto, pense:

```text
INP alto
   ↓
Qual interação?
   ↓
O que aconteceu antes do processamento?
   ↓
Input Delay
   ↓
O que aconteceu durante o processamento?
   ↓
Processing Time
   ↓
O que aconteceu antes da atualização aparecer?
   ↓
Presentation Delay
```

Ou, de forma ainda mais simples:

```text
Usuário interagiu
       ↓
A Main Thread estava ocupada?
       ↓
O processamento demorou?
       ↓
A renderização demorou?
       ↓
Próximo Paint
```

### A pergunta principal

> **"Em qual etapa a interação ficou esperando?"**

Essa pergunta ajuda a transformar:

```text
INP = 600 ms
```
em uma investigação:

```text
600 ms
  ↓
120 ms Input Delay
  ↓
350 ms Processing Time
  ↓
130 ms Presentation Delay
```
Agora sabemos **onde procurar o problema**.

---

## Resumo

```text
LCP
→ Quanto tempo até o conteúdo aparecer?

INP
→ Quanto tempo até a interface responder visualmente?

CLS
→ A interface permanece estável?
```

Para INP:

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
> **INP é uma métrica de resultado. Para entender um INP alto, precisamos investigar onde a interação perdeu tempo.**
