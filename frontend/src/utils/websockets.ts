import { getBaseUri } from "./utils";

export function isWSMessageError(message: MessageEvent<any>) {
    return JSON.parse(message.data).type === "error";
}

export function getWSUri() {
    return getBaseUri().replace("http", "ws");
}

export const WSErrorCodes = {
    4000: "Bad Request",
    4001: "Unauthorized",
    4004: "Not Found",
};
