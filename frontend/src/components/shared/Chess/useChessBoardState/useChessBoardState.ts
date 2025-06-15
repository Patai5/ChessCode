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
        const options = { moveTo, chess, isEnabled, color, setColorToPlay };
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

    const handleClientMakeMove = (move: Move, promotionPiece: PromotionPieceType | null) => {
        setChessBoardState((chessBoardState) => {
            const options = { isEnabled, color, move, chess, promotionPiece, setColorToPlay };
            return makeMove(chessBoardState, options).chessBoardState;
        });
    };

    const handleClientUndoMove = () => {
        const moveInfo = chess.undoMove();
        setChessBoardState((chessBoardState) => ({ ...chessBoardState, lastMove: moveInfo }));

        setColorToPlay(chess.board.colorToPlay);
    };

    return {
        chessBoardState,
        chess,
        colorToPlay,
        setColorToPlay,
        handleClientMakeMove,
        handleClientUndoMove,
        handleMaybeGetPromotionPiece,
        handleSetPromotionPiece,
        handleSelectPiece,
        handleHoveringOver,
        handleMovedTo,
    };
};
