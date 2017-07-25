# react-native-basic-xmpp
XMPP library for React Native

Simple interface for native XMPP communication.

## Example

```
var XMPP = require('react-native-basic-xmpp');

// optional callbacks
XMPP.on('stanza', (message)=>console.log("STANZA:"+JSON.stringify(message)));
XMPP.on('error', (message)=>console.log("ERROR:"+message));
XMPP.on('loginError', (message)=>console.log("LOGIN ERROR:"+message));
XMPP.on('login', (message)=>console.log("LOGGED!"));
XMPP.on('connect', (message)=>console.log("CONNECTED!"));
XMPP.on('disconnect', (message)=>console.log("DISCONNECTED!"));

// trust hosts(Ignore self-signed ssl issues)
// Warning: Do not use this in production( Security will be compromised. ).
XMPP.trustHosts(['chat.google.com']);

// set-up and connect
XMPP.connect(MYJID, MYPASSWORD);

// reconnect
XMPP.reconnect();

// send stanza
XMPP.sendStanza(stringStanza);

// disconnect
XMPP.disconnect();

```


## Getting started
1. `npm install react-native-basic-xmpp --save`
2. `rnpm link react-native-basic-xmpp`
3. In the XCode project navigator, select your project, select the `Build Phases` tab and in the `Link Binary With Libraries` section add **libRNXMPP.a**, ***libresolv** and **libxml2**
