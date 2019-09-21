import { Derivable, DerivableAtom, SettableDerivable } from '@politie/sherlock';
import { firestore } from 'firebase';
import { MockFirestore } from './firestore.mock';
import { MockDocumentSnapshot, MockQuerySnapshot } from './snapshot.mock';

class MockPath {
    constructor(protected readonly fs: MockFirestore, readonly path: string) { }

    // tslint:disable-next-line: no-use-before-declare dit wordt nooit direct aangeroepen
    collection(path: string) { return new MockCollection(this.fs, `${this.path}/${path}`); }
    // tslint:disable-next-line: no-use-before-declare dit wordt nooit direct aangeroepen
    doc(path: string) { return new MockDocument(this.fs, `${this.path}/${path}`); }
}

export class MockCollection<V = firestore.DocumentData> extends MockPath {
    /** A Derivable of the (single) QuerySnapshot resulting from this Query. */
    get snapshot$(): DerivableAtom<MockQuerySnapshot<V>> {
        return this.fs.getSnapshot$(this.path);
    }
    /** A Derivable of the (multiple) QueryDocumentSnapshots representing the found documents. */
    get doc$(): Derivable<Array<MockDocumentSnapshot<V>>> {
        return this.snapshot$.map(snap => snap.docs);
    }
    /** A Derivable of the found documents in this Query. */
    get data$(): Derivable<V[]> {
        return this.snapshot$.map(snap => snap.docs.map(doc => doc.data()));
    }

    pushValues(newCollection: V[]) {
        this.snapshot$.set(MockQuerySnapshot.fromValues(newCollection));
    }
}

export class MockDocument<V = firestore.DocumentData> extends MockPath {
    get snapshot$(): DerivableAtom<MockDocumentSnapshot<V>> {
        return this.fs.getSnapshot$(this.path);
    }
    get data$(): SettableDerivable<V> {
        return this.snapshot$.map(
            snap => snap.data(),
            data => new MockDocumentSnapshot(data),
        );
    }
}
