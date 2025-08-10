/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Statuses } from "types/friendStatuses";
import ChessTimer, { TimeMs } from "./ChessTimer/ChessTimer";
import Player from "./Player/Player";
import QuickActions, { ActionsType } from "./QuickActions/QuickActions";

const ActionBarCss = css`
    margin: 0.5em 0 0.5em 0;

    display: flex;
    justify-content: flex-end;
    width: 100%;
    gap: 0.5em;
    flex-direction: horizontal;
`;

export type PlayerProps = { username: string | null; time: TimeMs; friendStatus?: Statuses };

type Props = { player: PlayerProps; timerPaused: boolean; actions?: ActionsType; isReplay: boolean };
export default function ActionBar(props: Props) {
    return (
        <div css={ActionBarCss}>
            <Player
                username={props.player.username}
                isOpponent={!props.actions}
                friendStatus={props.player.friendStatus || null}
            />
            {props.actions && <QuickActions actions={props.actions} isReplay={props.isReplay} />}
            {!props.isReplay && <ChessTimer time={props.player.time} paused={props.timerPaused} />}
        </div>
    );
}
