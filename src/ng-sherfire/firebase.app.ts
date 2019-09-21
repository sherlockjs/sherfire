import { Injectable, NgZone } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { FirebaseConfig } from './firebase.config';

type App = import('firebase').app.App;

// tslint:disable-next-line: no-empty-interface
export interface FirebaseApp extends App { }
@Injectable({
    providedIn: 'root',
    deps: [FirebaseConfig, NgZone],
    useFactory: function firebaseAppFactory(config: FirebaseConfig, zone: NgZone) {
        return zone.runOutsideAngular(() => initializeApp(config));
    },
})
export class FirebaseApp { }
