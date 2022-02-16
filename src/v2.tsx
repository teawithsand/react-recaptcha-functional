import React, { useEffect, useRef } from "react"
import { defaultLoadStrategy, RecaptchaCallbacks, RecaptchaLoadStrategy } from "./defines"
import { getRecaptcha } from "./local"


export const defaultRecaptchaV2Theme: RecaptchaV2Theme = "light"
export type RecaptchaV2Theme = "light" | "dark"

export const defaultRecaptchaV2Size: RecaptchaV2Size = "normal"
export type RecaptchaV2Size = "normal" | "compact"

/**
 * Note: changing theme or sitekey or size causes recaptcha widget to reset and lose user's token if one was set.
 * Note 2: changes of loadStrategy are ignored until component is rerendered. Changing these does not cause rerender.
 */
export function RecaptchaV2(
    props: {
        sitekey: string,

        theme?: RecaptchaV2Theme,
        size?: RecaptchaV2Size,
        tabIndex?: number,
        loadStrategy?: RecaptchaLoadStrategy,
    } & RecaptchaCallbacks
) {
    const { theme: rawTheme, sitekey, size: rawSize, tabIndex: rawTabIndex, loadStrategy: rawLoadStrategy } = props
    const size = rawSize ?? defaultRecaptchaV2Size
    const theme = rawTheme ?? defaultRecaptchaV2Theme
    const tabIndex = rawTabIndex ?? 0
    const loadStrategy = rawLoadStrategy ?? defaultLoadStrategy

    const divRef = useRef(null)

    const callbacksRef = useRef<RecaptchaCallbacks>()
    callbacksRef.current = props

    const renderedIdRef = useRef(null)

    // Note: order is not accidental, sitekey(which is considered to possibly be arbitrary string, must be last)
    // other strings must not contain "_" char
    const rerenderOnChange = [theme, size, tabIndex.toString(), sitekey]
    const rerenderKey = rerenderOnChange.join("_")

    const cleanupRecaptchaIfNeeded = () => {
        renderedIdRef.current = null
    }

    const renderRecaptchaIfNeeded = (options: {
        theme: string,
        sitekey: string,
        size: string,
        tabIndex: number,
    }) => {
        const { theme, sitekey, size, tabIndex } = options

        if (divRef.current && renderedIdRef.current === null) {
            const callbacks = callbacksRef.current
            if (callbacks.onRender)
                callbacks.onRender()

            if (callbacks.onTokenChanged)
                callbacks.onTokenChanged("")

            renderedIdRef.current = getRecaptcha().render(divRef.current, {
                sitekey: sitekey,
                theme: theme,
                size: size,
                tabindex: tabIndex,

                callback: (token: string) => {
                    const callbacks = callbacksRef.current
                    if (callbacks.onTokenChanged)
                        callbacks.onTokenChanged(token)
                },
                "expired-callback": () => {
                    const callbacks = callbacksRef.current
                    if (callbacks.onExpired)
                        callbacks.onExpired()

                    if (callbacks.onTokenChanged)
                        callbacks.onTokenChanged("")
                },
                "error-callback": () => {
                    const callbacks = callbacksRef.current
                    if (callbacks.onError)
                        callbacks.onError()

                    if (callbacks.onTokenChanged)
                        callbacks.onTokenChanged("")
                },
            })
        }
    }

    const loadIteration = useRef(0)

    useEffect(() => {
        let isClosed = false

        if (getRecaptcha() && getRecaptcha().render) {
            renderRecaptchaIfNeeded({
                theme,
                sitekey,
                size,
                tabIndex,
            })
            return () => {
                cleanupRecaptchaIfNeeded()
            }
        } else {
            if (loadStrategy.type === "loaded-or-throw") {
                throw new Error("Recaptcha script is not loaded")
            } else if (loadStrategy.type === "wait") {
                let interval = null
                interval = setInterval(() => {
                    if (isClosed) {
                        return
                    }

                    if (loadStrategy.type !== "wait" ||
                        (loadStrategy.maxIterations !== undefined && loadIteration.current > loadStrategy.maxIterations)
                    ) {
                        throw new Error("Waited for too lond for recaptcha js to load; throwing")
                    }

                    if (getRecaptcha() && getRecaptcha().render) {
                        if (interval !== null) {
                            clearInterval(interval)
                            interval = null
                        }

                        renderRecaptchaIfNeeded({
                            theme,
                            sitekey,
                            size,
                            tabIndex,
                        })
                    }

                    loadIteration.current += 1
                }, loadStrategy.interval ?? 500)

                return () => {
                    isClosed = true

                    if (interval !== null) {
                        clearInterval(interval)
                        interval = null
                    }

                    // in case it was rendered
                    cleanupRecaptchaIfNeeded()
                }
            }
        }

    },
        rerenderOnChange
    )

    return <div ref={divRef} key={rerenderKey}></div>
}