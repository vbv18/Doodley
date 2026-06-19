import { WebSocketServer } from "ws";

import { wsEnv } from "@repo/config/ws-env";


const wss = new WebSocketServer({ port: wsEnv.WS_PORT });

wss.on("connection", function connection(ws) {

    ws.on("message", function message(data) {
        ws.send("pong");
    });
});

