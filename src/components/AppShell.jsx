import { Link } from 'react-router-dom';

export default function AppShell({ code, children, dense = false }) {
  return (
    <>
      <header className={dense ? 'topbar topbar-dense' : 'topbar'}>
        <img className="topbar-art" src="/candle-lights.jpg" alt="" />
        <div className="topbar-inner">
          <Link to="/" className="wordmark">
            တွေ့ကြမယ်
          </Link>
          <div className="topbar-end">
            {code ? (
              <p className="code-pill">
                <span>အခန်းကုဒ်</span>
                <strong>{code}</strong>
              </p>
            ) : null}
            <img className="nav-logo" src="/twaekyaml-logo.jpg" alt="twaekyaml" width="102" height="54" />
          </div>
        </div>
      </header>
      <main className={dense ? 'site-page site-page-dense' : 'site-page'}>{children}</main>
    </>
  );
}
