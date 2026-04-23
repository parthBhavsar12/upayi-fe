import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export function PayeeDetails() {
  const { profile } = useSelector((state: RootState) => state.profile);

  if (!profile) {
    return null;
  }

  return (
    <section className="payee-panel" aria-label="Payee details">
      <span>Paying to</span>
      <strong>{profile.name}</strong>
      <small>{profile.upiId}</small>
    </section>
  );
}
