export function Brand({ dark = false }) {
  return <div className={`brand ${dark ? 'dark' : ''}`} aria-label="Ivy Homes"><span aria-hidden="true">IH</span><div><strong>ivy homes</strong><small>property intelligence</small></div></div>;
}