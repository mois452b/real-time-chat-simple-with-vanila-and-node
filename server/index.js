import express from "express";
import logger from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import { LocalStorageDatabase } from "./localStorage.js";

const port = process.env.PORT || 3000;

const app = express( );
const server = createServer( app );
const io = new Server( server, {
    connectionStateRecovery: {}
});

const db = new LocalStorageDatabase( 'messages' );

io.on( 'connection', ( socket ) => {
    console.log( 'a user connected' );
    socket.on( 'disconnect', () => {
        console.log( 'user disconnected' );
    });

    socket.on( 'message', ( msg ) => {
        let result;
        try {
            result = db.insert( 'messages', { msg } );
        }
        catch( e ) {
            console.log(e)
            return;
        }
        io.emit( 'message', msg, result.id );
    })

    if( !socket.recovered ) {
        const messages = db.getTable( 'messages' ).filter( msg => msg.id > socket.handshake.auth.serverOffset ?? 0  );
        messages.forEach( msg => {
            socket.emit( 'message', msg.msg, msg.id );
        })
    }
})

app.use( logger('dev') );

app.get( '/', (req, res) => {
    res.sendFile( process.cwd() + '/client/index.html' );
})

server.listen( port, () => {
    console.log( `Server running on port ${ port }` );
})