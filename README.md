# Cookie Consent
This is an internationalized Cookie Consent component for vue 3.
## Component properties
```typescript
export interface Props {
    categories: Array<Category>;
    requiredLinks: RequiredLinksProps;
    links?: Array<Link>;
    useMetaCookie?: boolean;
    animationDuration?: string;
    minimizeAnimationDuration?: string;
    hideDuration?: string;
}
```
## Additional interfaces
```typescript
export interface Category {
  id: string;
  label: string;
  description?: string;
  cookies?: Array<Cookie>;
}
export interface RequiredLinksProps {
  privacy: Link;
  impress: Link;
}
export interface Link {
    title: string;
    href: string;
}
export interface Cookie {
    id: string;
    name: string;
    purpose: string;
    provider?: string;
    cookieName?: string;
    cookieValidityPeriod?: string;
    onAccepted?: Function;
    onDenied?: Function;
    privacyURL?: string;
    links?: Array<Link>;
    hosts?: string;
}
```
## Use component
Import the CSS Style Declarations with 
``` javascript
import '@avensio/cookie-consent/style.css'
```
and then the component with
```javascript
import CookieConsent from '@avensio/cookie-consent'
```
now it's possible to use this component in another vue component.
## Language Codes (ISO-639-1)
The language codes are listed in [IANA Subtag Registry](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry) (see also [IANA Protocols (Language Tags)](https://www.iana.org/protocols) and taken from [Wikipedia | List of ISO-639-1 codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).

Every translation block of this Cookie-Consent is named after the appropriate [ISO-639-1](https://en.wikipedia.org/wiki/ISO_639-1) code.

* Arabic ar
* Bulgarian bg
* Czech cs
* Danish da
* German de
* Greek el
* English en
* Spanish es
* Estonian et
* Finnish fi
* French fr
* Indian (Hindi) hi
* Croatian hr
* Hungarian hu
* Armenian hy
* Italian it
* Luxembourgian lb
* Lithuanian lt
* Latvian lv
* Dutch nl
* Norwegian no
* Polish pl
* Portuguese pt
* Romanian ro
* Russian ru
* Slovakian sk
* Slovenian sl
* Albanian sq
* Swedish sv
* Turkish tk
* Ukrainian uk
* Chinese zh

In sum 32 languages are supported, mostly from the EU and some others like arabic, indian, russian and chinese.

The source language for the translations is German. All translations were made with [google translate](https://translate.google.com/) and [deepl](https://www.deepl.com). For some translations also [Leo](https://dict.leo.org) was used.
