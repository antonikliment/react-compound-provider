import * as React from "react";
import {providerFactory, __lockProviderRegistration} from "./provider-storage";
import {__lockHookStorage, compoundHookState} from "./hook-storage";
import {CompoundRootContext} from "./compound-root-context";

export function CompoundProvider({children, props}: React.PropsWithChildren<any>) {
    /*
    * Builds a component tree from all registered providers
    * */
    const providers = providerFactory(children, props);

    /*
    * Creates a composite state from all the registered hooks
    * */
    const compoundState = compoundHookState();
    __lockProviderRegistration();
    __lockHookStorage();

    return (
        <CompoundRootContext.Provider value={compoundState}>
            {providers}
        </CompoundRootContext.Provider>
    );
}

