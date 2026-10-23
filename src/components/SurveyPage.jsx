import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  MESSAGES,
  STYLES,
  formatAvailability,
  normalizeJoinCode,
  validateResponse,
} from '../../shared/meetup.js';
import { getResponses, saveResponse } from '../api.js';
import AppShell from './AppShell.jsx';
import ClockSelect from './ClockSelect.jsx';
import Assistant from './Assistant.jsx';
import Organizer from './Organizer.jsx';
import TimeModal from './TimeModal.jsx';

const idleRoom = { status: 'idle', code: '', fixedPlace: '', responses: [], suggestion: null, message: '' };

export default function SurveyPage() {
  const { code: rawCode } = useParams();
  const navigate = useNavigate();
  const lockedCode = rawCode ? normalizeJoinCode(rawCode) : '';
  const locked = Boolean(rawCode);
  const invalidLink = Boolean(rawCode) && !lockedCode;

  const [roomCode, setRoomCode] = useState(lockedCode);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [place, setPlace] = useState('');
  const [style, setStyle] = useState('');
  const [availability, setAvailability] = useState([]);
  const [arrival, setArrival] = useState('');
  const [errors, setErrors] = useState({});
  const [timeOpen, setTimeOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [room, setRoom] = useState(idleRoom);
  const [shakeSuggestion, setShakeSuggestion] = useState(false);
  const fetchGen = useRef(0);
  const shownSuggestionFor = useRef('');

  const activeCode = locked ? lockedCode : normalizeJoinCode(roomCode);

  useEffect(() => {
    document.title = 'ပါဝင်ရန် · တွေ့ကြမယ်';
  }, []);

  useEffect(() => {
    if (rawCode && lockedCode && rawCode !== lockedCode) {
      navigate(`/join/${lockedCode}`, { replace: true });
    }
  }, [rawCode, lockedCode, navigate]);

  useEffect(() => {
    if (!activeCode) {
      setRoom(idleRoom);
      return undefined;
    }
    let stop = false;

    async function load(quiet) {
      const mine = ++fetchGen.current;
      if (!quiet) {
        setRoom((previous) =>
          previous.status === 'ready' ? previous : { ...previous, status: 'loading', message: '' },
        );
      }
      try {
        const data = await getResponses(activeCode);
        if (stop || mine !== fetchGen.current) return;
        setRoom({
          status: 'ready',
          code: activeCode,
          fixedPlace: data.fixedPlace || '',
          responses: data.responses,
          suggestion: data.suggestion,
          message: '',
        });
      } catch (error) {
        if (stop || mine !== fetchGen.current) return;
        if (error.status === 404) {
          if (activeCode.length < 4) {
            setRoom(idleRoom);
            return;
          }
          setRoom({ status: 'missing', responses: [], suggestion: null, message: error.message });
          return;
        }
        setRoom((previous) =>
          previous.status === 'ready'
            ? previous
            : { status: 'error', responses: [], suggestion: null, message: error.message },
        );
      }
    }

    load(false);
    const timer = setInterval(() => load(true), 4000);
    return () => {
      stop = true;
      clearInterval(timer);
    };
  }, [activeCode]);

  useEffect(() => {
    if (shownSuggestionFor.current && shownSuggestionFor.current !== activeCode) {
      shownSuggestionFor.current = '';
      setShakeSuggestion(false);
    }
    if (room.status !== 'ready' || room.code !== activeCode || !room.suggestion) return undefined;
    if (shownSuggestionFor.current === activeCode) return undefined;
    shownSuggestionFor.current = activeCode;
    setShakeSuggestion(false);
    const timer = window.setTimeout(() => setShakeSuggestion(true), 30);
    return () => window.clearTimeout(timer);
  }, [activeCode, room.status, room.code, room.suggestion]);

  const decidedPlace = room.code === activeCode ? room.fixedPlace : '';

  async function onSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!activeCode) nextErrors.room = MESSAGES.room;
    const checked = validateResponse({
      name,
      phone,
      place: decidedPlace || place,
      style,
      availability,
      arrival,
      fixedPlace: decidedPlace,
    });
    if (!checked.ok) Object.assign(nextErrors, checked.errors);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const saved = await saveResponse(activeCode, checked.value);
      fetchGen.current += 1;
      setSuccess({ updated: saved.updated, name: checked.value.name });
      setRoom({
        status: 'ready',
        code: activeCode,
        fixedPlace: saved.fixedPlace || decidedPlace,
        responses: saved.responses,
        suggestion: saved.suggestion,
        message: '',
      });
      setName(checked.value.name);
      setPhone(checked.value.phone);
    } catch (error) {
      if (error.field) setErrors({ [error.field]: error.message });
      else if (error.status === 404) setErrors({ room: error.message });
      else setErrors({ form: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  if (invalidLink) {
    return (
      <AppShell>
        <section className="card">
          <h1>လင့်ခ် မမှန်ပါ</h1>
          <p>အခန်းကုဒ်သည် အင်္ဂလိပ်အက္ခရာ ၁ လုံးမှ ၄ လုံး ဖြစ်ရပါမည်။</p>
          <Link className="btn" to="/join">
            ကိုယ်တိုင် ထည့်မည်
          </Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell code={activeCode} dense>
      <section className="card survey-card">
        <h5>တွေ့ဆုံမည့် အချက်အလက်</h5>
        <p className="lede">ဒီဝက်ဘ်ဆိုက်စာမျက်နှာမှာ အခန်းတစ်ခန်းအတွက် နေရာနဲ့ အချိန်ကို ဖြည့်ပါ။</p>

        <form className="stack" onSubmit={onSubmit} noValidate>
          {errors.form ? (
            <p className="field-error" role="alert">
              {errors.form}
            </p>
          ) : null}

          {locked ? (
            <div className="locked-code">
              <span>အခန်းကုဒ်</span>
              <strong>{lockedCode}</strong>
              <p className="hint">လင့်ခ်မှ ဝင်ထားသောကြောင့် ဒီအခန်းကိုပဲ ဝင်ပါမယ်။</p>
            </div>
          ) : (
            <div className="field">
              <input
                id="room-code"
                className="code-input"
                value={roomCode}
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck="false"
                maxLength={4}
                placeholder="မီတင် နံပါတ်"
                aria-label="မီတင် နံပါတ်"
                aria-invalid={Boolean(errors.room)}
                aria-describedby="room-hint"
                onChange={(event) => {
                  setRoomCode(event.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4));
                  setErrors((current) => ({ ...current, room: undefined }));
                }}
              />
              {errors.room ? (
                <span className="field-error" role="alert">
                  {errors.room}
                </span>
              ) : null}
            </div>
          )}
          {locked && (errors.room || room.status === 'missing') ? (
            <p className="field-error" role="alert">
              {errors.room || room.message}
            </p>
          ) : null}
          {!locked && room.status === 'missing' && !errors.room ? (
            <p className="field-error" role="status">
              {room.message} စီစဉ်သူ ဖွင့်ထားသော ကုဒ်ကို သုံးပါ။
            </p>
          ) : null}

          <div className="form-row">
            <div className="field">
              <input
                id="participant-name"
                name="name"
                autoComplete="name"
                value={name}
                placeholder="အမည်"
                aria-label="အမည်"
                aria-invalid={Boolean(errors.name)}
                onChange={(event) => setName(event.target.value)}
              />
              {errors.name ? (
                <span className="field-error" role="alert">
                  {errors.name}
                </span>
              ) : null}
            </div>

            <div className="field">
              <input
                id="participant-phone"
                name="tel"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                placeholder="ဖုန်းနံပါတ်"
                aria-label="ဖုန်းနံပါတ်"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby="phone-hint"
                onChange={(event) => setPhone(event.target.value)}
              />
              {errors.phone ? (
                <span className="field-error" role="alert">
                  {errors.phone}
                </span>
              ) : null}
            </div>
          </div>

          {decidedPlace ? (
            <p className="hint">စီစဉ်သူ ဆုံးဖြတ်ထားသော နေရာ — {decidedPlace}</p>
          ) : (
            <div className="field">
              <textarea
                id="participant-place"
                rows={2}
                value={place}
                placeholder="တွေ့ဆုံလိုသည့် နေရာ"
                aria-label="တွေ့ဆုံလိုသည့် နေရာ"
                aria-invalid={Boolean(errors.place)}
                onChange={(event) => setPlace(event.target.value)}
              />
              {errors.place ? (
                <span className="field-error" role="alert">
                  {errors.place}
                </span>
              ) : null}
            </div>
          )}

          <div className="form-row">
            {decidedPlace ? null : (
              <div className="field">
                <select
                  id="meetup-style"
                  name="style"
                  value={style}
                  aria-label="တွေ့ဆုံမည့် ပုံစံ"
                  aria-invalid={Boolean(errors.style)}
                  onChange={(event) => setStyle(event.target.value)}
                >
                  <option value="">တွေ့ဆုံမည့် ပုံစံ</option>
                  {STYLES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
                {errors.style ? (
                  <span className="field-error" role="alert">
                    {errors.style}
                  </span>
                ) : null}
              </div>
            )}

            <div className="field">
              <span style={{fontSize : 8}}>မျှော်မှန်း ရောက်ချိန်</span>
              <ClockSelect
                id="arrival-time"
                value={arrival}
                ariaLabel="မျှော်မှန်းရောက်ရှိချိန်"
                emptyLabel="ဥပမာ မနက်ဆယ်နာရီ ရောက်မည်"
                invalid={Boolean(errors.arrival)}
                onChange={setArrival}
              />
              {errors.arrival ? (
                <span className="field-error" role="alert">
                  {errors.arrival}
                </span>
              ) : null}
            </div>
          </div>

          <div className="availability-field">
            <div className="availability-row">
              <span style={{fontSize : 8}}>မိမိ၏အားလပ်ရက် ‌ရွေးပါ</span>
              <button
                type="button"
                className="btn secondary"
                aria-haspopup="dialog"
                aria-label="ရနိုင်သည့် အချိန်"
                onClick={() => setTimeOpen(true)}
              >
                {availability.length ? 'အချိန်ပြင်ရန်' : 'အချိန်ရွေးရန်'}
              </button>
                <p className={availability.length ? 'summary' : 'hint'}>
                {availability.length ? formatAvailability(availability) : 'မရွေးရသေးပါ'}
              </p>
            </div>
            {errors.availability ? (
              <span className="field-error" role="alert">
                {errors.availability}
              </span>
            ) : null}
          </div>

          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'ပေးပို့နေပါတယ်…' : 'ပေးပို့မည်'}
          </button>
        </form>

        {success ? (
          <p className="success" role="status">
            {success.updated
              ? `${success.name}၊ အဖြေကို ပြင်ဆင်သိမ်းပြီးပါပြီ။`
              : `${success.name}၊ ကျေးဇူးတင်ပါသည်။ အဖြေကို သိမ်းပြီးပါပြီ။`}
          </p>
        ) : null}
      </section>

      {activeCode ? <Assistant room={room} shake={shakeSuggestion} /> : null}
      <Organizer />

      {timeOpen ? (
        <TimeModal
          availability={availability}
          onCancel={() => setTimeOpen(false)}
          onConfirm={(next) => {
            setAvailability(next);
            setErrors((current) => ({ ...current, availability: undefined }));
            setTimeOpen(false);
          }}
        />
      ) : null}
    </AppShell>
  );
}
