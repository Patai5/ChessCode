import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as axios from "axios";
import { ReplayGame } from "components/ReplayGame/ReplayGame";
import { ReplayGameAPIResponse } from "types/api/replayGame";
import { describe, expect, test, vi } from "vitest";

const MOCK_API_RESPONSE: ReplayGameAPIResponse = {
    moves: ["e2e4", "e7e5", "d2d4"],
    players: {
        white: { user_type: "registered", username: "Player1", time: 0, status: "not_friends" },
        black: { user_type: "registered", username: "Player2", time: 0, status: "not_friends" },
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
    const expectSquare = (id: string, pieceType: string) => {
        const square = screen.getByTestId(id, { exact: false });
        expect(square.getAttribute("data-testid")).includes(`piece-${pieceType}`);
    };

    const getButtons = () => ({
        backButton: screen.getByTestId("go-back-button"),
        forwardButton: screen.getByTestId("go-forward-button"),
        startButton: screen.getByTestId("go-to-start-button"),
        endButton: screen.getByTestId("got-to-end-button"),
    });

    test("Should disable and enable them accordingly", async () => {
        await loadGame();

        const { backButton, forwardButton, startButton, endButton } = getButtons();

        expect(backButton.ariaDisabled).toBe("true");
        expect(forwardButton.ariaDisabled).toBe("false");
        expect(startButton.ariaDisabled).toBe("true");
        expect(endButton.ariaDisabled).toBe("false");
    });

    test("Should allow going back and forward", async () => {
        await loadGame();

        const { backButton, forwardButton, startButton, endButton } = getButtons();

        expectSquare("square-1-4", "Pawn");
        expectSquare("square-3-4", "empty");

        await userEvent.click(forwardButton);
        expectSquare("square-1-4", "empty");
        expectSquare("square-3-4", "Pawn");

        await userEvent.click(forwardButton);
        expectSquare("square-1-4", "empty");
        expectSquare("square-3-4", "Pawn");
        expectSquare("square-6-4", "empty");
        expectSquare("square-4-4", "Pawn");

        await userEvent.click(backButton);
        expectSquare("square-1-4", "empty");
        expectSquare("square-3-4", "Pawn");
        expectSquare("square-6-4", "Pawn");
        expectSquare("square-4-4", "empty");

        await userEvent.click(endButton);
        expectSquare("square-1-4", "empty");
        expectSquare("square-3-4", "Pawn");
        expectSquare("square-6-4", "empty");
        expectSquare("square-4-4", "Pawn");
        expectSquare("square-1-4", "empty");
        expectSquare("square-3-4", "Pawn");

        await userEvent.click(startButton);
        expectSquare("square-1-4", "Pawn");
        expectSquare("square-3-4", "empty");
        expectSquare("square-6-4", "Pawn");
        expectSquare("square-4-4", "empty");
        expectSquare("square-1-4", "Pawn");
        expectSquare("square-3-4", "empty");
    });

    test("Should toggle the disabled state of the buttons when moving", async () => {
        await loadGame();

        const { forwardButton, startButton, endButton } = getButtons();

        await userEvent.click(endButton);
        expect(startButton.ariaDisabled).toBe("false");
        expect(forwardButton.ariaDisabled).toBe("true");
        expect(endButton.ariaDisabled).toBe("true");
    });
});
