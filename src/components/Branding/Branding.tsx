export function Logo() {
  return (
    <div className="brand-logo" aria-label='UPayI'>
      <span className="brand-logo__part">UP</span>
      <span className="brand-logo__part brand-logo__part--alt">ay</span>
      <span className="brand-logo__part">I</span>
      <span className="brand-logo__accent">.</span>
    </div>
  );
}

export function BrandingSubtitle() {
  return (
    <div className="branding-subtitle">
      <strong>Secure UPI payment</strong>
    </div>
  );
}

export function Branding() {
  return (
    <div className="branding-content">
      <Logo />
      <BrandingSubtitle />
    </div>
  );
}
