# EconoJuvi-Web

App web (PWA) para controle de finanças de um casal, pensado para uso no iPhone.

**Estado atual:** sem login, dados mockados no dashboard e tela para lançar gastos.
Os gastos lançados ficam salvos no `localStorage` do aparelho (por enquanto, sem backend).

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- React Router
- Recharts (gráficos)
- vite-plugin-pwa (manifest + service worker)

## Rodando

```bash
npm install
npm run dev        # http://localhost:5173 (também exposto na rede local)
npm run build      # typecheck + build de produção
npm run preview    # serve o build
npm run icons      # regenera os ícones PNG a partir de public/icon.svg
```

## Instalar no iPhone

O PWA só instala como app (e o service worker só funciona) em **HTTPS**. Faça o deploy do
`dist/` em qualquer hospedagem estática (Vercel, Netlify, Cloudflare Pages...) e então:

1. Abra a URL no **Safari**
2. Toque em Compartilhar → **Adicionar à Tela de Início**

O app abre em tela cheia, com ícone próprio e respeitando a área segura (notch / barra inferior).

## Estrutura

```
src/
  pages/Dashboard.tsx    resumo do mês (saldo, quem pagou, categorias, histórico, lançamentos)
  pages/AddExpense.tsx   formulário de novo gasto
  data/mock.ts           gerador dos dados mockados (relativos ao mês atual)
  data/constants.ts      pessoas, categorias e meta mensal
  store.tsx              estado global + persistência em localStorage
```

## Próximos passos sugeridos

- Backend + login para os dois usuários compartilharem os dados
- Editar / excluir lançamentos, navegar entre meses
- Gastos individuais (não divididos) e divisão desigual
- Receitas e metas por categoria
