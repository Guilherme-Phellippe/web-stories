import express from "express";
import app from "./router/router"
const server = express();

server.use(express.json())
server.use(app)


server.listen("1111", ()=> console.log("SERVER IS RUNNING ON PORT: 1111"))