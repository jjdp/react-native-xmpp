'use strict';
var React = require('react-native');
var {NativeAppEventEmitter, NativeModules} = React;
var RNXMPP = NativeModules.RNXMPP;
var ltx = require('ltx');
var EventEmitter = require('events').EventEmitter;

var map = {
    'connect': 'RNXMPPConnect',
    'disconnect': 'RNXMPPDisconnect',
    'error': 'RNXMPPError',
    'loginError': 'RNXMPPLoginError',
    'login': 'RNXMPPLogin',
    'stanza': 'RNXMPPStanza',
}

class XMPP extends EventEmitter {
    PLAIN = RNXMPP.PLAIN;
    SCRAM = RNXMPP.SCRAMSHA1;
    MD5 = RNXMPP.DigestMD5;

    constructor(){
        super()

        this.isConnected = false;
        this.isLogged = false;
        this.iqCallbacks = {};
        NativeAppEventEmitter.addListener(map.connect, this.onConnected.bind(this));
        NativeAppEventEmitter.addListener(map.disconnect, this.onDisconnected.bind(this));
        NativeAppEventEmitter.addListener(map.error, this.onError.bind(this));
        NativeAppEventEmitter.addListener(map.loginError, this.onLoginError.bind(this));
        NativeAppEventEmitter.addListener(map.login, this.onLogin.bind(this));
        NativeAppEventEmitter.addListener(map.stanza, this.onStanza.bind(this));
    }

    onConnected(){
        console.log("Connected");
        this.isConnected = true;
        this.emit('connect');
    }

    onLogin(){
        console.log("Logged");
        this.isLogged = true;
        this.emit('login');
    }

    onDisconnected(error){
        console.log("onDisconnected", error);
        this.emit('end');

        var iqCallbacks = this.iqCallbacks;
        this.iqCallbacks = {};
        var ids = Object.keys(iqCallbacks);
        for(var i = 0; i < ids.length; i++) {
            var cb = iqCallbacks[ids[i]];
            try {
                cb(new Error('Disconnected: ' + error));
            } catch (e) {
                console.error(e.stack);
            }
        }

        console.log("Disconnected, error"+error);
        this.isConnected = false;
        this.isLogged = false;
    }

    onError(text){
        console.log("Error: "+text);
    }

    onLoginError(text){
        this.isLogged = false;
        console.log("LoginError: "+text);
        this.emit('loginError', new Error(text));
    }

    iq(iq, cb) {
        iq = iq.root();

        if (cb) {
            if (!iq.attrs.id) {
                // Auto-generate id
                do {
                    iq.attrs.id = Math.ceil(9999999 * Math.random());
                } while(this.iqCallbacks.hasOwnProperty(iq.attrs.id));
            }
            this.iqCallbacks[iq.attrs.id] = cb;
        }

        this.sendStanza(iq);
    }

    onStanza(stanzaStr){
        try {
            console.log(`<< ${stanzaStr}`);
            let stanza = ltx.parse(stanzaStr);

            if (stanza.name == 'iq' && this.onIq(stanza)) {
                return;
            } else if (stanza.name == 'message' ||
                       stanza.name == 'presence' ||
                       stanza.name == 'iq') {
                this.emit(stanza.name, stanza);
            }
        } catch (e) {
            console.error(e.stack || e.message);
        }
    }

    onIq(iq){
        var id = iq.attrs.id;
        var cb = this.iqCallbacks[id];
        if (cb && iq.type == 'result') {
            delete this.iqCallbacks[id];
            cb(null, iq);
            return true;
        } else if (cb && iq.type == 'error') {
            delete this.iqCallbacks[id];

            cb(new Error("Error: " + getStanzaError(iq)));
            return true;
        } else {
            // Not handled, let onStanza() emit('stanza', iq);
            return false;
        }
    }

    trustHosts(hosts){
        React.NativeModules.RNXMPP.trustHosts(hosts);
    }

    connect(username, password, auth = RNXMPP.SCRAMSHA1, hostname = null, port = 5222){
        if (!hostname) {
            hostname = (username+'@/').split('@')[1].split('/')[0];
        }
        React.NativeModules.RNXMPP.connect(username, password, auth, hostname, port);
    }

    sendStanza(stanza){
        if (typeof stanza.root == 'function') {
            stanza = stanza.root();
        }
        if (typeof stanza != 'string') {
            stanza = stanza.toString();
        }

        console.log(">> " + stanza);
        RNXMPP.sendStanza(stanza);
    }

    disconnect(){
        if (this.isConnected) {
            React.NativeModules.RNXMPP.disconnect();
        }
    }
}

module.exports = new XMPP();

function getStanzaError(stanza) {
    let errorEl;
    if ((errorEl = stanza.getChild('error'))) {
        for(let child of errorEl.children) {
            let errorCode = child &&
                child.attrs.xmlns == 'urn:ietf:params:xml:ns:xmpp-stanzas' &&
                child.name;
            if (errorCode) {
                cb(new Error(errorCode));
                return true;
            }
        }
    }

    cb(new Error("Error in: " + stanza.toString()));
}
