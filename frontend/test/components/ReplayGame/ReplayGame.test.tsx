import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as axios from "axios";
import { ReplayGame } from "components/ReplayGame/ReplayGame";
import { ReplayGameAPIResponse } from "types/api/replayGame";
import { describe, expect, test, vi } from "vitest";

const MOCK_API_RESPONSE: ReplayGameAPIResponse = {
    moves: ["e2e4", "e7e5", "d2d4"],
    players: {
        white: { username: "Player1", time: 0, friend_status: "not_friends" },
        black: { username: "Player2", time: 0 },
    },
    termination: "resignation",
    winner_color: "white",
    date: new Date(),
};

vi.mock("axios");
vi.mock("react-router-dom", () => ({
    ...vi.importActual("react-router-dom"),
    useParams: vi.fn().mockReturnValue(() => {}),
    useNavigate: vi.fn().mockReturnValue(() => {}),
}));

const loadGame = async () => {
    vi.spyOn(axios, "default").mockImplementationOnce(
        () => new Promise((resolve) => resolve({ data: MOCK_API_RESPONSE })),
    );
    render(<ReplayGame />);

    await waitFor(() => screen.queryAllByText("Loading...").length === 0);
};

test("Should display loading screen before game is loaded", () => {
    vi.spyOn(axios, "default").mockImplementationOnce(() => new Promise(() => {}));
    render(<ReplayGame />);

    expect(screen.getByText("Loading...")).toBeTruthy();
});

test("Should display chessboard after game is loaded", async () => {
    await loadGame();
});

describe("Should correctly handle action buttons", () => {
    test("Should disable and enable them accordingly", async () => {
        await loadGame();

        const backButton = screen.getByTestId("go-back-button");
        const forwardButton = screen.getByTestId("go-forward-button");
        const startButton = screen.getByTestId("go-to-start-button");
        const endButton = screen.getByTestId("got-to-end-button");

        expect(backButton.ariaDisabled).toBe("true");
        expect(forwardButton.ariaDisabled).toBe("false");
        expect(startButton.ariaDisabled).toBe("true");
        expect(endButton.ariaDisabled).toBe("false");
    });

    test("Should allow going back and forward", async () => {
        await loadGame();

        const forwardButton = screen.getByTestId("go-forward-button");
        const backButton = screen.getByTestId("go-back-button");
        const goToEndButton = screen.getByTestId("got-to-end-button");

        const pieceToMove = screen.getByTestId("square-1-4", { exact: false });
        const pieceToMoveTo = screen.getByTestId("square-3-4", { exact: false });

        expect(pieceToMove.getAttribute("data-testid")).includes("piece-Pawn");
        expect(pieceToMoveTo.getAttribute("data-testid")).includes("piece-empty");

        await userEvent.click(forwardButton);
        expect(pieceToMove.getAttribute("data-testid")).includes("piece-empty");
        expect(pieceToMoveTo.getAttribute("data-testid")).includes("piece-Pawn");

        await userEvent.click(backButton);
        expect(pieceToMove.getAttribute("data-testid")).includes("piece-Pawn");
        expect(pieceToMoveTo.getAttribute("data-testid")).includes("piece-empty");

        await userEvent.click(goToEndButton);
        expect(pieceToMove.getAttribute("data-testid")).includes("piece-empty");
    });

    test("Should toggle the disabled state of the buttons when moving", async () => {
        await loadGame();

        const goToStartButton = screen.getByTestId("go-to-start-button");
        const forwardButton = screen.getByTestId("go-forward-button");
        const goToEndButton = screen.getByTestId("got-to-end-button");

        await userEvent.click(goToEndButton);
        expect(goToStartButton.ariaDisabled).toBe("false");
        expect(forwardButton.ariaDisabled).toBe("true");
        expect(goToEndButton.ariaDisabled).toBe("true");
    });
});
