import { atom, DerivableAtom } from '@politie/sherlock';
import { MockCollection, MockDocument } from './path.mock';

export class MockFirestore {

    // Used in MockCollection | MockDocument to mock data changes
    private readonly snapshot$ = new Map<string, DerivableAtom<any>>();

    collection(path: string) { return new MockCollection(this, path); }
    doc(path: string) { return new MockDocument(this, path); }

    /**
     * Get the snapshot Atom for a certain database path
     * Will be created if no Atom was found for that path
     */
    getSnapshot$(path: string) {
        let snapshot$ = this.snapshot$.get(path);
        if (!snapshot$) {
            this.snapshot$.set(path, snapshot$ = atom.unresolved());
        }
        return snapshot$;
    }
}
