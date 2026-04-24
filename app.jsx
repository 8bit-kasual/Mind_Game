// app.jsx — main app state, routing, and score logic

const { useState: useStateApp, useEffect: useEffectApp } = React;

const QUESTIONS_PER_SESSION = 8;
const PROGRESS_PER_GOOD_SESSION = 2;   // added toward level-up on ≥6/8
const PROGRESS_PER_OK_SESSION   = 1;   // added on 5/8
const PROGRESS_NEEDED_TO_LEVEL  = 5;
const NEEDS_HELP_THRESHOLD      = 0.5; // <50% = flag for intervention

function App() {
  const [profiles,         setProfiles]         = useStateApp(() => loadProfiles());
  const [screen,           setScreen]           = useStateApp('profiles');
  const [activeProfileId,  setActiveProfileId]  = useStateApp(null);
  const [activeSkill,      setActiveSkill]      = useStateApp(null);
  const [questions,        setQuestions]        = useStateApp([]);
  const [lastResult,       setLastResult]       = useStateApp(null);

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  function persist(updated) {
    setProfiles(updated);
    saveProfiles(updated);
  }

  function selectProfile(id) {
    setActiveProfileId(id);
    setScreen('hub');
  }

  function selectSkill(skillId) {
    setActiveSkill(skillId);
    const prof  = profiles.find(p => p.id === activeProfileId);
    const level = prof.skillLevels[skillId];
    setQuestions(generateSession(skillId, level, QUESTIONS_PER_SESSION));
    setScreen('game');
  }

  function handleGameFinish(results, maxStreak) {
    const correct = results.filter(Boolean).length;
    const total   = results.length;
    const pct     = correct / total;

    const starsEarned = correct >= 7 ? 3 : correct >= 5 ? 2 : 1;

    // Intervention flag
    const needsHelp = pct < NEEDS_HELP_THRESHOLD;

    // Progress toward level-up
    const prof         = profiles.find(p => p.id === activeProfileId);
    const oldProgress  = prof.skillProgress[activeSkill] || 0;
    const gain         = correct >= 6 ? PROGRESS_PER_GOOD_SESSION
                       : correct >= 5 ? PROGRESS_PER_OK_SESSION
                       : 0;
    let newProgress    = oldProgress + gain;
    let newLevel       = prof.skillLevels[activeSkill];
    let leveledUp      = false;

    if (newProgress >= PROGRESS_NEEDED_TO_LEVEL && newLevel < 3) {
      newProgress = 0;
      newLevel++;
      leveledUp = true;
    }

    // Build updated profile (pre-badge)
    const updatedProf = {
      ...prof,
      totalStars:    prof.totalStars + starsEarned,
      skillLevels:   { ...prof.skillLevels,   [activeSkill]: newLevel    },
      skillProgress: { ...prof.skillProgress, [activeSkill]: newProgress },
      needsHelp:     { ...prof.needsHelp,     [activeSkill]: needsHelp   },
      sessions: [
        ...(prof.sessions || []).slice(-9),
        { skill: activeSkill, level: newLevel, date: Date.now(), correct, total, starsEarned },
      ],
    };

    // Check new badges
    const alreadyHave = new Set(prof.badges);
    const sessionCtx  = { correct, total, maxStreak };
    const newBadges   = BADGES.filter(b => !alreadyHave.has(b.id) && b.condition(updatedProf, sessionCtx));
    updatedProf.badges = [...prof.badges, ...newBadges.map(b => b.id)];

    const updated = profiles.map(p => p.id === activeProfileId ? updatedProf : p);
    persist(updated);

    setLastResult({ correct, total, starsEarned, leveledUp, newBadges, skill: activeSkill });
    setScreen('results');
  }

  /* ── Render ── */
  if (screen === 'profiles')
    return <ProfileScreen profiles={profiles} onSelect={selectProfile} />;

  if (screen === 'hub')
    return (
      <SkillHubScreen
        profile={activeProfile}
        onSelectSkill={selectSkill}
        onBack={() => setScreen('profiles')}
      />
    );

  if (screen === 'game')
    return (
      <GameScreen
        profile={activeProfile}
        skillId={activeSkill}
        level={activeProfile.skillLevels[activeSkill]}
        questions={questions}
        onFinish={handleGameFinish}
      />
    );

  if (screen === 'results')
    return (
      <ResultsScreen
        result={lastResult}
        profile={profiles.find(p => p.id === activeProfileId)}
        onContinue={() => selectSkill(activeSkill)}
        onHome={() => setScreen('profiles')}
      />
    );

  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
