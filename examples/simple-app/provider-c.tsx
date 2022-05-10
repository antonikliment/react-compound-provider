import React from "react";
const ContextA = React.createContext();

export default function ProviderC({children}) {
    return <ContextA.Provider value={"C"}>{children}</ContextA.Provider>
}
