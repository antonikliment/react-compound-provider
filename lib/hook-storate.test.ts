import {compoundHookState, registerHook} from "./hook-storage";

describe("HookStorage", () => {
    test("registerHook adds result to computed state with a random key", () => {
        const hookStateKey = registerHook(() => "A");
        const computedState = compoundHookState();
        expect(Object.keys(computedState)).toHaveLength(1);
        expect(Object.keys(computedState)[0]).toEqual(hookStateKey);
        expect(computedState[hookStateKey]).toEqual("A");
    });

});
