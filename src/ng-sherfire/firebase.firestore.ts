import { Injectable, NgZone } from '@angular/core';
import { extendFirestore } from '@sherlockjs/sherfire';
import { FirebaseApp } from './firebase.app';

import 'firebase/firestore';

type Firestore = import('firebase').firestore.Firestore;

// tslint:disable-next-line: no-empty-interface
export interface FirebaseFirestore extends Firestore { }
@Injectable({
    providedIn: 'root',
    deps: [],
    useFactory: function firebaseFirestoreFactory(fbApp: FirebaseApp, zone: NgZone) {
        return zone.runOutsideAngular(() => extendFirestore(fbApp.firestore(), zone));
    },
})
export class FirebaseFirestore { }
