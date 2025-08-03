import React from "react";
import { Move, MoveInfo, Position } from "../ChessBoard/ChessLogic/board";
import Chess from "../ChessBoard/ChessLogic/chess";
import { Color, Piece, PromotionPieceType } from "../ChessBoard/ChessLogic/pieces";
import { handleMoveTo, makeMove } from "./handleMovePiece";
import { maybeGetPromotionPiece, selectPromotion } from "./handlePromotions";
import { selectPiece } from "./handleSelectPiece";

export type SetChessBoardState = React.Dispatch<React.SetStateAction<ChessBoardState>>;

export type ChessBoardState = {
    pieces: Piece[];
    selectedPiece: Piece | null;
    hoveringOverSquare: Position | null;
    validMoves: Move[];
    inProgressPromotionMove: Move | null;
    lastMove: MoveInfo | null;
};

export type ChessBoardStateHandlersProps = {
    chessBoardState: ChessBoardState;
    chess: Chess;
    colorToPlay: Color;
    setColorToPlay: (color: Color) => void;
    setBroadcastMove: (broadcastMove: ((move: MoveInfo) => void) | null) => void;
    handleClientMakeMove: (move: Move, promotionPiece: PromotionPieceType | null) => void;
    handleClientUndoMove: () => void;
    handleHoveringOver: (position: Position) => void;
    handleMovedTo: (moveTo: Position) => void;
    handleSelectPiece: (piece: Piece | null) => void;
    handleSetPromotionPiece: (position: Position | null) => void;
    handleMaybeGetPromotionPiece: (selectedPosition: Position) => PromotionPieceType | null;
};

type Props = {
    color: Color;
    isEnabled: boolean;
};

export const useChessBoardState = (props: Props): ChessBoardStateHandlersProps => {
    const { color, isEnabled } = props;

    const [colorToPlay, setColorToPlay] = React.useState<Color>(color);
    const broadcastMove = React.useRef<((move: MoveInfo) => void) | null>(null);
    const chess = React.useRef(new Chess()).current;

    const [chessBoardState, setChessBoardState] = React.useState<ChessBoardState>({
        pieces: chess.board.getPieces(),
        selectedPiece: null,
        hoveringOverSquare: null,
        validMoves: [],
        inProgressPromotionMove: null,
        lastMove: null,
    });

    const handleHoveringOver = (position: Position | null) => {
        setChessBoardState((chessBoardState) => ({ ...chessBoardState, hoveringOverSquare: position }));
    };

    const handleMovedTo = (moveTo: Position) => {
        if (!broadcastMove.current) throw new Error("broadcastMove function is required for broadcasting moves");

        const options = { moveTo, chess, isEnabled, color, setColorToPlay, broadcastMove: broadcastMove.current };
        setChessBoardState((chessBoardState) => handleMoveTo(chessBoardState, options));
    };

    const handleMaybeGetPromotionPiece = (selectedPosition: Position): PromotionPieceType | null => {
        return maybeGetPromotionPiece(chessBoardState, { selectedPosition, color });
    };

    const handleSetPromotionPiece = (selectedPosition: Position) => {
        const options = { isEnabled, color, chess, selectedPosition, setColorToPlay };
        setChessBoardState((chessBoardState) => selectPromotion(chessBoardState, options));
    };

    const handleSelectPiece = (piece: Piece | null) => {
        const options = { chess, isEnabled, piece, color };
        setChessBoardState((boardState) => selectPiece(boardState, options));
    };

    /**
     * Handles the client-side making a move.
     * - The actual move on the chess instance has to be performed outside the set state, as otherwise we would be
     *      risking calling it multiple times due to how React batches state updates.
     */
    const handleClientMakeMove = (move: Move, promotionPiece: PromotionPieceType | null) => {
        const moveInfo = chess.move(move, promotionPiece);
        const options = { isEnabled, color, moveInfo, chess, promotionPiece, setColorToPlay };

        setChessBoardState((chessBoardState) => {
            return makeMove(chessBoardState, options);
        });
    };

    const handleClientUndoMove = () => {
        const moveInfo = chess.undoMove();
        setChessBoardState((chessBoardState) => ({ ...chessBoardState, lastMove: moveInfo }));

        setColorToPlay(chess.board.colorToPlay);
    };

    const setBroadcastMove = (newBroadcastMove: (move: MoveInfo) => void) => {
        broadcastMove.current = newBroadcastMove;
    };

    return {
        chessBoardState,
        chess,
        colorToPlay,
        setColorToPlay,
        setBroadcastMove,
        handleClientMakeMove,
        handleClientUndoMove,
        handleMaybeGetPromotionPiece,
        handleSetPromotionPiece,
        handleSelectPiece,
        handleHoveringOver,
        handleMovedTo,
    };
};
