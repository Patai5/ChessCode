/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import Button from "components/shared/Button";

type Props = { label: string; closePopup: () => void };
export default function CancelButton(props: Props) {
    return <Button label={props.label} fontSize="1.6em" onClick={props.closePopup} />;
}
