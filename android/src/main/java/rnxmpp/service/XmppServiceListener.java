package rnxmpp.service;

import org.jivesoftware.smack.packet.Stanza;
/**
 * Created by Kristian Frølund on 7/19/16.
 * Copyright (c) 2016. Teletronics. All rights reserved
 */

public interface XmppServiceListener {
    void onError(Exception e);
    void onLoginError(String errorMessage);
    void onLoginError(Exception e);
    void onStanza(Stanza stanza);
    void onConnnect(String username, String password);
    void onDisconnect(Exception e);
    void onLogin(String username, String password);
}
