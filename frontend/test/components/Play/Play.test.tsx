import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Play from "components/Play/Play";
import { AppContext, AppContextType } from "hooks/appContext";
import { JoinApiResponse } from "types/api/play";
import { expect, test, vi } from "vitest";
import { MockWebSocket } from "../../mockWebSocket";

const mockWebsocket = () => {
    const mockedWebSocket = new MockWebSocket();

    global.WebSocket = MockWebSocket as unknown as typeof WebSocket;

    return mockedWebSocket;
};

const loadGame = async ({ mockJoinMessage }: { mockJoinMessage?: JoinApiResponse } = {}) => {
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

    const defaultMockJoinMessage: JoinApiResponse = {
        type: "join",
        players: {
            white: { user_type: "registered", username: "Player1", is_current_user: true, time: 60 },
            black: { user_type: "registered", username: "Player2", is_current_user: false, time: 60 },
        },
        moves: [],
        offer_draw: false,
        game_started: true,
    };
    await act(async () => {
        websocket.triggerMessage(JSON.stringify(mockJoinMessage ?? defaultMockJoinMessage));
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

test("Should move pieces and broadcast moves", async () => {
    await loadGame();

    const squareE2 = screen.getByTestId("square-1-4", { exact: false });
    const squareE4 = screen.getByTestId("square-3-4", { exact: false });

    fireEvent.mouseDown(squareE2);
    fireEvent.mouseMove(squareE4);
    fireEvent.mouseUp(squareE4);

    expect(squareE2.getAttribute("data-testid")).includes(`piece-empty`);
    expect(squareE4.getAttribute("data-testid")).includes(`piece-Pawn`);

    expect(MockWebSocket.messages).toContain(JSON.stringify({ type: "move", move: "e2e4" }));
});

test("Should join anonymous user", async () => {
    const mockJoinMessage: JoinApiResponse = {
        type: "join",
        players: {
            white: { user_type: "registered", username: "Player1", is_current_user: false, time: 60 },
            black: { user_type: "anonymous", user_id: 2, is_current_user: true, time: 60 },
        },
        moves: [],
        offer_draw: false,
        game_started: true,
    };

    await loadGame({ mockJoinMessage });

    const firstSquare = screen.getAllByTestId(/square/i)[0];
    expect(firstSquare).toBeTruthy();
    expect(firstSquare).toHaveAttribute("data-testid", expect.stringContaining("square-7-7"));
});
