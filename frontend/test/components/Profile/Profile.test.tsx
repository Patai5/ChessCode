import { act, render, screen, within } from "@testing-library/react";
import * as axios from "axios";
import Profile from "components/Profile/Profile";
import { ProfileApiResponse } from "types/api/profile";
import { expect, test, vi } from "vitest";

const mockGameResponse = { termination: "checkmate", time_control: 1800, date: "2023-01-01T00:00:00Z" } as const;
const MOCK_API_RESPONSE: ProfileApiResponse = {
    date_joined: "2023-01-01T00:00:00Z",
    games: [
        {
            ...mockGameResponse,
            players: {
                white: { user_type: "registered", username: "Player1", is_current_user: true },
                black: { user_type: "anonymous", user_id: 1, is_current_user: false },
            },
            winner_color: "white",
            game_id: 1,
        },
        {
            ...mockGameResponse,
            players: {
                white: { user_type: "registered", username: "Player1", is_current_user: true },
                black: { user_type: "registered", username: "Player2", is_current_user: false },
            },
            winner_color: "black",
            game_id: 2,
        },
    ],
    total_friends: 1,
    total_games: 1,
};

vi.mock("axios");
vi.mock("react-router-dom", () => ({
    ...vi.importActual("react-router-dom"),
    useParams: vi.fn().mockReturnValue(() => {}),
    useNavigate: vi.fn().mockReturnValue(() => {}),
}));

test("Should load user games information", async () => {
    vi.spyOn(axios, "default").mockImplementationOnce(
        () => new Promise((resolve) => resolve({ data: MOCK_API_RESPONSE })),
    );

    await act(async () => {
        render(<Profile />);
    });

    const gamesRows = screen.getAllByTestId(/game-row/i);
    expect(gamesRows).toHaveLength(2);

    const gameOutcome1 = within(gamesRows[0]).getByTestId("game-outcome-text");
    expect(gameOutcome1).toHaveTextContent("Won");
    const opponent1 = within(gamesRows[0]).getByTestId("opponent-user-button");
    expect(opponent1).toHaveTextContent("Anonymous");

    const gameOutcome2 = within(gamesRows[1]).getByTestId("game-outcome-text");
    expect(gameOutcome2).toHaveTextContent("Lost");
    const opponent2 = within(gamesRows[1]).getByTestId("opponent-user-button");
    expect(opponent2).toHaveTextContent("Player2");
});
