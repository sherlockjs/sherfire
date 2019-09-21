import { Derivable, lens, SettableDerivable } from '@politie/sherlock';
import { derivableCache, DerivableCache } from '@politie/sherlock-utils';
import { firestore as fs } from 'firebase/app';
import { init, Zone } from '../utils';
import { mapFactoryWithKeyTransform } from './map-factory';
import { snapshot$ } from './snapshots';

const queryMapFactory = mapFactoryWithKeyTransform<InternalQuery, any>(q => q._query.toString());
const documentMapFactory = mapFactoryWithKeyTransform<fs.DocumentReference, any>(d => d.path);

export function extendFirestore(fire: fs.Firestore, zone?: Zone) {
    init();
    const query = Object.getPrototypeOf(fire.collectionGroup('anyGroup')) as fs.Query;
    Object.defineProperties(query, {
        _snapshot$: {
            value: derivableCache({
                mapFactory: queryMapFactory,
                derivableFactory: (q: fs.Query) => snapshot$(q, zone),
            }),
        },
        snapshot$: {
            enumerable: true,
            get(this: QueryCache) { return this._snapshot$(this); },
        },

        _docs$: {
            value: derivableCache({
                mapFactory: queryMapFactory,
                derivableFactory: (q: fs.Query) => q.snapshot$.map(s => s.docs),
            }),
        },
        docs$: {
            enumerable: true,
            get(this: QueryCache) { return this._docs$(this); },
        },

        _data$: {
            value: derivableCache({
                mapFactory: queryMapFactory,
                derivableFactory: (q: fs.Query) => q.snapshot$.map(s => s.docs.map(d => d.data())),
            }),
        },
        data$: {
            enumerable: true,
            get(this: QueryCache) { return this._data$(this); },
        },
    });

    const doc = Object.getPrototypeOf(fire.doc('anyCollection/anyDoc')) as fs.DocumentReference;
    Object.defineProperties(doc, {
        _snapshot$: {
            value: derivableCache({
                mapFactory: documentMapFactory,
                derivableFactory: (q: fs.DocumentReference) => snapshot$(q, zone),
            }),
        },
        snapshot$: {
            enumerable: true,
            get(this: DocCache) { return this._snapshot$(this); },
        },

        _data$: {
            value: derivableCache({
                mapFactory: documentMapFactory,
                derivableFactory: (q: fs.DocumentReference) => lens({
                    get: () => q.snapshot$.get().data(),
                    set: v => {
                        if (v == null) { throw new Error(`cannot set document to ${v}`); }
                        return q.set(v);
                    },
                }),
            }),
        },
        data$: {
            enumerable: true,
            get(this: DocCache) { return this._data$(this); },
        },
    });

    return fire;
}

declare module 'firebase/app' {
    namespace firestore {
        interface Query {
            /** A Derivable of the (single) QuerySnapshot resulting from this Query. */
            snapshot$: Derivable<QuerySnapshot>;
            /** A Derivable of the (multiple) QueryDocumentSnapshots representing the found documents. */
            docs$: Derivable<QueryDocumentSnapshot[]>;
            /** A Derivable of the found documents in this Query. */
            data$: Derivable<DocumentData[]>;
        }
        interface DocumentReference {
            /** A Derivable of the snapshot that is found at this path. */
            snapshot$: Derivable<DocumentSnapshot>;
            /** A Derivable of the document data (if found) at this path. */
            data$: SettableDerivable<DocumentData | undefined>;
        }
    }
}

//////
// Internal interfaces/types

// Using internals of Firebase, if this stops working, we can use `isEqual` of fs.Query.
interface InternalQuery extends fs.Query {
    _query: {
        toString(): string;
    };
}
interface QueryCache extends fs.Query {
    _snapshot$: DerivableCache<this, fs.QuerySnapshot>;
    _docs$: DerivableCache<this, fs.QueryDocumentSnapshot[]>;
    _data$: DerivableCache<this, fs.DocumentData[]>;
}
interface DocCache extends fs.DocumentReference {
    _snapshot$: DerivableCache<this, fs.DocumentData>;
    _data$: DerivableCache<this, fs.DocumentSnapshot | undefined>;
}
//////
