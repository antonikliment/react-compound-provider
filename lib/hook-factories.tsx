import * as React from "react";
import {CompoundRootContext} from "./compound-root-context";
import {registerHook} from "./hook-storage";
import {registerProvider, registerProviderWithKey} from "./provider-storage";


type TupleHook<S> = <S, > (...args) =>  readonly [S, (a:S) => void]

export const createGlobalContextHook = <T,>(hookFactory, ...args): TupleHook<T> => {
    const stateKey = registerHook(() => hookFactory(...args))
    return function () {
        const context = React.useContext(CompoundRootContext);

        if (context === undefined) {
            throw new Error('CompoundRootContext is not defined. Is this hook called outside the CompoundProvider?')
        }
        return context[stateKey]
    };
}

export const createGlobalHookWithDedicatedProvider = (hookFactory, ...args) => {
    const DedicatedContext = React.createContext(undefined);
    const DedicatedProvider = (props) => {
        const value = hookFactory(...args);
        return (
            <DedicatedContext.Provider {...props} value={value}/>
        )
    };
    registerProviderWithKey(DedicatedProvider, Math.random());
    return function () {
        const context = React.useContext(DedicatedContext);

        if (context === undefined) {
            throw new Error('CompoundRootContext is not defined. Is this hook called outside the CompoundProvider?')
        }
        return context;
    };
}
