export interface Link {
    title: string,
    href: string
}

export interface Cookie {
    id: string,
    name: string,
    purpose: string,
    provider?: string,
    cookieName?: string,
    cookieValidityPeriod?: string,
    onAccepted?: Function,
    onDenied?: Function,
    privacyURL?: string,
    links?: Array<Link>,
    hosts?: string
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
    showCookieInformation: string,
    cookieDetails: string,
    individuellSettings: string
}

export interface Props {
    categories: Array<Category>,
    requiredLinks: RequiredLinksProps,
    links?: Array<Link>,
    generalLabels?: GeneralLabelsProps,
    cookieLabels?: CookieLabelsProps,
    useMetaCookie?: boolean,
    metaCookieTitles?: Cookie,

    animationDuration?: string,
    minimizeAnimationDuration?: string,
    hideDuration?: string
}
export default Props
