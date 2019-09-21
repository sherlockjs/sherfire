import { ModuleWithProviders, NgModule } from '@angular/core';
import { FirebaseConfig } from './firebase.config';

@NgModule()
export class FirebaseModule {
    static forRoot(_config: FirebaseConfig): ModuleWithProviders {
        return {
            ngModule: FirebaseModule,
            providers: [{ provide: FirebaseConfig, useValue: _config }],
        };
    }
}
