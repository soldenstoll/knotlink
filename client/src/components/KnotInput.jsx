import React from "react"
import { useState } from "react"

function KnotInput({ cellSetter }) {
    const [input, setInput] = useState("")

    // Handles input box changes
    const handleInputChange = (evt) => {
        setInput(evt.target.value)
    }

    // Calls cellSetter to update cells on load
    const updateCells = () => {
        // TODO
    }

    return (
        <>
            <textarea id="input-box" rows={8} cols={60} value={input}
                onChange={handleInputChange}
                className="border-1 rounded-lg"
            >    
            </textarea>
            <button onClick={updateCells} className="px-2">load</button>
        </>
    )
}

export default KnotInput
