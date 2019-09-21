import { firestore } from 'firebase/app';

export class MockDocumentSnapshot<V> implements Pick<firestore.DocumentSnapshot, 'data' | 'isEqual'> {
    constructor(private readonly _data: firestore.DocumentData & V) { }

    data() { return this._data; }

    isEqual(other: any) {
        return other instanceof MockDocumentSnapshot &&
            JSON.stringify(this.data()) === JSON.stringify(other.data());
    }
}

export class MockQuerySnapshot<V> implements Pick<firestore.QuerySnapshot, 'isEqual'> {
    static fromValues<W>(values: W[]) { return new MockQuerySnapshot(values.map(val => new MockDocumentSnapshot(val))); }

    constructor(readonly docs: Array<MockDocumentSnapshot<V>>) { }

    isEqual(other: any) {
        return other instanceof MockQuerySnapshot &&
            this.docs.every((doc, i) => doc.isEqual(other.docs[i]));
    }
}
