import '@testing-library/jest-dom'
import * as React from 'react'
import {act, render, screen} from '@testing-library/react'
import {CompoundProvider, createGlobalContextHook, createGlobalHookWithDedicatedProvider} from './'
import {__resetState} from "./provider-storage";
import {__resetState as __hookReset} from "./hook-storage";

describe("HookFactories", () => {
    afterEach(()=>{
        __resetState()
        __hookReset()
    });
    test("createGlobalContextHook useState", () => {
        let valueBumper;
        const useGlobalState = createGlobalContextHook(React.useState, 1);
        const TestComponent = () => {
            const [value, setValue] = useGlobalState<number>();
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
    test("createGlobalHookWithDedicatedProvider useState", () => {
        let valueBumper;
        const useGlobalState = createGlobalHookWithDedicatedProvider(React.useState, 1);
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

    test("createGlobalHookWithDedicatedProvider useState", () => {
        let valueBumper;
        const useGlobalState = createGlobalHookWithDedicatedProvider(React.useState, 1);
        const useGlobalStateAlt = createGlobalHookWithDedicatedProvider(React.useState, 2);
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
});
