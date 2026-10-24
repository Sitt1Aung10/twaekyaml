import { formatClock, organizerLabel, sameOrganizer, toMyanmarDigits } from '../../shared/meetup.js';

export default function Assistant({ room, shake = false, member, onVote, organizer, onConfirmDate, confirmingDate = false, canConfirmPlace = true }) {
  const suggestion = room.suggestion;
  const roomOrganizer = room.organizer || null;
  const canConfirmDate = sameOrganizer(organizer, roomOrganizer);

  return (
    <section className={shake ? 'card assistant suggestion-shake' : 'card assistant'} aria-live="polite">
      <p className="kicker">အထောက်အကူ AI</p>
      <h2>အဖွဲ့အတွက် အကြံပြုချက်</h2>
      <p className="lede">အဖွဲ့ဝင်များ အကြံပြုထားသော နေရာများကို မဲပေးပြီး၊ ပြက္ခဒိန်ရက်များထဲမှ ဆုံနိုင်မည့်အချိန်ကို ကြည့်ပါ။</p>

      {room.status === 'loading' ? <p>စစ်ဆေးနေပါတယ်…</p> : null}
      {room.status === 'missing' ? (
        <p>{room.message || 'ဒီကုဒ်အတွက် အခန်းမဖွင့်ရသေးပါ။ စီစဉ်သူ ဖွင့်ပြီးမှ အဖြေနဲ့ အကြံပြုချက် ပေါ်လာပါမယ်။'}</p>
      ) : null}
      {room.status === 'error' ? <p className="field-error">{room.message}</p> : null}
      {room.status === 'ready' && !suggestion ? (
        <p>အဖြေမရှိသေးပါ။ ပထမဆုံး အဖြေရောက်လာရင် အကြံပြုချက် ပေါ်လာပါမယ်။</p>
      ) : null}

      {suggestion ? (
        <>
          <p className="headline">{suggestion.headline}</p>

          <h3>မဲအရေအတွက်</h3>
          <ul className="votes">
            {suggestion.votes.map((vote) => (
              <li key={vote.style}>
                <div className="vote-row">
                  <span>{vote.label}</span>
                  <strong>
                    {toMyanmarDigits(vote.count)} မဲ
                  </strong>
                </div>
                <div className="bar" aria-hidden="true">
                  <span style={{ width: `${(vote.count / suggestion.total) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>

          {suggestion.mentionedPlaces.length ? (
            <div className="place-voting">
              <h3>အကြံပြုနေရာ မဲပေးရန်</h3>
              <p className="hint">မဲအရေအတွက်ကိုသာ ပြထားပြီး မဲပေးသူအမည်များကို မပြပါ။</p>
              <ul className="place-vote-list">
                {suggestion.mentionedPlaces.map(({ place }) => {
                  const count = room.placeVotes?.find((vote) => vote.place === place)?.count || 0;
                  return <li key={place}><span>{place}<strong>{toMyanmarDigits(count)} မဲ</strong></span>
                    {onVote ? <button className="btn secondary" type="button" onClick={() => onVote(place)} disabled={!member?.name || !member?.phone}>မဲပေးမည်</button> : null}
                  </li>;
                })}
              </ul>
              {onVote && (!member?.name || !member?.phone) ? <p className="hint">မဲပေးရန် အရင်ဆုံး အမည်နှင့် ဖုန်းနံပါတ် ဖြည့်ပါ။</p> : null}
            </div>
          ) : null}

          <h3>တွေ့ဆုံရန် အချိန်</h3>
          <BestDays time={suggestion.time} />
          {suggestion.time.date && !room.confirmedDate ? (
            <div className="confirm-date-row">
              {canConfirmDate ? (suggestion.time.options?.length ? suggestion.time.options : [suggestion.time]).map((option) => (
                <button
                  type="button"
                  className="btn"
                  key={`${option.date}-${option.start}-${option.end}`}
                  disabled={confirmingDate || !canConfirmPlace}
                  onClick={() => onConfirmDate?.(option)}
                >
                  {confirmingDate ? 'အတည်ပြုနေပါတယ်…' : (
                    <>
                      အတည်ပြုမည် — <strong>{option.dayLabel || option.date}</strong>
                      {option.start && option.end ? ` ${formatClock(option.start)}–${formatClock(option.end)}` : ''}
                    </>
                  )}
                </button>
              )) : null}
              <p className="confirm-date-alert" role="status">
                Only organizer can confirm the date.
                {roomOrganizer ? (
                  <>
                    {' '}
                    ဤအခန်း ({room.code || '—'}) ၏ စီစဉ်သူ — <strong>{organizerLabel(roomOrganizer)}</strong>
                  </>
                ) : null}
              </p>
            </div>
          ) : null}
          {room.confirmedDate ? <CalendarLink date={room.confirmedDate} start={room.confirmedSlot?.start} end={room.confirmedSlot?.end} place={room.confirmedPlace || suggestion.mentionedPlaces[0]?.place || ''} /> : null}
          {room.confirmedDate && room.locations?.length ? <div className="location-card">
            <h3>မျှဝေထားသော တည်နေရာများ</h3>
            <ul className="location-list">{room.locations.map((location) => <li key={`${location.name}-${location.sharedAt}`}><strong>{location.name}</strong><a href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`} target="_blank" rel="noreferrer">မြေပုံဖွင့်ရန်</a></li>)}</ul>
          </div> : null}

          <h3>ရောက်ရှိချိန်</h3>
          <p>{suggestion.arrival.text}</p>

          <p className="hint">
            စုစုပေါင်း {toMyanmarDigits(suggestion.total)} ယောက် အဖြေပေးထားပါတယ်။ အသစ်တွေကို စက္ကန့်အနည်းငယ်တစ်ခါ
            စစ်ဆေးနေပါတယ်။
          </p>

        </>
      ) : null}
    </section>
  );
}

function BestDays({ time }) {
  const options = time.options?.length ? time.options : [];
  if (!options.length) return <p>{time.text}</p>;
  return (
    <ul className="best-days">
      {options.map((option) => (
        <li key={`${option.date}-${option.start}-${option.end}`}>
          <p>
            <mark className="best-day-mark"><strong>{option.dayLabel}</strong></mark>
            {' '}
            {formatClock(option.start)}–{formatClock(option.end)}
            {' '}
            · {toMyanmarDigits(option.count)} ယောက် တက်နိုင်ပါတယ်
          </p>
          {option.unavailableNames?.length ? (
            <p className="unavailable-names">
              မအားနိုင်သူ — {option.unavailableNames.map((name, index) => <strong key={`${option.date}-${index}`}>{name}</strong>)}
            </p>
          ) : (
            <p className="hint">ဒီရက်မှာ လူအားလုံး အားပါတယ်။</p>
          )}
        </li>
      ))}
    </ul>
  );
}

function CalendarLink({ date, start, end, place }) {
  const day = date.replaceAll('-', '');
  const dates = start && end ? `${day}T${start.replace(':', '')}00/${day}T${end.replace(':', '')}00` : `${day}/${day}`;
  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', 'သူငယ်ချင်းများ တွေ့ဆုံပွဲ');
  url.searchParams.set('dates', dates);
  if (start && end) url.searchParams.set('ctz', 'Asia/Yangon');
  url.searchParams.set('details', 'တွေ့ဆုံမည့်ရက်ကို တွေ့ကြမယ် ဝက်ဘ်ဆိုက်တွင် စီစဉ်သူက အတည်ပြုပြီးပါပြီ။');
  if (place) url.searchParams.set('location', place);
  return <p><a className="btn secondary" href={url.toString()} target="_blank" rel="noreferrer">Google Calendar ထဲသို့ သိမ်းမည်</a></p>;
}
