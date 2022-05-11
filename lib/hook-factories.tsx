import * as React from "react";
import {CompoundRootContext} from "./compound-root-context";
import {registerHook} from "./hook-storage";
import {registerProviderWithKey} from "./provider-storage";


type TupleHook<S> = <S, > (...args) =>  readonly [S, (a:S) => void]

export const createGlobalCustomHookInRootContext = <T,> (hookFactory, ...hookDefaultArgs): TupleHook<T> => {
    const stateKey = registerHook(() => hookFactory(...hookDefaultArgs))
    return function () {
        const context = React.useContext(CompoundRootContext);

        if (context === undefined) {
            throw new Error('CompoundRootContext is not defined. Is this hook called outside the CompoundProvider?')
        }

        return context[stateKey];
    };
}

export const createGlobalCustomHookWithProvider = (hookFactory, ...hookDefaultArgs) => {
    const DedicatedContext = React.createContext(undefined);
    const key = Math.random();
    const DedicatedProvider = (props) => {
        const value  = hookFactory(...hookDefaultArgs);
        return (
            <DedicatedContext.Provider {...props} key={key} value={value}/>
        )
    };
    registerProviderWithKey(DedicatedProvider, key);

    return function () {
        const context = React.useContext(DedicatedContext);
        if (context === undefined) {
            throw new Error('CompoundRootContext is not defined. Is this hook called outside the CompoundProvider?')
        }
        return context;
    };
}
