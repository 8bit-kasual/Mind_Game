// game.jsx — GameScreen with counting, addition, and shapes question types

const { useState: useStateG, useEffect: useEffectG, useRef: useRefG } = React;

/* ── Shape SVG renderer ── */
function ShapeDisplay({ shape }) {
  const s = shape;
  const svgProps = { style:{ display:'block' } };
  if (s.type === 'circle')
    return <svg {...svgProps} width={160} height={160} viewBox="0 0 100 100"><circle cx={50} cy={50} r={44} fill={s.color} /></svg>;
  if (s.type === 'square')
    return <svg {...svgProps} width={160} height={160} viewBox="0 0 100 100"><rect x={6} y={6} width={88} height={88} fill={s.color} rx={4} /></svg>;
  if (s.type === 'triangle')
    return <svg {...svgProps} width={160} height={160} viewBox="0 0 100 100"><polygon points="50,6 94,94 6,94" fill={s.color} /></svg>;
  if (s.type === 'rectangle')
    return <svg {...svgProps} width={200} height={130} viewBox="0 0 160 100"><rect x={5} y={10} width={150} height={80} fill={s.color} rx={4} /></svg>;
  if (s.type === 'diamond')
    return <svg {...svgProps} width={160} height={160} viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill={s.color} /></svg>;
  if (s.type === 'oval')
    return <svg {...svgProps} width={200} height={130} viewBox="0 0 160 100"><ellipse cx={80} cy={50} rx={74} ry={44} fill={s.color} /></svg>;
  if (s.type === 'star')
    return <svg {...svgProps} width={160} height={160} viewBox="0 0 100 100"><polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill={s.color} /></svg>;
  if (s.type === 'heart')
    return <svg {...svgProps} width={160} height={160} viewBox="0 0 100 100"><path d="M50,82 C50,82 8,52 8,28 C8,14 18,5 33,5 C41,5 50,13 50,13 C50,13 59,5 67,5 C82,5 92,14 92,28 C92,52 50,82 50,82Z" fill={s.color} /></svg>;
  return <div style={{ width:140, height:140, background:s.color, borderRadius:8 }} />;
}

/* ── Animal emoji grid ── */
function AnimalGrid({ animal, count }) {
  const size = count <= 5 ? 52 : count <= 10 ? 42 : 34;
  return (
    <div style={{
      display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center',
      maxWidth:380, margin:'0 auto', padding:8,
    }}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} style={{ fontSize:size, lineHeight:1 }}>{animal}</span>
      ))}
    </div>
  );
}

/* ── Choice button ── */
function ChoiceBtn({ label, onClick, disabled, state }) {
  // state: null | 'correct' | 'wrong' | 'reveal'
  const [pressed, setPressed] = useStateG(false);
  const bg = state === 'correct' ? '#4CAF50'
           : state === 'wrong'   ? '#FF5252'
           : state === 'reveal'  ? '#4CAF50'
           : 'white';
  const border = state === 'correct' ? '#2E7D32'
               : state === 'wrong'   ? '#C62828'
               : state === 'reveal'  ? '#2E7D32'
               : '#D1D5DB';
  const shadow = state === 'correct' ? '#2E7D32'
               : state === 'wrong'   ? '#C62828'
               : state === 'reveal'  ? '#2E7D32'
               : '#D1D5DB';
  const textColor = state ? 'white' : '#2D3748';

  return (
    <button
      disabled={disabled}
      onPointerDown={() => !disabled && setPressed(true)}
      onPointerUp={() => { setPressed(false); if (!disabled) onClick(); }}
      onPointerLeave={() => setPressed(false)}
      style={{
        background: bg, color: textColor,
        border: `3px solid ${border}`,
        borderRadius: 20, padding:'16px 12px',
        fontSize: 28, fontWeight: 900,
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'Nunito, sans-serif',
        transform: pressed ? 'scale(0.94) translateY(4px)' : 'scale(1)',
        transition: 'transform 0.1s, background 0.18s, box-shadow 0.1s',
        boxShadow: (pressed || disabled) ? `0 2px 0 ${shadow}` : `0 7px 0 ${shadow}`,
        flex: 1, minWidth: 100, userSelect:'none',
      }}
    >{label}</button>
  );
}

/* ── Progress dots ── */
function ProgressDots({ results, total }) {
  return (
    <div style={{ display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap' }}>
      {Array.from({ length: total }, (_, i) => {
        const r = results[i];
        return (
          <div key={i} style={{
            width: 16, height: 16, borderRadius: '50%',
            background: r === undefined ? '#E2E8F0' : r ? '#4CAF50' : '#FF5252',
            border: i === results.length ? '2px solid #4CAF50' : '2px solid transparent',
            transition:'background 0.3s',
          }} />
        );
      })}
    </div>
  );
}

/* ══ GAME SCREEN ══ */
function GameScreen({ profile, skillId, level, questions, onFinish }) {
  const [qIndex, setQIndex]   = useStateG(0);
  const [answered, setAnswered] = useStateG(null); // { choice, isCorrect }
  const [results, setResults] = useStateG([]);
  const [streak, setStreak]   = useStateG(0);
  const [maxStreak, setMaxStreak] = useStateG(0);
  const [feedbackMsg, setFeedbackMsg] = useStateG('');
  const timeoutRef = useRefG(null);

  const q = questions[qIndex];
  const isLast = qIndex === questions.length - 1;

  const positives = ['Great! 🌟','Awesome! 🎉','Yes! 🦋','Correct! ⭐','Brilliant! 🐾','Woo-hoo! 🌈'];
  const negatives = ['Not quite! 💙','Try again! 🤔','Almost there! 💪'];

  function handleChoice(choice) {
    if (answered) return;
    const isCorrect = String(choice) === String(q.correct);
    const newStreak = isCorrect ? streak + 1 : 0;
    const newMax    = Math.max(maxStreak, newStreak);
    const newResults = [...results, isCorrect];

    setAnswered({ choice: String(choice), isCorrect });
    setStreak(newStreak);
    setMaxStreak(newMax);
    setResults(newResults);
    setFeedbackMsg(isCorrect
      ? positives[Math.floor(Math.random() * positives.length)]
      : negatives[Math.floor(Math.random() * negatives.length)]);

    timeoutRef.current = setTimeout(() => {
      setAnswered(null);
      setFeedbackMsg('');
      if (isLast) {
        onFinish(newResults, newMax);
      } else {
        setQIndex(i => i + 1);
      }
    }, isCorrect ? 900 : 1600);
  }

  useEffectG(() => () => clearTimeout(timeoutRef.current), []);

  // Determine button states
  function btnState(choice) {
    if (!answered) return null;
    const c = String(choice);
    const correct = String(q.correct);
    if (c === correct) return answered.isCorrect ? 'correct' : 'reveal';
    if (c === answered.choice && !answered.isCorrect) return 'wrong';
    return null;
  }

  const correctSoFar = results.filter(Boolean).length;
  const skill = SKILL_CONFIG.find(s => s.id === skillId);

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(160deg, #87CEEB 0%, #C8F0D8 100%)',
      display:'flex', flexDirection:'column',
      maxWidth:640, margin:'0 auto', padding:'20px 18px', gap:16,
      fontFamily:'Nunito, sans-serif',
    }}>
      <style>{`
        @keyframes popIn  { from{transform:scale(0.6);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes shake  { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
        @keyframes pulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
      `}</style>

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{
          background: skill.colors.bg, border:`2px solid ${skill.colors.border}`,
          borderRadius:16, padding:'8px 16px', fontWeight:800, fontSize:18, color:skill.colors.text,
        }}>
          {skill.emoji} {skill.name}
        </div>
        <div style={{ flex:1 }} />
        <div style={{
          background:'white', border:'2px solid #FFD700', borderRadius:16,
          padding:'8px 16px', fontWeight:800, fontSize:18,
          display:'flex', alignItems:'center', gap:6,
        }}>
          ✅ <span style={{ color:'#2E7D32' }}>{correctSoFar}</span>
        </div>
        <div style={{
          background:'white', border:'2px solid #E2E8F0', borderRadius:16,
          padding:'8px 14px', fontWeight:700, fontSize:16, color:'#718096',
        }}>
          {qIndex + 1}/{questions.length}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height:12, background:'rgba(255,255,255,0.5)', borderRadius:6, overflow:'hidden', border:'2px solid rgba(255,255,255,0.8)' }}>
        <div style={{
          height:'100%',
          width:`${((qIndex) / questions.length) * 100}%`,
          background:`linear-gradient(90deg, ${skill.colors.border}, #8BC34A)`,
          borderRadius:6, transition:'width 0.4s ease',
        }} />
      </div>

      {/* Progress dots */}
      <ProgressDots results={results} total={questions.length} />

      {/* Fire streak banner */}
      {streak >= 3 && !answered && (
        <div style={{
          background:'#FFF9C4', border:'2px solid #FFD700', borderRadius:16,
          padding:'10px 18px', textAlign:'center', fontWeight:900, fontSize:20, color:'#92400E',
          animation:'pulse 1s infinite',
        }}>
          🔥 {streak} in a row! You're on fire!
        </div>
      )}

      {/* Question card */}
      <div style={{
        background:'white', borderRadius:32, padding:'28px 24px',
        border:'3px solid #E2E8F0', boxShadow:'0 10px 0 #E2E8F0',
        display:'flex', flexDirection:'column', alignItems:'center', gap:22, flex:1,
      }}>
        <h2 style={{ fontSize:30, fontWeight:900, color:'#2D3748', textAlign:'center', margin:0 }}>
          {q.question}
        </h2>

        {/* Visual content per question type */}
        {q.type === 'counting' && (
          <AnimalGrid animal={q.animal} count={q.count} />
        )}

        {q.type === 'addition' && (
          <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap', justifyContent:'center' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
              <AnimalGrid animal={q.animal1} count={q.a} />
              <span style={{ fontWeight:800, color:'#718096', fontSize:20 }}>{q.a}</span>
            </div>
            <div style={{ fontSize:56, fontWeight:900, color:'#4CAF50', lineHeight:1 }}>+</div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
              <AnimalGrid animal={q.animal2} count={q.b} />
              <span style={{ fontWeight:800, color:'#718096', fontSize:20 }}>{q.b}</span>
            </div>
            <div style={{ fontSize:56, fontWeight:900, color:'#2D3748', lineHeight:1 }}>=</div>
            <div style={{ fontSize:64, fontWeight:900, color:'#CBD5E0', lineHeight:1 }}>?</div>
          </div>
        )}

        {q.type === 'shapes' && (
          <div style={{
            display:'flex', justifyContent:'center', alignItems:'center',
            background:'#F7FAFC', borderRadius:24,
            padding:'24px 32px', minWidth:180, minHeight:180,
            animation: answered ? (answered.isCorrect ? 'pulse 0.4s ease' : 'shake 0.4s ease') : 'none',
          }}>
            <ShapeDisplay shape={q.shape} />
          </div>
        )}

        {/* Feedback */}
        {answered && (
          <div style={{
            background: answered.isCorrect ? '#E8F5E9' : '#FFF3E0',
            border: `3px solid ${answered.isCorrect ? '#4CAF50' : '#FFB300'}`,
            borderRadius:20, padding:'12px 28px',
            fontSize:26, fontWeight:900,
            color: answered.isCorrect ? '#2E7D32' : '#E65100',
            animation:'popIn 0.2s ease',
            textAlign:'center',
          }}>
            {feedbackMsg}
            {!answered.isCorrect && (
              <div style={{ fontSize:18, marginTop:6, fontWeight:700, color:'#7B341E' }}>
                The answer is <strong style={{ fontSize:22 }}>{q.correct}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Choice buttons */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {q.choices.map((choice, i) => (
          <ChoiceBtn
            key={i}
            label={String(choice)}
            onClick={() => handleChoice(choice)}
            disabled={!!answered}
            state={btnState(choice)}
          />
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { GameScreen });
