---
name: Dev Focus
colors:
  surface: '#12121e'
  surface-dim: '#12121e'
  surface-bright: '#383845'
  surface-container-lowest: '#0d0d19'
  surface-container-low: '#1a1a26'
  surface-container: '#1f1e2b'
  surface-container-high: '#292935'
  surface-container-highest: '#343441'
  on-surface: '#e3e0f2'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e3e0f2'
  inverse-on-surface: '#2f2f3c'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#ffb783'
  on-tertiary: '#4f2500'
  tertiary-container: '#d97721'
  on-tertiary-container: '#452000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#12121e'
  on-background: '#e3e0f2'
  surface-variant: '#343441'
typography:
  headline-h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-h1-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-h2:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  container-max: 1280px
---

## Brand & Style

O sistema de design é fundamentado no conceito de "Foco de Alta Performance". A personalidade da marca é técnica, minimalista e centrada na utilidade, evocando a precisão de ferramentas de desenvolvimento (IDE) com a fluidez de interfaces modernas de produtividade.

O estilo visual utiliza uma abordagem **Minimalista-Técnica**. O objetivo é reduzir a carga cognitiva, permitindo que o usuário se concentre exclusivamente nas suas tarefas, enquanto elementos de gamificação pontuais trazem uma camada de recompensa visual sem distrair do fluxo de trabalho principal. A interface deve parecer rápida, responsiva e robusta.

## Colors

A paleta é otimizada para longas sessões de trabalho, utilizando um fundo "Dark Navy" profundo para reduzir a fadiga ocular.

- **Primária (Indigo):** Utilizada para ações principais, estados de foco e caminhos críticos de navegação. Representa a lógica e a estrutura técnica.
- **Destaque (Amber):** Reservada exclusivamente para gamificação, streaks, conquistas e estados de sucesso. Este contraste quente contra o fundo frio sinaliza recompensa.
- **Superfícies:** Camadas de profundidade são criadas através de variações sutis de cinzas azulados escuros, mantendo a hierarquia visual sem o uso de bordas excessivas.
- **Status:** Sucesso (Emerald-500), Erro (Rose-500), Alerta (Amber-500).

## Typography

A tipografia utiliza a família **Inter** por sua legibilidade excepcional em interfaces técnicas e sua neutralidade moderna.

A escala tipográfica é compacta para maximizar a densidade de informações, permitindo que mais dados (tarefas, metadados, tags) sejam visíveis simultaneamente. Usamos `letter-spacing` negativo nos títulos para uma aparência mais robusta e "premium", enquanto os labels utilizam um espaçamento levemente maior para garantir clareza em tamanhos reduzidos.

## Layout & Spacing

O sistema utiliza um modelo de **Grid Fluido** baseado em uma unidade base de 4px, garantindo que todos os elementos alinhem-se matematicamente.

- **Desktop:** Grid de 12 colunas com margens laterais generosas (64px+) para centralizar o foco. Painéis laterais de navegação são fixos (240px).
- **Mobile:** Layout de coluna única com margens de 16px. Componentes como tabelas de tarefas transicionam para visualizações em lista (cards).
- **Rimo Espacial:** O espaçamento entre cards de tarefas (md: 16px) é maior que o espaçamento interno dos elementos do card (sm: 8px) para criar agrupamentos visuais claros via proximidade.

## Elevation & Depth

A profundidade neste sistema de design é transmitida através de **Camadas Tonais** e bordas sutis, inspiradas pela estética shadcn/ui.

1. **Nível 0 (Background):** #0F0F17 - A base do sistema.
2. **Nível 1 (Cards/Superfícies):** #1A1A26 - Elementos contidos. Possuem uma borda de 1px com opacidade baixa (white 5%) para definir limites sem criar ruído visual.
3. **Nível 2 (Popovers/Modais):** #1E1E2E - Elementos flutuantes. Utilizam sombras ambientais suaves (0 10px 15px -3px rgba(0,0,0,0.5)) para indicar elevação física sobre a interface.

Interações de hover em elementos clicáveis devem aumentar levemente a luminosidade do fundo ou a intensidade da borda, nunca apenas a sombra.

## Shapes

A linguagem de formas é moderadamente arredondada para equilibrar o rigor técnico com uma sensação moderna e acessível.

- **Padrão:** 12px (0.75rem) para cards, botões principais e inputs.
- **Pequeno:** 6px para tags, chips e checkboxes.
- **Gamificação:** Elementos de conquista podem usar formas orgânicas ou "squircle" para se diferenciarem da rigidez das tarefas comuns.

## Components

Os componentes seguem a filosofia de baixo contraste e alta funcionalidade.

- **Botões:** O botão primário utiliza o Indigo (#6366F1) com texto branco. Botões secundários utilizam um outline sutil ou fundo levemente mais claro que a superfície. O estado de "Focus" deve ser marcado por um anel (ring) Indigo de 2px com offset.
- **Cards de Tarefa:** Devem ser limpos. Título da tarefa em `body-base`, metadados (data, prioridade) em `label-md`. Uma borda lateral colorida pode indicar a prioridade.
- **Inputs:** Fundo escuro (#0F0F17), borda cinza discreta que se torna Indigo ao focar. O texto de placeholder deve ter contraste reduzido.
- **Gamificação (Streaks/XP):** Progress bars utilizam gradientes sutis de Amber. Ícones de "Fire" para streaks devem usar brilho externo (glow) suave em Amber para atrair o olhar.
- **Checkboxes:** Quando marcados, realizam uma animação de preenchimento suave. A tarefa concluída deve sofrer um decréscimo de opacidade (60%) e um "strikethrough" fino.
- **Lists:** Espaçamento denso, separadores de 1px apenas entre itens se necessário; preferencialmente usar apenas espaçamento negativo para separar grupos.