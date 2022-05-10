
const hookStorage: Record<number, Function> = {};

export function registerHook(hookFunction: Function) {
    const key = Math.random();
    hookStorage[key] = hookFunction;
    return `${key}`;
}

export function compoundHookState() {
    let compoundState = {};
    const hooks = Object.entries(hookStorage);
    for (const hookKeyVal of hooks) {
        const key = hookKeyVal[0];
        const value = hookKeyVal[1];
        compoundState[key] = value();
    }
    return compoundState;
}
