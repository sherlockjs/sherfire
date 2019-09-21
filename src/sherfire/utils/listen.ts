import { atom, Derivable, DerivableAtom } from '@politie/sherlock';

/**
 * A utility function to create a `Derivable` from an event pattern.
 * The function takes two callbacks as parameters.
 *
 * @param addHandler The callback that is called when the `Derivable` is connected and should start producing data.
 *  This callback is given the `DerivableAtom` that is used for the output.
 *  The return value of this function is given to the `removeHandler` callback
 * @param removeHandler The callback that is called when the `Derivable` is no longer connected and should stop producing data.
 *  This callback is given the return value of the `addHandler` callback.
 */
export function fromEventPattern<V, R>(
    addHandler: (atom: DerivableAtom<V>) => R,
    removeHandler: (returnedValue: R) => void,
): Derivable<V> {
    const snapshotAtom = atom.unresolved<V>();

    let returned: R;
    snapshotAtom.connected$.react(c => {
        if (c) {
            returned = addHandler(snapshotAtom);
        } else {
            // We know returned has been set to `R` by `addHandler` at this point
            removeHandler(returned);

            snapshotAtom.unset();
        }
    }, { skipFirst: true }); // `skipFirst` because the first `connected$` will always be `false` (the atom hasn't been returned yet)
    return snapshotAtom;
}
