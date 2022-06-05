import {Category, Cookie as CookieProp} from "../interfaces/CookieConsentProps";
import {Consent, Cookie} from "../interfaces/Consent";
// @ts-ignore
import {deleteCookie, readCookie, writeCookie} from '../assets/cookies.js'

declare global {
    interface Window {
        Consents: any
    }
}

export default function (metaCookie: Cookie, useMetaCookie: boolean, storagePrefix: string, storageConsentsKey: string, categories: Array<Category>, consents: Array<Consent>) {
    function loadConsentsWrapper() {
        const allIds = []
        let savedConsents = {}
        if (storageConsentsKey in localStorage) {
            // @ts-ignore
            savedConsents = JSON.parse(localStorage.getItem(storageConsentsKey))
        } else if (useMetaCookie) {
            savedConsents = readCookie(storageConsentsKey)
            if (Object.keys(savedConsents).length > 0)
                localStorage.setItem(storageConsentsKey, JSON.stringify(savedConsents))
        }

        for (let i = 1; categories != undefined && i < categories.length; i++) {
            const res = []

            if ('cookies' in categories[i]) {
                // @ts-ignore
                for (let j = 0; j < categories[i].cookies.length; j++) {
                    const {cookies} = categories[i];
                    if (!cookies) continue


                    allIds.push({
                        categoryId: categories[i].id,
                        cookieId: cookies[j].id
                    })

                    // @ts-ignore
                    consents[i].cookies[j].accepted = savedConsents[`${storagePrefix}-${categories[i].id}-${cookies[j].id}`] ?? false

                    res.push(consents[i].cookies[j].accepted)

                    if (consents[i].cookies[j].accepted && typeof cookies[j]?.onAccepted === 'function') {
                        // @ts-ignore
                        cookies[j].onAccepted()
                    }
                    if (!consents[i].cookies[j].accepted && typeof cookies[j]?.onDenied === 'function') {
                        // @ts-ignore
                        cookies[j].onDenied()
                    }
                }

                const containsTruthyValue = res.includes(true)
                const containsFalsyValue = res.includes(false)

                // accept all cookies of the category
                if (containsTruthyValue && !containsFalsyValue) {
                    consents[i].accepted = true
                }
                // accept some cookies of the category
                else if (containsTruthyValue && containsFalsyValue)
                    consents[i].partial = true
            }
        }

        return allIds
    }

    if (useMetaCookie) {
        const {cookies} = categories[0];
        if (cookies) { // @ts-ignore
            cookies.unshift(metaCookie)
        }
    }

    // initialise consents
    for (let i = 0; i < categories.length; i++) {
        const consent = {
            accepted: i === 0,
            partial: false,
            cookies: []
        }

        const {cookies} = categories[i];
        if (cookies) {
            for (let j = 0; j < cookies.length; j++) {
                // Accept all cookies of the first category
                // @ts-ignore
                consent.cookies.push({accepted: i === 0})
            }
            consents.push(consent)
        }
    }

    // load consents and receive all ids
    const ids = loadConsentsWrapper()

    window.Consents = {
        storagePrefix: storagePrefix,
        storageConsentsKey: storageConsentsKey,
        ids,
        /**
         * Accept or deny a cookie
         *
         * @param categoryId
         * @param cookieId
         * @param value
         */
        set(categoryId: number, cookieId: number, value: boolean) {
            const id = this.ids.find((id:any) => id.categoryId === categoryId && id.cookieId === cookieId)

            if (id) {
                const key = `${this.storagePrefix}-${categoryId}-${cookieId}`

                const savedConsents = JSON.parse(localStorage.getItem(this.storageConsentsKey) || '{}')
                if (key in savedConsents) {
                    savedConsents[key] = value

                    const category = categories.find((category:Category) => category.id === id.categoryId)
                    if (category && category.cookies) {
                        const cookie = category.cookies.find((cookie:CookieProp) => cookie.id === id.cookieId)

                        if (cookie && value && typeof cookie.onAccepted === 'function')
                            cookie.onAccepted()
                        if (cookie && !value && typeof cookie.onDenied === 'function')
                            cookie.onDenied()
                    }
                }

                localStorage.setItem(this.storageConsentsKey, JSON.stringify(savedConsents))

                if (useMetaCookie) {
                    const consents = readCookie(this.storageConsentsKey)
                    consents[`${this.storagePrefix}-${categoryId}-${cookieId}`] = value
                    writeCookie(consents)
                }
            } else {
                console.log(`id: ${this.storagePrefix}-${categoryId}-${cookieId} doesn't exist. See Consents.ids or localStorage`)
            }
        },
        /**
         * Obtain the current consent about a cookie
         *
         * @param categoryId
         * @param cookieId
         */
        get(categoryId: number, cookieId: number) {
            const value = localStorage.getItem(`${this.storagePrefix}-${categoryId}-${cookieId}`)
            if (value)
                return value === 'true'
        },
        /**
         * Did the user gave a consent or just minimized the Cookie Consent
         */
        get hasAccepted() {
            return this.storageConsentsKey in localStorage
        },
        /**
         * Clear the Consents
         */
        clear() {
            localStorage.removeItem(this.storageConsentsKey)
            deleteCookie()

            for (let i=0; i < categories.length; i++) {
                if (categories[i].cookies) {
                    for (let j=0; j < categories[i].cookies!.length; j++) {
                        if (typeof categories[i].cookies![j].onDenied === 'function') categories[i].cookies![j].onDenied!()
                        if (i > 0) {
                            consents[i].cookies[j].accepted = false
                            consents[i].accepted = false
                            consents[i].partial = false
                        }
                    }
                }
            }
        }
    }
}
