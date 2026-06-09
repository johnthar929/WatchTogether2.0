const WebSocket =
require("ws");

const wss =
new WebSocket.Server({
port:
process.env.PORT ||
8080
});

const rooms = {};

wss.on(
"connection",
ws => {

```
    let room = "";

    ws.on(
        "message",
        msg => {

            let data;

            try {

                data =
                    JSON.parse(
                        msg
                    );

            } catch {

                return;
            }

            if (
                data.type ===
                "join"
            ) {

                room =
                    data.room;

                if (
                    !rooms[room]
                ) {

                    rooms[room] =
                        [];
                }

                rooms[room]
                    .push(ws);

                return;
            }

            if (
                !rooms[room]
            ) {
                return;
            }

            rooms[room]
                .forEach(
                    client => {

                        if (
                            client !==
                                ws &&
                            client
                                .readyState ===
                                WebSocket
                                    .OPEN
                        ) {

                            client.send(
                                JSON.stringify(
                                    data
                                )
                            );
                        }
                    }
                );
        }
    );

    ws.on(
        "close",
        () => {

            if (
                rooms[room]
            ) {

                rooms[
                    room
                ] =
                    rooms[
                        room
                    ].filter(
                        c =>
                            c !==
                            ws
                    );

                if (
                    rooms[
                        room
                    ].length ===
                    0
                ) {

                    delete rooms[
                        room
                    ];
                }
            }
        }
    );
}
```

);

console.log(
"WebSocket running"
);
