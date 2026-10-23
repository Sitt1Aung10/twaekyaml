import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  MESSAGES,
  formatAvailability,
  formatClock,
  formatSubmitted,
  normalizeJoinCode,
  styleLabel,
} from '../../shared/meetup.js';
import { getResponses } from '../api.js';
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
    responses: [],
    suggestion: null,
    message: code ? '' : MESSAGES.room,
  });

  useEffect(() => {
    if (!code) return undefined;
    let stop = false;

    async function load() {
      try {
        const data = await getResponses(code);
        if (!stop) {
          setRoom({
            status: 'ready',
            responses: data.responses,
            suggestion: data.suggestion,
            message: '',
          });
        }
      } catch (error) {
        if (stop) return;
        setRoom({
          status: error.status === 404 ? 'missing' : 'error',
          responses: [],
          suggestion: null,
          message: error.message,
        });
      }
    }

    load();
    const timer = setInterval(load, 4000);
    return () => {
      stop = true;
      clearInterval(timer);
    };
  }, [code]);

  return (
    <AppShell code={code}>
      {room.status === 'ready' ? <Assistant room={room} /> : null}
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
