import { toMyanmarDigits } from '../../shared/meetup.js';

export default function Assistant({ room, shake = false }) {
  const suggestion = room.suggestion;

  return (
    <section className={shake ? 'card assistant suggestion-shake' : 'card assistant'} aria-live="polite">
      <p className="kicker">အထောက်အကူ AI</p>
      <h2>အဖွဲ့အတွက် အကြံပြုချက်</h2>
      <p className="lede">အများစုရွေးတဲ့ ပုံစံအတွက် ရန်ကုန်မြို့နယ်အလိုက် နေရာတွေနဲ့၊ လူအားလုံးဆုံတဲ့ နေ့၊ အချိန်ကို ပြပါတယ်။</p>

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
            <>
              <h3>အဖွဲ့က ရေးထားသော နေရာ</h3>
              <ul className="place-list">
                {suggestion.mentionedPlaces.map((item) => (
                  <li key={item.place}>
                    {item.place}
                    <span> · {toMyanmarDigits(item.count)}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <h3>တွေ့ဆုံရန် အချိန်</h3>
          <p>{suggestion.time.text}</p>

          <h3>ရောက်ရှိချိန်</h3>
          <p>{suggestion.arrival.text}</p>

          <p className="hint">
            စုစုပေါင်း {toMyanmarDigits(suggestion.total)} ယောက် အဖြေပေးထားပါတယ်။ အသစ်တွေကို စက္ကန့်အနည်းငယ်တစ်ခါ
            စစ်ဆေးနေပါတယ်။
          </p>

          <h3>သွားလို့ရသော နေရာ</h3>
          {suggestion.venues.map((venue) => (
            <div className="venue-block" key={venue.style}>
              <h4>{venue.label}</h4>
              <p>{venue.intro}</p>
              {(venue.townships?.length ? venue.townships : [{
                township: '',
                townshipMm: '',
                places: (venue.places || []).map((place) => (
                  typeof place === 'string' ? { name: place, address: '', detail: '' } : place
                )),
              }]).map((group) => (
                <div className="township-block" key={group.township || venue.style}>
                  {group.townshipMm ? <h5>{group.townshipMm} မြို့နယ်</h5> : null}
                  <ul className="place-list">
                    {group.places.map((place) => (
                      <li key={`${place.name}-${place.address}`}>
                        <strong>{place.name}</strong>
                        {place.address ? <span className="place-meta">{place.address}</span> : null}
                        {place.detail ? <span className="place-meta">{place.detail}</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}




        </>
      ) : null}
    </section>
  );
}
