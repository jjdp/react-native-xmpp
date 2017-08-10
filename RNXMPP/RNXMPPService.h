//
//  RNXMPPService.h
//  RNXMPP
//
//  Created by Pavlo Aksonov on 24.09.15.
//  Copyright © 2015 Pavlo Aksonov. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "XMPP.h"
#import "XMPPStreamManagementMemoryStorage.h"
#import "XMPPReconnect.h"
#import "RNXMPPConstants.h"
//#import "XMPPAutoPing.h"

@protocol RNXMPPServiceDelegate <NSObject>

-(void)onError:(NSError *)error;
-(void)onMessage:(XMPPMessage *)message;
-(void)onPresence:(XMPPPresence *)presence;
-(void)onIQ:(XMPPIQ *)iq;
-(void)onDisconnect:(NSError *)error;
-(void)onConnect:(NSString *)username password:(NSString *)password;
-(void)onLogin:(NSString *)username password:(NSString *)password;
-(void)onLoginError:(NSError *)error;
-(void)onReceiveAck:(NSArray *) stanzaIds;

@end

@interface RNXMPPService : NSObject
{
    XMPPStream *xmppStream;
    XMPPReconnect *xmppReconnect;
    //XMPPAutoPing *xmppAutoPing;
    NSArray *trustedHosts;
    NSString *username;
    NSString *password;
    AuthMethod authMethod;
    BOOL customCertEvaluation;
    BOOL isXmppConnected;
}

@property (nonatomic, strong, readonly) XMPPStream *xmppStream;
@property (nonatomic, strong, readonly) XMPPReconnect *xmppReconnect;
@property (nonatomic, strong, readonly) XMPPStreamManagementMemoryStorage *xmppStreamStorage;
@property (nonatomic, strong, readonly) XMPPStreamManagement *xmppStreamMgt;
//@property (nonatomic, strong, readonly) XMPPAutoPing *xmppAutoPing;
@property (nonatomic, weak) id<RNXMPPServiceDelegate> delegate;

+(RNXMPPService *) sharedInstance;
- (void)trustHosts:(NSArray *)hosts;
- (BOOL)setup:(NSString *)myJID withPassword:(NSString *)myPassword auth:(AuthMethod)auth hostname:(NSString *)hostname port:(int)port;
- (BOOL)connect;
- (void)disconnect;
- (void)sendStanza:(NSString *)stanza;

@end

