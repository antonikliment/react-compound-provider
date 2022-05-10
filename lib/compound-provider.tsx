import {PropsWithChildren} from "react";
import {providerFactory, __setInitialized} from "./provider-storage";


export function CompoundProvider({children, ...props}: PropsWithChildren<any>) {
    const providers  = providerFactory(children, props);
    __setInitialized();
    return providers;
}

