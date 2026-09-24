import { useEffect, useRef, useState } from 'react'
import './App.css'
import './tile-audio.css'
import './level-selector.css'

const levels = [
  { title: 'The Dewlit Garden', story: 'Three shy chimes wait beneath the morning leaves.', sequence: ['Dewdrop', 'Moss Bell', 'Sunbeam'], tiles: [{ name: 'Dewdrop', icon: '✦', color: 'blue', note: 523, wave: 'sine' }, { name: 'Moss Bell', icon: '◒', color: 'green', note: 392, wave: 'triangle' }, { name: 'Sunbeam', icon: '☼', color: 'yellow', note: 659, wave: 'sine' }] },
  { title: 'Lantern Alley', story: 'Follow the little lights through the hush of evening.', sequence: ['Candle', 'Lantern', 'Firefly'], tiles: [{ name: 'Candle', icon: '⌁', color: 'coral', note: 440, wave: 'sine' }, { name: 'Lantern', icon: '◈', color: 'orange', note: 587, wave: 'triangle' }, { name: 'Firefly', icon: '✧', color: 'gold', note: 784, wave: 'sine' }] },
  { title: 'Cloud Library', story: 'A gentle melody slipped between the floating shelves.', sequence: ['Puff', 'Whisper', 'Page Turn', 'Rain Dot'], tiles: [{ name: 'Puff', icon: '☁', color: 'sky', note: 330, wave: 'sine' }, { name: 'Whisper', icon: '〰', color: 'lilac', note: 494, wave: 'sine' }, { name: 'Page Turn', icon: '▱', color: 'peach', note: 415, wave: 'triangle' }, { name: 'Rain Dot', icon: '●', color: 'blue', note: 698, wave: 'sine' }] },
  { title: 'Moonwell', story: 'The water remembers a four-part song.', sequence: ['Ripple', 'Moonstone', 'Ripple', 'Reed'], tiles: [{ name: 'Ripple', icon: '≈', color: 'aqua', note: 349, wave: 'sine' }, { name: 'Moonstone', icon: '☾', color: 'violet', note: 554, wave: 'triangle' }, { name: 'Reed', icon: '⌇', color: 'mint', note: 466, wave: 'sine' }, { name: 'Starlight', icon: '✩', color: 'pink', note: 740, wave: 'sine' }] },
  { title: 'The Last Sound', story: 'Gather the five echoes that will wake the sleeping world.', sequence: ['Heartwood', 'Ember', 'Tide', 'Sky', 'Dawn'], tiles: [{ name: 'Heartwood', icon: '✤', color: 'green', note: 294, wave: 'triangle' }, { name: 'Ember', icon: '✹', color: 'coral', note: 466, wave: 'sine' }, { name: 'Tide', icon: '⌇', color: 'blue', note: 349, wave: 'sine' }, { name: 'Sky', icon: '☁', color: 'sky', note: 659, wave: 'triangle' }, { name: 'Dawn', icon: '☼', color: 'yellow', note: 784, wave: 'sine' }] },
  { title: 'Crystal Cavern', story: 'Shimmering stones sing back every friendly footstep.', sequence: ['Dripstone', 'Echo Gem', 'Cave Wind', 'Echo Gem', 'Glowpool'], tiles: [{ name: 'Dripstone', icon: '💧', color: 'blue', note: 392, wave: 'sine' }, { name: 'Echo Gem', icon: '◆', color: 'violet', note: 622, wave: 'triangle' }, { name: 'Cave Wind', icon: '〰', color: 'sky', note: 330, wave: 'sine' }, { name: 'Glowpool', icon: '◉', color: 'aqua', note: 523, wave: 'sine' }, { name: 'Pebble Tap', icon: '●', color: 'peach', note: 440, wave: 'triangle' }] },
  { title: 'Starling Grove', story: 'The woodland birds have tucked a longer tune into the leaves.', sequence: ['Robin Call', 'Leaf Rustle', 'Acorn Tap', 'Breeze', 'Robin Call', 'Twilight Bell'], tiles: [{ name: 'Robin Call', icon: '♬', color: 'coral', note: 698, wave: 'sine' }, { name: 'Leaf Rustle', icon: '❧', color: 'green', note: 349, wave: 'triangle' }, { name: 'Acorn Tap', icon: '●', color: 'gold', note: 494, wave: 'triangle' }, { name: 'Breeze', icon: '〰', color: 'sky', note: 392, wave: 'sine' }, { name: 'Twilight Bell', icon: '◒', color: 'lilac', note: 784, wave: 'sine' }] },
  { title: 'Aurora Summit', story: 'At the snowy peak, seven lights weave the sky’s brightest song.', sequence: ['Frost Chime', 'North Wind', 'Aurora Glow', 'Summit Drum', 'Aurora Glow', 'Frost Chime', 'Star Spark'], tiles: [{ name: 'Frost Chime', icon: '❄', color: 'aqua', note: 659, wave: 'sine' }, { name: 'North Wind', icon: '〰', color: 'sky', note: 294, wave: 'triangle' }, { name: 'Aurora Glow', icon: '✦', color: 'pink', note: 554, wave: 'sine' }, { name: 'Summit Drum', icon: '◉', color: 'coral', note: 415, wave: 'triangle' }, { name: 'Star Spark', icon: '✧', color: 'yellow', note: 880, wave: 'sine' }, { name: 'Snow Step', icon: '✣', color: 'mint', note: 349, wave: 'triangle' }] },
]

const key = 'the-last-sound-unlocked-level'
const levelEightMigrationKey = 'the-last-sound-eight-level-migration'

function App() {
  const [unlocked, setUnlocked] = useState(() => {
    const savedLevel = Number(localStorage.getItem(key)) || 1
    const isLegacyLevelFiveSave = savedLevel === 5 && !localStorage.getItem(levelEightMigrationKey)
    if (isLegacyLevelFiveSave) {
      localStorage.setItem(levelEightMigrationKey, 'done')
      localStorage.setItem(key, '6')
    }
    return isLegacyLevelFiveSave ? 6 : Math.min(savedLevel, levels.length)
  })
  const [levelNumber, setLevelNumber] = useState(1)
  const [answer, setAnswer] = useState([])
  const [feedback, setFeedback] = useState('')
  const [volume, setVolume] = useState(0.55)
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const timer = useRef(null)
  const audioContext = useRef(null)
  const current = levels[levelNumber - 1]

  useEffect(() => { localStorage.setItem(key, String(unlocked)) }, [unlocked])
  useEffect(() => () => {
    window.clearTimeout(timer.current)
    audioContext.current?.close()
  }, [])

  function stopSound() {
    window.clearTimeout(timer.current)
    if (audioContext.current) {
      audioContext.current.close()
      audioContext.current = null
    }
    setPlaying(false)
  }

  function finishSound(context) {
    timer.current = window.setTimeout(() => {
      if (audioContext.current === context) {
        context.close()
        audioContext.current = null
        setPlaying(false)
      }
    }, current.sequence.length * 650 + 180)
  }

  function playSequence() {
    stopSound()
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) { setFeedback('Your browser does not support Web Audio. Try a current browser to hear the sequence.'); return }
    const context = new AudioContext()
    audioContext.current = context
    const now = context.currentTime + 0.08
    const output = context.createGain()
    output.gain.value = muted ? 0 : volume
    output.connect(context.destination)
    current.sequence.forEach((name, index) => {
      const tile = current.tiles.find((item) => item.name === name)
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const start = now + index * 0.65
      oscillator.type = tile.wave
      oscillator.frequency.value = tile.note
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.28, start + 0.035)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.43)
      oscillator.connect(gain); gain.connect(output)
      oscillator.start(start); oscillator.stop(start + 0.46)
    })
    setPlaying(true); setFeedback('Listen closely… then tap the tiles in the same order.')
    finishSound(context)
  }

  function playTileSound(tile) {
    stopSound()
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) { setFeedback('Your browser does not support Web Audio. Try a current browser to hear the sounds.'); return }
    const context = new AudioContext()
    audioContext.current = context
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const start = context.currentTime + 0.01
    oscillator.type = tile.wave
    oscillator.frequency.value = tile.note
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(muted ? 0.0001 : 0.28 * volume, start + 0.035)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.43)
    oscillator.connect(gain); gain.connect(context.destination)
    oscillator.start(start); oscillator.stop(start + 0.46)
    timer.current = window.setTimeout(() => {
      if (audioContext.current === context) {
        context.close()
        audioContext.current = null
      }
    }, 600)
  }

  function chooseTile(name) {
    if (answer.length < current.sequence.length) {
      setAnswer([...answer, name])
      setFeedback('')
    }
  }
  function checkAnswer() {
    if (answer.length !== current.sequence.length) { setFeedback(`Add ${current.sequence.length - answer.length} more tile${current.sequence.length - answer.length === 1 ? '' : 's'} before checking.`); return }
    const correct = answer.every((name, index) => name === current.sequence[index])
    if (correct) {
      setFeedback('Restored! The world remembers this sound. ✨')
      if (levelNumber === levels.length) setUnlocked(levels.length)
      else setUnlocked((value) => Math.max(value, levelNumber + 1))
    } else setFeedback('Not quite — the echoes are still mixed up. Listen once more and try again.')
  }
  function clearAnswer() {
    stopSound()
    setAnswer([])
    setFeedback('')
  }
  function selectLevel(number) { if (number <= unlocked) { stopSound(); setLevelNumber(number); setAnswer([]); setFeedback('') } }
  const isComplete = levelNumber === levels.length && feedback.startsWith('Restored')

  if (isComplete) return <main className="app complete-screen"><div className="sparkles">✦ ✧ ✦</div><p className="kicker">THE WORLD IS SINGING AGAIN</p><h1>You found the last sound.</h1><p className="complete-copy">Eight forgotten melodies now ripple across the world. Thank you, Listener.</p><button className="primary" type="button" onClick={() => { setLevelNumber(1); setAnswer([]); setFeedback('') }}>Play again <span>↺</span></button></main>

  return <main className="app">
    <header><a className="logo" href="#top" onClick={(event) => event.preventDefault()}><span>✦</span> THE LAST SOUND</a><div className="audio-controls"><button type="button" className="mute" onClick={() => setMuted(!muted)} aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}>{muted ? '🔇' : '🔊'} <b>{muted ? 'Muted' : 'Sound on'}</b></button><label>Volume<input aria-label="Volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => { setVolume(Number(event.target.value)); setMuted(false) }} /></label></div></header>
    <section className="hero" id="top"><div><p className="kicker">A LISTENING PUZZLE</p><h1>Help the world<br /><em>remember its music.</em></h1><p className="intro">The sounds have vanished. Listen to each lost melody, then restore it one tile at a time.</p></div><div className="hero-orb"><span>☾</span><i>✦</i><b>✧</b></div></section>
    <section className="level-path" aria-label="Level selection">{levels.map((level, index) => { const number = index + 1; return <button type="button" key={level.title} className={`${number === levelNumber ? 'active' : ''} ${number > unlocked ? 'locked' : ''}`} disabled={number > unlocked} onClick={() => selectLevel(number)}><span>{number > unlocked ? '⌁' : number}</span><b>{number === levels.length ? 'Finale' : `Level ${number}`}</b></button> })}</section>
    <section className="game-card"><div className="scene"><div className="scene-stars">✦　·　✧　·　✦</div><div className="scene-title"><span>Level {levelNumber} of {levels.length}</span><h2>{current.title}</h2><p>{current.story}</p></div><div className="mountains"><i /><i /><i /></div></div><div className="puzzle"><div className="puzzle-head"><div><p className="step">STEP 1</p><h2>Listen to the lost melody</h2></div><button type="button" className="listen-button" onClick={playSequence} disabled={playing}>{playing ? 'Playing…' : '▶  Play sequence'}</button></div><p className="hint">Each sound is a short, original tone generated in your browser.</p><div className="divider" /><div className="puzzle-head"><div><p className="step">STEP 2</p><h2>Place the echoes in order</h2></div><span className="count">{answer.length} / {current.sequence.length}</span></div><div className="answer-slots" aria-label="Your answer">{Array.from({ length: current.sequence.length }, (_, index) => <div className={answer[index] ? 'answer-slot filled' : 'answer-slot'} key={index}><small>{index + 1}</small>{answer[index] ? <span>{current.tiles.find((tile) => tile.name === answer[index]).icon} {answer[index]}</span> : <span>?</span>}</div>)}</div><div className="tiles">{current.tiles.map((tile) => <div className={`tile ${tile.color}`} key={tile.name}><span className="tile-icon" aria-hidden="true">{tile.icon}</span><b>{tile.name}</b><div className="tile-actions"><button type="button" className="tile-action tile-listen" onClick={() => playTileSound(tile)} aria-label={`Listen to ${tile.name}`}>🔊 Listen</button><button type="button" className="tile-action tile-select" onClick={() => chooseTile(tile.name)} disabled={answer.length === current.sequence.length}>Select</button></div></div>)}</div><div className="action-row"><button className="clear" type="button" onClick={clearAnswer}>Clear answer</button><button className="primary" type="button" onClick={checkAnswer}>Check answer <span>→</span></button></div>{feedback && <p className={`feedback ${feedback.startsWith('Restored') ? 'success' : ''}`}>{feedback}</p>}</div></section>
    <section className="how-to"><div><span>01</span><h3>Listen</h3><p>Play the sequence as often as you need.</p></div><div><span>02</span><h3>Arrange</h3><p>Tap the sound tiles in the order you heard.</p></div><div><span>03</span><h3>Restore</h3><p>Check your answer to wake the next place.</p></div></section>
    <footer>Made for quiet moments · All sounds are generated with Web Audio</footer>
  </main>
}
export default App
