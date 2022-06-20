let hookStorage: Record<number, Function> = {};
let lockStorage = false;

export function __resetState() {
    hookStorage = {};
    lockStorage = false;
}

export function __lockHookStorage() {
    lockStorage = true;
}

export function registerHook(hookFunction: <T> (...args) => T, key = Math.random()) {
    if (lockStorage) {
        console.warn("First render is complete. No more hooks can be registered")
        return;
    }

    hookStorage[key] = hookFunction;
    return `${key}`;
}
// export function rebindHook(key, func, ...args) {
//     hookStorage[key] = hookStorage[key].bind(hookStorage[key], ...args)
// }

export function compoundHookState() {
    let compoundState = {};
    const hooks = Object.entries(hookStorage);

    for (const hookPair of hooks) {
        const key = hookPair[0];
        const value = hookPair[1];
        compoundState[key] = value();
    }
    return compoundState;
}
