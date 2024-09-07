import React from "react";
import { screen, render, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import App, { IsAuthenticatedEndpoint } from "../App";
import { RecordsEndpoint } from "../Main/Main";

const mocks = [
    {
        [IsAuthenticatedEndpoint]: { isAuthenticated: false },
    },
    {
        [IsAuthenticatedEndpoint]: { isAuthenticated: true },
        [RecordsEndpoint]: [
            { queried: "10*10", operation_response: "100" },
            { queried: "10+10", operation_response: "20" },
        ],
    },
];

export const mockFetch = (mocks) => {
    return jest.fn().mockImplementation((url) => {
        return Promise.resolve({
            json: () => Promise.resolve(mocks[url]),
        });
    });
};

test("Render app not logged", async () => {
    window.fetch = mockFetch(mocks[0]);
    render(<App />);
    await waitFor(() => {
        expect(screen.queryByTestId("login")).toBeInTheDocument();
        expect(screen.queryByTestId("main")).not.toBeInTheDocument();
    });
});

test("Render app is logged", async () => {
    window.fetch = mockFetch(mocks[1]);
    render(<App />);
    await waitFor(() => {
        expect(screen.queryByTestId("main")).toBeInTheDocument();
        expect(screen.queryByTestId("login")).not.toBeInTheDocument();
    });
});

test("Render main table with 2 records", async () => {
    window.fetch = mockFetch(mocks[1]);
    render(<App />);
    await waitFor(() => {
        expect(document.querySelectorAll(".record").length).toBe(2);
    });
});
