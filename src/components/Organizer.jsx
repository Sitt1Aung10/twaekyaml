import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MESSAGES, normalizeJoinCode, organizerLabel, validateOrganizer } from '../../shared/meetup.js';
import { createMeeting } from '../api.js';
import { clearSession, readSession, writeSession } from '../session.js';

export default function Organizer() {
  const [session, setSession] = useState(() => readSession());
  const [method, setMethod] = useState('gmail');
  const [gmail, setGmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [signError, setSignError] = useState('');
  const [lookup, setLookup] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [creating, setCreating] = useState(false);
  const [decidedPlace, setDecidedPlace] = useState('');
  const navigate = useNavigate();
  const [created, setCreated] = useState(null);
  const [createError, setCreateError] = useState('');
  const [copied, setCopied] = useState('');

  function signIn(event) {
    event.preventDefault();
    const payload =
      method === 'gmail' ? { method: 'gmail', gmail } : { method: 'phone', name, phone };
    const checked = validateOrganizer(payload);
    if (!checked.ok) {
      setSignError(checked.message);
      return;
    }
    writeSession(checked.value);
    setSession(checked.value);
    setSignError('');
  }

  function signOut() {
    clearSession();
    setSession(null);
    setCreated(null);
    setLookup('');
    setLookupError('');
  }

  function viewRoom(event) {
    event.preventDefault();
    const code = normalizeJoinCode(lookup);
    if (!code) {
      setLookupError(MESSAGES.room);
      return;
    }
    setLookupError('');
    navigate(`/answers/${code}`);
  }

  async function onCreate() {
    setCreating(true);
    setCreateError('');
    try {
      const meeting = await createMeeting(session, decidedPlace.trim());
      const link = `${window.location.origin}${meeting.joinPath}`;
      setCreated({ ...meeting, link });
      setCopied('');
    } catch (error) {
      setCreateError(error.message);
    } finally {
      setCreating(false);
    }
  }

  async function copy(kind, value) {
    const fallback = () => {
      const area = document.createElement('textarea');
      area.value = value;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.top = '0';
      area.style.left = '0';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.focus();
      area.select();
      area.setSelectionRange(0, area.value.length);
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    };

    try {
      if (!navigator.clipboard?.writeText) {
        fallback();
      } else {
        const copiedByClipboard = await Promise.race([
          navigator.clipboard.writeText(value).then(() => true),
          new Promise((resolve) => {
            window.setTimeout(() => resolve(false), 500);
          }),
        ]);
        if (!copiedByClipboard) fallback();
      }
    } catch {
      fallback();
    }

    setCopied(kind);
    window.setTimeout(() => setCopied((current) => (current === kind ? '' : current)), 2000);
  }

  return (
    <section className="card organizer">
      <p className="kicker">စီစဉ်သူ</p>
      <h2>စီစဉ်သူအဖြစ် ဝင်ရန်</h2>

      {session ? (
        <div className="session-bar">
          <p>
            {session.method === 'gmail' ? 'Gmail ဖြင့် ဝင်ထားသည်' : 'အမည်နှင့် ဖုန်းဖြင့် ဝင်ထားသည်'}
            {' — '}
            <strong>{organizerLabel(session)}</strong>
          </p>
          <button type="button" className="btn secondary" onClick={signOut}>
            ထွက်မည်
          </button>
        </div>
      ) : (
        <form className="stack" onSubmit={signIn} noValidate>
          <p className="lede">အခန်းဖွင့်ရန် သို့မဟုတ် အဖြေများကြည့်ရန် အောက်က နည်းတစ်ခုနဲ့ ဝင်ပါ။</p>
          <select
            id="sign-in-method"
            value={method}
            aria-label="ဝင်ရောက်နည်း"
            onChange={(event) => {
              setMethod(event.target.value);
              setSignError('');
            }}
          >
            <option value="gmail">Gmail ဖြင့်</option>
            <option value="phone">အမည်နှင့် ဖုန်းဖြင့်</option>
          </select>

          {method === 'gmail' ? (
            <input
              id="organizer-gmail"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={gmail}
              placeholder="Gmail လိပ်စာ"
              aria-label="Gmail လိပ်စာ"
              aria-invalid={Boolean(signError)}
              onChange={(event) => setGmail(event.target.value)}
            />
          ) : (
            <>
              <input
                id="organizer-name"
                name="name"
                autoComplete="name"
                value={name}
                placeholder="အမည်"
                aria-label="အမည်"
                onChange={(event) => setName(event.target.value)}
              />
              <input
                id="organizer-phone"
                name="tel"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                placeholder="ဖုန်းနံပါတ်"
                aria-label="ဖုန်းနံပါတ်"
                onChange={(event) => setPhone(event.target.value)}
              />
            </>
          )}
          {signError ? (
            <p className="field-error" role="alert">
              {signError}
            </p>
          ) : null}
          <button type="submit" className="btn">
            ဝင်မည်
          </button>
        </form>
      )}

      {session ? (
        <div className="organizer-tools">
          <form className="stack" onSubmit={viewRoom} noValidate>
            <h3>အခန်းကြည့်ရန်</h3>
            <input
              id="lookup-code"
              className="code-input"
              value={lookup}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck="false"
              maxLength={4}
              placeholder="အခန်းကုဒ်"
              aria-label="အခန်းကုဒ်"
              onChange={(event) => {
                setLookup(event.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4));
                setLookupError('');
              }}
            />
            <button type="submit" className="btn">
              အဖြေများ ကြည့်မည်
            </button>
            {lookupError ? (
              <p className="field-error" role="alert">
                {lookupError}
              </p>
            ) : null}
          </form>

          <div className="stack create-block">
            <h3>အခန်းအသစ် ဖွင့်ရန်</h3>
            <div className="decide-row">
              <p>တွေ့ဆုံမည့် နေရာ ဆုံးဖြတ်ပြီးပြီလား</p>
              <input
                id="decided-place"
                value={decidedPlace}
                placeholder="ဆုံးဖြတ်ထားသော နေရာ"
                aria-label="ဆုံးဖြတ်ထားသော နေရာ"
                onChange={(event) => setDecidedPlace(event.target.value)}
              />
            </div>
            <button type="button" className="btn" onClick={onCreate} disabled={creating}>
              {creating ? 'ဖွင့်နေပါတယ်…' : 'အခန်းအသစ် ဖွင့်မည်'}
            </button>
            {createError ? (
              <p className="field-error" role="alert">
                {createError}
              </p>
            ) : null}
            {created ? (
              <div className="created" aria-live="polite">
                <p className="hint">ဒီလင့်ခ်ကို ဘရောက်ဇာမှာ ဖွင့်ပြီး သူငယ်ချင်းတွေ ဝင်နိုင်ပါတယ်။</p>
                <p className="created-label">အခန်းကုဒ်</p>
                <p className="created-code">{created.code}</p>
                 <p className="hint" style={{ color: 'red',fontSize : "10px" }}>
              သတိပေးချက် - တစ်ပတ်ကြာရင် ကုဒ်သက်တမ်းကုန်ပြီး အချက်အလက်အားလုံး ပျက်ပါမယ်။
            </p>
                <button type="button" className="btn secondary" onClick={() => copy('code', created.code)}>
                  {copied === 'code' ? 'ကူးပြီးပါပြီ' : 'ကုဒ်ကူးမည်'}
                </button>
                <input
                  id="join-link"
                  readOnly
                  value={created.link}
                  placeholder="ပါဝင်ရန် လင့်ခ်"
                  aria-label="ပါဝင်ရန် လင့်ခ်"
                />
                <button type="button" className="btn secondary" onClick={() => copy('link', created.link)}>
                  {copied === 'link' ? 'ကူးပြီးပါပြီ' : 'လင့်ခ်ကူးမည်'}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
