require("./lib/global")(function(err, Global) {
    var Pith = require("./pith.js");
    var rest = require("./lib/pithrest.js");
    var express = require("express");
    var http = require("http");
    var ws = require("ws");
    var http = require("http");
    var scaler = require("./lib/imagescaler");
    var bodyparser = require("body-parser");

    process.on('uncaughtException', function(err) {
        // handle the error safely
        console.log(err)
    });

    Global.OpenDatabase(
        function startup(err, db) {
            if(err) {
                throw err;
            }

            var serverAddress = Global.bindAddress;
            var port = Global.httpPort;
            var pithPath = Global.settings.pithContext;

            console.log("Listening on http://" + serverAddress + ":" + port);

            var pithApp = new Pith({
                rootUrl: Global.rootUrl + "/pith/",
                rootPath: pithPath,
                db: db
            });

            var app = express();

            app.use(bodyparser.json());

            app.set('x-powered-by', false);

            app.use(pithPath, pithApp.handle);
            app.use(Global.settings.apiContext, rest(pithApp));
            app.use("/webui", express.static("webui/dist"));
            app.use("/scale", scaler.handle);

            // exclude all private members in JSON messages (those starting with underscore)
            function jsonReplacer(k,v) {
                if(k.charAt(0) == '_') return undefined;
                else return v;
            }

            app.set("json replacer", jsonReplacer);

            var server = new http.Server(app);

            server.listen(port, serverAddress);
            server.listen(port);

            var wss = new ws.Server({server: server});

            wss.on('connection', function(ws) {
                var listeners = [];
                ws.on('message', function(data) {
                    try {
                        var message = JSON.parse(data);
                        switch(message.action) {
                        case 'on':
                                var listener = function() {
                                    try {
                                        ws.send(JSON.stringify({event: message.event, arguments: Array.prototype.slice.apply(arguments)}, jsonReplacer));
                                    } catch(e) {
                                        console.error(e);
                                    }
                                };
                                listeners.push({event: message.event, listener: listener});
                                pithApp.on(message.event, listener);
                                break;
                        }
                    } catch(e) {
                        console.error("Error processing event message", data, e);
                    }
                });
                ws.on('close', function() {
                    console.log("Client disconnected, cleaning up listeners");
                    listeners.forEach(function(e) {
                        pithApp.removeListener(e.event, e.listener);
                    });
                });
            });

            app.use((req, res, next) => {
                res.redirect('/webui/');
            })
        }
    );
});
