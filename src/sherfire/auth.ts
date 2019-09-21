import { Derivable, unresolved } from '@politie/sherlock';
import { auth, Unsubscribe, User } from 'firebase/app';
import { fromEventPattern, noZone, Zone } from './utils';
import { init } from './utils/add-sherlock-equals';

export function extendAuth(fbAuth: auth.Auth, zone: Zone = noZone) {
    init();
    Object.defineProperty(
        Object.getPrototypeOf(fbAuth),
        'currentUser$', {
        get(this: auth.Auth & { _currentUser$: Derivable<User | null> }) {
            if (!this._currentUser$) {
                this._currentUser$ = fromEventPattern<User | null, Unsubscribe>(
                    atom => this.onIdTokenChanged(
                        user => zone.run(() => atom.set(user)),
                        err => zone.run(() => atom.setError(err)),
                    ),
                    unsubscribe => unsubscribe(),
                ).mapState(state => state === unresolved && this.currentUser ? this.currentUser : state);
            }
            return this._currentUser$;
        },
    });
    return fbAuth;
}

declare module 'firebase/app' {
    namespace auth {
        interface Auth {
            /**
             * A Derivable of the current User.
             * Will be `unresolved` if not synchronised with firebase yet
             * Will be `null` if synchronised, but no one is logged in.
             * Will be the `User` object if a user is logged in.
             */
            currentUser$: Derivable<User | null>;
        }
    }
}
