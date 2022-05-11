import * as React from "react";
import {CompoundRootContext} from "./compound-root-context";
import {registerHook} from "./hook-storage";
import {registerProviderWithKey} from "./provider-storage";


type TupleHook<S> = <S, > (...args) =>  readonly [S, (a:S) => void]

export const createGlobalCustomHookInRootContext = <T,>(hookFactory, ...globalArgs): TupleHook<T> => {
    const stateKey = registerHook(()=>hookFactory(...globalArgs))
    return function () {
        const context = React.useContext(CompoundRootContext);

        if (context === undefined) {
            throw new Error('CompoundRootContext is not defined. Is this hook called outside the CompoundProvider?')
        }

        return context[stateKey];
    };
}

export const createGlobalCustomHookWithProvider = (hookFactory, ...globalArgs) => {
    const DedicatedContext = React.createContext(undefined);
    const DedicatedProvider = (props) => {
        return (
            <DedicatedContext.Provider {...props} value={hookFactory}/>
        )
    };
    registerProviderWithKey(DedicatedProvider, Math.random());


    return function ()  {
        const context = React.useContext(DedicatedContext);

        if (context === undefined) {
            throw new Error('CompoundRootContext is not defined. Is this hook called outside the CompoundProvider?')
        }
        return context(...globalArgs);
    };
}
