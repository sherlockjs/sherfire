import { Injectable } from '@angular/core';

/**
 * @see https://firebase.google.com/docs/web/setup#config-object
 */
export interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    /** region for callable functions */
    functionsRegion?: string;
}
@Injectable()
export class FirebaseConfig { }
