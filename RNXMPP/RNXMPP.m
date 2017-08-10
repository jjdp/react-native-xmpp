//
//  XMPP.m
//  RNXMPP
//
//  Created by Pavlo Aksonov on 23.09.15.
//  Copyright © 2015 Pavlo Aksonov. All rights reserved.
//

#import "RNXMPP.h"
#if __has_include(<React/RCTBridge.h>)
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTConvert.h>
#else
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "RCTConvert.h"
#endif
#import "RNXMPPConstants.h"

const NSString *PLAIN_AUTH = @"PLAIN";
const NSString *SCRAMSHA1_AUTH = @"SCRAMSHA1";
const NSString *DigestMD5_AUTH = @"DigestMD5";

@implementation RCTConvert (AuthMethod)
RCT_ENUM_CONVERTER(AuthMethod, (@{ PLAIN_AUTH : @(Plain),
                                             SCRAMSHA1_AUTH : @(SCRAM),
                                             DigestMD5_AUTH : @(MD5)}),
                                          SCRAM, integerValue)
@end


@implementation RNXMPP {
    RCTResponseSenderBlock onError;
    RCTResponseSenderBlock onConnect;
    RCTResponseSenderBlock onMessage;
    RCTResponseSenderBlock onIQ;
    RCTResponseSenderBlock onPresence;
}

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();


-(void)onError:(NSError *)error {
    NSString *message = [error localizedDescription];
    [self.bridge.eventDispatcher sendAppEventWithName:@"RNXMPPError" body:message];
}

-(void)onLoginError:(NSError *)error {
    [self.bridge.eventDispatcher sendAppEventWithName:@"RNXMPPLoginError" body:[error localizedDescription]];
}

-(void)onMessage:(XMPPMessage *)message {
    NSString *xml = [message compactXMLString];
    [self.bridge.eventDispatcher sendAppEventWithName:@"RNXMPPStanza" body:xml];
}

-(void)onIQ:(XMPPIQ *)iq {
    NSString *xml = [iq compactXMLString];
    [self.bridge.eventDispatcher sendAppEventWithName:@"RNXMPPStanza" body:xml];
}

-(void)onPresence:(XMPPPresence *)presence {
    NSString *xml = [presence compactXMLString];
    [self.bridge.eventDispatcher sendAppEventWithName:@"RNXMPPStanza" body:xml];
}

-(void)onReceiveAck:(NSArray *)stanzaIds {
    [self.bridge.eventDispatcher sendAppEventWithName:@"RNXMPPReceiveAckIos" body:stanzaIds];
}

-(void)onConnect:(NSString *)username password:(NSString *)password {
    [self.bridge.eventDispatcher sendAppEventWithName:@"RNXMPPConnect" body:@{@"username":username, @"password":password}];
}

-(void)onDisconnect:(NSError *)error {
    [self.bridge.eventDispatcher sendAppEventWithName:@"RNXMPPDisconnect" body:[error localizedDescription]];
    if ([error localizedDescription]){
        [self.bridge.eventDispatcher sendAppEventWithName:@"RNXMPPLoginError" body:[error localizedDescription]];
    }
}

-(void)onLogin:(NSString *)username password:(NSString *)password {
    [self.bridge.eventDispatcher sendAppEventWithName:@"RNXMPPLogin" body:@{@"username":username, @"password":password}];
}

RCT_EXPORT_METHOD(trustHosts:(NSArray *)hosts){
    [RNXMPPService sharedInstance].delegate = self;
    [[RNXMPPService sharedInstance] trustHosts:hosts];
}

RCT_EXPORT_METHOD(setup:(NSString *)jid password:(NSString *)password auth:(AuthMethod) auth hostname:(NSString *)hostname port:(int)port){
    [RNXMPPService sharedInstance].delegate = self;
    [[RNXMPPService sharedInstance] setup:jid withPassword:password auth:auth hostname:hostname port:port];
}

RCT_EXPORT_METHOD(connect){
    [RNXMPPService sharedInstance].delegate = self;
    [[RNXMPPService sharedInstance] connect];
}

RCT_EXPORT_METHOD(disconnect){
    [RNXMPPService sharedInstance].delegate = self;
    [[RNXMPPService sharedInstance] disconnect];
}

RCT_EXPORT_METHOD(sendStanza:(NSString *)stanza){
    [RNXMPPService sharedInstance].delegate = self;
    [[RNXMPPService sharedInstance] sendStanza:stanza];
}

- (NSDictionary *)constantsToExport
{
    return @{ PLAIN_AUTH : @(Plain),
              SCRAMSHA1_AUTH: @(SCRAM),
              DigestMD5_AUTH: @(MD5)
              };
};


@end
