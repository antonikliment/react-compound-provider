import '@testing-library/jest-dom'
import * as React from 'react'
import {render, screen} from '@testing-library/react'
import {CompoundProvider, registerProvider} from './'
import {__resetState} from "./provider-storage";

const TestContextA = React.createContext("A");
const TestContextB = React.createContext("B");

const ConsumerA= (props) =>
    <TestContextA.Consumer>{context => (<>{props.children}{context}</>)}</TestContextA.Consumer>
const ProviderA =  ({children}) => <TestContextA.Provider value={"A"} children={children}/>;

const ConsumerB = (props) => <TestContextB.Consumer>{context => (<>{props.children}{context}</>)}</TestContextB.Consumer>
const ProviderB = ({children}) => <TestContextB.Provider value={"B"} children={children}/>;


describe("CompoundProvider", () => {
    afterEach(()=>{
        __resetState()
    });
    test("renders child components when no providers exist", () => {
        const testMessage = 'Test Message'
        render(<CompoundProvider>{testMessage}</CompoundProvider>);
        expect(screen.queryByText(testMessage)).not.toBeNull();
        expect(screen.queryByText(testMessage)).toHaveTextContent(testMessage)
    });
    test("renders child components with one provider", () => {
        const testMessage = 'Test Message'
        registerProvider(ProviderA);
        render(<CompoundProvider><ConsumerA>{testMessage}</ConsumerA></CompoundProvider>);
        expect(screen.queryByText(testMessage+"A")).not.toBeNull();
    });

    test("renders child components with two providers", () => {
        const testMessage = 'Test Message'

        registerProvider(ProviderA);
        registerProvider(ProviderB);
        render(
            <CompoundProvider>
                <ConsumerA>
                    <div data-testid="A">{testMessage}</div>
                </ConsumerA>
                <ConsumerB>
                    <div data-testid="B">{testMessage}</div>
                </ConsumerB>
            </CompoundProvider>
        );

        expect(screen.queryByTestId("A")).not.toBeNull();
        expect(screen.queryByTestId("B")).not.toBeNull();
    });

    test("renders child components with one provider even when a second is added after the initial render", () => {
        const testMessage = 'Test Message'
        registerProvider(ProviderA);
        render(<CompoundProvider><ConsumerA>{testMessage}</ConsumerA></CompoundProvider>);
        registerProvider(ProviderB);

        expect(screen.queryByText(testMessage+"A")).not.toBeNull();

        // TODO improve assertion
    });

    test("renders a provider only once", () => {
        const testMessage = 'Test Message'
        registerProvider(ProviderA);
        registerProvider(ProviderA);
        render(<CompoundProvider><ConsumerA>{testMessage}</ConsumerA></CompoundProvider>);

        expect(screen.queryByText(testMessage+"A")).not.toBeNull();

        // TODO improve assertion
    });
});
