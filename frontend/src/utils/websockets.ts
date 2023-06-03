import { getBaseUri } from "./utils";

export function isWSMessageError(message: MessageEvent<any>) {
    return JSON.parse(message.data).type === "error";
}

export function getWSUri() {
    return getBaseUri().replace("http", "ws");
}
