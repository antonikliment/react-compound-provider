import * as React from "react";
import {CompoundRootContext} from "./compound-root-context";
import {registerHook} from "./hook-storage";
import {registerProviderWithKey} from "./provider-storage";


type TupleHook<S> = <S, > (...args) =>  readonly [S, (a:S) => void]

export const createGlobalCustomHookInRootContext = <T,>(hookFactory): TupleHook<T> => {
    const stateKey = registerHook(hookFactory)
    return function (...args) {
        const context = React.useContext(CompoundRootContext);

        if (context === undefined) {
            throw new Error('CompoundRootContext is not defined. Is this hook called outside the CompoundProvider?')
        }
        return context[stateKey](...args)
    };
}

export const createGlobalCustomHookWithProvider = (hookFactory) => {
    const DedicatedContext = React.createContext(undefined);
    const DedicatedProvider = (props) => {
        return (
            <DedicatedContext.Provider {...props} value={hookFactory}/>
        )
    };
    registerProviderWithKey(DedicatedProvider, Math.random());
    return function (...args)  {
        const context = React.useContext(DedicatedContext);

        if (context === undefined) {
            throw new Error('CompoundRootContext is not defined. Is this hook called outside the CompoundProvider?')
        }
        return context(...args);
    };
}
