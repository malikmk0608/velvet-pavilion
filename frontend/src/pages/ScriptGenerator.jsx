import { useNavigate } from 'react-router-dom'
import actionImg from '../assets/genre-action.jpg'
import dramaImg from '../assets/genre-drama.jpg'
import comedyImg from '../assets/genre-comedy.jpg'
import horrorImg from '../assets/genre-horror.jpg'
import thrillerImg from '../assets/genre-thriller.jpg'
import historicalImg from '../assets/genre-historical.jpg'
import romanceImg from '../assets/genre-romance.jpg'
import scifiImg from '../assets/genre-scifi.jpg'
import './ScriptGenerator.css'

const genres = [
  { name: 'Action', className: 'genre-action', image: actionImg, description: 'High stakes, relentless momentum. Stories built on danger, speed, and physical conflict.' },
  { name: 'Drama', className: 'genre-drama', image: dramaImg, description: 'Raw emotion, human conflict. Character-driven stories rooted in real stakes.' },
  { name: 'Comedy', className: 'genre-comedy', image: comedyImg, description: 'Wit, timing, and warmth. Stories that find the humor in the everyday.' },
  { name: 'Horror', className: 'genre-horror', image: horrorImg, description: 'Dread, tension, the unknown. Stories designed to unsettle and haunt.' },
  { name: 'Thriller', className: 'genre-thriller', image: thrillerImg, description: 'Suspense with every turn. Stories that keep the audience guessing.' },
  { name: 'Historical', className: 'genre-historical', image: historicalImg, description: 'Stories rooted in time. Narratives shaped by real or imagined eras.' },
  { name: 'Romance', className: 'genre-romance', image: romanceImg, description: 'Longing, connection, heart. Stories about the people we choose to love.' },
  { name: 'Sci-Fi', className: 'genre-scifi', image: scifiImg, description: 'Bold ideas, new worlds. Stories that imagine what could be.' },
]

function ScriptGenerator() {
  const navigate = useNavigate()

  return (
    <div className="genre-page">
      <div className="genre-header">
        <p className="genre-eyebrow">Script Generator</p>
        <h1 className="genre-title">Choose a genre to begin</h1>
      </div>

      <div className="genre-grid">
        {genres.map((genre, i) => (
          <button
            key={genre.name}
            className={`genre-block ${genre.className}`}
            style={{ animationDelay: `${0.4 + i * 0.1}s` }}
            onClick={() => navigate(`/script-generator/${genre.name.toLowerCase()}`)}
          >
            <img src={genre.image} alt="" className="genre-block-img" />
            <h3 className="genre-name">{genre.name.toUpperCase()}</h3>
            <p className="genre-desc">{genre.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ScriptGenerator