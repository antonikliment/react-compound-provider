import * as React from "react";
import {CompoundRootContext} from "./compound-root-context";
import {rebindHook, registerHook} from "./hook-storage";
import {registerProviderWithKey} from "./provider-storage";


type TupleHook<S> = <S, > (...args) => readonly [S, (a: S) => void]

export const createGlobalCustomHookInRootContext = <T, >(hookFactory, ...hookDefaultArgs): TupleHook<T> => {
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
        const value = hookFactory(...hookDefaultArgs);
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

const compoundStateReducer = (name) => (state, action) => typeof action === 'function' ? action(state[name]) : {
    ...state,
    [name]: action
};

const internalCompoundState = (name) => {
    const [state, setState] = React.useReducer(compoundStateReducer(name), {});
    if(!name){
        throw new Error("No name");
    }
    return [state[name], (val)=>{
        console.log('internalCompoundState setState', {name}, {state})
        setState(val)
    }]
}
// @ts-ignore
const compoundStateHook = registerHook(internalCompoundState, "useCompoundState");
export const useCompoundState = (name) => {
    const context = React.useContext(CompoundRootContext);
    if (context === undefined) {
        throw new Error('CompoundRootContext is not defined. Is useCompoundState called outside the CompoundProvider?')
    }

    // rebindHook(compoundStateHook, internalCompoundState, name)
    return context[compoundStateHook];
};
