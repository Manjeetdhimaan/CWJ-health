import { status } from "./status";

export function successAction(data: any, message = "OK", success = true) {
    return { statusCode: status.SUCCESS, data, message, success };
}

export function failAction(message: string = 'Server error', statusCode: number = status.FAILURE) {
    return { statusCode, message, success: false };
}
