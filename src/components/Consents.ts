import {Category} from "../interfaces/CookieConsentProps";
import {Consent, Cookie} from "../interfaces/Consent";

declare global {
    interface Window {
        Consents: any
    }
}

export default function (metaCookie: Cookie, useMetaCookie: boolean, storagePrefix: string, storageConsentsKey: string, categories: Array<Category>, consents: Array<Consent>) {
    function loadConsentsWrapper() {
        const allIds = []

        for (let i = 1; categories != undefined && i < categories.length; i++) {
            const res = []

            if ('cookies' in categories[i]) {
                // @ts-ignore
                for (let j = 0; j < categories[i].cookies.length; j++) {
                    const {cookies} = categories[i];


                    allIds.push({
                        categoryId: categories[i].id,
                        cookieId: cookies[j].id
                    })

                    consents[i].cookies[j].accepted =
                      localStorage.getItem(`${storagePrefix}-${categories[i].id}-${cookies[j].id}`) === 'true'
                    res.push(consents[i].cookies[j].accepted)
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
        categories: categories,
        consents: consents,
        set(categoryId: number, cookieId: number, value: boolean) {
            const containsId = this.ids.find((id:any) => id.categoryId === categoryId && id.cookieId === cookieId)

            if (containsId) {
                localStorage.setItem(`${this.storagePrefix}-${categoryId}-${cookieId}`, `${value}`)

                loadConsentsWrapper()

                if (document.cookie.indexOf(this.storageConsentsKey) > -1) {
                    const d = new Date()
                    d.setFullYear(d.getFullYear() + 1)

                    const consents = JSON.parse(document.cookie.substr(document.cookie.indexOf(this.storageConsentsKey) + 9, document.cookie.indexOf(';') - 9))
                    consents[`${this.storagePrefix}-${categoryId}-${cookieId}`] = value
                    document.cookie = `${this.storagePrefix}=${JSON.stringify(consents)};expires=${d};samesite=Lax;path=/;secure=true`
                }
            } else {
                console.log(`id: ${this.storagePrefix}-${categoryId}-${cookieId} doesn't exist. See Consents.ids or localStorage`)
            }
        },
        get(categoryId: number, cookieId: number) {
            const value = localStorage.getItem(`${this.storagePrefix}-${categoryId}-${cookieId}`)
            if (typeof value === 'string')
                return value === 'true'
            return false
        },
        hasAccepted() {
            return this.storageConsentsKey in localStorage
        },
        clear() {
            for (const key in localStorage) {
                if (key.startsWith(this.storagePrefix) || key.startsWith(this.storageConsentsKey)) {
                    localStorage.removeItem(key)
                }
            }
            for (let i=0; i < this.categories.length; i++) {
                for (let j=0; j < this.categories[i].cookies.length; j++) {
                    if ('onDenied' in this.categories[i].cookies[j]) this.categories[i].cookies[j].onDenied()
                    if (i > 0) {
                        this.consents[i].cookies[j].accepted = false
                        this.consents[i].accepted = false
                        this.consents[i].partial = false
                    }
                }
            }
        }
    }
}
