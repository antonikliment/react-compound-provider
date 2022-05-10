import * as React from "react";
import {providerFactory, __lockProviderRegistration} from "./provider-storage";
import {__lockHookStorage, compoundHookState} from "./hook-storage";
import {CompoundRootContext} from "./compound-root-context";

export function CompoundProvider({children, props}: React.PropsWithChildren<any>) {
    const providers  = providerFactory(children, props);
    const compoundState = compoundHookState();
    __lockProviderRegistration();
    __lockHookStorage();
    return (
        <CompoundRootContext.Provider value={compoundState}>
            {providers}
        </CompoundRootContext.Provider>
    );
}

