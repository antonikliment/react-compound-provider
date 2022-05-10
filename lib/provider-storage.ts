import {FunctionComponent} from "react";
import {simpleHashCode} from "./util";

interface ProviderEntry {
    provider: FunctionComponent<any>;
    order: number;
}

let providerStorage: Record<number, ProviderEntry> = {};
let appInitialized = false;
let sequentialOrder = 0;

export function __resetState() {
    providerStorage = {};
    appInitialized = false;
}

export function __setInitialized() {
    appInitialized = true;
}

export function __getProviders() {
    return providerStorage;
}

export function registerProvider(provider: FunctionComponent<any>) {
    registerProviderWithOrder(provider, sequentialOrder++);
}

export function registerProviderWithOrder(provider: FunctionComponent<any>, order: number) {
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
