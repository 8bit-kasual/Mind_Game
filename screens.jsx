// screens.jsx — ProfileScreen, SkillHubScreen, ResultsScreen

const { useState: useStateS, useEffect: useEffectS } = React;

/* ── Confetti ── */
function Confetti() {
  const items = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.6,
    dur: 1.4 + Math.random() * 0.8,
    emoji: ['⭐','🌟','✨','🎉','🌈','🍀','🌸','🦋'][Math.floor(Math.random() * 8)],
    size: 20 + Math.random() * 18,
  }));
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:200, overflow:'hidden' }}>
      <style>{`@keyframes fall{from{transform:translateY(-40px) rotate(0deg);opacity:1}to{transform:translateY(110vh) rotate(720deg);opacity:0}}`}</style>
      {items.map(p => (
        <div key={p.id} style={{
          position:'absolute', left:`${p.x}%`, top:0,
          fontSize: p.size, animation:`fall ${p.dur}s ${p.delay}s ease-in forwards`,
        }}>{p.emoji}</div>
      ))}
    </div>
  );
}

/* ── Stars row ── */
function Stars({ count, max = 3, size = 40 }) {
  return (
    <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{
          fontSize: size,
          opacity: i < count ? 1 : 0.2,
          filter: i < count ? 'drop-shadow(0 0 10px #FFD700)' : 'none',
          transition: `all 0.35s ${i * 0.18}s`,
          display:'inline-block',
        }}>⭐</span>
      ))}
    </div>
  );
}

/* ── Profile card ── */
function ProfileCard({ profile, onClick }) {
  const [pressed, setPressed] = useStateS(false);
  return (
    <button
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => { setPressed(false); onClick(); }}
      onPointerLeave={() => setPressed(false)}
      style={{
        background: 'white',
        border: `5px solid ${profile.color}`,
        borderRadius: 36,
        padding: '36px 48px',
        cursor: 'pointer',
        transform: pressed ? 'scale(0.94) translateY(4px)' : 'scale(1)',
        transition: 'transform 0.13s, box-shadow 0.13s',
        boxShadow: pressed
          ? `0 2px 0 ${profile.color}40`
          : `0 10px 0 ${profile.color}, 0 14px 30px ${profile.color}30`,
        display: 'flex', flexDirection:'column', alignItems:'center', gap:16,
        minWidth: 200, fontFamily:'Nunito, sans-serif',
        userSelect:'none',
      }}
    >
      <div style={{ fontSize:90, lineHeight:1 }}>{profile.emoji}</div>
      <div style={{ fontSize:34, fontWeight:900, color:'#2D3748' }}>{profile.name}</div>
      <div style={{
        display:'flex', alignItems:'center', gap:8,
        background:'#FFFBEB', borderRadius:20, padding:'6px 18px',
        border:'2px solid #FFD700',
      }}>
        <span style={{ fontSize:22 }}>⭐</span>
        <span style={{ fontSize:22, fontWeight:800, color:'#D97706' }}>{profile.totalStars}</span>
        <span style={{ fontSize:14, fontWeight:600, color:'#92400E' }}>stars</span>
      </div>
    </button>
  );
}

/* ══ PROFILE SCREEN ══ */
function ProfileScreen({ profiles, onSelect }) {
  return (
    <div style={{
      minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      background:'linear-gradient(160deg, #87CEEB 0%, #B8F0C8 55%, #90EE90 100%)',
      padding:32, gap:48,
    }}>
      {/* Decorative nature bg */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:120,
        background:'linear-gradient(180deg,transparent,#5D9C59)', opacity:0.3, pointerEvents:'none' }} />

      <div style={{ textAlign:'center', position:'relative' }}>
        <div style={{ fontSize:72, marginBottom:4, animation:'bounce 2s infinite' }}>🌿</div>
        <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
          @keyframes popIn{from{transform:scale(0.7);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        <h1 style={{
          fontSize:44, fontWeight:900, color:'#1A3A2A',
          textShadow:'0 3px 0 rgba(255,255,255,0.5)', letterSpacing:'-1px',
          whiteSpace:'nowrap',
        }}>Math Adventure!</h1>
        <p style={{ fontSize:24, color:'#2D5A3D', fontWeight:700, marginTop:16 }}>
          Who is playing today? 🐾
        </p>
      </div>

      <div style={{ display:'flex', gap:36, flexWrap:'wrap', justifyContent:'center', position:'relative' }}>
        {profiles.map(p => (
          <ProfileCard key={p.id} profile={p} onClick={() => onSelect(p.id)} />
        ))}
      </div>

      <p style={{ color:'#2D5A3D', fontWeight:600, fontSize:16, opacity:0.7, position:'relative' }}>
        Tap your picture to start! 👆
      </p>
    </div>
  );
}

/* ── Skill card ── */
function SkillCard({ skill, level, progress, needsHelp, onClick }) {
  const [pressed, setPressed] = useStateS(false);
  const c = skill.colors;
  const pct = Math.min(100, (progress / 5) * 100);

  return (
    <button
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => { setPressed(false); onClick(); }}
      onPointerLeave={() => setPressed(false)}
      style={{
        background: c.bg, border:`3px solid ${c.border}`,
        borderRadius:28, padding:'22px 26px',
        cursor:'pointer', width:'100%', textAlign:'left',
        transform: pressed ? 'scale(0.97) translateY(4px)' : 'scale(1)',
        transition:'transform 0.13s, box-shadow 0.13s',
        boxShadow: pressed ? `0 2px 0 ${c.shadow}` : `0 8px 0 ${c.shadow}`,
        position:'relative', fontFamily:'Nunito, sans-serif', userSelect:'none',
      }}
    >
      {needsHelp && (
        <div style={{
          position:'absolute', top:-12, right:16,
          background:'#FF5722', color:'white', borderRadius:20,
          padding:'4px 14px', fontSize:14, fontWeight:800,
          boxShadow:'0 3px 0 #BF360C',
        }}>💙 Needs Practice</div>
      )}
      <div style={{ display:'flex', alignItems:'center', gap:18 }}>
        <span style={{ fontSize:52 }}>{skill.emoji}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:26, fontWeight:900, color:c.text }}>{skill.name}</div>
          <div style={{ fontSize:16, fontWeight:600, color:'#718096', marginTop:2 }}>
            Level {level} of {skill.maxLevel} · {skill.levelNames[level - 1]}
          </div>
        </div>
        <div style={{ fontSize:36, color:c.border, fontWeight:900 }}>›</div>
      </div>
      <div style={{ marginTop:18, height:14, background:'rgba(0,0,0,0.08)', borderRadius:7, overflow:'hidden' }}>
        <div style={{
          height:'100%', width:`${pct}%`, background:c.border,
          borderRadius:7, transition:'width 0.6s ease',
        }} />
      </div>
      <div style={{ fontSize:13, color:'#718096', marginTop:5, fontWeight:700 }}>
        {progress}/5 toward next level
      </div>
    </button>
  );
}

/* ══ SKILL HUB SCREEN ══ */
function SkillHubScreen({ profile, onSelectSkill, onBack }) {
  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(160deg, #87CEEB 0%, #C8F0D8 100%)',
      padding:'28px 20px', display:'flex', flexDirection:'column', gap:22,
      maxWidth:620, margin:'0 auto', fontFamily:'Nunito, sans-serif',
    }}>
      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <button onClick={onBack} style={{
          background:'white', border:'2px solid #CBD5E0', borderRadius:16,
          padding:'10px 20px', fontSize:18, fontWeight:800, cursor:'pointer',
          fontFamily:'Nunito', boxShadow:'0 4px 0 #CBD5E0', color:'#4A5568',
        }}>← Back</button>
        <div style={{ flex:1 }} />
        <div style={{
          display:'flex', alignItems:'center', gap:10, background:'white',
          borderRadius:24, padding:'10px 20px',
          border:`3px solid ${profile.color}`,
          boxShadow:`0 4px 0 ${profile.color}`,
        }}>
          <span style={{ fontSize:28 }}>{profile.emoji}</span>
          <span style={{ fontWeight:900, fontSize:22, color:'#2D3748' }}>{profile.name}</span>
          <span style={{ fontSize:20 }}>⭐</span>
          <span style={{ fontWeight:800, color:'#D97706', fontSize:20 }}>{profile.totalStars}</span>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize:36, fontWeight:900, color:'#1A3A2A', letterSpacing:'-0.5px' }}>
          Choose a skill! 🌟
        </h2>
        <p style={{ fontSize:18, color:'#4A5568', fontWeight:600, marginTop:4 }}>
          What do you want to practice today?
        </p>
      </div>

      {/* Skill cards */}
      <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
        {SKILL_CONFIG.map(skill => (
          <SkillCard
            key={skill.id}
            skill={skill}
            level={profile.skillLevels[skill.id]}
            progress={profile.skillProgress[skill.id]}
            needsHelp={profile.needsHelp[skill.id]}
            onClick={() => onSelectSkill(skill.id)}
          />
        ))}
      </div>

      {/* Badge shelf */}
      {profile.badges.length > 0 && (
        <div style={{
          background:'white', borderRadius:24, padding:22,
          border:'2px solid #E2E8F0', boxShadow:'0 4px 0 #E2E8F0',
        }}>
          <div style={{ fontSize:18, fontWeight:900, color:'#2D3748', marginBottom:14 }}>
            🏆 My Badges
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {profile.badges.map(id => {
              const badge = BADGES.find(b => b.id === id);
              return badge ? (
                <div key={id} title={badge.desc} style={{
                  background:'#FFFBEB', border:'2px solid #FFD700',
                  borderRadius:14, padding:'7px 14px', fontSize:15, fontWeight:800,
                  display:'flex', alignItems:'center', gap:6, color:'#92400E',
                }}>
                  {badge.emoji} {badge.name}
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══ RESULTS SCREEN ══ */
function ResultsScreen({ result, profile, onContinue, onHome }) {
  const [mounted, setMounted] = useStateS(false);
  useEffectS(() => { setTimeout(() => setMounted(true), 50); }, []);

  const stars = result.correct >= 7 ? 3 : result.correct >= 5 ? 2 : 1;
  const headline = stars === 3 ? 'Amazing! 🎉' : stars === 2 ? 'Great job! 😊' : 'Keep going! 💪';
  const subline = stars === 3 ? "You're a math superstar!" : stars === 2 ? "You're doing really well!" : "Practice makes perfect!";

  return (
    <div style={{
      minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      background:'linear-gradient(160deg, #87CEEB 0%, #C8F0D8 100%)',
      padding:32, gap:28, fontFamily:'Nunito, sans-serif',
    }}>
      {stars >= 2 && <Confetti />}

      <div style={{
        fontSize:90,
        transform: mounted ? 'scale(1)' : 'scale(0)',
        transition:'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {stars === 3 ? '🎉' : stars === 2 ? '😊' : '💪'}
      </div>

      <div style={{ textAlign:'center' }}>
        <h1 style={{ fontSize:48, fontWeight:900, color:'#1A3A2A', letterSpacing:'-1px' }}>{headline}</h1>
        <p style={{ fontSize:22, color:'#4A5568', fontWeight:700, marginTop:6 }}>{subline}</p>
      </div>

      <Stars count={mounted ? stars : 0} size={48} />

      {/* Score card */}
      <div style={{
        background:'white', borderRadius:32, padding:'28px 48px',
        border:'3px solid #E2E8F0', boxShadow:'0 10px 0 #E2E8F0',
        textAlign:'center',
        transform: mounted ? 'translateY(0)' : 'translateY(30px)',
        opacity: mounted ? 1 : 0,
        transition:'all 0.4s 0.2s ease',
      }}>
        <div style={{ fontSize:72, fontWeight:900, color:'#2D3748', lineHeight:1 }}>
          {result.correct}<span style={{ fontSize:40, color:'#A0AEC0' }}>/{result.total}</span>
        </div>
        <div style={{ fontSize:20, color:'#718096', fontWeight:700 }}>correct answers</div>

        {result.leveledUp && (
          <div style={{
            marginTop:18, background:'#E8F5E9', borderRadius:18,
            padding:'14px 22px', border:'2px solid #4CAF50',
          }}>
            <div style={{ fontSize:22, fontWeight:900, color:'#2E7D32' }}>
              🎊 Level Up! Now on Level {profile.skillLevels[result.skill]}!
            </div>
          </div>
        )}

        {result.newBadges && result.newBadges.length > 0 && (
          <div style={{ marginTop:14, display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            {result.newBadges.map(b => (
              <div key={b.id} style={{
                background:'#FFFBEB', border:'2px solid #FFD700', borderRadius:16,
                padding:'8px 18px', fontSize:18, fontWeight:800, color:'#92400E',
              }}>
                {b.emoji} New Badge: {b.name}!
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display:'flex', gap:16, flexWrap:'wrap', justifyContent:'center' }}>
        <button onClick={onContinue} style={{
          background:'#4CAF50', color:'white', border:'none', borderRadius:22,
          padding:'18px 40px', fontSize:24, fontWeight:900, cursor:'pointer',
          boxShadow:'0 8px 0 #2E7D32', fontFamily:'Nunito',
          transform:'translateY(0)', transition:'transform 0.1s, box-shadow 0.1s',
        }}
          onPointerDown={e => e.currentTarget.style.cssText += ';transform:translateY(4px);box-shadow:0 4px 0 #2E7D32'}
          onPointerUp={e => e.currentTarget.style.cssText += ';transform:translateY(0);box-shadow:0 8px 0 #2E7D32'}
        >Play Again! 🎮</button>
        <button onClick={onHome} style={{
          background:'white', color:'#2D3748', border:'3px solid #CBD5E0',
          borderRadius:22, padding:'18px 40px', fontSize:24, fontWeight:900,
          cursor:'pointer', boxShadow:'0 8px 0 #CBD5E0', fontFamily:'Nunito',
        }}>Home 🏠</button>
      </div>
    </div>
  );
}

Object.assign(window, { ProfileScreen, SkillHubScreen, ResultsScreen, Stars, Confetti });
