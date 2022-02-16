export const defaultWaitInterval = 500

export type RecaptchaLoadStrategy = {
    type: "wait",
    interval?: number,
    maxIterations?: number,
} | {
    type: "loaded-or-throw",
}


export interface RecaptchaCallbacks {
    // Called when captcha expires.
    // Causes token to be lost.
    onExpired?: () => void,

    // Called when recaptcha encouters some error.
    // It causes token reset.
    onError?: () => void,

    // Called when internal recaptcha component gets rendered/starts working.
    // It causes token reset.
    onRender?: () => void,

    // called when received token changes, sets empty string when captcha expires, has error or is rerendered.
    onTokenChanged?: (token: string) => void,
}

export const defaultLoadStrategy: RecaptchaLoadStrategy = {
    type: "wait",
    interval: 500,
}
