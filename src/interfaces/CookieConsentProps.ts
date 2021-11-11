export interface Link {
    title: string,
    href?: string
}

export interface Cookie {
    id: string,
    name: string,
    purpose: string,
    provider?: string,
    cookieName?: string,
    cookieValidityPeriod?: string,
    onDenied?: Function
}

export interface Category {
    id: string,
    label: string,
    description?: string,
    cookies?: Array<Cookie>
}

export interface BinarySliderLabels {
    accepted: string,
    declined: string,
    partial: string
}

export interface RequiredLinksProps {
    privacy: Link,
    impress: Link
}

export interface CookieLabelsProps {
    accept: string,
    name: string,
    provider: string,
    purpose: string,
    privacy: string,
    hosts: string,
    cookieName: string,
    cookieValidityPeriod: string,
    links: string
}

export interface Button {
    acceptAll: string,
    acceptSelection: string
}

export interface Description {
    main: string,
    details: string
}

export interface GeneralLabelsProps {
    title: string,
    back: string,
    minimize: string,
    binarySliderLabels: BinarySliderLabels,
    button: Button,
    description: Description
    showCookieInformation: 'Cookie-Information anzeigen',
    cookieDetails: 'Cookie-Details',
    individuellSettings: 'Individuelle Datenschutzeinstellungen'
}

export interface Props {
    categories: Array<Category>,
    requiredLinks: RequiredLinksProps,
    links?: Array<Link>,
    cookieLabels?: CookieLabelsProps,
    generalLabels?: GeneralLabelsProps,
    useMetaCookie?: boolean,
    metaCookieTitles?: Cookie,
    locale?: string,

    animationDuration?: string,
    minimizeAnimationDuration?: string,
    hideDuration?: string
}
export default Props
