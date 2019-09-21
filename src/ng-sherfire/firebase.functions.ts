import { Injectable, NgZone } from '@angular/core';
import { FirebaseApp } from './firebase.app';
import { FirebaseConfig } from './firebase.config';

import 'firebase/functions';

type Functions = import('firebase').functions.Functions;

// tslint:disable-next-line: no-empty-interface
export interface FirebaseFunctions extends Functions { }
@Injectable({
    providedIn: 'root',
    deps: [FirebaseApp, FirebaseConfig, NgZone],
    useFactory: function firebaseFunctionsFactory(fbApp: FirebaseApp, config: FirebaseConfig, zone: NgZone) {
        return zone.runOutsideAngular(() => fbApp.functions(config.functionsRegion));
    },
})
export class FirebaseFunctions { }
