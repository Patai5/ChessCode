/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import { Move, MoveInfo, Position } from "./ChessLogic/board";
import Chess from "./ChessLogic/chess";
import { Color, Piece, Pieces, PromotionPieceType, PromotionPieces } from "./ChessLogic/pieces";
import { isPositionInMoves } from "./ChessLogic/utils";
import Square, { AnyProps as squareAnyProps, Props as squareProps } from "./Square/Square";

const ChessBoardCss = css`
    display: flex;
    flex-direction: row;
`;
const FileCss = css`
    display: flex;
    flex-flow: column-reverse;
`;

export type selectedPieceType = Piece | null;
export type setPieceType = (piece: selectedPieceType) => void;
type chessboardRowElement = React.ReactElement<squareProps>[];
type chessboardElement = chessboardRowElement[];
interface PromotionSquare {
    position: Position;
    promotionPiece: PromotionPieceType;
    move: Move;
}

export interface RefType {
    clientMakeMove: (move: Move, promotionPiece: PromotionPieceType | null) => void;
    clientUndoMove: () => void;
}

type Props = {
    color: Color;
    isEnabled: boolean;
    broadcastMove?: (move: MoveInfo, promotionPiece: PromotionPieceType | null) => void;
    updateColorToPlay: (color: Color) => void;
};
function ChessBoard(props: Props, forwardedRef: React.Ref<RefType>) {
    let selectedPiece = React.useRef<selectedPieceType>(null).current;
    let hoveringOver = React.useRef<Position | null>(null).current;
    let validMoves = React.useRef<Move[]>([]).current;
    let showPromotionSquares = React.useRef<PromotionSquare[] | null>(null).current;
    const isEnabled = React.useRef(props.isEnabled);
    const chess = React.useRef(new Chess()).current;

    React.useImperativeHandle(forwardedRef, () => {
        return { clientMakeMove, clientUndoMove };
    });

    React.useEffect(() => {
        isEnabled.current = props.isEnabled;
    }, [props.isEnabled]);

    const getSquareFromPosition = (
        chessboard: chessboardElement,
        position: Position
    ): React.ReactElement<squareProps> => {
        if (props.color === Color.White) {
            return chessboard[position.file][position.rank];
        } else {
            return chessboard[7 - position.file][7 - position.rank];
        }
    };
    const setSquareToPosition = (
        chessboard: chessboardElement,
        position: Position,
        square: React.ReactElement<squareProps>
    ) => {
        if (props.color === Color.White) {
            chessboard[position.file][position.rank] = square;
        } else {
            chessboard[7 - position.file][7 - position.rank] = square;
        }
    };

    const updateSquaresProps = (chessboard: chessboardElement, position: Position, propsToUpdate: squareAnyProps) => {
        const square = getSquareFromPosition(chessboard, position);
        const updatedProps = { ...square.props, ...propsToUpdate };
        setSquareToPosition(chessboard, position, <Square {...updatedProps} key={square.key} />);
    };

    const handleUpdateSelectedPiece = (chessboard: chessboardElement, piece: selectedPieceType) => {
        // Deselects the previously selected piece
        if (selectedPiece) {
            updateSquaresProps(chessboard, selectedPiece.position, { isSelected: false });
        }
        // Selects the new piece
        if (piece) {
            updateSquaresProps(chessboard, piece.position, { isSelected: true });
        }
        selectedPiece = piece;
    };

    const handleUpdateValidMoves = (chessboard: chessboardElement, moves: Move[]) => {
        // Deselects the previously valid moves;
        validMoves.forEach((move) => {
            updateSquaresProps(chessboard, move.to, { isValidMove: false });
        });
        // Selects the new valid moves
        moves.forEach((move) => {
            updateSquaresProps(chessboard, move.to, { isValidMove: true });
        });
        validMoves = moves;
    };

    const handleSelectPiece: setPieceType = (piece: selectedPieceType) => {
        if (!isEnabled.current) return;
        if (piece && piece.color !== props.color) return;

        const updatedChessboard = [...chessboard];
        handleUpdateSelectedPiece(updatedChessboard, piece);

        const updatedValidMoves = piece ? piece.getValidMoves(chess.board) : [];
        handleUpdateValidMoves(updatedChessboard, updatedValidMoves);

        setChessboard(updatedChessboard);
    };

    const updateMoveIndicator = (chessboard: chessboardElement, moveInfo: MoveInfo) => {
        for (const position of [moveInfo.move.from, moveInfo.move.to]) {
            updateSquaresProps(chessboard, position, { isLastMove: true });
        }
    };

    const handleUpdateMove = (moveInfo: MoveInfo | null) => {
        const updatedChessboard = [...chessboard];

        for (const { position, piece } of chess.positionGenerator()) {
            updateSquaresProps(chessboard, position, { piece: piece, isLastMove: false });
        }

        if (moveInfo) updateMoveIndicator(chessboard, moveInfo);

        setChessboard(updatedChessboard);
    };

    const handleShowPromotion = (piece: Piece, move: Move) => {
        if (!(piece instanceof Pieces.Pawn)) return false;

        if (piece.color === Color.White && move.to.rank !== 7) return false;
        if (piece.color === Color.Black && move.to.rank !== 0) return false;

        const updatedChessboard = [...chessboard];

        showPromotionSquares = [];
        const selectPiecePosition = move.to.copy();
        for (const promotionPiece of PromotionPieces) {
            showPromotionSquares.push({ position: selectPiecePosition.copy(), promotionPiece, move });
            updateSquaresProps(updatedChessboard, selectPiecePosition, {
                promotionPiece: { piece: promotionPiece, color: piece.color },
            });
            selectPiecePosition.rank += piece.color === Color.White ? -1 : 1;
        }

        setChessboard(updatedChessboard);
        return true;
    };

    const selectPromotion = (selectedPosition: Position) => {
        if (showPromotionSquares === null) return;

        const updatedChessboard = [...chessboard];
        for (const promotionSquare of showPromotionSquares) {
            updateSquaresProps(chessboard, promotionSquare.position, { promotionPiece: null });
        }
        setChessboard(updatedChessboard);

        for (const promotionSquare of showPromotionSquares) {
            if (promotionSquare.position.equals(selectedPosition)) {
                showPromotionSquares = null;
                makeMove(promotionSquare.move, promotionSquare.promotionPiece);
                return;
            }
        }
        // Position is not a promotion square
        showPromotionSquares = null;
    };

    const handleMovedTo = (moveTo: Position) => {
        const move = new Move(selectedPiece!.position, moveTo);
        if (!showPromotionSquares) if (handleShowPromotion(selectedPiece!, move)) return;
        makeMove(move);
    };

    const makeMove = (move: Move, promotionPiece: PromotionPieceType | null = null) => {
        const moveInfo = clientMakeMove(move, promotionPiece);
        props.broadcastMove!(moveInfo, promotionPiece);
    };

    const clientMakeMove = (move: Move, promotionPiece: PromotionPieceType | null = null) => {
        const moveInfo = chess.move(move, promotionPiece);
        handleUpdateMove(moveInfo);
        handleSelectPiece(null);

        props.updateColorToPlay(chess.board.colorToPlay);

        return moveInfo;
    };

    const clientUndoMove = () => {
        const moveInfo = chess.undoMove();
        handleUpdateMove(moveInfo);

        props.updateColorToPlay(chess.board.colorToPlay);
    };

    const handleHoveringOver = (position: Position | null) => {
        const updatedChessboard = [...chessboard];
        if (hoveringOver) {
            updateSquaresProps(chessboard, hoveringOver, { hoveringOver: false });
        }
        if (position) {
            updateSquaresProps(chessboard, position, { hoveringOver: true });
        }

        hoveringOver = position;
        setChessboard(updatedChessboard);
    };

    const makeRow = (file: number): chessboardRowElement => {
        const squares: chessboardRowElement = [];
        for (let rank = 0; rank < 8; rank++) {
            const position = new Position(file, rank);
            squares.push(
                <Square
                    piece={chess.board.getPiece(position)}
                    position={position.copy()}
                    color={(position.file + position.rank) % 2 === 0 ? Color.Black : Color.White}
                    isSelected={selectedPiece ? selectedPiece.position.toName() === position.toName() : false}
                    isValidMove={isPositionInMoves(position, validMoves)}
                    isLastMove={false}
                    setSelectedPiece={handleSelectPiece}
                    hoveringOver={hoveringOver ? hoveringOver.toName() === position.toName() : false}
                    setHoveringOver={handleHoveringOver}
                    setMovedTo={handleMovedTo}
                    promotionPiece={null}
                    setPromotionPiece={selectPromotion}
                    key={position.rank}
                />
            );
        }
        if (props.color === Color.Black) squares.reverse();
        return squares;
    };
    /** Packs all of the chessboard into an array of columns containing the rows with individual squares
     * @returns {chessboardElement} Array of React elements containing the chessboard */
    const makeFiles = (): chessboardElement => {
        const files: chessboardElement = [];
        for (let file = 0; file < 8; file++) {
            files.push(makeRow(file));
        }
        if (props.color === Color.Black) files.reverse();
        return files;
    };

    const [chessboard, setChessboard] = React.useState<chessboardElement>(makeFiles);
    return (
        <div css={ChessBoardCss}>
            {chessboard.map((file, index) => (
                <div css={FileCss} key={index}>
                    {file}
                </div>
            ))}
        </div>
    );
}

export default React.forwardRef(ChessBoard);
