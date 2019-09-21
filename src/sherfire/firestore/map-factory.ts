import { MapImplementation } from '@politie/sherlock-utils';

export function mapFactoryWithKeyTransform<I, O>(keyTransform: (inp: I) => unknown): () => MapImplementation<I, O> {
    return () => {
        const map = new Map<unknown, O>();
        return {
            get(inp: I) { return map.get(keyTransform(inp)); },
            set(inp: I, value: O) { return map.set(keyTransform(inp), value); },
            delete(inp: I) { return map.delete(keyTransform(inp)); },
        };
    };
}
