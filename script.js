const GRID_SIZE = 7

const layout = [

    ["#", "#", "C", "R", "O", "S", "S"],
    ["R", "#", "#", "#", "O", "#", "E"],
    ["I", "T", "O", "M", "B", "#", "P"],
    ["S", "#", "#", "#", "E", "#", "O"],
    ["E", "B", "R", "A", "N", "C", "H"],
    ["N", "#", "#", "#", "H", "#", "#"]

]

const words = {
    cross: { row: 0, col: 2, dir: "across" },
    tomb: { row: 2, col: 1, dir: "across" },
    branch: { row: 4, col: 1, dir: "across" },
    risen: { row: 1, col: 0, dir: "down" },
    hope: { row: 4, col: 6, dir: "up" }
}

const clues = [

    {
        number: "1",
        clue: "Jesus died on this wooden structure",
        answer: "cross"
    },

    {
        number: "2",
        clue: "Jesus rose from the ____",
        answer: "tomb"
    },

    {
        number: "3",
        clue: "Palm ____ Sunday",
        answer: "branch"
    },

    {number:"4", clue:"Jesus is ____", answer:"risen"},

    {number:"5", clue:"Easter gives us ____", answer:"hope"}

]

let currentClue = null

let solved = JSON.parse(localStorage.getItem("solved")) || []

function createGrid() {

    const grid = document.getElementById("grid")

    layout.forEach(row => {

        row.forEach(cell => {

            const div = document.createElement("div")

            if (cell == "#") {
                div.className = "cell block"
            }
            else {
                div.className = "cell"
            }

            grid.appendChild(div)

        })

    })

}

function fillWord(word) {

    let info = words[word]

    let letters = word.toUpperCase().split("")

    let start = info.row * 7 + info.col

    // letters.forEach((l, i) => {

    //     setTimeout(() => {

    //         document.getElementsByClassName("cell")[start + i].innerText = l

    //     }, i * 300)

    // })

    let cells = document.getElementsByClassName("cell")

    letters.forEach((letter, i) => {

        let index

        if (info.dir === "across") {
            index = (info.row * GRID_SIZE) + info.col + i
        }

        if (info.dir === "down") {
            index = ((info.row + i) * GRID_SIZE) + info.col
        }

        if (info.dir === "up") {
            index = ((info.row - i) * GRID_SIZE) + info.col
        }

        setTimeout(() => {

            cells[index].innerText = letter

        }, i * 250)

    })

}

function unlockClue() {

    let num = document.getElementById("numberInput").value

    let clue = clues.find(c => c.number === num)

    if (!clue) {

        document.getElementById("message").innerText = "Invalid number"

        return

    }

    currentClue = clue

    document.getElementById("clueText").innerText = clue.clue

    document.getElementById("message").innerText = "Clue unlocked!"

}

function checkAnswer() {

    let ans = document.getElementById("answerInput").value.toLowerCase().trim()
    console.log("checking answer");
    
    if (currentClue && ans === currentClue.answer) {

        fillWord(ans)

        solved.push(ans)

        localStorage.setItem("solved", JSON.stringify(solved))

        document.getElementById("message").innerText = "Correct! 🎉"

        document.getElementById("answerInput").value = ""

        if (solved.length === clues.length) {

            document.getElementById("message").innerText = "🏆 Congratulations! You solved the Easter crossword!"

        }

    }
    else {

        document.getElementById("message").innerText = "Try again"

    }

}

function resetGame() {

    localStorage.removeItem("solved")

    location.reload()

}

createGrid()

solved.forEach(w => fillWord(w))