/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Statuses } from "types/friendStatuses";
import ChessTimer, { TimeMs } from "./ChessTimer/ChessTimer";
import Player from "./Player/Player";
import QuickActions, { Actions } from "./QuickActions/QuickActions";

const ActionBarCss = css`
    margin: 0.5em 0 0.5em 0;

    display: flex;
    justify-content: flex-end;
    width: 100%;
    gap: 0.5em;
    flex-direction: horizontal;
`;

export type PlayerProps = { username: string | null; time: TimeMs; friend_status?: Statuses };

type Props = { player: PlayerProps; timerPaused: boolean; actions?: Actions };
export default function ActionBar(props: Props) {
    return (
        <div css={ActionBarCss}>
            <Player
                username={props.player.username}
                isOpponent={!props.actions}
                friendStatus={props.player.friend_status || null}
            />
            {props.actions && <QuickActions actions={props.actions} />}
            <ChessTimer time={props.player.time} paused={props.timerPaused} />
        </div>
    );
}
