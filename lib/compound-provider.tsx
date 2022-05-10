import * as React from "react";
import {providerFactory, __setInitialized} from "./provider-storage";
import {compoundHookState} from "./hook-storage";
import {CompoundRootContext} from "./compound-root-context";

export function CompoundProvider({children, props}: React.PropsWithChildren<any>) {
    const providers  = providerFactory(children, props);

    const compoundState = compoundHookState();
    __setInitialized();
    return (
        <CompoundRootContext.Provider value={compoundState}>
            {providers}
        </CompoundRootContext.Provider>
    );
}

