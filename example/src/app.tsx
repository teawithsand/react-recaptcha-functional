import React, { useState } from 'react'
import { render } from 'react-dom'
import { RecaptchaV2, RecaptchaV2Size, RecaptchaV2Theme } from 'react-recaptcha-functional'

const App = () => {
    const [events, setEvents] = useState<string[]>([])
    const addEvent = (e: string) => {
        setEvents([
            ...events,
            e,
        ])
    }

    const [theme, setTheme] = useState<RecaptchaV2Theme>("light")
    const [size, setSize] = useState<RecaptchaV2Size>("normal")

    return <div>
        <div>
            {
                <RecaptchaV2
                    // see https://developers.google.com/recaptcha/docs/faq
                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    theme={theme}
                    size={size}
                    onRender={() => addEvent("On render")}
                    onExpired={() => addEvent("On expired")}
                    onError={() => addEvent("On error")}
                    onTokenChanged={(e) => addEvent("On token changed: " + e)}
                />
            }
        </div>
        <div>
            <div>
                <button onClick={() => {
                    if (theme === "dark") {
                        setTheme("light")
                    } else {
                        setTheme("dark")
                    }
                }}>
                    Switch theme
                </button>
            </div>
            <div>
                <button onClick={() => {
                    if (size === "compact") {
                        setSize("normal")
                    } else {
                        setSize("compact")
                    }
                }}>
                    Switch size
                </button>
            </div>
        </div>
        <div>
            <h1>Event log</h1>
            <ul>
                {events.map((v, i) => <li key={i}>
                    {v}
                </li>)}
            </ul>
        </div>
    </div>
}

const renderApp = () => {
    const root = document.createElement("div")
    root.id = "root"
    document.body.appendChild(root)

    // crappy way to do this, but for this example should do
    const recaptcha = document.createElement('script')
    recaptcha.setAttribute('src', 'https://www.google.com/recaptcha/api.js?render=explicit')
    document.head.appendChild(recaptcha)

    const rootById = document.getElementById("root")

    render(<App />, rootById)
}


window.addEventListener("DOMContentLoaded", () => {
    renderApp()
})

