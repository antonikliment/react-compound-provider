const hookStorage: Record<number, Function> = {};
let lockStorage = false;

export function __lockHookStorage() {
    lockStorage = true;
}

export function registerHook(hookFunction: Function) {
    if (lockStorage) {
        console.warn("First render is complete. No more hooks can be registered")
        return;
    }
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
