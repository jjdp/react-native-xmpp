//
//  XMPP.h
//  RNXMPP
//
//  Created by Pavlo Aksonov on 23.09.15.
//  Copyright © 2015 Pavlo Aksonov. All rights reserved.
//

#import <Foundation/Foundation.h>
#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTConvert.h>
#else
#import "RCTBridgeModule.h"
#endif
#import "RNXMPPService.h"

@interface RNXMPP : NSObject<RCTBridgeModule, RNXMPPServiceDelegate>

@end
