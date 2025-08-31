import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PATHS } from "components/constants";
import UserMenu from "components/shared/UserMenu/UserMenu";
import { AppContext } from "hooks/appContext";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { expect, test } from "vitest";

test("Should display and navigate for sign in button for anonymous users", () => {
    render(
        <MemoryRouter>
            <Routes>
                <Route path={PATHS.HOME} element={<UserMenu />} />
                <Route path={PATHS.LOGIN} element={<p>Login Page</p>} />
            </Routes>
        </MemoryRouter>,
    );

    const signInButton = screen.getByText("Sign in");
    expect(signInButton).toBeTruthy();

    act(() => signInButton.click());

    expect(screen.getByText("Login Page")).toBeTruthy();
});

test("Should display and handle dropdown menu for signed in users", async () => {
    const username = "testUsername";
    const handleSetUsername = () => {};

    render(
        <AppContext.Provider value={{ username, setUsername: handleSetUsername }}>
            <MemoryRouter>
                <Routes>
                    <Route path={PATHS.HOME} element={<UserMenu />} />
                </Routes>
            </MemoryRouter>
        </AppContext.Provider>,
    );

    const profileButton = screen.getByText(username);
    expect(profileButton).toBeTruthy();

    expect(screen.queryAllByTestId("dropdown-popup")).toHaveLength(0);

    act(() => fireEvent.mouseEnter(profileButton));
    await waitFor(() => expect(screen.queryByTestId("dropdown-popup")).toBeTruthy());

    act(() => fireEvent.mouseLeave(profileButton));
    await waitFor(() => expect(screen.queryByTestId("dropdown-popup")).toBeNull());
});
