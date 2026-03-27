// Simple local API server that serves clue answers for the crossword app.
// Run with: node server.js

const http = require("http")
const url = require("url")

// In-memory unlock codes for clues (for demonstration purposes)
// const unlock_clue_codes = {
//     0: [84, 19, 72, 41],
//     1: [11, 23, 45,67],
//     2: [22, 44, 78,90],
//     3: [33, 15, 63,32],
//     4: [58, 39, 92,51],
//     5: [84, 19, 72, 41],
//     6: [11, 23, 45,67],
//     7: [22, 44, 78,90],
//     8: [33, 15, 63,32],
//     9: [58, 39, 92,51]    
// }

const unlock_clue_codes_with_questions = {
  0: [{ "clueindex": 1, "clue": "A sweet treat made from cocoa that many kids love", "unlock_code": 84, "clue_answer":  "CHOCOLATE21", "row": 4, "col": 2, "dir": "across" }
    , { "clueindex": 2, "clue": "A place where people relax play and see trees", "unlock_code": 19, "clue_answer":  "PARK44", "row": 6, "col": 1, "dir": "across" }
    , { "clueindex": 3, "clue": "A small animal that hops and is often linked with Easter", "unlock_code": 72, "clue_answer":  "BUNNY78", "row": 3, "col": 6, "dir": "across" }
    , { "clueindex": 4, "clue": "A round object chickens lay", "unlock_code": 41, "clue_answer":  "EGG15", "row": 4, "col": 10, "dir": "down" }
    , { "clueindex": 5, "clue": "Something you read that has many pages", "unlock_code": 58, "clue_answer":  "BOOK63", "row": 3, "col": 6, "dir": "down" }

  ],
  1: [{ "clueindex": 1, "clue": "The bright star at the center of our solar system", "unlock_code": 11, "clue_answer": "SUN32" , "row": 5, "col": 3, "dir": "across" } 
    , { "clueindex": 2, "clue": "Frozen water that falls from the sky in winter", "unlock_code": 23, "clue_answer": "SNOW23", "row": 3, "col": 3, "dir": "down" }
    , { "clueindex": 3, "clue": "A vehicle that flies in the sky with passengers", "unlock_code": 45, "clue_answer": "PLANE84", "row": 6, "col": 0, "dir": "across" }
    , { "clueindex": 4, "clue": "A place where students go to learn", "unlock_code": 67, "clue_answer": "SCHOOL19", "row": 7, "col": 0, "dir": "across" }
    , { "clueindex": 5, "clue": "A sweet baked dessert with candles on top", "unlock_code": 89, "clue_answer": "CAKE72", "row": 0,"col": 7, "dir":"down" }
  ],
  2: [{ "clueindex": 1, "clue": "The king of the jungle animal", "unlock_code": 11, "clue_answer": "LION58",  "row": 3, "col": 3, "dir": "down" } 
    , { "clueindex": 2, "clue": "A pet that says meow", "unlock_code": 23, "clue_answer": "CAT90", "row": 5, "col": 2, "dir": "down" }
    , { "clueindex": 3, "clue": "A tall animal with a very long neck", "unlock_code": 45, "clue_answer": "GIRAFFE11", "row": 4, "col": 2, "dir": "across" }
    , { "clueindex": 4, "clue": "A farm animal that gives us milk", "unlock_code": 67, "clue_answer": "COW43", "row": 5, "col": 2, "dir": "across" }
    , { "clueindex": 5, "clue": "A small buzzing insect that makes honey", "unlock_code": 89, "clue_answer": "BEE77", "row": 1, "col": 8, "dir": "down" }
  ],
  3: [{ "clueindex": 1, "clue": "The day after Saturday", "unlock_code": 11, "clue_answer":    "MONDAY11",  "row": 0, "col": 0, "dir": "across" } 
    , { "clueindex": 2, "clue": "The color of grass", "unlock_code": 23, "clue_answer": "GREEN64", "row": 2, "col": 4, "dir": "down" } 
    , { "clueindex": 3, "clue": "Something you use to write on paper", "unlock_code": 45, "clue_answer": "PENCIL39", "row": 0, "col": 2, "dir": "across" } 
    , { "clueindex": 4, "clue": "Frozen dessert often eaten in summer", "unlock_code": 67, "clue_answer": "ICECREAM92", "row": 0, "col": 6, "dir": "down" } 
    , { "clueindex": 5, "clue": "A sport played with a bat and ball", "unlock_code": 89, "clue_answer": "BASEBALL55", "row": 2, "col": 2, "dir": "down" } 
  ],
  4: [{ "clueindex": 1, "clue": "A place where books are borrowed", "unlock_code": 11, "clue_answer": "LIBRARY17",  "row": 5, "col": 1, "dir": "across" } 
    , { "clueindex": 2, "clue": "A device used to call or text people", "unlock_code": 23, "clue_answer": "PHONE83", "row": 3, "col": 4, "dir": "across" }
    , { "clueindex": 3, "clue": "A place where airplanes take off and land", "unlock_code": 45, "clue_answer": "AIRPORT46", "row": 0, "col": 4, "dir": "down" }
    , { "clueindex": 4, "clue": "A vehicle that runs on rails", "unlock_code": 67, "clue_answer": "TRAIN70", "row": 0, "col": 2, "dir": "across" }
    , { "clueindex": 5, "clue": "A round fruit that keeps the doctor away", "unlock_code": 89, "clue_answer": "APPLE26", "row": 2, "col": 1, "dir":"down" }
  ],
  5: [{ "clueindex": 1, "clue": "Something you wear on your feet", "unlock_code": 11, "clue_answer": "SHOES91", "row": 5, "col": 2, "dir": "across" } 
    , { "clueindex": 2, "clue": "A building where movies are shown", "unlock_code": 23, "clue_answer": "THEATER35", "row": 0, "col": 5, "dir": "down" } 
    , { "clueindex": 3, "clue": "The cold season of the year", "unlock_code": 45, "clue_answer": "WINTER45", "row": 2, "col": 2, "dir": "across" } 
    , { "clueindex": 4, "clue": "A yellow fruit monkeys love", "unlock_code": 67, "clue_answer": "BANANA67", "row": 3, "col": 2, "dir": "across" } 
    , { "clueindex": 5, "clue": "Something you open to enter a room", "unlock_code": 89, "clue_answer": "DOOR89", "row": 4, "col": 2, "dir": "across" } 

  ], 6: [{ "clueindex": 1, "clue": "A place where doctors treat sick people", "unlock_code": 11, "clue_answer": "HOSPITAL11", "row": 0, "col": 0, "dir": "across" } 
    , { "clueindex": 2, "clue": "A game played with a black and white ball and goals", "unlock_code": 23, "clue_answer": "SOCCER23", "row": 0, "col": 0, "dir": "across" } 
    , { "clueindex": 3, "clue": "Something you drink to stay healthy from cows", "unlock_code": 45, "clue_answer": "MILK45", "row": 0, "col": 0, "dir": "across" } 
    , { "clueindex": 4, "clue": "A big body of water with waves", "unlock_code": 67, "clue_answer": "OCEAN67", "row": 0, "col": 0, "dir": "across" } 
    , { "clueindex": 5, "clue": "A person who teaches students", "unlock_code": 89, "clue_answer": "TEACHER89", "row": 0, "col": 0, "dir": "across" } 
  ],
  7: [{ "clueindex": 1, "clue": "Something you wear when it rains", "unlock_code": 11, "clue_answer": "RAINCOAT11", "row": 0, "col": 0, "dir": "across" } 
    , { "clueindex": 2, "clue": "A fast animal that runs and neighs", "unlock_code": 23, "clue_answer": "HORSE23", "row": 0, "col": 0, "dir": "across" } 
    , { "clueindex": 3, "clue": "A place where you swim and relax", "unlock_code": 45, "clue_answer": "BEACH45", "row": 0, "col": 0, "dir": "across" } 
    , { "clueindex": 4, "clue": "A building where people pray", "unlock_code": 67, "clue_answer": "CHURCH67", "row": 0, "col": 0, "dir": "across" } 
    , { "clueindex": 5, "clue": "A long yellow vegetable rabbits like", "unlock_code": 89, "clue_answer": "CARROT89", "row": 0, "col": 0, "dir": "across" } 
  ],
  9: [{ "clueindex": 1, "clue": "Something that shines in the night sky", "unlock_code": 11, "clue_answer": "STAR11", "row": 6, "col":6, "dir": "down" } 
    , { "clueindex": 2, "clue": "A place where families live together", "unlock_code": 23, "clue_answer": "house49", "row": 6, "col": 3, "dir": "across" } 
    , { "clueindex": 3, "clue": "A vehicle with two wheels you pedal", "unlock_code": 45, "clue_answer": "BICYCLE45", "row": 0, "col": 7, "dir": "down" } 
    , { "clueindex": 4, "clue": "A place where you see many fish", "unlock_code": 67, "clue_answer": "AQUARIUM67", "row": 1, "col": 2, "dir": "across" } 
    , { "clueindex": 5, "clue": "A large animal with a long trunk", "unlock_code": 89, "clue_answer": "ELEPHANT89", "row": 2, "col": 3, "dir": "down" } 
  ]
}





const clues = {
  1: "CHOCOLATE21",
  2: "44PARK",
  3: "BUNNY78",
  4: "EGG15",
  5: "BOOK63",
  6: "SUN32",
  7: "51SNOW",
  8: "PLANE84",
  9: "SCHOOL19",
  10: "CAKE72",
  11: "LION58",
  12: "CAT90",
  13: "GIRAFFE11",
  14: "COW43",
  15: "77BEE",
  16: "SUNDAY28",
  17: "GREEN64",
  18: "PENCIL39",
  19: "ICECREAM92",
  20: "55BASEBALL",
  21: "LIBRARY17",
  22: "PHONE83",
  23: "AIRPORT46",
  24: "TRAIN70",
  25: "APPLE26",
  26: "SHOES91",
  27: "THEATER35",
  28: "WINTER68",
  29: "BANANA14",
  30: "52DOOR",
  31: "HOSPITAL74",
  32: "SOCCER18",
  33: "MILK60",
  34: "OCEAN33",
  35: "TEACHER87",
  36: "RAINCOAT23",
  37: "HORSE69",
  38: "POOL41",
  39: "CHURCH95",
  40: "CARROT12",
  41: "ZOO56",
  42: "BOAT38",
  43: "CLOCK80",
  44: "MARKET27",
  45: "BASKETBALL61",
  46: "STAR16",
  47: "HOUSE49",
  48: "BICYCLE75",
  49: "AQUARIUM22",
  50: "ELEPHANT88"
}

const PORT = process.env.PORT || 3000

// Load the crossword placement config first
const fs = require("fs")
const path = require("path")

const configPath = path.join(__dirname, "crossword_placement_config.json")
let crosswordConfig = {}

try {
  const configData = fs.readFileSync(configPath, "utf8")
  crosswordConfig = JSON.parse(configData)
  console.log("Loaded crossword configuration")
} catch (err) {
  console.error("Failed to load crossword configuration:", err.message)
}

// Single consolidated server with all endpoints
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`)

  const parsed = url.parse(req.url, true)

  // Basic CORS support
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    res.writeHead(204)
    return res.end()
  }

  // Route: GET /api/crossword/grids - Get all grid designs
  if (parsed.pathname === "/api/crossword/grids") {
    const grids = {}
    for (const gridId in crosswordConfig) {
      grids[gridId] = {
        grid_design: crosswordConfig[gridId].grid_design
      }
    }
    console.log(`  -> 200 Returning ${Object.keys(grids).length} grids`)
    res.writeHead(200, { "Content-Type": "application/json" })
    return res.end(JSON.stringify(grids))
  }

  // Route: GET /api/crossword/grid/:id/design - Get only grid design
  const designMatch = parsed.pathname.match(/^\/api\/crossword\/grid\/([^/]+)\/design\/?$/)
  if (designMatch) {
    const gridId = decodeURIComponent(designMatch[1])
    const gridData = crosswordConfig[gridId]

    if (!gridData || !gridData.grid_design) {
      console.log(`  -> 404 Grid design not found: ${gridId}`)
      res.writeHead(404, { "Content-Type": "application/json" })
      return res.end(JSON.stringify({ error: "Grid design not found" }))
    }

    console.log(`  -> 200 Grid design ${gridId}`)
    res.writeHead(200, { "Content-Type": "application/json" })
    return res.end(JSON.stringify({ grid_design: gridData.grid_design }))
  }

  // Route: GET /api/crossword/grid/:id - Get specific grid and its clues
  const gridMatch = parsed.pathname.match(/^\/api\/crossword\/grid\/([^/]+)\/?$/)
  if (gridMatch) {
    const gridId = decodeURIComponent(gridMatch[1])
    const gridData = crosswordConfig[gridId]

    if (!gridData) {
      console.log(`  -> 404 Grid not found: ${gridId}`)
      res.writeHead(404, { "Content-Type": "application/json" })
      return res.end(JSON.stringify({ error: "Grid not found" }))
    }

    // Extract grid design and clues from the grid data
    const response = {
      grid_design: gridData.grid_design,
      clues: {}
    }

    // Gather all clues for this grid
    for (const key in gridData) {
      if (key !== "grid_design" && gridData[key].clue_answer) {
        response.clues[gridData[key].clue_index] = {
          answer: Object.keys(gridData[key].clue_answer)[0],
          position: gridData[key].clue_answer[Object.keys(gridData[key].clue_answer)[0]],
          unlock_code: gridData[key].unlock_code
        }
      }
    }

    console.log(`  -> 200 Grid ${gridId} with ${Object.keys(response.clues).length} clues`)
    res.writeHead(200, { "Content-Type": "application/json" })
    return res.end(JSON.stringify(response))
  }

  // Route: GET /api/unlock/:trailId/:clueIndex - Get unlock code and clue by trail and clue index
  const unlockMatch = parsed.pathname.match(/^\/api\/unlock\/([^/]+)\/([^/]+)\/?$/)
  if (unlockMatch) {
    const trailId = parseInt(decodeURIComponent(unlockMatch[1]), 10)
    const clueIndex = parseInt(decodeURIComponent(unlockMatch[2]), 10)

    if (Number.isNaN(trailId) || Number.isNaN(clueIndex)) {
      console.log(`  -> 400 Invalid trailId or clueIndex`)
      res.writeHead(400, { "Content-Type": "application/json" })
      return res.end(JSON.stringify({ error: "Invalid trailId or clueIndex" }))
    }

    const trailData = unlock_clue_codes_with_questions[trailId]
    if (!trailData) {
      console.log(`  -> 404 Trail not found: ${trailId}`)
      res.writeHead(404, { "Content-Type": "application/json" })
      return res.end(JSON.stringify({ error: "Trail not found" }))
    }

    if (clueIndex < 0 || clueIndex >= trailData.length) {
      console.log(`  -> 404 Clue index out of range: ${clueIndex} (trail ${trailId})`)
      res.writeHead(404, { "Content-Type": "application/json" })
      return res.end(JSON.stringify({ error: "Clue index out of range" }))
    }

    const clueData = trailData[clueIndex]
    if (!clueData) {
      console.log(`  -> 404 Clue data missing for trail ${trailId}, clue ${clueIndex}`)
      res.writeHead(404, { "Content-Type": "application/json" })
      return res.end(JSON.stringify({ error: "Clue data missing" }))
    }

    const clueindex = clueData.clueindex
    const clue = clueData.clue
    const unlockCode = clueData.unlock_code
    const clueAnswer = clueData.clue_answer
    const clueRowPosition = clueData.row
    const clueColPosition = clueData.col
    const clueDirection = clueData.dir

    console.log(`  -> 200 Unlock for trail ${trailId}, clueIndex ${clueIndex} -> Clue: ${clue} (${unlockCode})`)
    console.log(`     Clue answer: ${clueAnswer}, position: (${clueRowPosition}, ${clueColPosition}), direction: ${clueDirection}`)

    res.writeHead(200, { "Content-Type": "application/json" })
    return res.end(JSON.stringify({
      trailId,
      clueIndex,
      clueindex,
      clue,
      unlockCode,
      clueAnswer,
      clueRowPosition,
      clueColPosition,
      clueDirection
    }))
  }

  // Route: GET /api/validate/:trailId/:clueIndex/:answer - Validate answer for a clue
  const validateMatch = parsed.pathname.match(/^\/api\/validate\/([^/]+)\/([^/]+)\/([^/]+)\/?$/)
  if (validateMatch) {
    const trailId = parseInt(decodeURIComponent(validateMatch[1]), 10)
    const clueIndex = parseInt(decodeURIComponent(validateMatch[2]), 10)
    const submittedAnswer = decodeURIComponent(validateMatch[3])

    if (Number.isNaN(trailId) || Number.isNaN(clueIndex)) {
      console.log(`  -> 400 Invalid trailId or clueIndex`)
      res.writeHead(400, { "Content-Type": "application/json" })
      return res.end(JSON.stringify({ error: "Invalid trailId or clueIndex" }))
    }

    const trailData = unlock_clue_codes_with_questions[trailId]
    if (!trailData) {
      console.log(`  -> 404 Trail not found: ${trailId}`)
      res.writeHead(404, { "Content-Type": "application/json" })
      return res.end(JSON.stringify({ error: "Trail not found" }))
    }

    if (clueIndex < 0 || clueIndex >= trailData.length) {
      console.log(`  -> 404 Clue index out of range: ${clueIndex} (trail ${trailId})`)
      res.writeHead(404, { "Content-Type": "application/json" })
      return res.end(JSON.stringify({ error: "Clue index out of range" }))
    }

    const clueData = trailData[clueIndex]
    if (!clueData) {
      console.log(`  -> 404 Clue data missing for trail ${trailId}, clue ${clueIndex}`)
      res.writeHead(404, { "Content-Type": "application/json" })
      return res.end(JSON.stringify({ error: "Clue data missing" }))
    }

    const expectedAnswer = clueData.clue_answer
    const isCorrect = submittedAnswer.toUpperCase() === expectedAnswer.toUpperCase()

    console.log(`  -> 200 Answer validation for trail ${trailId}, clue ${clueIndex}: ${isCorrect ? 'CORRECT' : 'INCORRECT'}`)
    res.writeHead(200, { "Content-Type": "application/json" })
    return res.end(JSON.stringify({
      isCorrect,
      message: isCorrect ? `Correct answer!` : `Incorrect answer. Expected: ${expectedAnswer}`
    }))
  }

  // Route: GET /api/answers/:clueNumber - Original endpoint for individual clue answers
  const answerMatch = parsed.pathname.match(/^\/api\/answers\/([^/]+)\/?$/)
  if (answerMatch) {
    const clueNumber = decodeURIComponent(answerMatch[1])
    const answer = clues[clueNumber]

    if (!answer) {
      console.log(`  -> 404 Unknown clue number: ${clueNumber}`)
      res.writeHead(404, { "Content-Type": "application/json" })
      return res.end(JSON.stringify({ error: "Unknown clue number" }))
    }

    console.log(`  -> 200 { answer: "${answer}" }`)
    res.writeHead(200, { "Content-Type": "application/json" })
    return res.end(JSON.stringify({ answer }))
  }

  // 404 for unmatched routes
  console.log(`  -> 404 Not found`)
  res.writeHead(404, { "Content-Type": "application/json" })
  res.end(JSON.stringify({ error: "Not found" }))
})

server.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`)
  console.log(`GET /api/answers/1  ->  { answer: "CHOCOLATE21" }`)
  console.log(`GET /api/crossword/grids  ->  All available grids`)
  console.log(`GET /api/crossword/grid/:id  ->  Specific grid with clues`)
  console.log(`GET /api/crossword/grid/:id/design  ->  Only grid design`)
  console.log(`GET /api/unlock/:trailId/:clueIndex  ->  Unlock code for specific trail and clue index`)
  console.log(`GET /api/validate/:trailId/:clueIndex/:answer  ->  Validate answer for specific trail and clue`)
})

