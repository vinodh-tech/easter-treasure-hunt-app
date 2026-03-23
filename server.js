// Simple local API server that serves clue answers for the crossword app.
// Run with: node server.js

const http = require("http")
const url = require("url")

const clues = {
1	: "CHOCOLATE21",
2	: "44PARK",
3	: "BUNNY78",
4	: "EGG15",
5	: "BOOK63",
6	: "SUN32",
7	: "51SNOW",
8	: "PLANE84",
9	: "SCHOOL19",
10	: "CAKE72",
11	: "LION58",
12	: "CAT90",
13	: "GIRAFFE11",
14	: "COW43",
15	: "77BEE",
16	: "SUNDAY28",
17	: "GREEN64",
18	: "PENCIL39",
19	: "ICECREAM92",
20	: "55BASEBALL",
21	: "LIBRARY17",
22	: "PHONE83",
23	: "AIRPORT46",
24	: "TRAIN70",
25	: "APPLE26",
26	: "SHOES91",
27	: "THEATER35",
28	: "WINTER68",
29	: "BANANA14",
30	: "52DOOR",
31	: "HOSPITAL74",
32	: "SOCCER18",
33	: "MILK60",
34	: "OCEAN33",
35	: "TEACHER87",
36	: "RAINCOAT23",
37	: "HORSE69",
38	: "POOL41",
39	: "CHURCH95",
40	: "CARROT12",
41	: "ZOO56",
42	: "BOAT38",
43	: "CLOCK80",
44	: "MARKET27",
45	: "BASKETBALL61",
46	: "STAR16",
47	: "HOUSE49",
48	: "BICYCLE75",
49	: "AQUARIUM22",
50	: "ELEPHANT88"
}

const PORT = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`)  // Log each incoming request

  const parsed = url.parse(req.url, true)
  const match = parsed.pathname.match(/^\/api\/answers\/([^/]+)\/?$/)

  // Basic CORS support so the app can call this from file:// or localhost
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    res.writeHead(204)
    return res.end()
  }

  if (!match) {
    console.log(`  -> 404 Not found`)
    res.writeHead(404, { "Content-Type": "application/json" })
    return res.end(JSON.stringify({ error: "Not found" }))
  }

  const clueNumber = decodeURIComponent(match[1])
  const answer = clues[clueNumber]

  if (!answer) {
    console.log(`  -> 404 Unknown clue number: ${clueNumber}`)
    res.writeHead(404, { "Content-Type": "application/json" })
    return res.end(JSON.stringify({ error: "Unknown clue number" }))
  }

  console.log(`  -> 200 { answer: "${answer}" }`)
  res.writeHead(200, { "Content-Type": "application/json" })
  res.end(JSON.stringify({ answer }))
})

server.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`)
  console.log(`GET /api/answers/1  ->  { answer: "cross" }`)
})
