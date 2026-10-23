import { useEffect, useId, useRef, useState } from 'react';
import { MESSAGES, validateAvailability } from '../../shared/meetup.js';
import ClockSelect from './ClockSelect.jsx';

function dateKey(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function nextDates(kind, weeks = 8) {
  const result = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let offset = 0; offset < weeks * 7; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    if (kind === 'all' || (kind === 'weekend' ? weekend : !weekend)) result.push(dateKey(date));
  }
  return result;
}

export default function TimeModal({ availability, onConfirm, onCancel }) {
  const titleId = useId();
  const errorId = useId();
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const onCancelRef = useRef(onCancel);
  const [items, setItems] = useState(() => (availability || []).filter((item) => item.date));
  const [calendarDate, setCalendarDate] = useState('');
  const [error, setError] = useState('');
  const [today] = useState(() => dateKey(new Date()));

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    openerRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    const dialog = dialogRef.current;
    function focusable() {
      return [...(dialog?.querySelectorAll('button, input, select, a[href]') || [])].filter((el) => !el.disabled && el.tabIndex !== -1);
    }
    function onKey(event) {
      if (event.key === 'Escape') { event.preventDefault(); onCancelRef.current(); return; }
      if (event.key !== 'Tab') return;
      const list = focusable();
      if (!list.length) return;
      if (event.shiftKey && (document.activeElement === list[0] || document.activeElement === dialog)) { event.preventDefault(); list.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === list.at(-1)) { event.preventDefault(); list[0].focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKey); openerRef.current?.focus?.(); };
  }, []);

  function addDates(dates) {
    setItems((current) => {
      const byDate = new Map(current.map((item) => [item.date, item]));
      for (const date of dates) if (!byDate.has(date)) byDate.set(date, { date, start: '17:00', end: '20:00' });
      return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
    });
    setError('');
  }

  function updateTime(date, key, value) {
    setItems((current) => current.map((item) => item.date === date ? { ...item, [key]: value } : item));
    setError('');
  }

  function confirm() {
    if (!items.length) { setError(MESSAGES.availability); return; }
    const checked = validateAvailability(items);
    if (!checked.ok) { setError(checked.message); return; }
    onConfirm(checked.value);
  }

  return (
    <div className="modal-backdrop" onMouseDown={onCancel}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={error ? errorId : undefined} tabIndex={-1} ref={dialogRef} onMouseDown={(event) => event.stopPropagation()}>
        <h2 id={titleId}>ပြက္ခဒိန်မှ ရက်နှင့်အချိန် ရွေးပါ</h2>
        <p className="hint">နေ့ရက်များကို တစ်ရက်ချင်းရွေးနိုင်သလို အလုပ်ရက် သို့မဟုတ် စနေ၊ တနင်္ဂနွေကို ရှစ်ပတ်စာ ထည့်နိုင်ပါတယ်။</p>
        <div className="calendar-tools">
          <label htmlFor="calendar-date">ပြက္ခဒိန်ရက်</label>
          <input id="calendar-date" type="date" min={today} value={calendarDate} onChange={(event) => { setCalendarDate(event.target.value); if (event.target.value) addDates([event.target.value]); }} />
          <button type="button" className="btn secondary" onClick={() => addDates(nextDates('weekday'))}>အလုပ်ရက်များထည့်ရန်</button>
          <button type="button" className="btn secondary" onClick={() => addDates(nextDates('weekend'))}>စနေ၊ တနင်္ဂနွေ ထည့်ရန်</button>
          {items.length ? <button type="button" className="btn secondary" onClick={() => setItems([])}>အားလုံးဖယ်မည်</button> : null}
        </div>
        <div className="day-list">
          {items.map((item) => (
            <div className="day-block on" key={item.date}>
              <div className="day-selected">
                <strong>{new Intl.DateTimeFormat('my-MM', { dateStyle: 'full' }).format(new Date(`${item.date}T12:00:00`))}</strong>
                <button type="button" className="btn secondary" onClick={() => setItems((current) => current.filter((entry) => entry.date !== item.date))}>ဖယ်မည်</button>
              </div>
              <div className="time-range">
                <ClockSelect id={`${item.date}-start`} value={item.start} ariaLabel="စတင်ချိန်" onChange={(next) => updateTime(item.date, 'start', next)} />
                <ClockSelect id={`${item.date}-end`} value={item.end} ariaLabel="ပြီးဆုံးချိန်" onChange={(next) => updateTime(item.date, 'end', next)} />
              </div>
            </div>
          ))}
        </div>
        {error ? <p id={errorId} className="field-error" role="alert">{error}</p> : null}
        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={onCancel}>ပယ်ဖျက်မည်</button>
          <button type="button" className="btn" onClick={confirm}>အတည်ပြုမည်</button>
        </div>
      </div>
    </div>
  );
}
