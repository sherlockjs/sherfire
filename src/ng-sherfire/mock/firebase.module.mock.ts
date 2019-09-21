import { NgModule } from '@angular/core';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import { FirebaseApp } from '../firebase.app';
import { FirebaseAuth } from '../firebase.auth';
import { FirebaseFirestore } from '../firebase.firestore';
import { FirebaseFunctions } from '../firebase.functions';
import { MockApp } from './app.mock';
import { MockAuth } from './auth.mock';
import { MockFirestore } from './firestore';
import { MockFunctions } from './functions.mock';

@NgModule({
    providers: [
        { provide: FirebaseApp, useClass: MockApp },
        { provide: FirebaseAuth, useClass: MockAuth },
        { provide: FirebaseFirestore, useClass: MockFirestore },
        { provide: FirebaseFunctions, useClass: MockFunctions },
    ],
})
export class FirebaseMockModule { }
