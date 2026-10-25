import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  useEffect(() => {
    document.title = 'တွေ့ကြမယ် · သူငယ်ချင်းတွေ့ဆုံမှု စီစဉ်ရာ';
  }, []);

  return (
    <main className="landing">
      <div className="landing-wave" aria-hidden="true" />
      <div className="lanterns" aria-hidden="true">
        <img className="lantern lantern-orange" src="/lantern-orange.png" alt="" />
        <img className="lantern lantern-green" src="/lantern-green.png" alt="" />
        <img className="lantern lantern-pink" src="/lantern-pink.png" alt="" />
        <img className="lantern lantern-purple" src="/lantern-purple.png" alt="" />
      </div>
      <header className="landing-bar">
        <img className="nav-logo" src="/twaekyaml-logo.jpg" alt="twaekyaml" width="102" height="54" />
      </header>
      <div className="landing-card">
        <p className="eyebrow">ဟေး</p>
        <h1 className="landing-title">တွေ့ကြမယ်</h1>
        <div className="ornament" aria-hidden="true">
          <span />
        </div>
        <p className="landing-sub">
          တွေ့ကြမယ်သည် သူငယ်ချင်းအုပ်စုတွေ့ဆုံမှုကို စီစဉ်ပေးသော နေရာဖြစ်သည်။ အဖွဲ့သားတိုင်း တွေ့ဆုံလိုသည့် နေရာ၊ ပုံစံနှင့် အချိန်ကို ဖြည့်ပြီး အားလုံးအဆင်ပြေမည့် အချိန်ကို အတူရွေးနိုင်သည်။
        </p>
        <Link className="btn" to="/join">
          စတင်မည်
        </Link>
      </div>
    </main>
  );
}
