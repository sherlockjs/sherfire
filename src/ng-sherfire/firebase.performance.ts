import { Injectable, NgZone } from '@angular/core';
import { FirebaseApp } from './firebase.app';

import 'firebase/performance';

type Performance = import('firebase').performance.Performance;

// tslint:disable-next-line: no-empty-interface
export interface FirebasePerformance extends Performance { }
@Injectable({
    providedIn: 'root',
    deps: [FirebaseApp, NgZone],
    useFactory: function firebasePerformanceFactory(fbApp: FirebaseApp, zone: NgZone) {
        return zone.runOutsideAngular(() => fbApp.performance());
    },
})
export class FirebasePerformance { }
