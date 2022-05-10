import {createElement, FunctionComponent, PropsWithChildren} from "react";
import {__getProviders, __setInitialized} from "./provider-storage";

const fallbackComponent = ({children}) => children;

export function CompoundProvider({children, ...props}: PropsWithChildren<any>) {
    const providers = Object.values(__getProviders())
        .sort((a, b) => b.order - a.order)
        .map(entry => entry.provider);
    const lastIndex = providers.length - 1;
    const baseElement: FunctionComponent<any> = providers[lastIndex] || fallbackComponent;
    let childElement = createElement(baseElement, props, children);

    for (let i = lastIndex - 1; i >= 0; i--) {
        childElement = createElement(providers[i], props, childElement);
    }
    __setInitialized();


    return childElement;
}
