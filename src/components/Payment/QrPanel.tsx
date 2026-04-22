import { QRCodeSVG } from 'qrcode.react';
import { env } from '../../config/env';

interface QrPanelProps {
  amount: string;
  paymentUrl: string;
}

export function QrPanel({ amount, paymentUrl }: QrPanelProps) {
  return (
    <section className="qr-panel" aria-label="Generated UPI QR code">
      <div className="qr-panel__details">
        <span>Scan to pay</span>
        <strong className="money-value">
          <span>{env.upiCurrencySymbol}</span>
          <span>{amount}</span>
        </strong>
        <small>{env.payeeName}</small>
      </div>
      <div className="qr-panel__code">
        <QRCodeSVG
          value={paymentUrl}
          size={220}
          bgColor="#ffffff"
          fgColor="#075985"
          level="M"
          includeMargin={false}
        />
      </div>
    </section>
  );
}
