<template>
  <div id="cookie-consent">
    <div class="settings-icon-container" @click="maximize($event)" :title="t('generalLabels.title')">
      <span class="settings-icon" />
    </div>
    <div id="overlay" v-if="showConsent"
         class="animate-top w-full h-full bg-gray-600 bg-opacity-40 fixed top-0 left-0"
         :class="{ 'hidden': isMinimized, 'blur-overlay-reverse': blurOverlayReverse }">
      <div id="container" :dir="locale === 'ar' ? 'rtl' : 'ltr'"
           class="transform-gpu rounded py-2 px-4 text-center bg-white relative w-[var(--cookie-consent-width)] h-[var(--cookie-consent-height)] overflow-x-hidden overflow-y-auto mx-auto my-[8vh] sm:my-[25vh]">
        <div id="cookie-consent-opacity-container">
          <div v-if="isMainContainerVisible">
            <header>
              <div class="relative z-10">
                <span class="cookie-consent-info font-bold" :title="t('generalLabels.info.title')" @click="toggleInfo" style="font-family: 'Verdana'">i</span>
                <div class="rounded w-full h-max bg-blue-200 absolute top-[26px] left-0" :class="{ 'cookie-consent-info-hide': !isInfoOpen }">
                  <span class="absolute arrow-up top-[-4px] left-[5px]"></span>
                  <p class="text-[13px] px-2 text-left my-1 mx-0" style="line-height: 1.2">{{ t('generalLabels.info.text') }}</p>
                </div>
              </div>
              <a rel="nofollow" href="#" class="minimizer" @click="minimize($event)"
                 :title="t('generalLabels.minimize')"></a>
              <a rel="nofollow" href="#" class="clear-site" @click="clearSite($event)"
                 :title="t('generalLabels.clearSite')"></a>
              <div class="inline-flex h-[45px] mt-4">
                <span class="select-none text-[36px]">&#127850;</span>
                <h4 class="select-none font-bold mt-[10px]">{{ t('generalLabels.title') }}</h4>
              </div>
              <hr class="mt-5 mb-2 mx-0 rounded-b-2xl"/>
              <p>{{ t('generalLabels.description.main') }}</p>
              <hr class="mt-2 mb-3.5 rounded-t-2xl"/>
            </header>

            <div class="categories">
              <div v-for="(category, index) in categories" class="relative ml-4 inline-flex" :key="category.id">
                <div class="relative w-[20px] h-[20px] flex checkbox-container">

                  <input :id="`cookie-consent-checkbox-${category.id}`" type="checkbox"
                         :checked="consents[index].accepted" :disabled="index === 0"
                         @change="setCategoryConsent($event, index)" class="m-0" />
                  <span v-if="index > 0 && consents[index].partial" class="checkbox-partial-indicator"></span>
                  <span v-if="index > 0 && !consents[index].partial && !consents[index].accepted" class="checkbox-none-indicator"></span>
                </div>
                <label :for="`cookie-consent-checkbox-${category.id}`" class="ml-2 rtl:mr-2 select-none hover:text-orange-400 -translate-y-[2px]">{{ category.label }}</label>

              </div>

              <div>
                <button class="btn" @click="acceptAll()">{{ t('generalLabels.button.acceptAll') }}</button>
                <button class="btn" @click="acceptSelection()">{{ t('generalLabels.button.acceptSelection') }}</button>
              </div>
            </div>

            <div id="link-container" class="bg-white rounded-t-lg sticky pb-3 -bottom-2">
              <div class="my-[6px] rounded-lg">
                <a rel="nofollow" href="#" @click="showDetails($event)" class="font-bold shadow-green-700 hover:shadow-[0_0_10px_green] text-[var(--cookie-consent-settings-color)] w-full h-full p-0.5 block">{{
                    t('generalLabels.individualSettings')
                  }}</a>
              </div>
              <a class="hover:text-orange-400" rel="nofollow" href="#" @click="showDetails($event)"><b>{{ t('generalLabels.cookieDetails') }}</b></a>
              <a rel="nofollow" :href="t('generalLabels.requiredLinks.privacy.href')"><b>{{
                  t('generalLabels.requiredLinks.privacy.title')
                }}</b></a>
              <a rel="nofollow" :href="t('generalLabels.requiredLinks.impress.href')"><b>{{
                  t('generalLabels.requiredLinks.impress.title')
                }}</b></a>
              <a rel="nofollow" v-for="link in links" :key="link.title" :href="link.href"><b>{{ link.title }}</b></a>
            </div>
          </div>

          <div v-else id="details-container" class="text-left">
            <header>
              <a rel="nofollow" href="#" class="absolute top-[6px] right-10 font-bold"
                 @click="showMain($event)">{{ t('generalLabels.details.back') }}</a>
              <a rel="nofollow" href="#" class="minimizer" @click="minimize($event)"
                 :title="t('generalLabels.minimize')"><span>-</span></a>
              <div class="inline-flex h-[45px] mt-4">
                <span class="select-none text-[36px]">&#127850;</span>
                <h4 class="select-none font-bold mt-[10px]">{{ t('generalLabels.title') }}</h4>
              </div>
              <hr class="my-2 mx-0 rounded-b-2xl"/>
              <p class="text-center">{{ t('generalLabels.description.details') }}</p>
              <hr class="mt-2 mb-3.5 rounded-t-2xl"/>
              <div>
                <button @click="acceptAll()">{{ t('generalLabels.button.acceptAll') }}</button>
                <button @click="acceptSelection()">{{ t('generalLabels.button.acceptSelection') }}</button>
              </div>
              <!--              <div>
                              <div class="w-full tab-container">
                                <div class="w-1/2 h-[45px] text-center inline-block cursor-pointer" :class="{ 'active-tab': currentTab === 'cookies' }" @click="currentTab = 'cookies'"><span>Cookies</span></div>
                                <div class="w-1/2 h-[45px] text-center inline-block cursor-pointer" :class="{ 'active-tab': currentTab === 'fonts' }" @click="currentTab = 'fonts'"><span>Fonts</span></div>
                              </div>
                              <hr class="mb-2 p-0 m-0 rounded-b-2xl hover:cursor-pointer"/>
                            </div>-->
            </header>

            <div v-for="(category, categoryIndex) in categories" class="cookie-details-card w-full rounded relative px-3 my-4 mx-2" :key="category.id"
                 :ref="el => { detailsCards[categoryIndex] = el }">
              <div class="rtl:right-auto rtl:left-0 inline-flex absolute right-0 top-0" v-if="categoryIndex > 0">
                <span class="select-none mt-[12px] rtl:mt-[6px]"
                      :class="{ 'hidden': !consents[categoryIndex].accepted }">{{
                    t('generalLabels.binarySliderLabels.accepted')
                  }}</span>
                <span class="select-none mt-[12px] rtl:mt-[6px]"
                      :class="{ 'hidden': consents[categoryIndex].accepted || consents[categoryIndex].partial }">{{
                    t('generalLabels.binarySliderLabels.declined')
                  }}</span>
                <span class="select-none mt-[12px] rtl:mt-[6px]"
                      :class="{ 'hidden': !consents[categoryIndex].partial }">{{
                    t('generalLabels.binarySliderLabels.partial')
                  }}</span>
                <div>
                  <div :id="`cookie-consent-details-checkbox-${category.id}`" class="binary-slider m-[8px]"
                       :class="{ active: consents[categoryIndex].accepted, partial: consents[categoryIndex].partial }"
                       @click="toggleConsent($event, categoryIndex)">
                    <span class="binary-slider-circle"></span>
                  </div>
                </div>
              </div>
              <div class="label-container pt-4">
                <h5 class="mt-2 mb-1 ltr:before:content-[''] ltr:before:border-2 ltr:before:border-solid ltr:before:border-black ltr:before:mr-4 rtl:border-r-4 rtl:border-solid rtl:border-black rtl:text-right rtl:pr-2 font-bold">{{ category.label }} ({{ getCookieCountForCategory(category) }})</h5>
              </div>

              <p>{{ category.description }}</p>
              <a rel="nofollow" href="#" class="text-center block font-bold"
                 @click="toggleCookieInformation($event)">{{ t('generalLabels.showCookieInformation') }}</a>

              <div class="table-container h-0 transition-all duration-700 overflow-hidden">
                <table v-for="(cookie, cookieIndex) in category.cookies" :key="cookie.cookieName">
                  <tr v-if="categoryIndex > 0">
                    <td>{{ t('cookieLabels.accept') }}</td>
                    <td>
                      <div class="table-binary-slider-container">
                        <div class="binary-slider" @click="toggleConsent($event, categoryIndex, cookieIndex)"
                             :class="{ active: consents[categoryIndex].cookies[cookieIndex].accepted }">
                          <span class="binary-slider-circle"></span>
                        </div>
                        <div class="select-none mt-0 ml-2 rtl:mr-2 rtl:-mt-[8px]"
                             :class="{ '!hidden': !consents[categoryIndex].cookies[cookieIndex].accepted }">
                          {{ t('generalLabels.binarySliderLabels.accepted') }}
                        </div>
                        <div class="select-none mt-0 ml-2 rtl:mr-2 rtl:-mt-[8px]"
                             :class="{ '!hidden': consents[categoryIndex].cookies[cookieIndex].accepted }">
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
                    <td v-else style="white-space: pre-line">{{ cookie.purpose }}</td>
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
import {nextTick, onBeforeMount, onMounted, reactive, ref, toRefs, withDefaults} from 'vue'
import type {Category, Cookie, Props} from '../interfaces/CookieConsentProps'
import {Consent} from '../interfaces/Consent'
import Consents from './Consents'
import {useI18n} from 'vue-i18n'

const { t, locale } = useI18n()

// Data
const consents: Array<Consent> = reactive([])
const isMainContainerVisible = ref(true)
const isMinimized = ref(false)
const showConsent = ref(false)
const blurOverlayReverse = ref(false)
const detailsCards = ref([])
const isInfoOpen = ref(false)
const currentTab = ref('cookies')

// Props
const props = withDefaults(defineProps<Props>(), {
  useMetaCookie: false,
  animationDuration: '1.5s',
  minimizeAnimationDuration: '1s',
  hideDuration: '1s',
  storagePrefix: 'consent',
  storageConsentsKey: 'consents'
})

const {
  useMetaCookie,
  animationDuration,
  minimizeAnimationDuration,
  hideDuration,
  categories,
  requiredLinks,
  links,
  storagePrefix,
  storageConsentsKey
} = toRefs(props)

const metaCookie = ref<Cookie>({
  id: t('metaCookieTitles.id'),
  name: t('metaCookieTitles.name'),
  provider: t('metaCookieTitles.provider'),
  purpose: t('metaCookieTitles.purpose'),
  cookieName: storageConsentsKey.value,
  cookieValidityPeriod: t('metaCookieTitles.cookieValidityPeriod'),
})

if (!(storageConsentsKey.value in localStorage)) showConsent.value = true

// lifecycle hooks
onBeforeMount(() => {
  // @ts-ignore
  Consents(metaCookie.value, useMetaCookie.value, storagePrefix.value, storageConsentsKey.value, categories.value, consents)

  document.documentElement.style.setProperty('--cookie-consent-animation-duration', animationDuration.value)
  document.documentElement.style.setProperty('--cookie-consent-minimize-animation-duration', minimizeAnimationDuration.value)
  document.documentElement.style.setProperty('--cookie-consent-hide-duration', hideDuration.value)
})

onMounted(() => {})

// Functions

function getCookieCountForCategory(category: Category) {
  const count = category.cookies && Array.isArray(category.cookies) ? category.cookies.length : 0
  return count.toLocaleString(locale.value)
}

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

function toggleInfo() {
  isInfoOpen.value = !isInfoOpen.value
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
        obj[key] = true

        if ('onAccepted' in cookie && typeof cookie.onAccepted === 'function') {
          cookie.onAccepted()
        }
      } else {
        obj[key] = false

        if ('onDenied' in cookie && typeof cookie.onDenied === 'function') {
          cookie.onDenied()
        }
      }
    }
  }

  localStorage.setItem(storageConsentsKey.value, JSON.stringify(obj))

  if (useMetaCookie.value)
    setMetaCookie(obj)
}

function setMetaCookie(obj: {[key: string]: boolean}) {
  const expireDate = new Date()
  expireDate.setFullYear(expireDate.getFullYear() + 1)
  document.cookie = `${t('metaCookieTitles.cookieName')}=${JSON.stringify(obj)};samesite=Lax;secure=true;expires=${expireDate}`
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

      if (currentHeight === 0) {
        if (tables.length > 1) {
          height -= 4 * (tables.length - 1)
        }
        // @ts-ignore
        for (const table of tables) {
          height += table.offsetHeight + 7
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
    consents[categoryIndex].partial = res.includes(true);

    consents[categoryIndex].accepted = false
    consents[categoryIndex].cookies[cookieIndex].accepted = false

  } else {
    const binarySliders = cookieDetailsCard.querySelectorAll('.table-container .binary-slider')

    consents[categoryIndex].cookies[cookieIndex].accepted = true

    // Ist die Rückgabe vom anfänglichen Umschalten true, dann prüfen, ob alle anderen Schalter aktiviert sind.
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

<style>
  :root {
    --border-color: darkgray;
    --cookie-consent-animation-duration: 1s;
    --cookie-consent-transition-duration: 0.4s;
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
  @import '/src/assets/css/index.css';
  @import "/src/assets/css/all.css";

  .tab-container .active-tab {
    border-bottom: 3px solid var(--border-color);
    color: orange;
  }
  .tab-container .active-tab span {
    display: inline-block;
    height: 1rem;
    vertical-align: middle;
    font-weight: 600;
  }

  .tab-container div span {
    display: inline-block;
    vertical-align: middle;
    padding-top: 0.5rem;
    height: 1rem;
  }

  hr {
    border: 2px solid var(--border-color);
  }

  p {
    user-select: none;
  }

  #overlay {
    perspective: 400px;
  }

  #container {
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.2), 0 4px 20px 0 rgba(0, 0, 0, 0.19);
    transform: translateZ(0);
    perspective: 1000px;
    backface-visibility: hidden;
  }

  .cookie-details-card > a {
    margin-bottom: 8px;
  }

  #link-container > a::before {
    content: '__';
    font-size: 0.9rem;
    color: white;
    background: url('../assets/img/link.svg') no-repeat;
  }

  #link-container > a:not(:last-child)::after {
    content: ' | ';
    font-weight: bold;
    font-size: 20px;
    color: #333333;
  }

  #link-container a {
    text-decoration: none;
  }

  #link-container > div > a {
    color: var(--cookie-consent-settings-color);
  }

  #link-container > div {
    border: 1px solid var(--cookie-consent-settings-color);
    border-left: 6px solid var(--cookie-consent-settings-color);
    border-right: 6px solid var(--cookie-consent-settings-color);
  }

  header > div h4, header > div h5 {
    padding-inline-start: 8px;
  }

  .cookie-details-card {
    box-shadow: 0 0 6px gray;
  }
  .cookie-details-card:hover {
    box-shadow: 0 0 0 gray;
  }

  .cookie-details-card {
    background: rgba(45, 45, 45, 0.08);
  }

  .btn {
    width: 100%;
  }
  #details-container > header button {
    margin-left: 10px;
  }
</style>

<i18n>
{
  "da": {
    "generalLabels": {
      "title": "Privatlivsindstillinger",
      "details": {
        "back": "Tilbage"
      },
      "description": {
        "details": "Her finder du en oversigt over alle de cookies, der anvendes. Du kan acceptere individuelle kategorier eller individuelle cookies og kan få vist yderligere oplysninger om de enkelte cookies.",
        "main": "Vi bruger cookies på vores websted til væsentlige formål samt til statistiske og markedsføringsmæssige formål. Eksterne medier kan også bruge cookies."
      },
      "minimize": "Minimer",
      "clearSite": "Slet data",
      "button": {
        "acceptAll": "Accepter alle",
        "acceptSelection": "Accepter valg"
      },
      "binarySliderLabels": {
        "accepted": "Accepteret",
        "declined": "Afvist",
        "partial": "Delvist accepteret"
      },
      "showCookieInformation": "Vis oplysninger om cookies",
      "cookieDetails": "Cookie-detaljer",
      "individualSettings": "individuelle indstillinger",
      "requiredLinks": {
        "privacy": {
          "title": "Privatlivspolitik",
          "href": "/privatlivspolotik"
        },
        "impress": {
          "title": "Impressum",
          "href": "/impressum"
        }
      }
    },
    "cookieLabels": {
      "accept": "Accepter",
      "name": "Navn",
      "provider": "Udbyder",
      "purpose": "Formål",
      "privacy": "Privatlivspolitik",
      "hosts": "Vært",
      "cookieName": "Cookie navn",
      "cookieValidityPeriod": "Cookie køretid",
      "links": "Links"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Samtykke til cookies",
      "provider": "Webstedsoperatør",
      "purpose": "Gemmer samtykke og afvisning af individuelle cookies",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 Year"
    }
  },
  "de": {
    "generalLabels": {
      "title": "Datenschutzeinstellungen",
      "details": {
        "back": "Zurück"
      },
      "description": {
        "details": "Hier findest Du eine Übersicht über alle verwendeten Cookies. Du kannst zu einzelnen Kategorien oder einzelnen Cookies zustimmen und kannst Dir weitere Informationen zu den einzelnen Cookies anzeigen lassen.",
        "main": "Wir nutzen Cookies auf unserer Webseite für essenzielle Zwecke, sowie für statistische und Marketingzwecke. Auch externe Medien können Cookies verwenden."
      },
      "minimize": "Minimieren",
      "clearSite": "Daten löschen",
      "info": {
        "title": "Legende",
        "text": "✓ = Alle Cookies dieser Kategorie akzeptiert\n▣ = Einige Cookies dieser Kategorie akzeptiert\n- = Keine Cookies dieser Kategorie akzeptiert"
      },
      "button": {
        "acceptAll": "Alle Akzeptieren",
        "acceptSelection": "Auswahl Speichern"
      },
      "binarySliderLabels": {
        "accepted": "Akzeptiert",
        "declined": "Abgelehnt",
        "partial": "Teilweise akzeptiert"
      },
      "showCookieInformation": "Cookie-Information anzeigen",
      "cookieDetails": "Cookie-Details",
      "individualSettings": "Individuelle Datenschutzeinstellungen",
      "requiredLinks": {
        "privacy": {
          "title": "Datenschutz",
          "href": "/datenschutz"
        },
        "impress": {
          "title": "Impressum",
          "href": "/impressum"
        }
      }
    },
    "cookieLabels": {
      "accept": "Akzeptieren",
      "name": "Name",
      "provider": "Anbieter",
      "purpose": "Zweck",
      "privacy": "Datenschutzerklärung",
      "hosts": "Host",
      "cookieName": "Cookie Name",
      "cookieValidityPeriod": "Cookie Gültigkeit",
      "links": "Links"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Cookie-Zustimmungen",
      "provider": "Eigentümer der Webseite",
      "purpose": "Speichert die Zustimmungen bzw. Ablehnungen zu den einzelnen Cookies.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 Jahr"
    }
  },
  "en": {
    "generalLabels": {
      "title": "Privacy Settings",
      "details": {
        "back": "Back"
      },
      "description": {
        "details": "Here you find an overview from all used cookies of this site. You can agree with some categories or cookies and also let you see further Information about individual cookies.",
        "main": "We use cookies on our website for essential purposes, as well as for statistical and marketing purposes. External media may also use cookies."
      },
      "minimize": "Minimize",
      "clearSite": "Delete data",
      "button": {
        "acceptAll": "Accept All",
        "acceptSelection": "Accept Selection"
      },
      "binarySliderLabels": {
        "accepted": "Accepted",
        "declined": "Denied",
        "partial": "Partially accepted"
      },
      "showCookieInformation": "Show Cookie-Information",
      "cookieDetails": "Cookie-Details",
      "individualSettings": "Individual Settings",
      "requiredLinks": {
        "privacy": {
          "title": "Privacy",
          "href": "/privacy"
        },
        "impress": {
          "title": "Imprint",
          "href": "/imprint"
        }
      }
    },
    "cookieLabels": {
      "accept": "Accept",
      "name": "Name",
      "provider": "Provider",
      "purpose": "Purpose",
      "privacy": "Privacy Notice",
      "hosts": "Host",
      "cookieName": "Cookie Name",
      "cookieValidityPeriod": "Cookie Validity",
      "links": "Links"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Cookie-Consent",
      "provider": "Provider of the website",
      "purpose": "Stores the consent or refusal of individual cookies",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 Year"
    }
  },
  "es": {
    "generalLabels": {
      "title": "Configuración de la privacidad",
      "details": {
        "back": "Volver"
      },
      "description": {
        "details": "Aquí encontrará un resumen de todas las cookies utilizadas. Puede aceptar categorías individuales o cookies individuales y hacer que se muestre más información sobre las cookies individuales.",
        "main": "Utilizamos cookies en nuestro sitio web para fines esenciales, así como para fines estadísticos y de marketing. Los medios de comunicación externos también pueden utilizar cookies."
      },
      "minimize": "Minimizar",
      "clearSite": "Borrar datos",
      "button": {
        "acceptAll": "Aceptar todo",
        "acceptSelection": "Guardar selección"
      },
      "binarySliderLabels": {
        "accepted": "Aceptado",
        "declined": "Rechazado",
        "partial": "Aceptado parcialmente"
      },
      "showCookieInformation": "Mostrar información sobre las cookies",
      "cookieDetails": "Detalles de las cookies",
      "individualSettings": "Configuración individual de la privacidad",
      "requiredLinks": {
        "privacy": {
          "title": "Protección de datos",
          "href": "/proteccion-de-datos"
        },
        "impress": {
          "title": "Pie de imprenta",
          "href": "/pie-de-imprenta"
        }
      }
    },
    "cookieLabels": {
      "accept": "Aceptar",
      "name": "Nombre",
      "provider": "Proveedor",
      "purpose": "Propósito",
      "privacy": "Política de privacidad",
      "hosts": "Host",
      "cookieName": "Nombre de la cookie",
      "cookieValidityPeriod": "Validez de las cookies",
      "links": "Enlaces"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Acuerdo sobre cookies",
      "provider": "Propietario del sitio web",
      "purpose": "Guarda las aprobaciones o rechazos de las cookies individuales.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 año"
    }
  },
  "fr": {
    "generalLabels": {
      "title": "Paramètres de confidentialité",
      "details": {
        "back": "Dos"
      },
      "description": {
        "details": "Vous trouverez ici un aperçu de tous les cookies utilisés. Vous pouvez accepter des catégories individuelles ou des cookies individuels et obtenir des informations supplémentaires sur les cookies individuels.",
        "main": "Nous utilisons des cookies sur notre site web à des fins essentielles, ainsi qu'à des fins statistiques et de marketing. Les médias externes peuvent également utiliser des cookies."
      },
      "minimize": "Minimoi",
      "clearSite": "Supprimer les données",
      "button": {
        "acceptAll": "Accepter tous",
        "acceptSelection": "Sauvegarder la sélection"
      },
      "binarySliderLabels": {
        "accepted": "Accepté",
        "declined": "Rejeté",
        "partial": "Partiellement accepté"
      },
      "showCookieInformation": "Afficher les informations sur les cookies",
      "cookieDetails": "Détails des cookies",
      "individualSettings": "Paramètres de confidentialité individuels",
      "requiredLinks": {
        "privacy": {
          "title": "Protection des données",
          "href": "/protection-des-donnees"
        },
        "impress": {
          "title": "Impression",
          "href": "/impression"
        }
      }
    },
    "cookieLabels": {
      "accept": "Accepter",
      "name": "Nom",
      "provider": "Prestataire",
      "purpose": "Objectif",
      "privacy": "Politique de confidentialité",
      "hosts": "Host",
      "cookieName": "Nom du cookie",
      "cookieValidityPeriod": "Validité du cookie",
      "links": "Liens"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Accord sur les cookies",
      "provider": "Propriétaire du site web",
      "purpose": "Sauvegarde les approbations ou les rejets pour les cookies individuels.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 an"
    }
  },
  "it": {
    "generalLabels": {
      "title": "Impostazioni della privacy",
      "details": {
        "back": "Indietro"
      },
      "description": {
        "details": "Qui troverete una panoramica di tutti i cookie utilizzati. È possibile acconsentire a singole categorie o a singoli cookie e far visualizzare ulteriori informazioni sui singoli cookie.",
        "main": "Utilizziamo i cookie sul nostro sito web per scopi essenziali, così come per scopi statistici e di marketing. Anche i media esterni possono utilizzare i cookie."
      },
      "minimize": "Minimizzare",
      "clearSite": "Cancellare i dati",
      "button": {
        "acceptAll": "Accetta tutti",
        "acceptSelection": "Salva la selezione"
      },
      "binarySliderLabels": {
        "accepted": "Accettato",
        "declined": "Rifiutato",
        "partial": "Parzialmente accettato"
      },
      "showCookieInformation": "Mostra informazioni sui cookie",
      "cookieDetails": "Dettagli dei cookie",
      "individualSettings": "Impostazioni di privacy individuali",
      "requiredLinks": {
        "privacy": {
          "title": "Protezione dei dati",
          "href": "/protezione-dei-dati"
        },
        "impress": {
          "title": "Impronta",
          "href": "/impronta"
        }
      }
    },
    "cookieLabels": {
      "accept": "Accettare",
      "name": "Nome",
      "provider": "Fornitore",
      "purpose": "Scopo",
      "privacy": "Politica sulla privacy",
      "hosts": "Host",
      "cookieName": "Nome del cookie",
      "cookieValidityPeriod": "Validità dei cookie",
      "links": "Links"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Accordo sui cookie",
      "provider": "Proprietario del sito web",
      "purpose": "Salva le approvazioni o i rifiuti per i singoli cookie..",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 anno"
    }
  },
  "nl": {
    "generalLabels": {
      "title": "Privacy-instellingen",
      "details": {
        "back": "Terug"
      },
      "description": {
        "details": "Hier vindt u een overzicht van alle gebruikte cookies. U kunt instemmen met afzonderlijke categorieën of afzonderlijke cookies en u kunt nadere informatie over de afzonderlijke cookies laten weergeven.",
        "main": "Wij gebruiken cookies op onze website voor essentiële doeleinden, alsmede voor statistische en marketingdoeleinden. Externe media kunnen ook cookies gebruiken."
      },
      "minimize": "Minimaliseer",
      "clearSite": "Gegevens wissen",
      "button": {
        "acceptAll": "Accepteer alle",
        "acceptSelection": "Selectie opslaan"
      },
      "binarySliderLabels": {
        "accepted": "Geaccepteerd",
        "declined": "Afgewezen",
        "partial": "Gedeeltelijk aanvaard"
      },
      "showCookieInformation": "Toon cookie-informatie",
      "cookieDetails": "Cookie-Details",
      "individualSettings": "Individuele privacy-instellingen",
      "requiredLinks": {
        "privacy": {
          "title": "Privacybeleid",
          "href": "/privacy"
        },
        "impress": {
          "title": "Afdruk",
          "href": "/afdruk"
        }
      }
    },
    "cookieLabels": {
      "accept": "Accepteren",
      "name": "Naam",
      "provider": "Aanbieder",
      "purpose": "Doel",
      "privacy": "Privacybeleid",
      "hosts": "Host",
      "cookieName": "Cookie Naam",
      "cookieValidityPeriod": "Geldigheid cookie",
      "links": "Links"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Cookie-overeenkomst",
      "provider": "Website eigenaar",
      "purpose": "Slaat de goedkeuringen of afkeuringen voor de individuele cookies op.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 jaar"
    }
  },
  "pl": {
    "generalLabels": {
      "title": "Ustawienia prywatności",
      "details": {
        "back": "Powrót"
      },
      "description": {
        "details": "Tutaj znajdziesz przegląd wszystkich używanych plików cookie. Mogą Państwo wyrazić zgodę na poszczególne kategorie lub poszczególne pliki cookie i uzyskać dalsze informacje na temat poszczególnych plików cookie.",
        "main": "Używamy plików cookies na naszej stronie internetowej w celach niezbędnych, statystycznych i marketingowych. Zewnętrzne media mogą również używać plików cookie."
      },
      "minimize": "Zminimalizuj",
      "clearSite": "Usuń dane",
      "button": {
        "acceptAll": "Przyjmij wszystkie",
        "acceptSelection": "Zapisz wybór"
      },
      "binarySliderLabels": {
        "accepted": "Zaakceptowany",
        "declined": "Odrzucony",
        "partial": "Częściowo przyjęty"
      },
      "showCookieInformation": "Pokaż informacje o plikach cookie",
      "cookieDetails": "Szczegóły dotyczące plików cookie",
      "individualSettings": "Indywidualne ustawienia prywatności",
      "requiredLinks": {
        "privacy": {
          "title": "Ochrona danych",
          "href": "/ochrona-danych"
        },
        "impress": {
          "title": "Nadruk",
          "href": "/nadruk"
        }
      }
    },
    "cookieLabels": {
      "accept": "Przyjmij",
      "name": "Nazwa",
      "provider": "Dostawca",
      "purpose": "Przeznaczenie",
      "privacy": "Polityka prywatności",
      "hosts": "Host",
      "cookieName": "Nazwa pliku cookie",
      "cookieValidityPeriod": "Ważność plików cookie",
      "links": "Linki"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Umowa dotycząca plików cookie",
      "provider": "Właściciel strony internetowej",
      "purpose": "Zapisuje zatwierdzenia lub odrzucenia dla poszczególnych plików cookie.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 rok"
    }
  }
}
</i18n>
