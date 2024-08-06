/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { LoginFormType } from "../Login";
import InputField from "./InputField/InputField";

const inputFieldsCss = css`
	display: flex;
	flex-direction: column;
	padding: 1em 0;
	gap: 2em;
	width: 100%;
`;

type Props = {
	register: boolean;
	fields: LoginFormType;
	handleSetField: (type: "username" | "password", value: string) => void;
};
export default function InputFields(props: Props) {
	return (
		<div css={inputFieldsCss}>
			<InputField
				register={props.register}
				type="username"
				value={props.fields.username}
				setValue={(value: string) =>
					props.handleSetField("username", value)
				}
			/>
			<InputField
				register={props.register}
				type="password"
				value={props.fields.password}
				setValue={(value: string) =>
					props.handleSetField("password", value)
				}
			/>
		</div>
	);
}
