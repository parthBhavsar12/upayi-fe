import { ReactNode } from 'react';

interface PageLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function PageLayout({ eyebrow, title, description, children }: PageLayoutProps) {
  return (
    <div className="payment-page">
      <section className="payment-layout">
        <div className="payment-copy">
          <p className="payment-copy__eyebrow">{eyebrow}</p>
          <h1 className="payment-copy__title">{title}</h1>
          <p className="payment-copy__description">{description}</p>
        </div>

        <div className="phone-frame" aria-label="Screen preview">
          <div className="phone-frame__speaker" aria-hidden="true" />
          {children}
        </div>
      </section>
    </div>
  );
}
