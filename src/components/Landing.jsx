import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  useEffect(() => {
    document.title = 'တွေ့ကြမယ်';
  }, []);

  return (
    <main className="landing">
      <div className="landing-card">
        <p className="eyebrow">ဟေး</p>
        <h1 className="landing-title">တွေ့ကြမယ်</h1>
        <div className="ornament" aria-hidden="true">
          <span />
        </div>
        <p className="landing-sub">
          သူငယ်ချင်းတွေ ဒီဝက်ဘ်ဆိုက်မှာ နေရာ၊ ပုံစံ၊ အချိန်ကို စုစည်းပြီး တွေ့ဆုံကြမယ်။
        </p>
        <Link className="btn" to="/join">
          စတင်မည်
        </Link>
      </div>
    </main>
  );
}
