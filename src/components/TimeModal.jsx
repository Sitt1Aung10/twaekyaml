import { useEffect, useId, useRef, useState } from 'react';
import { DAYS, MESSAGES } from '../../shared/meetup.js';
import ClockSelect from './ClockSelect.jsx';

function initialDays(availability) {
  return DAYS.map((day) => {
    const found = availability.find((item) => item.day === day.id);
    return {
      day: day.id,
      label: day.label,
      on: Boolean(found),
      start: found?.start || '17:00',
      end: found?.end || '20:00',
    };
  });
}

export default function TimeModal({ availability, onConfirm, onCancel }) {
  const titleId = useId();
  const errorId = useId();
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const onCancelRef = useRef(onCancel);
  const [days, setDays] = useState(() => initialDays(availability));
  const [error, setError] = useState('');
  onCancelRef.current = onCancel;

  useEffect(() => {
    openerRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const dialog = dialogRef.current;
    function focusable() {
      if (!dialog) return [];
      return [...dialog.querySelectorAll('button, input, textarea, select, a[href]')].filter(
        (element) => !element.disabled && element.tabIndex !== -1,
      );
    }

    function onKey(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancelRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      openerRef.current?.focus?.();
    };
  }, []);

  function toggle(dayId) {
    setDays((current) => current.map((day) => (day.day === dayId ? { ...day, on: !day.on } : day)));
    setError('');
  }

  function updateTime(dayId, key, value) {
    setDays((current) => current.map((day) => (day.day === dayId ? { ...day, [key]: value } : day)));
    setError('');
  }

  function confirm() {
    const selected = days.filter((day) => day.on);
    if (!selected.length) {
      setError(MESSAGES.availability);
      return;
    }
    if (selected.some((day) => !day.start || !day.end || day.start >= day.end)) {
      setError(MESSAGES.availabilityRange);
      return;
    }
    onConfirm(selected.map(({ day, start, end }) => ({ day, start, end })));
  }

  return (
    <div className="modal-backdrop" onMouseDown={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={error ? errorId : undefined}
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id={titleId}>ရနိုင်သည့်နေ့များ</h2>
        <p className="hint">ရက်ရွေးပြီး စတင်ချိန်နဲ့ ပြီးဆုံးချိန် ထည့်ပါ။ ရက်အများကြီး ရွေးနိုင်ပါတယ်။</p>
        <select
          id="day-picker"
          value=""
          aria-label="ရက်များ"
          onChange={(event) => {
            const dayId = event.target.value;
            if (!dayId) return;
            setDays((current) => current.map((day) => (day.day === dayId ? { ...day, on: true } : day)));
            setError('');
          }}
        >
          <option value="">ရက်ရွေးရန်</option>
          {days
            .filter((day) => !day.on)
            .map((day) => (
              <option key={day.day} value={day.day}>
                {day.label}
              </option>
            ))}
        </select>
        <div className="day-list">
          {days
            .filter((day) => day.on)
            .map((day) => (
              <div className="day-block on" key={day.day}>
                <div className="day-selected">
                  <strong>{day.label}</strong>
                  <button
                    type="button"
                    className="btn secondary"
                    aria-label={`${day.label} ဖယ်မည်`}
                    onClick={() => toggle(day.day)}
                  >
                    ဖယ်မည်
                  </button>
                </div>
                <div className="time-range">
                  <ClockSelect
                    id={`${day.day}-start`}
                    value={day.start}
                    ariaLabel={`${day.label} စတင်ချိန်`}
                    onChange={(next) => updateTime(day.day, 'start', next)}
                  />
                  <ClockSelect
                    id={`${day.day}-end`}
                    value={day.end}
                    ariaLabel={`${day.label} ပြီးဆုံးချိန်`}
                    onChange={(next) => updateTime(day.day, 'end', next)}
                  />
                </div>
              </div>
            ))}
        </div>
        {error ? (
          <p id={errorId} className="field-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={onCancel}>
            ပယ်ဖျက်မည်
          </button>
          <button type="button" className="btn" onClick={confirm}>
            အတည်ပြုမည်
          </button>
        </div>
      </div>
    </div>
  );
}
