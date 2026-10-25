import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  MESSAGES,
  STYLES,
  formatAvailability,
  normalizeJoinCode,
  validateResponse,
} from '../../shared/meetup.js';
import { getMeeting, getResponses, saveResponse, shareLocation, voteForPlace } from '../api.js';
import { readSession } from '../session.js';
import AppShell from './AppShell.jsx';
import ClockSelect from './ClockSelect.jsx';
import Assistant from './Assistant.jsx';
import Organizer from './Organizer.jsx';
import TimeModal from './TimeModal.jsx';

const idleRoom = { status: 'idle', code: '', organizer: null, fixedPlace: '', responses: [], suggestion: null, placeVotes: [], confirmedDate: '', confirmedSlot: null, locations: [], message: '' };

export default function SurveyPage() {
  const { code: rawCode } = useParams();
  const navigate = useNavigate();
  const session = readSession();
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
  const [voteMessage, setVoteMessage] = useState('');
  const [locationMessage, setLocationMessage] = useState('');
  const [sharingLocation, setSharingLocation] = useState(false);
  const [todayMyanmar, setTodayMyanmar] = useState(() => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Yangon' }).format(new Date()));
  const [room, setRoom] = useState(idleRoom);
  const [shakeSuggestion, setShakeSuggestion] = useState(false);
  const fetchGen = useRef(0);
  const shownSuggestionFor = useRef('');

  const activeCode = locked ? lockedCode : normalizeJoinCode(roomCode);

  useEffect(() => {
    document.title = 'ပါဝင်ရန် · တွေ့ကြမယ်';
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setTodayMyanmar(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Yangon' }).format(new Date())), 60_000);
    return () => window.clearInterval(timer);
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
        setRoom((previous) => ({
          status: 'ready',
          code: activeCode,
          organizer: data.organizer || previous.organizer,
          fixedPlace: data.fixedPlace || '',
          responses: data.responses,
          suggestion: data.suggestion,
          placeVotes: data.placeVotes,
          confirmedDate: data.confirmedDate,
          confirmedSlot: data.confirmedSlot,
          locations: data.locations,
          message: '',
        }));
      } catch (error) {
        if (stop || mine !== fetchGen.current) return;
        if (error.status === 404) {
          if (activeCode.length < 5) {
            setRoom(idleRoom);
            return;
          }
          setRoom({ status: 'missing', code: activeCode, organizer: null, responses: [], suggestion: null, message: error.message });
          return;
        }
        setRoom((previous) =>
          previous.status === 'ready'
            ? previous
            : { status: 'error', code: activeCode, organizer: null, responses: [], suggestion: null, message: error.message },
        );
      }
    }

    async function loadOrganizer() {
      try {
        const meeting = await getMeeting(activeCode);
        if (stop) return;
        setRoom((previous) => ({ ...previous, code: activeCode, organizer: meeting.organizer || null }));
      } catch {
        if (!stop) setRoom((previous) => (previous.code === activeCode ? previous : { ...previous, organizer: null }));
      }
    }

    loadOrganizer();
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
      setRoom((previous) => ({
        status: 'ready',
        code: activeCode,
        organizer: saved.organizer || previous.organizer,
        fixedPlace: saved.fixedPlace || decidedPlace,
        responses: saved.responses,
        suggestion: saved.suggestion,
        placeVotes: saved.placeVotes,
        confirmedDate: saved.confirmedDate,
        confirmedSlot: saved.confirmedSlot,
        locations: saved.locations,
        message: '',
      }));
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

  async function onVote(placeName) {
    if (!activeCode || !name || !phone) return;
    try {
      const result = await voteForPlace(activeCode, { name, phone }, placeName);
      setRoom((current) => ({ ...current, placeVotes: result.placeVotes }));
      setVoteMessage('မဲပေးမှုကို အမည်မဖော်ဘဲ သိမ်းပြီးပါပြီ။');
    } catch (error) { setVoteMessage(error.message); }
  }

  async function onShareLocation() {
    if (!navigator.geolocation || !name || !phone) { setLocationMessage('အမည်၊ ဖုန်းနံပါတ်နှင့် တည်နေရာခွင့်ပြုချက် လိုအပ်ပါသည်။'); return; }
    setSharingLocation(true); setLocationMessage('');
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const result = await shareLocation(activeCode, { name, phone }, coords.latitude, coords.longitude);
        setRoom((current) => ({ ...current, locations: result.locations }));
        setLocationMessage('တည်နေရာကို အဖွဲ့နှင့် မျှဝေပြီးပါပြီ။');
      } catch (error) { setLocationMessage(error.message); }
      finally { setSharingLocation(false); }
    }, (error) => { setLocationMessage(error.code === 1 ? 'တည်နေရာခွင့်ပြုချက် လိုအပ်ပါသည်။' : 'လက်ရှိတည်နေရာကို ရယူမရပါ။'); setSharingLocation(false); }, { enableHighAccuracy: true, timeout: 15000 });
  }

  if (invalidLink) {
    return (
      <AppShell>
        <section className="card">
          <h1>လင့်ခ် မမှန်ပါ</h1>
          <p>အခန်းကုဒ်သည် အင်္ဂလိပ်အက္ခရာ ၄ လုံး သို့မဟုတ် ၅ လုံး ဖြစ်ရပါမည်။</p>
          <Link className="btn" to="/join">
            ကိုယ်တိုင် ထည့်မည်
          </Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell code={activeCode} dense banner>
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
              <label className="field-label" htmlFor="room-code">မီတင် နံပါတ်</label>
              <input
                id="room-code"
                className="code-input"
                value={roomCode}
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck="false"
                maxLength={5}
                placeholder="ဥပမာ ABCDE"
                aria-invalid={Boolean(errors.room)}
                aria-describedby="room-hint"
                onChange={(event) => {
                  setRoomCode(event.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5));
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
              <label className="field-label" htmlFor="participant-name">အမည်</label>
              <input
                id="participant-name"
                name="name"
                autoComplete="name"
                value={name}
                placeholder="ဥပမာ မောင်မောင်"
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
              <label className="field-label" htmlFor="participant-phone">ဖုန်းနံပါတ်</label>
              <input
                id="participant-phone"
                name="tel"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                placeholder="ဥပမာ ၀၉…"
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
              <label className="field-label" htmlFor="participant-place">တွေ့ဆုံလိုသည့်နေရာ</label>
              <textarea
                id="participant-place"
                rows={2}
                value={place}
                placeholder="ဥပမာ တာမွေ"
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
                <label className="field-label" htmlFor="meetup-style">တွေ့ဆုံမည့် ပုံစံ</label>
                <select
                  id="meetup-style"
                  name="style"
                  value={style}
                  aria-invalid={Boolean(errors.style)}
                  onChange={(event) => setStyle(event.target.value)}
                >
                  <option value="">ရွေးပါ</option>
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
              <label className="field-label" htmlFor="arrival-time">မျှော်မှန်းရောက်ရှိချိန်</label>
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
            <label className="field-label" id="availability-label">ရနိုင်သည့် အချိန်</label>
            <div className="availability-row" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'left' }}>
              <button
                type="button"
                className="btn secondary"
                aria-haspopup="dialog"
                aria-labelledby="availability-label"
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

      {activeCode ? <Assistant room={room} shake={shakeSuggestion} member={{ name, phone }} onVote={onVote} organizer={session} /> : null}
      {voteMessage ? <p className="hint" role="status">{voteMessage}</p> : null}
      {room.confirmedDate ? <section className="card location-card">
        <h3>တွေ့ဆုံမည့်နေ့တွင် တည်နေရာမျှဝေရန်</h3>
        <p className="hint">အတည်ပြုရက် — {new Intl.DateTimeFormat('my-MM', { dateStyle: 'full' }).format(new Date(`${room.confirmedDate}T12:00:00`))}</p>
        <button type="button" className="btn" onClick={onShareLocation} disabled={sharingLocation || room.confirmedDate !== todayMyanmar || !name || !phone}>{sharingLocation ? 'တည်နေရာ ရယူနေပါတယ်…' : 'ကျွန်ုပ်၏တည်နေရာ မျှဝေမည်'}</button>
        {room.confirmedDate !== todayMyanmar ? <p className="hint">တွေ့ဆုံမည့်ရက်ရောက်မှ မျှဝေနိုင်ပါမည်။</p> : null}
        {locationMessage ? <p className="hint" role="status">{locationMessage}</p> : null}
      </section> : null}
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
