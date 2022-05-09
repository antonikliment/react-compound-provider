import React, {useEffect} from "react";
import {simpleHashCode} from "./util";

interface ProviderEntry {
    provider: React.Provider;
    order: number;
}

const providerStorage: Record<number, ProviderEntry> = {};
let appInitialized = false;

let sequentialOrder = 0;
export function registerProvider(provider: React.Context.Provider<any>) {
    registerProviderWithOrder(provider, sequentialOrder++);
}
export function registerProviderWithOrder(provider: React.Context.Provider<any>, order: number) {
    const key = simpleHashCode(provider.toString());
    if (typeof provider !== 'function') {
        throw new Error("Provider must be a function");
    }
    if (order === undefined) {
        throw new Error("Provider order is required");
    }
    if (appInitialized) {
        console.warn("App already rendered, no more providers can be registered")
        return;
    }
    if (!!providerStorage[key]) {
        console.warn("Provider already registered");
        return;
    }
    providerStorage[key] = {provider, order};
}

export function CompoundProvider({children, ...props}: React.PropsWithChildren<any>) {
    const providers = Object.values(providerStorage)
        .sort((a, b) => b.order - a.order)
        .map(entry => entry.provider);
    const lastIndex = providers.length - 1;

    let childElement = React.createElement(providers[lastIndex], props, children);

    for (let i = lastIndex - 1; i >= 0; i--) {
        childElement = React.createElement(providers[i], props, childElement);
    }
    appInitialized = true;
    useEffect(() => {
        Object.freeze(providerStorage);
    }, [])
    return childElement;
}
