import { Derivable } from '@politie/sherlock';
import { firestore as fs } from 'firebase/app';
import { fromEventPattern, noZone, Zone } from '../utils';

export function snapshot$<R extends Ref>(ref: Snapshottable<R>, zone: Zone = noZone): Derivable<Snapshot<R>> {
    return fromEventPattern<Snapshot<R>, () => void>(
        // `onSnapshot` also has a `complete` but it should never be called
        atom => ref.onSnapshot(
            snap => zone.run(() => atom.set(snap)),
            err => zone.run(() => atom.setError(err)),
        ),
        unsubscribe => unsubscribe(),
    );
}

type Ref = fs.DocumentReference | fs.Query;
type Snapshot<R extends Ref> =
    R extends fs.DocumentReference ? fs.DocumentSnapshot :
    R extends fs.Query ? fs.QuerySnapshot :
    never;
// Need this due to problems with the Ref Union on the `onSnapshot` method
type Snapshottable<R extends Ref> = R & {
    onSnapshot(
        options: fs.SnapshotListenOptions,
        next: (snap: Snapshot<R>) => void,
        error?: (error: Error) => void,
        complete?: () => void,
    ): () => void;
    onSnapshot(
        next: (snap: Snapshot<R>) => void,
        error?: (error: Error) => void,
        complete?: () => void,
    ): () => void;
};
