# Math Adventure 🌿

An interactive math skill game for young children (ages 4–6). Kids pick a profile, choose a skill to practice, and answer 8 multiple-choice questions per session — earning stars, leveling up, and collecting badges along the way.

## How to Play

Open `Math Adventure.html` in any modern browser. No installation or build step required.

1. Tap your profile to start
2. Choose a skill to practice
3. Answer 8 questions
4. Earn stars and see your progress

Works on desktop and mobile. Designed for touch (iOS/Android friendly).

## Skills

| Skill | Levels |
|-------|--------|
| 🐾 **Counting** | Count to 5 → Count to 10 → Count to 15 |
| 🌟 **Adding** | Sums to 5 → Sums to 10 → Sums to 15 |
| 🔷 **Shapes** | Basic shapes → More shapes → All shapes |

Each skill has 3 levels. You level up after earning enough progress points across sessions.

## Scoring

- **3 stars** — 7 or 8 correct
- **2 stars** — 5 or 6 correct
- **1 star** — fewer than 5 correct

A session with 6+ correct adds 2 progress points toward level-up; 5 correct adds 1. Reach 5 progress points to advance to the next level.

## Badges

| Badge | How to Earn |
|-------|-------------|
| ⭐ First Star! | Earn your first star |
| 🌟 Star Collector | Earn 10 stars total |
| 🐾 Counting Champ | Reach Level 2 in Counting |
| 🔢 Counting Master | Reach Level 3 in Counting |
| ➕ Addition Ace | Reach Level 2 in Adding |
| 🔷 Shape Explorer | Reach Level 2 in Shapes |
| 🏆 Perfect Score! | Get 8/8 in a session |
| 🔥 On Fire! | Answer 5 in a row correctly |

## Files

```
Math Adventure.html   # Entry point — open this in your browser
data.jsx              # Profiles, question generators, badges, localStorage
screens.jsx           # ProfileScreen, SkillHubScreen, ResultsScreen
game.jsx              # GameScreen and all question-type renderers
app.jsx               # App state, routing, scoring logic
```

## Tech

- **React 18** via CDN (no build step, no npm)
- **Babel Standalone** for JSX in-browser compilation
- **localStorage** for saving profiles, stars, badges, and progress between sessions
- Pure inline CSS — no external stylesheet dependencies

## Profiles

Two default profiles are included (Ellie and Everlyn). Progress is saved automatically in `localStorage` under the key `mathAdv_profiles_v3`.
