<template>
  <div id="cookie-consent">
    <div id="settings-symbol" @click="maximize($event)" :title="t('generalLabels.title')">
      <span>&#9881;</span>
    </div>
    <div v-if="showConsent" id="overlay" class="av-animate-top" :class="{ 'cookie-consent-hidden': isMinimized, 'blur-overlay-reverse': blurOverlayReverse }">
      <div id="container" class="av-card-4 av-round av-padding av-center av-white">
        <div id="cookie-consent-opacity-container">
          <div v-if="isMainContainerVisible">
            <header>
              <a rel="nofollow" href="#" class="minimizer" @click="minimize($event)"
                 :title="t('generalLabels.minimize')"></a>
              <a rel="nofollow" href="#" class="clear-site" @click="clearSite($event)"
                 :title="t('generalLabels.clearSite')"></a>
              <div class="heading">
                <span>&#127850;</span>
                <h4>{{ t('generalLabels.title') }}</h4>
              </div>
              <hr class="first-hr"/>
              <p>{{ t('generalLabels.description.main') }}</p>
              <hr class="second-hr-main"/>
            </header>

            <div class="content">
              <div v-for="(category, index) in categories" class="checkbox-container row" :key="category.id">
                <input :id="`cookie-consent-checkbox-${category.id}`" type="checkbox"
                       :checked="consents[index].accepted" :disabled="index === 0"
                       @change="setCategoryConsent($event, index)" class="col"/>
                <label :for="`cookie-consent-checkbox-${category.id}`" class="col">{{ category.label }}</label>
                <span v-if="index > 0 && consents[index].partial" class="checkbox-partial-indicator"></span>
                <span v-if="index > 0 && !consents[index].partial && !consents[index].accepted "
                      class="checkbox-none-indicator"></span>
              </div>

              <div>
                <button @click="acceptAll()">{{ t('generalLabels.button.acceptAll') }}</button>
                <button @click="acceptSelection()">{{ t('generalLabels.button.acceptSelection') }}</button>
              </div>
            </div>

            <div id="link-container" class="av-white">
              <div>
                <a rel="nofollow" href="#" @click="showDetails($event)"><b>{{
                    t('generalLabels.individualSettings')
                  }}</b></a>
              </div>
              <a rel="nofollow" href="#" @click="showDetails($event)"><b>{{ t('generalLabels.cookieDetails') }}</b></a>
              <a rel="nofollow" :href="t('generalLabels.requiredLinks.privacy.href')">{{
                  t('generalLabels.requiredLinks.privacy.title')
                }}</a>
              <a rel="nofollow" :href="t('generalLabels.requiredLinks.impress.href')">{{
                  t('generalLabels.requiredLinks.impress.title')
                }}</a>
              <a rel="nofollow" v-for="link in links" :key="link.title" :href="link.href">{{ link.title }}</a>
            </div>
          </div>

          <div v-else id="details-container">
            <header>
              <a rel="nofollow" href="#" class="back-to-main"
                 @click="showMain($event)">{{ t('generalLabels.details.back') }}</a>
              <a rel="nofollow" href="#" class="minimizer" @click="minimize($event)"
                 :title="t('generalLabels.minimize')"><span>-</span></a>
              <div class="heading">
                <span>&#127850;</span>
                <h4>{{ t('generalLabels.title') }}</h4>
              </div>
              <hr class="first-hr"/>
              <p class="av-center">{{ t('generalLabels.description.details') }}</p>
              <hr class="second-hr-details"/>
              <div>
                <button @click="acceptAll()">{{ t('generalLabels.button.acceptAll') }}</button>
                <button @click="acceptSelection()">{{ t('generalLabels.button.acceptSelection') }}</button>
              </div>
            </header>

            <div v-for="(category, categoryIndex) in categories" class="cookie-details-card" :key="category.id"
                 :ref="el => { detailsCards[categoryIndex] = el }">
              <div class="binary-slider-label-container" v-if="categoryIndex > 0">
                <span class="binary-slider-label binary-slider-label-margin accepted"
                      :class="{ 'av-hide': !consents[categoryIndex].accepted }">{{
                    t('generalLabels.binarySliderLabels.accepted')
                  }}</span>
                <span class="binary-slider-label binary-slider-label-margin declined"
                      :class="{ 'av-hide': consents[categoryIndex].accepted || consents[categoryIndex].partial }">{{
                    t('generalLabels.binarySliderLabels.declined')
                  }}</span>
                <span class="binary-slider-label binary-slider-label-margin partial"
                      :class="{ 'av-hide': !consents[categoryIndex].partial }">{{
                    t('generalLabels.binarySliderLabels.partial')
                  }}</span>
                <div>
                  <div :id="`cookie-consent-details-checkbox-${category.id}`" class="binary-slider margin-small"
                       :class="{ active: consents[categoryIndex].accepted, partial: consents[categoryIndex].partial }"
                       @click="toggleConsent($event, categoryIndex)">
                    <span class="binary-slider-circle"></span>
                  </div>
                </div>
              </div>
              <div class="label-container">
                <h5 class="padding-top">{{ category.label }} ({{ category.cookies ? category.cookies.length : 0 }})</h5>
                <div></div>
              </div>

              <p>{{ category.description }}</p>
              <a rel="nofollow" href="#" class="av-center av-block"
                 @click="toggleCookieInformation($event)">{{ t('generalLabels.showCookieInformation') }}</a>

              <div class="table-container">
                <table v-for="(cookie, cookieIndex) in category.cookies" :key="cookie.cookieName">
                  <tr v-if="categoryIndex > 0">
                    <td>{{ t('cookieLabels.accept') }}</td>
                    <td>
                      <div class="table-binary-slider-container">
                        <div class="binary-slider" @click="toggleConsent($event, categoryIndex, cookieIndex)"
                             :class="{ active: consents[categoryIndex].cookies[cookieIndex].accepted }">
                          <span class="binary-slider-circle"></span>
                        </div>
                        <div class="binary-slider-label binary-slider-label-small-margin"
                             :class="{ 'av-hide': !consents[categoryIndex].cookies[cookieIndex].accepted }">
                          {{ t('generalLabels.binarySliderLabels.accepted') }}
                        </div>
                        <div class="binary-slider-label binary-slider-label-small-margin"
                             :class="{ 'av-hide': consents[categoryIndex].cookies[cookieIndex].accepted }">
                          {{ t('generalLabels.binarySliderLabels.declined') }}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ t('cookieLabels.name') }}</td>
                    <td v-if="categoryIndex === 0 && cookieIndex === 0">{{ t('metaCookieTitles.name') }}</td>
                    <td v-else>{{ cookie.name }}</td>
                  </tr>
                  <tr>
                    <td>{{ t('cookieLabels.provider') }}</td>
                    <td v-if="categoryIndex === 0 && cookieIndex === 0">{{ t('metaCookieTitles.provider') }}</td>
                    <td v-else>{{ cookie.provider }}</td>
                  </tr>
                  <tr>
                    <td>{{ t('cookieLabels.purpose') }}</td>
                    <td v-if="categoryIndex === 0 && cookieIndex === 0">{{ t('metaCookieTitles.purpose') }}</td>
                    <td v-else>{{ cookie.purpose }}</td>
                  </tr>
                  <tr v-if="'privacyURL' in cookie">
                    <td>{{ t('cookieLabels.privacy') }}</td>
                    <td><a rel="nofollow" :href="cookie.privacyURL">{{ cookie.privacyURL }}</a></td>
                  </tr>
                  <tr v-if="'hosts' in cookie">
                    <td>{{ t('cookieLabels.hosts') }}</td>
                    <td v-if="categoryIndex === 0 && cookieIndex === 0">{{ t('metaCookieTitles.hosts') }}</td>
                    <td v-else>{{ cookie.hosts }}</td>
                  </tr>
                  <tr v-if="'cookieName' in cookie">
                    <td>{{ t('cookieLabels.cookieName') }}</td>
                    <td v-if="categoryIndex === 0 && cookieIndex === 0">{{ t('metaCookieTitles.cookieName') }}</td>
                    <td v-else><i>{{ cookie.cookieName }}</i></td>
                  </tr>
                  <tr v-if="'cookieValidityPeriod' in cookie">
                    <td>{{ t('cookieLabels.cookieValidityPeriod') }}</td>
                    <td v-if="categoryIndex === 0 && cookieIndex === 0">{{
                        t('metaCookieTitles.cookieValidityPeriod')
                      }}
                    </td>
                    <td v-else>{{ cookie.cookieValidityPeriod }}</td>
                  </tr>
                  <tr v-if="'links' in cookie && cookie.links && cookie.links.length > 0">
                    <td>{{ t('cookieLabels.links') }}</td>
                    <td><a rel="nofollow" v-for="link in cookie.links" :key="link.title" :href="link.href"
                           target="_blank">{{ link.title || link.href }}</a></td>
                  </tr>
                </table>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onBeforeMount, onMounted, ref, reactive, toRefs, withDefaults, nextTick, Ref} from 'vue'
  import type { Props, Cookie } from '../interfaces/CookieConsentProps'
  import Consents from './Consents'
  import { useI18n } from 'vue-i18n'
  import { Consent } from '../interfaces/Consent'

  const { t } = useI18n()

  // Data
  const consents: Array<Consent> = reactive([])
  const storagePrefix = ref('consent')
  const storageConsentsKey = ref('consents')
  const isMainContainerVisible = ref(true)
  const isMinimized = ref(false)
  const showConsent = ref(false)
  const blurOverlayReverse = ref(false)
  const detailsCards = ref([])

  // Props
  const props = withDefaults(defineProps<Props>(), {
    useMetaCookie: false,
    metaCookieTitles: {
      // @ts-ignore
      id: 'meta-cookie',
      name: 'Cookie-Zustimmungen',
      provider: 'Eigentümer der Webseite',
      purpose: 'Speichert die Zustimmungen bzw. Ablehnungen zu den einzelnen Kategorien, sowie einzelnen Cookies.',
      cookieName: 'consents',
      cookieValidityPeriod: '1 Jahr'
    },
    animationDuration: '1.5s',
    minimizeAnimationDuration: '1s',
    hideDuration: '1s',
    generalLabels: {
      // @ts-ignore
      title: 'Datenschutzeinstellungen',
      back: 'Zurück',
      minimize: 'Minimieren',
      binarySliderLabels: {
        accepted: 'Akzeptiert',
        declined: 'Abgelehnt',
        partial: 'Teilweise akzeptiert'
      },
      button: {
        acceptAll: 'Alle Akzeptieren',
        acceptSelection: 'Auswahl Speichern'
      },
      description: {
        main: 'Wir nutzen Cookies auf unserer Webseite für essenzielle Zwecke, sowie für statistische und Marketingzwecke. Auch externe Medien können Cookies verwenden.',
        details: 'Hier findest Du eine Übersicht über alle verwendeten Cookies. Du kannst zu einzelnen Kategorien oder einzelnen Cookies zustimmen und kannst Dir weitere Informationen zu den einzelnen Cookies anzeigen lassen.'
      },
      showCookieInformation: 'Cookie-Information anzeigen',
      cookieDetails: 'Cookie-Details',
      individuellSettings: 'Individuelle Datenschutzeinstellungen'
    },
    cookieLabels: {
      // @ts-ignore
      accept: 'Akzeptieren',
      name: 'Name',
      provider: 'Anbieter',
      purpose: 'Zweck',
      privacy: 'Datenschutzerklärung',
      hosts: 'Host',
      cookieName: 'Cookie Name',
      cookieValidityPeriod: 'Cookie Laufzeit',
      links: 'Links'
    }
  })

  const {
    useMetaCookie,
    animationDuration,
    minimizeAnimationDuration,
    hideDuration,
    cookieLabels,
    generalLabels,
    metaCookieTitles,
    categories,
    requiredLinks,
    links
  } = toRefs(props)

  if (!(storageConsentsKey.value in localStorage)) showConsent.value = true

  // @ts-ignore
  Consents(metaCookieTitles.value, useMetaCookie.value, storagePrefix.value, storageConsentsKey.value, categories.value, consents)

  // lifecycle hooks
  onBeforeMount(() => {
    document.documentElement.style.setProperty('--cookie-consent-animation-duration', animationDuration!.value!)
    document.documentElement.style.setProperty('--cookie-consent-minimize-animation-duration', minimizeAnimationDuration!.value!)
    document.documentElement.style.setProperty('--cookie-consent-hide-duration', hideDuration!.value!)
  })

  onMounted(() => {})

  // Functions

  function setTransformToWidthAndHeight() {
    let currentWidth, currentHeight

    if (isMainContainerVisible.value) {
      currentWidth = getComputedStyle(document.documentElement).getPropertyValue('--cookie-consent-width')
      currentHeight = getComputedStyle(document.documentElement).getPropertyValue('--cookie-consent-height')
    } else {
      currentWidth = getComputedStyle(document.documentElement).getPropertyValue('--cookie-consent-details-width')
      currentHeight = getComputedStyle(document.documentElement).getPropertyValue('--cookie-consent-details-height')
    }

    document.documentElement.style.setProperty('--transform-current-width', currentWidth)
    document.documentElement.style.setProperty('--transform-current-height', currentHeight)
  }

  function setTransformToXY(container: HTMLElement) {
    let offsetLeft, containerWidth
    let offsetTop = window.innerHeight / 4

    if (isMainContainerVisible.value) {
      containerWidth = +getComputedStyle(document.documentElement).getPropertyValue('--cookie-consent-width').replace('px', '')
    } else {
      containerWidth = +getComputedStyle(document.documentElement).getPropertyValue('--cookie-consent-details-width').replace('px', '')
    }
    offsetLeft = (window.innerWidth / 2) - (containerWidth / 2)
    // Ohne diese Zeile funktioniert im Firefox die Minimierungsanimation nicht mehr immer... Warum auch immer..
    // Auch nicht wenn der Parameter ganz entfernt wird! -.-
    offsetTop = container.offsetTop || offsetTop

    const x = window.innerWidth - offsetLeft - 45 - (containerWidth / 2);
    const y = window.innerHeight - offsetTop - 60;

    document.documentElement.style.setProperty('--transform-minimize-x', `${x}px`)
    document.documentElement.style.setProperty('--transform-minimize-y', `${y}px`)
  }

  function setCategoryConsent(event: Event, index: number) {
    consents[index].partial = false
    consents[index].accepted = (<HTMLInputElement> event.target).checked

    for (let i = 0; i < consents[index].cookies.length; i++) {
      consents[index].cookies[i].accepted = (<HTMLInputElement> event.target).checked
    }
  }

  function maximize(event: Event) {
    event.preventDefault()

    setTransformToWidthAndHeight()
    showConsent.value = true

    nextTick(() => {
      const overlay = <HTMLElement> document.getElementById('overlay')
      const container = <HTMLElement> document.getElementById('container')

      setTransformToXY(container)

      overlay.classList.remove('blur-overlay')

      isMinimized.value = false
      blurOverlayReverse.value = true

      container.classList.add('maximize')
    })
  }

  function clearSite(event: Event) {
    event.preventDefault()
    window.Consents.clear()
  }

  function minimize(event: Event) {
    event.preventDefault()

    setTransformToWidthAndHeight()

    const container = <HTMLElement> document.getElementById('container')
    const overlay = <HTMLElement> document.getElementById('overlay')

    overlay.classList.remove('blur-overlay-reverse')
    container.classList.remove('transform-to-details')
    container.classList.remove('transform-to-main')
    container.classList.remove('maximize')

    setTransformToXY(container)

    overlay.classList.add('blur-overlay')
    container.classList.add('minimize')

    const animationDuration = getComputedStyle(document.documentElement).getPropertyValue('--cookie-consent-minimize-animation-duration')

    setTimeout(() => {
      showConsent.value = false
      isMinimized.value = true
    }, ((+animationDuration.replace('s', '')) * 1000) - 50)
  }

  function hideConsent() {
    setTransformToWidthAndHeight()

    const container = <HTMLElement> document.getElementById('container')
    const overlay = <HTMLElement> document.getElementById('overlay')
    overlay.classList.remove('blur-overlay-reverse')

    setTransformToXY(container)

    overlay.classList.add('blur-overlay')
    container.classList.add('hide-consent')

    const animationDuration = getComputedStyle(document.documentElement).getPropertyValue('--cookie-consent-hide-duration')

    setTimeout(() => {
      showConsent.value = false
      overlay.classList.remove('blur-overlay')
      container.classList.remove('hide-consent')
    }, ((+animationDuration.replace('s', '')) * 1000) - 50)
  }

  function showMain(event: Event) {
    event.preventDefault()

    const container = <HTMLElement> document.getElementById('container')
    const opacityContainer = <HTMLElement> document.getElementById('cookie-consent-opacity-container')

    opacityContainer.classList.remove('transform-opacity-to-details')
    opacityContainer.classList.add('transform-opacity-to-main')
    container.classList.remove('transform-to-details')
    container.classList.remove('maximize')
    container.classList.add('transform-to-main')

    const animationDuration = getComputedStyle(document.documentElement).getPropertyValue('--cookie-consent-animation-duration')

    setTimeout(() => {
      isMainContainerVisible.value = true
    }, ((+animationDuration.replace('s', '')) / 2) * 1000)
  }

  function showDetails(event: Event) {
    event.preventDefault()

    const container = <HTMLElement> document.getElementById('container')
    const opacityContainer = <HTMLElement> document.getElementById('cookie-consent-opacity-container')

    opacityContainer.classList.remove('transform-opacity-to-main')
    opacityContainer.classList.add('transform-opacity-to-details')
    container.classList.remove('transform-to-main')
    container.classList.remove('maximize')
    container.classList.add('transform-to-details')

    const animationDuration = getComputedStyle(document.documentElement).getPropertyValue('--cookie-consent-animation-duration')

    setTimeout(() => {
      isMainContainerVisible.value = false
    }, ((+animationDuration.replace('s', '')) / 2) * 1000)
  }

  function acceptSelection() {
    hideConsent()

    const obj: {[key: string]: boolean} = {}

    for (let i = 1; i < consents.length; i++) {
      for (let j = 0; j < consents[i].cookies.length; j++) {
        const cookieConsent = consents[i].cookies[j]
        // @ts-ignore
        const cookie: Cookie = categories.value[i].cookies[j]
        // @ts-ignore
        const key = `${storagePrefix.value}-${categories.value[i].id}-${cookie.id}`

        if (cookieConsent.accepted) {
          localStorage.setItem(key, 'true')
          obj[key] = true

          if ('onAccepted' in cookie && cookie.onAccepted) {
            cookie.onAccepted()
          }
        } else {
          localStorage.setItem(key, 'false')
          obj[key] = false

          if ('onDenied' in cookie && cookie.onDenied) {
            cookie.onDenied()
          }
        }
      }
    }

    localStorage.setItem(storageConsentsKey.value, JSON.stringify(obj))

    if (useMetaCookie!.value)
      setMetaCookie(obj)
  }

  function setMetaCookie(obj: {[key: string]: boolean}) {
    const expireDate = new Date()
    expireDate.setFullYear(expireDate.getFullYear() + 1)
    document.cookie = `${metaCookieTitles!.value!.cookieName}=${JSON.stringify(obj)};samesite=Lax;secure=true;expires=${expireDate}`
  }

  function acceptAll() {
    hideConsent()

    for (const consent of consents) {
      consent.accepted = true
      consent.partial = false

      for (const cookieConsent of consent.cookies) {
        cookieConsent.accepted = true
      }
    }

    const obj: {[key: string]: boolean} = {}

    for (let i = 1; i < categories.value.length; i++) {
      // @ts-ignore
      for (let j = 0; j < categories.value[i].cookies.length; j++) {
        // @ts-ignore
        const cookie = categories.value[i].cookies[j]
        // @ts-ignore
        const key = `${storagePrefix.value}-${categories.value[i].id}-${cookie.id}`
        localStorage.setItem(key, 'true')
        obj[key] = true

        if ('onAccepted' in cookie && typeof cookie.onAccepted === 'function') {
          cookie.onAccepted()
        }
      }
    }

    localStorage.setItem(storageConsentsKey.value, JSON.stringify(obj))
    if (useMetaCookie!.value)
      setMetaCookie(obj)
  }

  function toggleCookieInformation(event: Event) {
    event.preventDefault()
    const parent = (<HTMLElement> event.target).parentElement

    if (parent) {
      const tableContainer = <HTMLElement> parent.querySelector('.table-container')

      if (tableContainer) {
        const tables = tableContainer.querySelectorAll('table')
        const currentHeight = +tableContainer.style.height.replace('px', '')
        let height = 0

        // @ts-ignore
        for (const table of tables) {
          height += table.offsetHeight
          height += 7
        }

        if (currentHeight === 0) {
          if (tables.length > 1) {
            height -= 4 * (tables.length - 1)
          }
          tableContainer.style.height = `${height}px`
        } else {
          tableContainer.style.height = '0'
        }
      }
    }
  }

  function toggleConsent(event: Event, categoryIndex: number, cookieIndex?: number) {
    // @ts-ignore
    const added = event.target.classList.toggle('active')

    // when no cookie index is available, a category was toggled
    if (cookieIndex === undefined) {
      if (added) {
        consents[categoryIndex].partial = false
        consents[categoryIndex].accepted = true

        for (let i = 0; i < consents[categoryIndex].cookies.length; i++) {
          consents[categoryIndex].cookies[i].accepted = true
        }
      } else {
        consents[categoryIndex].partial = false
        consents[categoryIndex].accepted = false

        for (let i = 0; i < consents[categoryIndex].cookies.length; i++) {
          consents[categoryIndex].cookies[i].accepted = false
        }
      }

      return
    }


    const cookieDetailsCard = <HTMLElement> detailsCards.value[categoryIndex]
    // when the return value from toggling is false, then also deactivate the category
    if (!added) {
      const binarySliders = cookieDetailsCard.querySelectorAll('.table-container .binary-slider')

      // Ist die Rückgabe vom anfänglichen Umschalten false, dann prüfen ob alle anderen Schalter deaktiviert sind
      const res = []
      // @ts-ignore
      for (const slider of binarySliders) {
        res.push(slider.classList.contains('active'))
      }

      // Sind alle anderen Cookies deaktiviert, dann auch die Kategorie deaktivieren
      if (!res.includes(true)) {
        consents[categoryIndex].partial = false
      } else {
        consents[categoryIndex].partial = true
      }

      consents[categoryIndex].accepted = false
      consents[categoryIndex].cookies[cookieIndex].accepted = false

    } else {
      const binarySliders = cookieDetailsCard.querySelectorAll('.table-container .binary-slider')

      consents[categoryIndex].cookies[cookieIndex].accepted = true

      // Ist die Rückgabe vom anfänglichen Umschalten true, dann prüfen ob alle anderen Schalter aktiviert sind.
      const res = []
      // @ts-ignore
      for (const slider of binarySliders) {
        res.push(slider.classList.contains('active'))
      }

      // Sind alle anderen Cookies aktiviert, dann auch die Kategorie aktivieren
      if (!res.includes(false)) {
        consents[categoryIndex].partial = false
        consents[categoryIndex].accepted = true
      } else {
        consents[categoryIndex].partial = true
      }
    }
  }
</script>

<!--<script>
export default {
  methods: {
    loadConsents() {
      const allIds = []

      for (let i = 1; i < this.categories.length; i++) {
        const res = []

        for (let j = 0; j < this.categories[i].cookies.length; j++) {
          allIds.push({
            categoryId: this.categories[i].id,
            cookieId: this.categories[i].cookies[j].id
          })

          if (`${this.storagePrefix}-${this.categories[i].id}-${this.categories[i].cookies[j].id}` in localStorage) {
            this.consents[i].cookies[j].accepted = localStorage.getItem(`${this.storagePrefix}-${this.categories[i].id}-${this.categories[i].cookies[j].id}`) === 'true'
            res.push(this.consents[i].cookies[j].accepted)
          } else
            res.push(false)
        }

        const containsTruthyValue = res.includes(true)
        const containsFalsyValue = res.includes(false)

        // Alle Cookies der Kategorie akzeptiert
        if (containsTruthyValue && !containsFalsyValue) {
          this.consents[i].accepted = true
        }
        // Einige Cookies der Kategorie akzeptiert
        else if (containsTruthyValue && containsFalsyValue)
          this.consents[i].partial = true
      }

      return allIds
    },
  }
}
</script>-->

<style>
  :root {
    --cookie-consent-animation-duration: 1s;
    --cookie-consent-minimize-animation-duration: 1s;
    --cookie-consent-hide-duration: 1s;
    --cookie-consent-width: 350px;
    --cookie-consent-height: 450px;
    --cookie-consent-details-width: 600px;
    --cookie-consent-details-height: 450px;
    --cookie-consent-settings-color: green;
    --cookie-consent-minimizer-hover-color: dodgerblue;
  }

  @media all and (max-width: 600px) {
    :root {
      --cookie-consent-details-width: 350px;
    }
  }
</style>

<style scoped>
  @import "/src/assets/css/all.css";

  * {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    box-sizing: border-box;
    transition: 0.4s;
    z-index: 0;
    outline: none;
  }

  #settings-symbol span {
    top: 4px;
    left: 0;
  }

  .cookie-consent-hidden {
    display: none;
  }

  #overlay {
    width: 100%;
    height: 100%;
    background: rgba(51, 51, 51, 0.4);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    perspective: 400px;
  }

  @media all and (max-width: 600px) {
    #container {
      border: 1px solid black;
      margin: 8vh auto !important;
    }
  }


  #container {
    position: relative;
    width: var(--cookie-consent-width);
    height: var(--cookie-consent-height);
    margin: 25vh auto;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .content button {
    width: 100%;
    margin: 6px 0;
  }

  .content .checkbox-container {
    display: inline-flex;
  }

  .content div label {
    margin-left: 6px;
    user-select: none;
  }


  .back-to-main {
    position: absolute;
    top: 9px;
    right: 32px;
  }

  #link-container {
    position: sticky;
    bottom: -8px;
    left: 0;
    right: 0;
    padding-bottom: 8px;
  }

  #link-container > a:not(:last-child)::after {
    content: ' | ';
    font-weight: bold;
    font-size: 20px;
    color: #333333;
  }

  #link-container a, #details-container a {
    color: dodgerblue;
    text-decoration: none;
  }

  #link-container > div > a {
    color: var(--cookie-consent-settings-color);
    width: 100%;
    height: 100%;
    display: block;
    padding: 2px;
  }

  #link-container > div {
    border: 1px solid var(--cookie-consent-settings-color);
    border-left: 6px solid var(--cookie-consent-settings-color);
    border-right: 6px solid var(--cookie-consent-settings-color);
    margin: 6px 0;
    border-radius: 6px;
  }


  #details-container button {
    margin: 6px 6px;
  }

  #details-container {
    text-align: left;
  }

  .cookie-details-card:hover {
    box-shadow: 0 0 6px gray;
  }

  .margin-small {
    margin: 8px;
  }

  .heading {
    display: inline-flex;
    height: 45px;
    margin-top: 12px;
  }

  .heading span:first-child {
    font-size: 36px;
    user-select: none;
  }

  .first-hr {
    margin: 8px 0;
    border-color: #9e9e9e !important;
  }

  .second-hr-main {
    margin-top: 8px;
    margin-bottom: 12px;
    border-color: #9e9e9e !important;
  }

  .second-hr-details {
    margin-top: 8px;
    margin-bottom: 6px;
    border-color: #9e9e9e !important;
  }


  .cookie-details-card {
    width: 100%;
    background: rgba(45, 45, 45, 0.08);
    border-radius: 4px;
    position: relative;
    padding: 0 8px;
    margin: 12px 4px;
  }

  .padding-top {
    padding-top: 14px !important;
    padding-left: 4px !important;
  }

  .cookie-details-card h5, .cookie-details-card p {
    padding: 0 8px;
    user-select: none;
  }

  .cookie-details-card h5 {
    padding-top: 4px;
  }
</style>
