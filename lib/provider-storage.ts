import {createElement, FunctionComponent} from "react";
import {simpleHashCode} from "./util";

interface ProviderEntry {
    provider: FunctionComponent<any>;
    order: number;
}

let providerStorage: Record<number, ProviderEntry> = {};
let lockStorage = false;
let sequentialOrder = 0;
const fallbackComponent = ({children}) => children;
export function __resetState() {
    providerStorage = {};
    lockStorage = false;
}

export function __lockProviderRegistration() {
    lockStorage = true;
}

export function __getProviders() {
    return providerStorage;
}

export function registerProvider(provider: FunctionComponent<any>) {
    registerProviderWithOrder(provider, sequentialOrder++);
}
export function registerProviderWithKey(provider: FunctionComponent<any>, key: number) {
    registerProviderWithOrder(provider, sequentialOrder++);
}

export function registerProviderWithOrder(provider: FunctionComponent<any>, order: number) {
    return registerProviderWithOrderAndKey(provider, order, simpleHashCode(provider.toString()));
}
export function registerProviderWithOrderAndKey(provider: FunctionComponent<any>, order: number, key: number) {

    if (typeof provider !== 'function') {
        throw new Error("Provider must be a function");
    }
    if (order === undefined) {
        throw new Error("Provider order is required");
    }
    if (lockStorage) {
        console.warn("App already rendered, no more providers can be registered")
        return;
    }
    if (!!providerStorage[key]) {
        console.warn(`Provider ${key} already registered`);
        return;
    }
    providerStorage[key] = {provider, order};
}

export function providerFactory(children, props) {
    const providers = Object.values(__getProviders())
        .sort((a, b) => b.order - a.order)
        .map(entry => entry.provider);
    const lastIndex = providers.length - 1;
    const baseElement: FunctionComponent<any> = providers[lastIndex] || fallbackComponent;
    let childElement = createElement(baseElement, props, children);

    for (let i = lastIndex - 1; i >= 0; i--) {
        childElement = createElement(providers[i], props, childElement);
    }

    return childElement;
}
