This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# tmeal-restaurant-delicius
# tmeal-restaurant-delicius
# tmeal-restaurant-delicius
# tmeal-restaurant-delicius
## Supabase y panel administrativo

El proyecto incluye un panel protegido en `/admin`. Para activarlo:

1. Ejecuta la migración y el seed que están en `supabase/migrations/` y `supabase/seed.sql` desde el SQL Editor de Supabase.
2. Crea el usuario administrador en Supabase Auth y añádelo a `public.restaurant_admins`.
3. Configura las tres variables de `.env.example` en Vercel. La clave `SUPABASE_SERVICE_ROLE_KEY` es secreta y nunca debe comenzar por `NEXT_PUBLIC_`.
4. Vuelve a desplegar Vercel. El menú público sincronizará los platos disponibles y `/admin` permitirá administrar el restaurante.
