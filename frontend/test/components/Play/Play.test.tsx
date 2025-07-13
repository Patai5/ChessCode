import { act, render, screen, waitFor } from "@testing-library/react";
import Play from "components/Play/Play";
import { AppContext, AppContextType } from "hooks/appContext";
import { expect, test, vi } from "vitest";
import { MockWebSocket } from "../../mockWebSocket";

const mockWebsocket = () => {
    const mockedWebSocket = new MockWebSocket();

    global.WebSocket = MockWebSocket as unknown as typeof WebSocket;

    return mockedWebSocket;
};

const loadGame = async () => {
    const websocket = mockWebsocket();
    vi.mock("react-router-dom", async () => ({
        useParams: () => ({ id: "test-game-id" }),
        useNavigate: () => vi.fn(),
    }));

    render(
        <AppContext.Provider value={{ username: "Player1" } as AppContextType}>
            <Play />
        </AppContext.Provider>,
    );

    await act(async () => {
        websocket.triggerOpen();
    });

    await act(async () => {
        websocket.triggerMessage(
            JSON.stringify({
                type: "join",
                players: {
                    white: { username: "Player1", color: "white" },
                    black: { username: "Player2", color: "black" },
                },
                moves: [],
                offer_draw: false,
                game_started: true,
            }),
        );
    });

    await waitFor(() => screen.queryAllByText("Connecting...").length === 0);
};

test("Should display loading screen before game is loaded", async () => {
    mockWebsocket();
    vi.mock("react-router-dom", async () => ({
        useParams: () => ({ id: "test-game-id" }),
        useNavigate: () => vi.fn(),
    }));

    render(<Play />);

    expect(screen.getByText("Connecting...")).toBeTruthy();
});

test("Should display chessboard after game is loaded", async () => {
    await loadGame();

    expect(screen.getByTestId("square-0-0", { exact: false })).toBeTruthy();
});
