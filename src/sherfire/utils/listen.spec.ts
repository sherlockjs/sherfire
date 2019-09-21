import { atom, Derivable, DerivableAtom, isDerivableAtom } from '@politie/sherlock';
import { fromEventPattern } from './listen';

describe(fromEventPattern, () => {
    const until = atom(false);
    beforeEach(() => until.set(false));
    afterEach(() => until.set(true));

    const returnedValue = {};
    const reactSpy = jest.fn();
    const onError = jest.fn();
    // Create reactor function to ignore the second parameter (stopper) of the react method
    const reactor = (val: any) => reactSpy(val);
    const addHandler = jest.fn();
    const removeHandler = jest.fn();
    beforeEach(() => {
        reactSpy.mockReset();
        addHandler.mockReset();
        addHandler.mockReturnValue(returnedValue);
        removeHandler.mockReset();
        onError.mockReset();
    });
    function getAtom(): DerivableAtom<any> {
        return addHandler.mock.calls[addHandler.mock.calls.length - 1][0];
    }

    it('should start as `unresolved`', () => {
        const d$ = fromEventPattern(addHandler, removeHandler);
        expect(d$.resolved).toBe(false);
    });

    describe('when the first connection to the `Derivable` starts', () => {
        let d$: Derivable<string>;
        beforeEach(() => d$ = fromEventPattern(addHandler, removeHandler));
        beforeEach(() => d$.react(reactor, { until, onError }));

        it('should subscribe using the `addHandler`', () => {
            expect(addHandler).toHaveBeenCalled();
        });

        it('should not call `addHandler` more than once', () => {
            expect(addHandler).toHaveBeenCalledTimes(1);
            d$.react(reactor, { until });
            expect(d$.value).toBe(undefined);
            d$.react(reactor, { until });
            expect(addHandler).toHaveBeenCalledTimes(1);
        });

        it('should call the `addHandler` with the DerivableAtom', () => {
            expect(isDerivableAtom(getAtom())).toBe(true);
        });

        it('should not resolve before getting a value', () => {
            expect(reactSpy).not.toHaveBeenCalled();
        });

        describe('after the first value is emitted', () => {
            const value = 'first value';
            beforeEach(() => getAtom().set(value));

            it('should resolve the `Derivable`', () => {
                expect(d$.resolved).toBe(true);
            });

            it('should output the value', () => {
                expect(reactSpy).toHaveBeenCalledTimes(1);
                expect(reactSpy).toHaveBeenLastCalledWith('first value');
            });

            it('should output any errors', () => {
                const error = new Error('My Error');
                getAtom().setError(error);
                expect(onError).toHaveBeenCalledTimes(1);
                expect(d$.error).toBe(error);
            });

            it('should be able to `get()` the latest value', () => {
                expect(d$.get()).toBe(value);
            });

            describe('when the last connection to the `Derivable` stops', () => {
                beforeEach(() => until.set(true));

                it('should unsubscribe using the `removeHandler`', () => {
                    expect(removeHandler).toHaveBeenCalledTimes(1);
                });
                it('should hand the returned value of the `addHandler` to the `removeHandler`', () => {
                    expect(removeHandler).toHaveBeenLastCalledWith(returnedValue);
                });
                it('should return to being `unresolved`', () => {
                    expect(d$.resolved).toBe(false);
                });
                it('should be able to start a connection again', () => {
                    reactSpy.mockReset();
                    const stop = d$.react(reactor);

                    expect(addHandler).toHaveBeenCalledTimes(2);

                    expect(d$.resolved).toBe(false);

                    const val = 'second value';
                    getAtom().set(val);
                    expect(d$.resolved).toBe(true);
                    expect(reactSpy).toHaveBeenCalledTimes(1);
                    expect(reactSpy).toHaveBeenLastCalledWith(val);

                    stop();
                });
            });
        });
    });
});
