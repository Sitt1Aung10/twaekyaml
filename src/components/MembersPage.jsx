import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  MESSAGES,
  formatAvailability,
  formatClock,
  formatSubmitted,
  normalizeJoinCode,
  sameOrganizer,
  styleLabel,
} from '../../shared/meetup.js';
import { confirmDate, getMeeting, getResponses, voteForPlace } from '../api.js';
import { readSession } from '../session.js';
import AppShell from './AppShell.jsx';
import Assistant from './Assistant.jsx';

function fieldValue(response, key) {
  if (key === 'phone') return response.phone;
  if (key === 'place') return response.place;
  if (key === 'style') return styleLabel(response.style);
  if (key === 'availability') return formatAvailability(response.availability);
  if (key === 'arrival') return formatClock(response.arrival);
  if (key === 'submitted') return formatSubmitted(response.submittedAt);
  return '';
}

const FIELDS = [
  { key: 'phone', label: 'ဖုန်းနံပါတ်' },
  { key: 'place', label: 'တွေ့ဆုံလိုသည့် နေရာ' },
  { key: 'style', label: 'ပုံစံ' },
  { key: 'availability', label: 'ရနိုင်သည့် အချိန်' },
  { key: 'arrival', label: 'မျှော်မှန်းရောက်ရှိချိန်' },
  { key: 'submitted', label: 'ပေးပို့သည့် အချိန်' },
];

export default function MembersPage() {
  const params = useParams();
  const code = normalizeJoinCode(params.code || '');
  const [room, setRoom] = useState({
    status: code ? 'loading' : 'invalid',
    code,
    organizer: null,
    responses: [],
    suggestion: null,
    placeVotes: [],
    confirmedDate: '',
    confirmedSlot: null,
    locations: [],
    message: code ? '' : MESSAGES.room,
  });
  const session = readSession();
  const isRoomOrganizer = sameOrganizer(session, room.organizer);
  const [confirmingDate, setConfirmingDate] = useState(false);
  const [message, setMessage] = useState('');
  const [voter, setVoter] = useState({ name: '', phone: '' });
  const [confirmedPlace, setConfirmedPlace] = useState('');

  useEffect(() => {
    if (!code) return undefined;
    let stop = false;

    async function loadOrganizer() {
      try {
        const meeting = await getMeeting(code);
        if (!stop) {
          setRoom((current) => ({ ...current, code, organizer: meeting.organizer || null }));
        }
      } catch {
        if (!stop) setRoom((current) => ({ ...current, code, organizer: null }));
      }
    }

    async function load() {
      try {
        const data = await getResponses(code);
        if (!stop) {
          setRoom((current) => ({
            ...current,
            status: 'ready',
            code,
            organizer: data.organizer || current.organizer,
            responses: data.responses,
            suggestion: data.suggestion,
            placeVotes: data.placeVotes,
            confirmedDate: data.confirmedDate,
            confirmedSlot: data.confirmedSlot,
            locations: data.locations,
            message: '',
          }));
        }
      } catch (error) {
        if (stop) return;
        setRoom((current) => ({
          ...current,
          status: error.status === 404 ? 'missing' : 'error',
          code,
          responses: [],
          suggestion: null,
          message: error.message,
        }));
      }
    }

    loadOrganizer();
    load();
    const timer = setInterval(load, 4000);
    return () => {
      stop = true;
      clearInterval(timer);
    };
  }, [code]);

  async function onConfirmDate(slot) {
    setConfirmingDate(true); setMessage('');
    try {
      const result = await confirmDate(code, session, slot, confirmedPlace);
      setRoom((current) => ({ ...current, confirmedDate: result.confirmedDate, confirmedSlot: result.confirmedSlot, confirmedPlace: result.confirmedPlace }));
      setMessage('တွေ့ဆုံမည့်ရက်ကို အတည်ပြုပြီးပါပြီ။');
    } catch (error) { setMessage(error.message); }
    finally { setConfirmingDate(false); }
  }

  async function onVote(place) {
    try {
      const result = await voteForPlace(code, voter, place);
      setRoom((current) => ({ ...current, placeVotes: result.placeVotes }));
      setMessage('မဲပေးမှုကို အမည်မဖော်ဘဲ သိမ်းပြီးပါပြီ။');
    } catch (error) { setMessage(error.message); }
  }

  return (
    <AppShell code={code}>
      {room.status === 'ready' && room.suggestion?.mentionedPlaces?.length ? <section className="card vote-access">
        <h3>အကြံပြုနေရာ မဲပေးရန်</h3>
        <p className="hint">မဲပေးသူကို အဖွဲ့ဝင်အဖြစ် စစ်ဆေးရန် ဖြည့်ထားသော အမည်နှင့်ဖုန်းကို ထည့်ပါ။ မဲအရေအတွက်သာ လူတိုင်းမြင်ရပါမည်။</p>
        <div className="form-row"><input aria-label="မဲပေးသူအမည်" placeholder="အမည်" value={voter.name} onChange={(event) => setVoter((current) => ({ ...current, name: event.target.value }))} /><input aria-label="မဲပေးသူဖုန်း" placeholder="ဖုန်းနံပါတ်" value={voter.phone} onChange={(event) => setVoter((current) => ({ ...current, phone: event.target.value }))} /></div>
      </section> : null}
      {room.status === 'ready' && isRoomOrganizer && room.suggestion?.mentionedPlaces?.length && !room.confirmedDate ? <section className="card"><h3>အတည်ပြုမည့်နေရာ</h3><select value={confirmedPlace} onChange={(event) => setConfirmedPlace(event.target.value)}><option value="">နေရာရွေးပါ</option>{room.suggestion.mentionedPlaces.map(({ place }) => <option key={place} value={place}>{place}</option>)}</select></section> : null}
      {room.status === 'ready' ? <Assistant room={room} member={voter} onVote={onVote} organizer={session} onConfirmDate={onConfirmDate} confirmingDate={confirmingDate} canConfirmPlace={!room.suggestion?.mentionedPlaces?.length || Boolean(confirmedPlace)} /> : null}
      {message ? <p className="hint" role="status">{message}</p> : null}
      <section className="card member-page">
        <p className="kicker">စီစဉ်သူ</p>
        <h2>{code ? `အခန်း ${code} ၏ အဖွဲ့ဝင်များ` : 'အဖွဲ့ဝင် အဖြေများ'}</h2>
        <Link className="btn secondary" to="/join">
          နောက်သို့
        </Link>

        {room.status === 'loading' ? <p>ဖတ်နေပါတယ်…</p> : null}
        {room.status === 'invalid' || room.status === 'error' ? (
          <p className="field-error" role="alert">
            {room.message}
          </p>
        ) : null}
        {room.status === 'missing' ? (
          <p className="empty-note" role="status">
            {room.message || 'ဤအခန်းကုဒ် မရှိသေးပါ။'}
          </p>
        ) : null}
        {room.status === 'ready' && room.responses.length === 0 ? (
          <p className="empty-note" role="status">
            ဤအခန်းတွင် အဖြေမရှိသေးပါ။
          </p>
        ) : null}

        {room.status === 'ready' && room.responses.length > 0 ? (
          <ul className="member-list">
            {room.responses.map((response) => (
              <li key={response.id} className="member-card">
                <h3>{response.name}</h3>
                <dl className="member-fields">
                  {FIELDS.map((field) => {
                    const value = fieldValue(response, field.key) || '—';
                    return (
                      <div className="member-field" key={field.key}>
                        <dt>{field.label}</dt>
                        <dd>
                          {field.key === 'phone' && response.phone ? (
                            <a href={`tel:${response.phone}`}>{value}</a>
                          ) : (
                            value
                          )}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </AppShell>
  );
}
