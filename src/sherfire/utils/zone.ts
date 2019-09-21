export const noZone: Zone = { run: fn => fn() };
export interface Zone {
    run(fn: () => void): void;
}
