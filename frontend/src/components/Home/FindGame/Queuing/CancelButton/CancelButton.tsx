/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import Button from "components/shared/Button";

type Props = { stopQueuing: () => Promise<void> };
export default function CancelButton(props: Props) {
    return <Button label={"Cancel"} fontSize="1.6em" onClick={props.stopQueuing} />;
}
