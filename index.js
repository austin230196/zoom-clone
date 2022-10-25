const http = require("http");


const express = require("express");
const {Server} = require("socket.io");
const {ExpressPeerServer} = require("peer");


const uuid = require("./uuid");


const app = express();
const server = http.Server(app);
const io = new Server(server, {
    cors: false
});
const peerServer = ExpressPeerServer(server, {
    debug: true,
})


app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use("/peerjs", peerServer);


peerServer.on("connection", client => {
    console.log({id: client.id});
})


peerServer.on("disconnect", client => {
    console.log({id: client.id})
})

io.on("connection", socket => {
    console.log(`User ${socket.id} is connected`);
    socket.on('join-room', (roomId, peerId) => {
        console.log({peerId, roomId})
        socket.join(roomId);
        io.to(roomId).emit('user-joined', peerId);
        socket.on("message", msg => {
            console.log({peerId});
            io.to(roomId).emit('get-message', msg, peerId);
        })
    })
    socket.on("disconnect", () => {
        console.log(`User ${socket.id} is disconnected`)
    })
})



app.get("/", async(req, res, next) => {
    res.redirect(`/${uuid(40)}`)
})


app.get("/:roomId", async(req, res, next) => {
    const {roomId} = req.params;
    res.render('room', {
        roomId
    })
    return;
})



//ERROR HANDLERS
app.use((req, res, next) => {
    let err = new Error('Reached an invalid endpoint, please re-navigate');
    err.status = 404;
    next(err);
})
//general error handler
app.use((error, req, res, next) => {
    res.status(error.status ?? 500);
    res.json({
        message: error.message ?? 'Server error',
        statusCode: error.status ?? 500,
        success: false
    })
})


server.on("listening", (req, res) => {
    console.log(`Server has started on http://${server.address().address}:${server.address().port} on family ${server.address().family}`)
})





server.listen(9000, '127.0.0.1');
