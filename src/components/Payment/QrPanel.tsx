import { QRCodeSVG } from 'qrcode.react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { env } from '../../config/env';

interface QrPanelProps {
  amount: string;
  paymentUrl: string;
}

export function QrPanel({ amount, paymentUrl }: QrPanelProps) {
  const { profile } = useSelector((state: RootState) => state.profile);

  if (!profile) {
    return null;
  }

  return (
    <section className="qr-panel" aria-label="Generated UPI QR code">
      <div className="qr-panel__details">
        <span>Scan to pay</span>
        <strong className="money-value">
          <span>{env.upiCurrencySymbol}</span>
          <span>{amount}</span>
        </strong>
        <small>Receiver: {profile.name}</small>
        <small>UPI ID: {profile.upiId}</small>
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
