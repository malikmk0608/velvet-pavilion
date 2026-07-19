import './QuickChips.css'

function QuickChips({ chips, onInsert }) {
  return (
    <div className="quick-chips">
      <span className="quick-chips-label">Quick insert</span>
      <div className="quick-chips-row">
        {chips.map((chip) => (
          <button
            key={chip}
            className="quick-chip"
            type="button"
            onClick={() => onInsert(chip)}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickChips
