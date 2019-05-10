const express = require("express")
const path = require("path")
const http = require("http")
const socketIO = require("socket.io")
const bodyParser = require("body-parser")

require("dotenv").config()

const db = require("../models")
const PORT = process.env.PORT || 5000


const app = express()
const server = http.createServer(app)

// Intitialize socket.io
const io = socketIO(server)

const playersRoute = require("./routes/players")
const cardsRoute = require("./routes/cards")
const adminRoute = require("./routes/admin")

io.sockets.on("connection", socket => {
  console.log("user connected")
  console.log(socket.id)
  const count = Object.keys(io.sockets.connected).length
  console.log(count, ": this is count")

  socket.on("hi", (id) => {
    io.sockets.connected[id].emit("message", id)
  })

  socket.on("room", (room) => {
    console.log("user:" + socket.id + "joined " + room)
    socket.join(room)
  })

  socket.on("error", function(){
    socket.socket.reconnect()
  })

  // TODO: EVENT TO RECEIVE A TRANSACTION REQUEST

  socket.on("disconnect", () => {
    console.log("user disconnected")
  })
})

app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

db.sequelize
.authenticate()
.then(() => {
  console.log("🛎 SERVER:", "Postgres Connection has been established successfully.")
})
.catch(err => {
  console.error("🛎 SERVER:", "Unable to connect to the database:", err)
})

// make socket.io accessible to our router
app.use(function(req,res,next){
    req.io = io
    next()
})

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, "../react-ui/build")))

// Intialize routes
app.use("/players", playersRoute)
app.use("/cards", cardsRoute)
app.use("/admin", adminRoute)

// All remaining requests return the React app, so it can handle routing.
app.get("*", function(request, response) {
  response.sendFile(
    path.resolve(__dirname, "../react-ui/build", "index.html")
  )
})

 server.listen(PORT, function() {
  console.error("🛎 SERVER:",
    `Node cluster worker ${process.pid}: listening on port ${PORT}`
  )
})
