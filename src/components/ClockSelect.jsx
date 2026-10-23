import { useState } from 'react';
import { joinClock, splitClock, toMyanmarDigits } from '../../shared/meetup.js';

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MINUTES = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));

export default function ClockSelect({ id, value, onChange, ariaLabel, emptyLabel, invalid = false }) {
  const [open, setOpen] = useState(Boolean(value));
  const parts = splitClock(value);

  function update(part, nextValue) {
    const next = { ...parts, [part]: nextValue };
    if (!next.minute) next.minute = '00';
    if (!next.period) next.period = 'am';
    onChange(joinClock(next.hour, next.minute, next.period));
  }

  if (emptyLabel && !value && !open) {
    return (
      <input
        id={id}
        className="clock-empty"
        type="text"
        readOnly
        placeholder={emptyLabel}
        aria-label={ariaLabel}
        aria-invalid={invalid}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
      />
    );
  }

  return (
    <div className="clock-selects" role="group" aria-label={ariaLabel}>
      <select
        id={id}
        aria-label={`${ariaLabel} နာရီ`}
        aria-invalid={invalid}
        value={parts.hour}
        onChange={(event) => update('hour', event.target.value)}
      >
        <option value="">နာရီ</option>
        {HOURS.map((hour) => (
          <option key={hour} value={String(hour)}>
            {toMyanmarDigits(hour)}
          </option>
        ))}
      </select>
      <select
        id={id ? `${id}-minute` : undefined}
        aria-label={`${ariaLabel} မိနစ်`}
        value={parts.minute || '00'}
        onChange={(event) => update('minute', event.target.value)}
      >
        {MINUTES.map((minute) => (
          <option key={minute} value={minute}>
            {toMyanmarDigits(minute)}
          </option>
        ))}
      </select>
      <select
        id={id ? `${id}-period` : undefined}
        aria-label={`${ariaLabel} နံနက် သို့မဟုတ် ညနေ`}
        value={parts.period || 'am'}
        onChange={(event) => update('period', event.target.value)}
      >
        <option value="am">နံနက်</option>
        <option value="pm">ညနေ</option>
      </select>
    </div>
  );
}
