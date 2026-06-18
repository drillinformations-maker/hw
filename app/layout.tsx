import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Headway Broker Review 2026 | Best Forex Broker',
  description: 'Looking for the best Forex broker? Read our honest Headway Broker Review 2026. Discover their $1 minimum deposit...',
  verification: {
    google: "ncIG00s8IVc-iBiofHm26zUFYnTtp-kdb7hXq1wwT0q", 
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
