# React Compound
 

## Usage 

Place the CompoundProvider component around all dependant components;



## Library api

###  `CompoundProvider`
Top level provider where all other providers and registered hooks are mounted 

### `registerProvider`
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


