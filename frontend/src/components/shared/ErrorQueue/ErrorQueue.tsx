/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import Error, { ErrorType } from "./Error/Error";

export class ErrorQueueClass {
    private static ErrorQueue: ErrorType[] = [];
    public static setErrorFnCallback: (error: ErrorType) => void = () => {};
    public static addError(error: ErrorType) {
        ErrorQueueClass.ErrorQueue.push(error);

        if (ErrorQueueClass.ErrorQueue.length > 1) return;
        ErrorQueueClass.setErrorFnCallback(ErrorQueueClass.getError());
    }
    public static getError() {
        return ErrorQueueClass.ErrorQueue[0];
    }
    public static removeError() {
        ErrorQueueClass.ErrorQueue.shift();
    }
}

type Props = {};
export default function ErrorQueue(props: Props) {
    const [error, setError] = React.useState<false | ErrorType>(false);

    React.useEffect(() => {
        ErrorQueueClass.setErrorFnCallback = setError;
    }, []);

    const handleErrorClosed = () => {
        ErrorQueueClass.removeError();
        const nextError = ErrorQueueClass.getError();
        if (nextError) setError(nextError);
    };

    return error && <Error error={error} closedCallback={handleErrorClosed} />;
}
