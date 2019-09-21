import { config } from '@politie/sherlock';

let initialized = false;
export function init() {
    // Make sure this only happens once...
    if (initialized) {
        return;
    } else {
        initialized = true;
    }
    /**
     * Firebase can compare References, Snapshots etc. with the `isEqual` method
     */
    const currentEquals = config.equals;
    config.equals = (a, b) => {
        // a needs to exists and have an 'isEqual' function
        return a && typeof a.isEqual === 'function' &&
            // Firebase doesn't like it if b isn't at least an object
            typeof b === 'object' &&
            // Return if it's equal
            a.isEqual(b) ||
            // Else just use the default
            currentEquals(a, b);
    };
}
