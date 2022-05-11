import '@testing-library/jest-dom'
import * as React from 'react'
import {act, render, screen} from '@testing-library/react'
import {
    CompoundProvider,
    createGlobalCustomHookInRootContext,
    createGlobalCustomHookWithProvider,
    useCompoundState
} from './'
import {__resetState} from "./provider-storage";
import {__resetState as __hookReset} from "./hook-storage";

describe("HookFactories", () => {
    afterEach(()=>{
        __resetState()
        __hookReset()
    });
    test("createGlobalCustomHookInRootContext useState", () => {
        let valueBumper;
        const useGlobalState = createGlobalCustomHookInRootContext(React.useState, 1);
        const TestComponent = () => {
            const result = useGlobalState<number>();
            const [value, setValue] = result;
            valueBumper = setValue;

            return (<div data-testid="component-with-hook">Value {value}</div>)
        }
        render(<CompoundProvider><TestComponent /></CompoundProvider>);
        expect(screen.getByTestId("component-with-hook")).not.toBeNull();
        expect(screen.getByTestId("component-with-hook")).toHaveTextContent(`Value 1`);

        act(() => {
            valueBumper(2);
        });
        expect(screen.getByTestId("component-with-hook")).toHaveTextContent(`Value 2`);
    });
    test("createGlobalCustomHookWithProvider useState", () => {
        let valueBumper;
        const useGlobalState = createGlobalCustomHookWithProvider(React.useState, 1);
        const TestComponent = () => {
            const [value, setValue] = useGlobalState();
            valueBumper = setValue;
            return (<div data-testid="component-with-hook">Value {value}</div>)
        }
        render(<CompoundProvider><TestComponent /></CompoundProvider>);
        expect(screen.getByTestId("component-with-hook")).not.toBeNull();
        expect(screen.getByTestId("component-with-hook")).toHaveTextContent(`Value 1`);

        act(() => {
            valueBumper(2);
        });
        expect(screen.getByTestId("component-with-hook")).toHaveTextContent(`Value 2`);
    });

    test("createGlobalCustomHookWithProvider useState with Arg", () => {
        let valueBumper;
        const useGlobalState = createGlobalCustomHookWithProvider(React.useState, 2);
        const TestComponent = () => {
            const [value, setValue] = useGlobalState();
            valueBumper = setValue;
            return (<div data-testid="component-with-hook">Value {value}</div>)
        }
        render(<CompoundProvider><TestComponent /></CompoundProvider>);
        expect(screen.getByTestId("component-with-hook")).not.toBeNull();
        expect(screen.getByTestId("component-with-hook")).toHaveTextContent(`Value 2`);

        act(() => {
            valueBumper(2);
        });
        expect(screen.getByTestId("component-with-hook")).toHaveTextContent(`Value 2`);
    });

    test("createGlobalCustomHookWithProvider useState", () => {
        let valueBumper;
        const useGlobalState = createGlobalCustomHookWithProvider(React.useState,1);
        const useGlobalStateAlt = createGlobalCustomHookWithProvider(React.useState,2 );
        const TestComponent = () => {
            const [value, setValue] = useGlobalState();
            const [valueTw, setValueTw] = useGlobalStateAlt();
            valueBumper = setValue;
            return (<div data-testid="component-with-hook">Value {value}</div>)
        }
        render(<CompoundProvider><TestComponent /></CompoundProvider>);
        expect(screen.getByTestId("component-with-hook")).not.toBeNull();
        expect(screen.getByTestId("component-with-hook")).toHaveTextContent(`Value 1`);

        act(() => {
            valueBumper(2);
        });
        expect(screen.getByTestId("component-with-hook")).toHaveTextContent(`Value 2`);
    });
    test("createGlobalCustomHookInRootContext useState in two components", () => {
        let valueBumper;
        const useGlobalState = createGlobalCustomHookInRootContext(React.useState, 1);
        const TestComponent = () => {
            const [value,setValue] = useGlobalState();
            return (<div data-testid="component-with-hook">Value {value}</div>)
        }
        const TestComponentTwo = () => {
            const [value, setValue] = useGlobalState();
            valueBumper = setValue;
            return (<div data-testid="component-with-hook-two">Value {value}</div>)
        }
        render(<CompoundProvider><TestComponent /><TestComponentTwo/></CompoundProvider>);
        expect(screen.getByTestId("component-with-hook")).not.toBeNull();
        expect(screen.getByTestId("component-with-hook")).toHaveTextContent(`Value 1`);
        expect(screen.getByTestId("component-with-hook-two")).not.toBeNull();
        expect(screen.getByTestId("component-with-hook")).toHaveTextContent(`Value 1`);

        act(() => {
            valueBumper(2);
        });
        expect(screen.getByTestId("component-with-hook-two")).toHaveTextContent(`Value 2`);
        expect(screen.getByTestId("component-with-hook")).toHaveTextContent(`Value 2`);
    });

    test("createGlobalCustomHookWithProvider useState in two components", () => {
        let valueBumperFirst;
        let valueBumperSecond;
        const useGlobalState = createGlobalCustomHookWithProvider(React.useState, 1);
        const TestComponent = () => {
            const [value,setValue] = useGlobalState();
            valueBumperFirst = setValue;
            return (<div data-testid="component-with-hook">Value {value}</div>)
        }
        const TestComponentTwo = () => {
            const [value, setValue] = useGlobalState();
            valueBumperSecond = setValue;
            return (<div data-testid="component-with-hook-two">Value {value}</div>)
        }
        render(<CompoundProvider><TestComponent /><TestComponentTwo/></CompoundProvider>);
        expect(screen.getByTestId("component-with-hook")).not.toBeNull();
        expect(screen.getByTestId("component-with-hook")).toHaveTextContent(`Value 1`);
        expect(screen.getByTestId("component-with-hook-two")).not.toBeNull();
        expect(screen.getByTestId("component-with-hook")).toHaveTextContent(`Value 1`);

        act(() => {
            valueBumperSecond(2);
        });

        expect(screen.getByTestId("component-with-hook")).toHaveTextContent(`Value 2`);
        expect(screen.getByTestId("component-with-hook-two")).toHaveTextContent(`Value 2`);

        act(() => {
            valueBumperSecond(3);
        });

        expect(screen.getByTestId("component-with-hook")).toHaveTextContent(`Value 3`);
        expect(screen.getByTestId("component-with-hook-two")).toHaveTextContent(`Value 3`);

    });


    test("useCompoundState in two components set the same value", () => {
        let valueBumper;
        const TestComponent = () => {
            const [value,setValue] = useCompoundState("bla", 1);
            valueBumper = setValue;
            return (<div data-testid="component-with-hook">Value {value}</div>)
        }
        const TestComponentTwo = () => {
            const [value, setValue] = useCompoundState("bla");
            return (<div data-testid="component-with-hook-two">Value {value}</div>)
        }
        render(<CompoundProvider><TestComponent /><TestComponentTwo/></CompoundProvider>);
        expect(screen.getByTestId("component-with-hook")).not.toBeNull();
        expect(screen.getByTestId("component-with-hook-two")).not.toBeNull();

        act(() => {
            valueBumper(2);
        });
        expect(screen.getByTestId("component-with-hook")).toHaveTextContent(`Value 2`);
        expect(screen.getByTestId("component-with-hook-two")).toHaveTextContent(`Value 2`);
    });
});
