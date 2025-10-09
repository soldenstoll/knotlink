import './App.css'

function App() {
  const size = 5
  const cells = Array.from({ length: size * size })

  return (
    <div className="grid-wrapper">
      <div className="grid" role="grid" aria-label="5 by 5 grid">
        {cells.map((_, i) => (
          <div key={i} className="cell" role="gridcell" />
        ))}
      </div>
    </div>
  )
}

export default App
