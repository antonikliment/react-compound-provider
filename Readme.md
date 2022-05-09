# React Compound Provider


## Usage 

Place the CompoundProvider component around all dependant components;



```javascript
import * as React from 'react'
import {createRoot} from 'react-dom/client';
import {CompoundProvider} from 'react-compound-provider';
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
        <Components/>
    </CompoundProvider>
);
```

