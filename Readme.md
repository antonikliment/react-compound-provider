# React Compound Provider


## Usage 

Place the CompoundProvider component around all dependant components;



## Library api

Component `CompoundProvider`
Wrapper element where all other providers are added

Function `registerProvider`
Used for registration of providers. 
A provider can be added only before the first render. Any calls after the initial rendering is complete will be ignored

The order of function calls determines the render tree
For example 
```
registerProvider(providerA);
registerProvider(providerB);
registerProvider(providerC);
```
will result in the following component tree;
```
<providerA>
    <providerB>
        <providerC>
        </providerC>
    </providerB>
</providerA>
```



Simple use case
```javascript
import * as React from 'react'
import {createRoot} from 'react-dom/client';
import {CompoundProvider, registerProvider} from 'react-compound-provider';
import providerA from './context/providerA';
import providerB from './context/providerB';
import providerC from './context/providerC';
registerProvider(providerA);
registerProvider(providerB);
registerProvider(providerC);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <CompoundProvider>
        <Components />
    </CompoundProvider>
);
```

