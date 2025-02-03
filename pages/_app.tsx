// pages/_app.tsx

import type { AppProps } from 'next/app';
import '../styles/global.css';

function BudgetApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default BudgetApp;