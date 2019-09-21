import { Injectable, NgZone } from '@angular/core';
import { extendAuth } from '@sherlockjs/sherfire';
import { FirebaseApp } from './firebase.app';

import 'firebase/auth';

type Auth = import('firebase').auth.Auth;

// tslint:disable-next-line: no-empty-interface
export interface FirebaseAuth extends Auth { }
@Injectable({
    providedIn: 'root',
    deps: [],
    useFactory: function firebaseAuthFactory(fbApp: FirebaseApp, zone: NgZone) {
        return zone.runOutsideAngular(() => extendAuth(fbApp.auth(), zone));
    },
})
export class FirebaseAuth { }
