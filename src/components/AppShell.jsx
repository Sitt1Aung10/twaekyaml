import { Link } from 'react-router-dom';

export default function AppShell({ code, children, dense = false }) {
  return (
    <>
      <header className={dense ? 'topbar topbar-dense' : 'topbar'}>
        <div className="topbar-inner">
          <Link to="/" className="wordmark">
            တွေ့ကြမယ်
          </Link>
          {code ? (
            <p className="code-pill">
              <span>အခန်းကုဒ်</span>
              <strong>{code}</strong>
            </p>
          ) : null}
        </div>
      </header>
      <main className={dense ? 'site-page site-page-dense' : 'site-page'}>{children}</main>
    </>
  );
}
