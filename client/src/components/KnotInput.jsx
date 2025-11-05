import React from "react"
import { useState } from "react"

function KnotInput({ setter }) {
    const [input, setInput] = useState("")

    // Handles input box changes
    const handleInputChange = (evt) => {
        setInput(evt.target.value)
    }

    // Calls cellSetter to update cells on load
    const updateCells = () => {
        var inputCells = input
        inputCells = inputCells.replaceAll("\n", "")
                               .replaceAll("[", "")

        // Subtract 2 to account for ]] at the end.
        const rows = inputCells.split("]").length - 2

        inputCells = inputCells.replaceAll("]", "")
        const res = inputCells.split(",")
        const cols = res.length / rows

        const cells = res.map(item => safeParseInt(item, 10))

        // Update cells
        setter(cells, rows, cols)
    }

    const safeParseInt = (item, radix) => {
        const res = parseInt(item, radix)
        if ((res < 0) || (res > 11) || Number.isNaN(res)) {
            return 0
        }
        return res
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
