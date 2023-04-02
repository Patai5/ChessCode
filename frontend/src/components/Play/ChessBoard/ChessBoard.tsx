/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import { Position, Move, MoveInfo } from "./ChessLogic/board";
import Chess from "./ChessLogic/chess";
import { Color, Piece } from "./ChessLogic/pieces";
import Square, { Props as squareProps, AnyProps as squareAnyProps } from "./Square/Square";
import { isPositionInMoveArray } from "./ChessLogic/utils";

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

type Props = {};
export default function ChessBoard(props: Props) {
    let selectedPiece = React.useRef<selectedPieceType>(null).current;
    let hoveringOver = React.useRef<Position | null>(null).current;
    let validMoves = React.useRef<Move[]>([]).current;
    const chess = React.useRef(new Chess()).current;

    const getSquareFromPosition = (
        chessboard: chessboardElement,
        position: Position
    ): React.ReactElement<squareProps> => {
        return chessboard[position.file][position.rank];
    };
    const setSquareToPosition = (
        chessboard: chessboardElement,
        position: Position,
        square: React.ReactElement<squareProps>
    ) => {
        chessboard[position.file][position.rank] = square;
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
        const updatedChessboard = [...chessboard];
        handleUpdateSelectedPiece(updatedChessboard, piece);

        const updatedValidMoves = piece ? piece.getValidMoves(chess.board) : [];
        handleUpdateValidMoves(updatedChessboard, updatedValidMoves);

        setChessboard(updatedChessboard);
    };

    const handleUpdateMove = (moveInfo: MoveInfo) => {
        const updatedChessboard = [...chessboard];
        // Remove the captured piece
        if (moveInfo.capturedPiece) {
            updateSquaresProps(chessboard, moveInfo.capturedPiece.position, { piece: null });
        }
        // Update the piece's position
        updateSquaresProps(chessboard, moveInfo.move.from, { piece: null });
        updateSquaresProps(chessboard, moveInfo.move.to, { piece: moveInfo.piece });

        setChessboard(updatedChessboard);
    };

    const handleMovedTo = (moveTo: Position) => {
        const move = new Move(selectedPiece!.position, moveTo);
        const moveInfo = chess.move(move);

        handleUpdateMove(moveInfo);
        handleSelectPiece(null);
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
                    isValidMove={isPositionInMoveArray(position, validMoves)}
                    setSelectedPiece={handleSelectPiece}
                    hoveringOver={hoveringOver ? hoveringOver.toName() === position.toName() : false}
                    setHoveringOver={handleHoveringOver}
                    setMovedTo={handleMovedTo}
                    key={position.rank}
                />
            );
        }
        return squares;
    };
    /** Packs all of the chessboard into an array of columns containing the rows with individual squares
     * @returns {chessboardElement} Array of React elements containing the chessboard */
    const makeFiles = (): chessboardElement => {
        const files: chessboardElement = [];
        for (let file = 0; file < 8; file++) {
            files.push(makeRow(file));
        }
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
