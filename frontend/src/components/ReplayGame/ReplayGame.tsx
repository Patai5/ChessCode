/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import axios from "axios";
import { PlayersProps as PlayersAPI } from "components/shared/Chess/ActionBar/ActionBar";
import Chess from "components/shared/Chess/Chess";
import { RefType } from "components/shared/Chess/ChessBoard/ChessBoard";
import { Move, MoveName } from "components/shared/Chess/ChessBoard/ChessLogic/board";
import { Color } from "components/shared/Chess/ChessBoard/ChessLogic/pieces";
import { GameResult, GameTermination, GameWinner } from "components/shared/Chess/ResultsDisplay/ResultsDisplay";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import UserMenu from "components/shared/UserMenu/UserMenu";
import React from "react";
import { useParams } from "react-router-dom";
import { validateId } from "utils/chess";

interface ReplayMatchAPIResponse {
    moves: MoveName[];
    players: PlayersAPI;
    termination: keyof typeof GameTermination;
    date: Date;
    winner_color: keyof typeof GameWinner;
}

const replayCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

type Props = { replayUser?: string };
export default function ReplayGame(props: Props) {
    const [color, setColor] = React.useState<Color>(Color.White);
    const [playedMoves, setPlayedMoves] = React.useState<MoveName[]>([]);
    const [players, setPlayers] = React.useState<PlayersAPI | null>(null);
    const [gameResult, setGameResult] = React.useState<GameResult | null>(null);
    const chessboardRef = React.useRef<RefType>(null);
    const { id } = useParams();

    React.useEffect(() => {
        const isValidId = handleGameIdValidation();
        if (!isValidId) return;

        fetchGame();
    }, []);

    const handleGameIdValidation = (): boolean => {
        const isValidId = validateId(id);
        if (isValidId !== true) {
            ErrorQueueClass.addError({ errorMessage: isValidId });
            return false;
        }
        return true;
    };

    const fetchGame = async () => {
        try {
            const res = await axios({ method: "get", url: `/api/play/game/${id}` });
            handleReplayFromApiResponse(res.data);
        } catch (err) {
            ErrorQueueClass.handleError(err);
        }
    };

    const handleReplayFromApiResponse = (res: ReplayMatchAPIResponse) => {
        const { moves, players, termination, winner_color } = res;

        setPlayedMoves(moves);
        setPlayers(players);

        setGameResult({
            winner: winner_color,
            termination: termination,
        });

        if (props.replayUser) {
            const replayUserColor = props.replayUser === players.black.username ? Color.Black : Color.White;
            setColor(replayUserColor);
        }
    };

    const updateMove = (moveName: MoveName) => {
        if (!chessboardRef.current) return;
        const { move, promotionPiece } = Move.fromName(moveName);
        chessboardRef.current.clientMakeMove(move, promotionPiece);
    };

    const goBack = () => {
        // TODO:
    };

    const goForward = () => {
        // TODO:
    };

    const goToStart = () => {
        // TODO:
    };

    const goToEnd = () => {
        // TODO:
    };

    const chessProps = {
        color: color,
        players: players,
        gameStarted: true,
        gameResult: gameResult,
        isReplay: true,
        actions: {
            replayActions: {
                goBack,
                goForward,
                goToStart,
                goToEnd,
            },
        },
        ref: chessboardRef,
    };

    return (
        <>
            <UserMenu />
            <div css={replayCss}>
                <Chess {...chessProps} />
            </div>
        </>
    );
}
