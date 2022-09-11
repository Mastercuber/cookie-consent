<template>
  <div id="cookie-consent">
    <div
      class="settings-icon-container"
      :title="t('generalLabels.title')"
      @click="maximize($event)"
    >
      <span class="settings-icon" />
    </div>
    <div
      v-if="showConsent"
      id="overlay"
      class="w-full h-full fixed top-0 left-0"
      :class="{ 'hidden': isMinimized, 'blur-overlay-reverse': blurOverlayReverse }"
    >
      <div
        id="container"
        :dir="locale === 'ar' ? 'rtl' : 'ltr'"
        class="rounded py-2 px-4 text-center bg-white relative w-[var(--cookie-consent-width)] h-[var(--cookie-consent-height)] overflow-x-hidden overflow-y-auto mx-auto my-[8vh] sm:my-[25vh]"
      >
        <div id="cookie-consent-opacity-container">
          <div v-if="isMainContainerVisible">
            <header>
              <div class="relative z-10">
                <span
                  class="cookie-consent-info font-bold"
                  :title="t('generalLabels.info.title')"
                  style="font-family: 'Verdana'"
                  @click="toggleInfo"
                >i</span>
                <div
                  class="rounded w-full h-max bg-blue-200 absolute top-[26px] left-0"
                  :class="{ 'cookie-consent-info-hide': !isInfoOpen }"
                >
                  <span class="absolute arrow-up top-[-4px] left-[5px]" />
                  <p
                    class="text-[13px] px-2 text-left my-1 mx-0"
                    style="line-height: 1.2"
                  >
                    {{ t('generalLabels.info.text') }}
                  </p>
                </div>
              </div>
              <a
                rel="nofollow"
                href="#"
                class="minimizer"
                :title="t('generalLabels.minimize')"
                @click="minimize($event)"
              />
              <a
                rel="nofollow"
                href="#"
                class="clear-site"
                :title="t('generalLabels.clearSite')"
                @click="clearSite($event)"
              />
              <div class="inline-flex h-[45px] mt-4">
                <span class="select-none text-[36px]">&#127850;</span>
                <h4 class="select-none font-bold mt-[10px]">
                  {{ t('generalLabels.title') }}
                </h4>
              </div>
              <hr class="mt-5 mb-2 mx-0 rounded-b-2xl">
              <p>{{ t('generalLabels.description.main') }}</p>
              <hr class="mt-2 mb-3.5 rounded-t-2xl">
            </header>

            <div class="categories">
              <div
                v-for="(category, index) in props.categories"
                :key="category.id"
                class="relative ml-4 inline-flex"
              >
                <div class="relative w-[20px] h-[20px] flex checkbox-container">
                  <input
                    :id="`cookie-consent-checkbox-${category.id}`"
                    type="checkbox"
                    :checked="consents[index].accepted"
                    :disabled="index === 0"
                    class="m-0"
                    @change="setCategoryConsent($event, index)"
                  >
                  <span
                    v-if="index > 0 && consents[index].partial"
                    class="checkbox-partial-indicator"
                  />
                  <span
                    v-if="index > 0 && !consents[index].partial && !consents[index].accepted"
                    class="checkbox-none-indicator"
                  />
                </div>
                <label
                  :for="`cookie-consent-checkbox-${category.id}`"
                  class="ml-2 rtl:mr-2 select-none hover:text-orange-400 -translate-y-[2px]"
                >{{ category.label }}</label>
              </div>

              <div>
                <button
                  class="btn"
                  @click="acceptAll()"
                >
                  {{ t('generalLabels.button.acceptAll') }}
                </button>
                <button
                  class="btn"
                  @click="acceptSelection()"
                >
                  {{ t('generalLabels.button.acceptSelection') }}
                </button>
              </div>
            </div>

            <div
              id="link-container"
              class="bg-white rounded-t-lg sticky pb-3 -bottom-2"
            >
              <div class="my-[6px] rounded-lg">
                <a
                  rel="nofollow"
                  href="#"
                  class="font-bold shadow-green-700 hover:shadow-[0_0_10px_green] text-[var(--cookie-consent-settings-color)] w-full h-full p-0.5 block"
                  @click="showDetails($event)"
                >{{
                  t('generalLabels.individualSettings')
                }}</a>
              </div>
              <a
                class="hover:text-orange-400"
                rel="nofollow"
                href="#"
                @click="showDetails($event)"
              ><b>{{ t('generalLabels.cookieDetails') }}</b></a>
              <a
                rel="nofollow"
                :href="t('generalLabels.requiredLinks.privacy.href')"
              ><b>{{
                t('generalLabels.requiredLinks.privacy.title')
              }}</b></a>
              <a
                rel="nofollow"
                :href="t('generalLabels.requiredLinks.impress.href')"
              ><b>{{
                t('generalLabels.requiredLinks.impress.title')
              }}</b></a>
              <a
                v-for="link in links"
                :key="link.title"
                rel="nofollow"
                :href="link.href"
              ><b>{{ link.title }}</b></a>
            </div>
          </div>

          <div
            v-else
            id="details-container"
            class="text-left"
          >
            <header>
              <a
                rel="nofollow"
                href="#"
                class="absolute top-[6px] right-10 font-bold"
                @click="showMain($event)"
              >{{ t('generalLabels.details.back') }}</a>
              <a
                rel="nofollow"
                href="#"
                class="minimizer"
                :title="t('generalLabels.minimize')"
                @click="minimize($event)"
              ><span>-</span></a>
              <div class="inline-flex h-[45px] mt-4">
                <span class="select-none text-[36px]">&#127850;</span>
                <h4 class="select-none font-bold mt-[10px]">
                  {{ t('generalLabels.title') }}
                </h4>
              </div>
              <hr class="my-2 mx-0 rounded-b-2xl">
              <p class="text-center">
                {{ t('generalLabels.description.details') }}
              </p>
              <hr class="mt-2 mb-3.5 rounded-t-2xl">
              <div>
                <button @click="acceptAll()">
                  {{ t('generalLabels.button.acceptAll') }}
                </button>
                <button @click="acceptSelection()">
                  {{ t('generalLabels.button.acceptSelection') }}
                </button>
              </div>
              <!--              <div>
                <div class="w-full tab-container">
                  <div class="w-1/2 h-[45px] text-center inline-block cursor-pointer" :class="{ 'active-tab': currentTab === 'cookies' }" @click="currentTab = 'cookies'"><span>Cookies</span></div>
                  <div class="w-1/2 h-[45px] text-center inline-block cursor-pointer" :class="{ 'active-tab': currentTab === 'fonts' }" @click="currentTab = 'fonts'"><span>Fonts</span></div>
                </div>
                <hr class="mb-2 p-0 m-0 rounded-b-2xl hover:cursor-pointer"/>
              </div>-->
            </header>

            <div
              v-for="(category, categoryIndex) in props.categories"
              :key="category.id"
              :ref="el => { detailsCards[categoryIndex] = el }"
              class="cookie-details-card w-full rounded relative px-3 my-4 mx-2"
            >
              <div
                v-if="categoryIndex > 0"
                class="rtl:right-auto rtl:left-0 inline-flex absolute right-0 top-0"
              >
                <span
                  class="select-none mt-[12px] rtl:mt-[6px]"
                  :class="{ 'hidden': !consents[categoryIndex].accepted }"
                >{{
                  t('generalLabels.binarySliderLabels.accepted')
                }}</span>
                <span
                  class="select-none mt-[12px] rtl:mt-[6px]"
                  :class="{ 'hidden': consents[categoryIndex].accepted || consents[categoryIndex].partial }"
                >{{
                  t('generalLabels.binarySliderLabels.declined')
                }}</span>
                <span
                  class="select-none mt-[12px] rtl:mt-[6px]"
                  :class="{ 'hidden': !consents[categoryIndex].partial }"
                >{{
                  t('generalLabels.binarySliderLabels.partial')
                }}</span>
                <div>
                  <div
                    :id="`cookie-consent-details-checkbox-${category.id}`"
                    class="binary-slider m-[8px]"
                    :class="{ active: consents[categoryIndex].accepted, partial: consents[categoryIndex].partial }"
                    @click="toggleConsent($event, categoryIndex)"
                  >
                    <span class="binary-slider-circle" />
                  </div>
                </div>
              </div>
              <div class="label-container pt-4">
                <h5 class="mt-2 mb-1 ltr:before:content-[''] ltr:before:border-2 ltr:before:border-solid ltr:before:border-black ltr:before:mr-4 rtl:border-r-4 rtl:border-solid rtl:border-black rtl:text-right rtl:pr-2 font-bold">
                  {{ category.label }} ({{ getCookieCountForCategory(category) }})
                </h5>
              </div>

              <p>{{ category.description }}</p>
              <a
                rel="nofollow"
                href="#"
                class="text-center block font-bold"
                @click="toggleCookieInformation($event)"
              >{{ t('generalLabels.showCookieInformation') }}</a>

              <div class="table-container h-0 transition-all duration-700 overflow-hidden">
                <table
                  v-for="(cookie, cookieIndex) in category.cookies"
                  :key="cookie.cookieName"
                >
                  <tr v-if="categoryIndex > 0">
                    <td>{{ t('cookieLabels.accept') }}</td>
                    <td>
                      <div class="table-binary-slider-container">
                        <div
                          class="binary-slider"
                          :class="{ 'active': consents[categoryIndex].cookies[cookieIndex].accepted }"
                          @click="toggleConsent($event, categoryIndex, cookieIndex)"
                        >
                          <span class="binary-slider-circle" />
                        </div>
                        <div
                          class="select-none mt-0 ml-2 rtl:mr-2 rtl:-mt-[8px]"
                          :class="{ '!hidden': !consents[categoryIndex].cookies[cookieIndex].accepted }"
                        >
                          {{ t('generalLabels.binarySliderLabels.accepted') }}
                        </div>
                        <div
                          class="select-none mt-0 ml-2 rtl:mr-2 rtl:-mt-[8px]"
                          :class="{ '!hidden': consents[categoryIndex].cookies[cookieIndex].accepted }"
                        >
                          {{ t('generalLabels.binarySliderLabels.declined') }}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ t('cookieLabels.name') }}</td>
                    <td v-if="categoryIndex === 0 && cookieIndex === 0">
                      {{ t('metaCookieTitles.name') }}
                    </td>
                    <td v-else>
                      {{ cookie.name }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ t('cookieLabels.provider') }}</td>
                    <td v-if="categoryIndex === 0 && cookieIndex === 0">
                      {{ t('metaCookieTitles.provider') }}
                    </td>
                    <td v-else>
                      {{ cookie.provider }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ t('cookieLabels.purpose') }}</td>
                    <td v-if="categoryIndex === 0 && cookieIndex === 0">
                      {{ t('metaCookieTitles.purpose') }}
                    </td>
                    <td
                      v-else
                      style="white-space: pre-line"
                    >
                      {{ cookie.purpose }}
                    </td>
                  </tr>
                  <tr v-if="'privacyURL' in cookie">
                    <td>{{ t('cookieLabels.privacy') }}</td>
                    <td>
                      <a
                        rel="nofollow"
                        :href="cookie.privacyURL"
                      >{{ cookie.privacyURL }}</a>
                    </td>
                  </tr>
                  <tr v-if="'hosts' in cookie">
                    <td>{{ t('cookieLabels.hosts') }}</td>
                    <td v-if="categoryIndex === 0 && cookieIndex === 0">
                      {{ t('metaCookieTitles.hosts') }}
                    </td>
                    <td v-else>
                      {{ cookie.hosts }}
                    </td>
                  </tr>
                  <tr v-if="'cookieName' in cookie">
                    <td>{{ t('cookieLabels.cookieName') }}</td>
                    <td v-if="categoryIndex === 0 && cookieIndex === 0">
                      {{ t('metaCookieTitles.cookieName') }}
                    </td>
                    <td v-else>
                      <i>{{ cookie.cookieName }}</i>
                    </td>
                  </tr>
                  <tr v-if="'cookieValidityPeriod' in cookie">
                    <td>{{ t('cookieLabels.cookieValidityPeriod') }}</td>
                    <td v-if="categoryIndex === 0 && cookieIndex === 0">
                      {{
                        t('metaCookieTitles.cookieValidityPeriod')
                      }}
                    </td>
                    <td v-else>
                      {{ cookie.cookieValidityPeriod }}
                    </td>
                  </tr>
                  <tr v-if="'links' in cookie && cookie.links && cookie.links.length > 0">
                    <td>{{ t('cookieLabels.links') }}</td>
                    <td>
                      <a
                        v-for="link in cookie.links"
                        :key="link.title"
                        rel="nofollow"
                        :href="link.href"
                        target="_blank"
                      >{{ link.title || link.href }}</a>
                    </td>
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
import {nextTick, onBeforeMount, onMounted, reactive, ref, unref, withDefaults} from 'vue'
import type { Category, Cookie, Props } from '../interfaces/CookieConsentProps'
import { Consent } from '../interfaces/Consent'
import Consents from './Consents'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// Data
const consents: Array<Consent> = reactive([])
const isMainContainerVisible = ref(true)
const isMinimized = ref(false)
const showConsent = ref(false)
const blurOverlayReverse = ref(false)
const detailsCards = ref([])
const isInfoOpen = ref(false)
/*const currentTab = ref('cookies')*/

// Props
const props = withDefaults(defineProps<Props>(), {
  useMetaCookie: false,
  animationDuration: '1.5s',
  minimizeAnimationDuration: '1s',
  hideDuration: '1s',
  storagePrefix: 'consent',
  storageConsentsKey: 'consents'
})

const metaCookie = ref<Cookie>({
  id: t('metaCookieTitles.id'),
  name: t('metaCookieTitles.name'),
  provider: t('metaCookieTitles.provider'),
  purpose: t('metaCookieTitles.purpose'),
  cookieName: props.storageConsentsKey,
  cookieValidityPeriod: t('metaCookieTitles.cookieValidityPeriod'),
})

if (!(props.storageConsentsKey in localStorage)) showConsent.value = true

// lifecycle hooks
onBeforeMount(() => {
  // @ts-ignore
  Consents(metaCookie.value, props.useMetaCookie, props.storagePrefix, props.storageConsentsKey, props.categories, consents)

  document.documentElement.style.setProperty('--cookie-consent-animation-duration', props.animationDuration)
  document.documentElement.style.setProperty('--cookie-consent-minimize-animation-duration', props.minimizeAnimationDuration)
  document.documentElement.style.setProperty('--cookie-consent-hide-duration', props.hideDuration)
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
  let containerWidth
  let offsetTop = window.innerHeight / 4

  if (isMainContainerVisible.value) {
    containerWidth = +getComputedStyle(document.documentElement).getPropertyValue('--cookie-consent-width').replace('px', '')
  } else {
    containerWidth = +getComputedStyle(document.documentElement).getPropertyValue('--cookie-consent-details-width').replace('px', '')
  }
  const offsetLeft = window.innerWidth / 2 - containerWidth / 2
  // Ohne diese Zeile funktioniert im Firefox die Minimierungsanimation nicht mehr immer... Warum auch immer..
  // Auch nicht wenn der Parameter ganz entfernt wird! -.-
  offsetTop = container.offsetTop || offsetTop

  const x = window.innerWidth - offsetLeft - 45 - containerWidth / 2
  const y = window.innerHeight - offsetTop - 60

  document.documentElement.style.setProperty('--transform-minimize-x', `${x}px`)
  document.documentElement.style.setProperty('--transform-minimize-y', `${y}px`)
}

function setCategoryConsent(event: Event, index: number) {
  consents[index].partial = false
  consents[index].accepted = <HTMLInputElement> event.target.checked

  for (let i = 0; i < consents[index].cookies.length; i++) {
    consents[index].cookies[i].accepted = <HTMLInputElement> event.target.checked
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
  }, +animationDuration.replace('s', '') * 1000 - 50)
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
  }, +animationDuration.replace('s', '') * 1000 - 50)
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
  }, +animationDuration.replace('s', '') / 2 * 1000)
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
  }, +animationDuration.replace('s', '') / 2 * 1000)
}

function acceptSelection() {
  hideConsent()

  const obj: {[key: string]: boolean} = {}

  for (let i = 1; i < consents.length; i++) {
    for (let j = 0; j < consents[i].cookies.length; j++) {
      const cookieConsent = consents[i].cookies[j]
      // @ts-ignore
      const cookie: Cookie = props.categories[i].cookies[j]
      // @ts-ignore
      const key = `${props.storagePrefix}-${props.categories[i].id}-${cookie.id}`

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

  localStorage.setItem(props.storageConsentsKey, JSON.stringify(obj))

  if (props.useMetaCookie) setMetaCookie(obj)
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

  for (let i = 1; i < props.categories.length; i++) {
    // @ts-ignore
    for (let j = 0; j < props.categories[i].cookies.length; j++) {
      // @ts-ignore
      const cookie = props.categories[i].cookies[j]
      // @ts-ignore
      const key = `${props.storagePrefix}-${props.categories[i].id}-${cookie.id}`
      obj[key] = true

      if ('onAccepted' in cookie && typeof cookie.onAccepted === 'function') {
        cookie.onAccepted()
      }
    }
  }

  localStorage.setItem(props.storageConsentsKey, JSON.stringify(obj))
  if (props.useMetaCookie) setMetaCookie(obj)
}

function toggleCookieInformation(event: Event) {
  event.preventDefault()
  const parent = <HTMLElement> event.target.parentElement

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
  if (!isNaN(categoryIndex)) {
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

  const cookieDetailsCard = <HTMLElement> unref(detailsCards)[categoryIndex]
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
    consents[categoryIndex].partial = res.includes(true)

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
    perspective: 1000px;
    transform-style: preserve-3d;
  }

  #container {
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.2), 0 4px 20px 0 rgba(0, 0, 0, 0.19);
    transform: translateZ(0);
    backface-visibility: hidden;
    transform-style: preserve-3d;
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
    box-sizing: border-box;
    width: auto;
  }

  .btn {
    width: 100%;
  }
  #details-container {
    padding-bottom: 4px;
  }
  #details-container > header button {
    margin-left: 10px;
  }
</style>

<i18n global>
{
  "ar": {
    "generalLabels": {
      "title": "إعدادات الخصوصية",
      "details": {
        "back": "يعود"
      },
      "description": {
        "details": "ستجد هنا نظرة عامة على جميع ملفات تعريف الارتباط المستخدمة. يمكنك الموافقة على الفئات الفردية أو ملفات تعريف الارتباط الفردية ويمكنك عرض مزيد من المعلومات حول ملفات تعريف الارتباط الفردية.",
        "main": "نحن نستخدم ملفات تعريف الارتباط على موقعنا لأغراض أساسية ، وكذلك للأغراض الإحصائية والتسويقية. يمكن للوسائط الخارجية أيضًا استخدام ملفات تعريف الارتباط."
      },
      "minimize": "تصغير",
      "clearSite": "حذف البيانات",
      "info": {
        "title": "عنوان تفسيري",
        "text": "✓ = تم قبول جميع ملفات تعريف الارتباط في هذه الفئة\n▣ = تم قبول بعض ملفات تعريف الارتباط في هذه الفئة\n- = لم يتم قبول ملفات تعريف الارتباط في هذه الفئة"
      },
      "button": {
        "acceptAll": "كل قبول",
        "acceptSelection": "اختيار حفظ"
      },
      "binarySliderLabels": {
        "accepted": "وافقت",
        "declined": "رفض",
        "partial": "مقبولة جزئياً"
      },
      "showCookieInformation": "إظهار معلومات ملفات تعريف الارتباط",
      "cookieDetails": "تفاصيل ملفات تعريف الارتباط",
      "individualSettings": "إعدادات حماية البيانات الفردية",
      "requiredLinks": {
        "privacy": {
          "title": "حماية البيانات",
          "href": "/privacy"
        },
        "impress": {
          "title": "بصمة",
          "href": "/imprint"
        }
      }
    },
    "cookieLabels": {
      "accept": "استعرض - قبل - قبول",
      "name": "اسم",
      "provider": "مقدمي",
      "purpose": "غرض",
      "privacy": "حماية البيانات",
      "hosts": "مضيف",
      "cookieName": "اسم ملف تعريف الارتباط",
      "cookieValidityPeriod": "صلاحية ملفات تعريف الارتباط",
      "links": "اليسار"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "موافقات ملفات تعريف الارتباط",
      "provider": "صاحب الموقع الإلكتروني",
      "purpose": "يحفظ الموافقات أو الرفض لملفات تعريف الارتباط الفردية.",
      "cookieName": "consents",
      "cookieValidityPeriod": "١ سنة"
    }
  },
  "bg": {
    "generalLabels": {
      "title": "Настройки за поверителност",
      "details": {
        "back": "Обратно"
      },
      "description": {
        "details": "Тук ще намерите преглед на всички използвани бисквитки. Можете да се съгласите с отделни категории или отделни бисквитки и да получите допълнителна информация за отделните бисквитки.",
        "main": "Използваме \"бисквитки\" на нашия уебсайт за основни цели, както и за статистически и маркетингови цели. Външните медии също могат да използват"
      },
      "minimize": "Сведете до минимум",
      "clearSite": "Изтриване на данни",
      "info": {
        "title": "Легенда",
        "text": "✓ = Всички бисквитки в тази категория приети\n▣ = Някои бисквитки в тази категория приеха\n- = В тази категория няма приемани бисквитки"
      },
      "button": {
        "acceptAll": "Приемете всички",
        "acceptSelection": "Запазване на избора"
      },
      "binarySliderLabels": {
        "accepted": "Приема се",
        "declined": "Отхвърлени",
        "partial": "Частично приет"
      },
      "showCookieInformation": "Показване на информация за бисквитките",
      "cookieDetails": "Данни за бисквитките",
      "individualSettings": "Индивидуални настройки за поверителност",
      "requiredLinks": {
        "privacy": {
          "title": "Защита на данните",
          "href": "/privacy"
        },
        "impress": {
          "title": "Отпечатък",
          "href": "/imprint"
        }
      }
    },
    "cookieLabels": {
      "accept": "Приемане на",
      "name": "Име",
      "provider": "Доставчик",
      "purpose": "Цел",
      "privacy": "Политика за поверителност",
      "hosts": "Host",
      "cookieName": "Име на бисквитка",
      "cookieValidityPeriod": "Валидност на бисквитките",
      "links": "Връзки"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Споразумение за бисквитки",
      "provider": "Собственик на уебсайта",
      "purpose": "Запазва одобренията или отказите за отделните бисквитки.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 година"
    }
  },
  "cs": {
    "generalLabels": {
      "title": "Nastavení soukromí",
      "details": {
        "back": "Zpět"
      },
      "description": {
        "details": "Zde najdete přehled všech používaných souborů cookie. Můžete souhlasit s jednotlivými kategoriemi nebo jednotlivými soubory cookie a nechat si zobrazit další informace o jednotlivých souborech cookie.",
        "main": "Na našich webových stránkách používáme soubory cookie pro základní účely a pro statistické a marketingové účely. Externí média mohou také používat soubory cookie."
      },
      "minimize": "Minimalizujte",
      "clearSite": "Odstranění dat",
      "info": {
        "title": "Legenda",
        "text": "✓ = Všechny soubory cookie v této kategorii jsou přijaty\n▣ = Některé soubory cookie přijaté v této kategorii\n- = V této kategorii nejsou přijímány žádné soubory cookie"
      },
      "button": {
        "acceptAll": "Přijmout všechny",
        "acceptSelection": "Uložit výběr"
      },
      "binarySliderLabels": {
        "accepted": "Přijato",
        "declined": "Odmítnuto",
        "partial": "Částečně přijato"
      },
      "showCookieInformation": "Zobrazit informace o souborech cookie",
      "cookieDetails": "Podrobnosti o souborech cookie",
      "individualSettings": "Individuální nastavení soukromí",
      "requiredLinks": {
        "privacy": {
          "title": "Ochrana údajů",
          "href": "/chrana-udaju"
        },
        "impress": {
          "title": "Otisk",
          "href": "/otisk"
        }
      }
    },
    "cookieLabels": {
      "accept": "Přijmout",
      "name": "Název",
      "provider": "Poskytovatel",
      "purpose": "Účel",
      "privacy": "Zásady ochrany osobních údajů",
      "hosts": "Host",
      "cookieName": "Název souboru cookie",
      "cookieValidityPeriod": "Platnost souborů cookie",
      "links": "Odkazy"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Dohoda o souborech cookie",
      "provider": "Vlastník webových stránek",
      "purpose": "Uloží schválení nebo zamítnutí jednotlivých souborů cookie.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 rok"
    }
  },
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
      "info": {
        "title": "Legende",
        "text": "✓ = Alle cookies i denne kategori accepteres\n▣ = Nogle af de cookies, der accepteres i denne kategori\n- = Ingen cookies accepteres i denne kategori"
      },
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
  "el": {
    "generalLabels": {
      "title": "Ρυθμίσεις απορρήτου",
      "details": {
        "back": "Πίσω"
      },
      "description": {
        "details": "Εδώ θα βρείτε μια επισκόπηση όλων των cookies που χρησιμοποιούνται. Μπορείτε να συμφωνήσετε με μεμονωμένες κατηγορίες ή μεμονωμένα cookies και να έχετε περισσότερες πληροφορίες σχετικά με τα μεμονωμένα cookies.",
        "main": "Χρησιμοποιούμε cookies στον ιστότοπό μας για βασικούς σκοπούς, καθώς και για στατιστικούς σκοπούς και σκοπούς μάρκετινγκ. Τα εξωτερικά μέσα ενδέχεται επίσης να χρησιμοποιούν cookies."
      },
      "minimize": "Ελαχιστοποίηση",
      "clearSite": "Διαγραφή δεδομένων",
      "info": {
        "title": "Υπόμνημα",
        "text": "✓ = Όλα τα cookies σε αυτή την κατηγορία αποδεκτά\n▣ = Μερικά cookies που γίνονται δεκτά σε αυτή την κατηγορία\n- = Δεν γίνονται δεκτά cookies σε αυτή την κατηγορία"
      },
      "button": {
        "acceptAll": "Αποδοχή όλων",
        "acceptSelection": "Αποθήκευση επιλογής"
      },
      "binarySliderLabels": {
        "accepted": "Αποδεκτή",
        "declined": "Απορρίφθηκε",
        "partial": "Μερικώς αποδεκτή"
      },
      "showCookieInformation": "Εμφάνιση πληροφοριών cookie",
      "cookieDetails": "Λεπτομέρειες cookie",
      "individualSettings": "Ατομικές ρυθμίσεις απορρήτου",
      "requiredLinks": {
        "privacy": {
          "title": "Προστασία δεδομένων",
          "href": "/privacy"
        },
        "impress": {
          "title": "Εκτύπωση",
          "href": "/imprint"
        }
      }
    },
    "cookieLabels": {
      "accept": "Αποδοχή",
      "name": "Όνομα",
      "provider": "Πάροχος",
      "purpose": "Σκοπός",
      "privacy": "Πολιτική απορρήτου",
      "hosts": "Host",
      "cookieName": "Όνομα cookie",
      "cookieValidityPeriod": "Εγκυρότητα cookie",
      "links": "Links"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Συμφωνία cookie",
      "provider": "Ιδιοκτήτης ιστοσελίδας",
      "purpose": "Αποθηκεύει τις εγκρίσεις ή απορρίψεις για τα μεμονωμένα cookies.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 έτος"
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
      "info": {
        "title": "Legend",
        "text": "✓ = All cookies in this category accepted\n▣ = Some cookies accepted in this category\n- = No cookies accepted in this category"
      },
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
      "info": {
        "title": "Leyenda",
        "text": "✓ = Se aceptan todas las cookies de esta categoría\n▣ = Algunas cookies aceptadas en esta categoría\n- = No se aceptan cookies en esta categoría"
      },
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
  "et": {
    "generalLabels": {
      "title": "Privaatsuse seaded",
      "details": {
        "back": "Tagasi"
      },
      "description": {
        "details": "Siit leiate ülevaate kõigist kasutatavatest küpsistest. Saate nõustuda üksikute kategooriate või üksikute küpsiste kasutamisega ja saada lisateavet üksikute küpsiste kohta.",
        "main": "Me kasutame oma veebisaidil küpsiseid põhilistel eesmärkidel, samuti statistilistel ja turunduslikel eesmärkidel. Ka väline meedia võib kasutada küpsiseid."
      },
      "minimize": "Minimeeri",
      "clearSite": "Andmete kustutamine",
      "info": {
        "title": "Legend",
        "text": "✓ = Kõik küpsised selles kategoorias on aktsepteeritud\n▣ = Mõned selles kategoorias aktsepteeritud küpsised\n- = Selles kategoorias ei ole küpsised lubatud"
      },
      "button": {
        "acceptAll": "Võtke kõik vastu",
        "acceptSelection": "Salvesta valik"
      },
      "binarySliderLabels": {
        "accepted": "Aktsepteeritud",
        "declined": "Tagasilükatud",
        "partial": "Osaliselt aktsepteeritud"
      },
      "showCookieInformation": "Näita küpsiste teavet",
      "cookieDetails": "Küpsise üksikasjad",
      "individualSettings": "Individuaalsed privaatsusseaded",
      "requiredLinks": {
        "privacy": {
          "title": "Andmekaitse",
          "href": "/andmekaitse"
        },
        "impress": {
          "title": "Jälg",
          "href": "/jaelg"
        }
      }
    },
    "cookieLabels": {
      "accept": "Aktsepteeri",
      "name": "Nimi",
      "provider": "Teenusepakkuja",
      "purpose": "Eesmärk",
      "privacy": "Privaatsuspoliitika",
      "hosts": "Host",
      "cookieName": "Küpsise nimi",
      "cookieValidityPeriod": "Küpsise kehtivus",
      "links": "Links"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Küpsiste leping",
      "provider": "Veebilehe omanik",
      "purpose": "Salvestab üksikute küpsiste heakskiitmise või tagasilükkamise.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 aasta"
    }
  },
  "fi": {
    "generalLabels": {
      "title": "Tietosuoja-asetukset",
      "details": {
        "back": "Takaisin"
      },
      "description": {
        "details": "Täältä löydät yleiskatsauksen kaikista käytetyistä evästeistä. Voit hyväksyä yksittäiset luokat tai yksittäiset evästeet ja saada lisätietoja yksittäisistä evästeistä näkyviin.",
        "main": "Käytämme verkkosivustollamme evästeitä välttämättömiin tarkoituksiin sekä tilastollisiin ja markkinointitarkoituksiin. Myös ulkoiset mediat voivat käyttää evästeitä."
      },
      "minimize": "Minimoi",
      "clearSite": "Tietojen poistaminen",
      "info": {
        "title": "Selite",
        "text": "✓ = Kaikki tämän luokan evästeet hyväksytty\n▣ = Joitakin tähän luokkaan hyväksyttyjä evästeitä\n- = Tässä kategoriassa ei hyväksytä evästeitä"
      },
      "button": {
        "acceptAll": "Hyväksy kaikki",
        "acceptSelection": "Tallenna valinta"
      },
      "binarySliderLabels": {
        "accepted": "Hyväksytty",
        "declined": "Hylätyt",
        "partial": "Osittain hyväksytty"
      },
      "showCookieInformation": "Näytä evästetiedot",
      "cookieDetails": "Evästeen tiedot",
      "individualSettings": "Yksilölliset yksityisyysasetukset",
      "requiredLinks": {
        "privacy": {
          "title": "Tietosuoja",
          "href": "/tietosuoja"
        },
        "impress": {
          "title": "Jälki",
          "href": "/jaelki"
        }
      }
    },
    "cookieLabels": {
      "accept": "Hyväksy",
      "name": "Nimi",
      "provider": "Palveluntarjoaja",
      "purpose": "Käyttötarkoitus",
      "privacy": "Tietosuojakäytäntö",
      "hosts": "Host",
      "cookieName": "Evästeen nimi",
      "cookieValidityPeriod": "Evästeen voimassaolo",
      "links": "Linkit"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Evästesopimus",
      "provider": "Verkkosivuston omistaja",
      "purpose": "Tallentaa yksittäisten evästeiden hyväksynnät tai hylkäykset.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 vuosi"
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
      "info": {
        "title": "Légende",
        "text": "✓ = Tous les cookies de cette catégorie acceptés\n▣ = Quelques cookies de cette catégorie acceptés\n- = Aucun cookie de cette catégorie n'est accepté"
      },
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
  "hi": {
    "generalLabels": {
      "title": "गोपनीय सेटिंग",
      "details": {
        "back": "वापसी"
      },
      "description": {
        "details": "यहां आपको उपयोग की गई सभी कुकीज़ का अवलोकन मिलेगा। आप अलग-अलग श्रेणियों या अलग-अलग कुकीज़ के लिए सहमत हो सकते हैं और आप अलग-अलग कुकीज़ के बारे में अधिक जानकारी देख सकते हैं।",
        "main": "हम अपनी वेबसाइट पर आवश्यक उद्देश्यों के साथ-साथ सांख्यिकीय और विपणन उद्देश्यों के लिए कुकीज़ का उपयोग करते हैं। बाहरी मीडिया भी कुकीज़ का उपयोग कर सकता है।"
      },
      "minimize": "छोटा करना",
      "clearSite": "डेटा हटाएं",
      "info": {
        "title": "दंतकथा",
        "text": "✓ = इस श्रेणी में सभी कुकीज़ ने स्वीकार किया\n▣ = इस श्रेणी में कुछ कुकीज़ स्वीकार किए जाते हैं\n- = इस श्रेणी में कोई कुकीज़ स्वीकार नहीं की"
      },
      "button": {
        "acceptAll": "सभी स्वीकार करते हैं",
        "acceptSelection": "चयन सहेजें"
      },
      "binarySliderLabels": {
        "accepted": "को स्वीकृत",
        "declined": "अस्वीकृत",
        "partial": "आंशिक रूप से स्वीकृत"
      },
      "showCookieInformation": "कुकी जानकारी दिखाएं",
      "cookieDetails": "कुकी-विवरण",
      "individualSettings": "व्यक्तिगत डेटा सुरक्षा सेटिंग्स",
      "requiredLinks": {
        "privacy": {
          "title": "डेटा सुरक्षा",
          "href": "/privacy"
        },
        "impress": {
          "title": "छाप",
          "href": "/imprint"
        }
      }
    },
    "cookieLabels": {
      "accept": "स्वीकार करना",
      "name": "नाम",
      "provider": "प्रदाताओं",
      "purpose": "प्रयोजन",
      "privacy": "डेटा सुरक्षा",
      "hosts": "मेज़बान",
      "cookieName": "कुकी का नाम",
      "cookieValidityPeriod": "कुकी वैधता",
      "links": "बाएं"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "कुकी सहमति",
      "provider": "वेबसाइट का मालिक",
      "purpose": "व्यक्तिगत कुकीज़ के लिए अनुमोदन या अस्वीकृति सहेजता है।",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 वर्ष"
    }
  },
  "hr": {
    "generalLabels": {
      "title": "Postavke privatnosti",
      "details": {
        "back": "Povratak"
      },
      "description": {
        "details": "Ovdje ćete pronaći pregled svih korištenih kolačića. Možete pristati na pojedinačne kategorije ili pojedinačne kolačiće i možete vidjeti dodatne informacije o pojedinačnim kolačićima.",
        "main": "Kolačiće na našoj web stranici koristimo u osnovne svrhe, kao i u statističke i marketinške svrhe. Vanjski mediji također mogu koristiti kolačiće."
      },
      "minimize": "Minimizirajte",
      "clearSite": "Izbriši podatke",
      "info": {
        "title": "Legenda",
        "text": "✓ = Svi kolačići u ovoj kategoriji prihvaćeni su\n▣ = Neki kolačići u ovoj kategoriji prihvaćeni su\n- = Nije prihvaćen nijedan kolačići u ovoj kategoriji"
      },
      "button": {
        "acceptAll": "Svi prihvaćaju",
        "acceptSelection": "Spremi odabir"
      },
      "binarySliderLabels": {
        "accepted": "Prihvaćeno",
        "declined": "Odbijeno",
        "partial": "Djelomično prihvaćeno"
      },
      "showCookieInformation": "Prikaži informacije o kolačićima",
      "cookieDetails": "Pojedinosti o kolačićima",
      "individualSettings": "Pojedinačne postavke zaštite podataka",
      "requiredLinks": {
        "privacy": {
          "title": "zaštita podataka",
          "href": "/zastita-podataka"
        },
        "impress": {
          "title": "otisak",
          "href": "/otisak"
        }
      }
    },
    "cookieLabels": {
      "accept": "Prihvatiti",
      "name": "Ime",
      "provider": "pružatelji usluga",
      "purpose": "Svrha",
      "privacy": "Zaštita podataka",
      "hosts": "Host",
      "cookieName": "Naziv kolačića",
      "cookieValidityPeriod": "Valjanost kolačića",
      "links": "Lijevo"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Suglasnost za kolačiće",
      "provider": "Vlasnik web stranice",
      "purpose": "Sprema odobrenja ili odbijanja u pojedinačne kolačiće.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 godina"
    }
  },
  "hu": {
    "generalLabels": {
      "title": "Adatvédelmi beállítások",
      "details": {
        "back": "Vissza"
      },
      "description": {
        "details": "Itt áttekintést talál az összes használt sütiről. Egyéni kategóriákhoz vagy egyes sütikhez hozzájárulhat, és további információkat kaphat az egyes sütikről.",
        "main": "Weboldalunkon cookie-kat használunk alapvető célokra, valamint statisztikai és marketing célokra. A külső médiumok is használhatnak sütiket."
      },
      "minimize": "Minimalizálja a",
      "clearSite": "Adatok törlése",
      "info": {
        "title": "Legenda",
        "text": "✓ = Minden cookie ebben a kategóriában elfogadott\n▣ = Néhány ebben a kategóriában elfogadott cookie\n- = Ebben a kategóriában nem fogadunk el sütiket"
      },
      "button": {
        "acceptAll": "Fogadjon el mindent",
        "acceptSelection": "Kiválasztás mentése"
      },
      "binarySliderLabels": {
        "accepted": "Elfogadva",
        "declined": "Visszautasított",
        "partial": "Részben elfogadott"
      },
      "showCookieInformation": "Cookie információk megjelenítése",
      "cookieDetails": "Cookie részletek",
      "individualSettings": "Egyéni adatvédelmi beállítások",
      "requiredLinks": {
        "privacy": {
          "title": "Adatvédelem",
          "href": "/adatvedelem"
        },
        "impress": {
          "title": "Impresszum",
          "href": "/impresszum"
        }
      }
    },
    "cookieLabels": {
      "accept": "Elfogadom",
      "name": "Név",
      "provider": "Szolgáltató",
      "purpose": "Cél",
      "privacy": "Datenschutzerklärung",
      "hosts": "Host",
      "cookieName": "Cookie Name",
      "cookieValidityPeriod": "Cookie érvényessége",
      "links": "Linkek"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Cookie-megállapodás",
      "provider": "A weboldal tulajdonosa",
      "purpose": "Menti az egyes sütik jóváhagyását vagy elutasítását.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 év"
    }
  },
  "hy": {
    "generalLabels": {
      "title": "Գաղտնիության կարգավորումներ",
      "details": {
        "back": "Վերադարձ"
      },
      "description": {
        "details": "Այստեղ դուք կգտնեք օգտագործված բոլոր թխուկների ակնարկը: Դուք կարող եք համաձայնվել առանձին կատեգորիաների կամ առանձին թխուկների հետ և կարող եք դիտել լրացուցիչ տեղեկություններ առանձին թխուկների մասին:",
        "main": "Մենք օգտագործում ենք թխուկներ մեր կայքում հիմնական նպատակներով, ինչպես նաև վիճակագրական և մարքեթինգային նպատակներով: Արտաքին լրատվամիջոցները կարող են նաև օգտագործել թխուկներ:"
      },
      "minimize": "Փոքրացնել",
      "clearSite": "Ջնջել տվյալները",
      "info": {
        "title": "Լեգենդ",
        "text": "✓ = Այս կատեգորիայում բոլոր Տեղեկանիշն ընդունված է\n▣ = Այս կատեգորիայում որոշ բլիթներ ընդունված են\n- = Այս կատեգորիայում ոչ մի բլիթ չի ընդունվում"
      },
      "button": {
        "acceptAll": "Բոլորն ընդունում են",
        "acceptSelection": "Պահպանել ընտրությունը"
      },
      "binarySliderLabels": {
        "accepted": "Ընդունված է",
        "declined": "Մերժվել է",
        "partial": "Մասամբ ընդունված"
      },
      "showCookieInformation": "Ցուցադրել թխուկների մասին տեղեկությունները",
      "cookieDetails": "Cookie-Մանրամասներ",
      "individualSettings": "Անհատական տվյալների պաշտպանության կարգավորումներ",
      "requiredLinks": {
        "privacy": {
          "title": "տվյալների պաշտպանություն",
          "href": "/privacy"
        },
        "impress": {
          "title": "դրոշմել",
          "href": "/imprint"
        }
      }
    },
    "cookieLabels": {
      "accept": "Ընդունել",
      "name": "Անուն",
      "provider": "մատակարարներ",
      "purpose": "նպատակը",
      "privacy": "Տվյալների պաշտպանություն",
      "hosts": "Host",
      "cookieName": "Թխվածքաբլիթի անվանումը",
      "cookieValidityPeriod": "Cookie-ի վավերականություն",
      "links": "Ձախ"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Cookie-ի համաձայնություն",
      "provider": "Կայքի սեփականատեր",
      "purpose": "Պահպանում է հաստատումները կամ մերժումները առանձին թխուկների վրա:",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 տարի"
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
      "info": {
        "title": "Leggenda",
        "text": "✓ = Tutti i cookie di questa categoria accettati\n▣ = Alcuni cookie accettati in questa categoria\n- = Nessun cookie accettato in questa categoria"
      },
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
  "lb": {
    "generalLabels": {
      "title": "Privatsphär Astellunge",
      "details": {
        "back": "Retour"
      },
      "description": {
        "details": "Hei fannt Dir en Iwwerbléck vun all benotzte Cookien. Dir kënnt fir eenzel Kategorien oder eenzel Cookien averstanen an Dir kënnt weider Informatiounen iwwert déi eenzel Cookien Bléck.",
        "main": "Mir benotze Cookien op eiser Websäit fir wesentlech Zwecker, souwéi fir statistesch a Marketingzwecker. Extern Medien kënnen och Cookien benotzen."
      },
      "minimize": "Minimiséieren",
      "clearSite": "Läschen Daten",
      "info": {
        "title": "Legend",
        "text": "✓ = All Cookien an dëser Kategorie akzeptéiert\n▣ = E puer Cookien an dëser Kategorie akzeptéiert\n- = Keng Cookien an dëser Kategorie ugeholl"
      },
      "button": {
        "acceptAll": "All akzeptéieren",
        "acceptSelection": "Späicheren Auswiel"
      },
      "binarySliderLabels": {
        "accepted": "Akzeptéiert",
        "declined": "Ofgeleent",
        "partial": "Deelweis ugeholl"
      },
      "showCookieInformation": "Show Cookie Informatiounen",
      "cookieDetails": "Cookie-Detailer",
      "individualSettings": "Individuell Dateschutz Astellunge",
      "requiredLinks": {
        "privacy": {
          "title": "Dateschutz",
          "href": "/datenschutz"
        },
        "impress": {
          "title": "Ofdréck",
          "href": "/ofdreck"
        }
      }
    },
    "cookieLabels": {
      "accept": "Akzeptéieren",
      "name": "Numm",
      "provider": "Ubidder",
      "purpose": "Zweck",
      "privacy": "Dateschutz",
      "hosts": "Host",
      "cookieName": "Cookie Numm",
      "cookieValidityPeriod": "Cookie Validitéit",
      "links": "Lénks"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Cookie Zoustëmmung",
      "provider": "Websäit Besëtzer",
      "purpose": "Späichert d'Zustimmungen oder Oflehnungen op déi eenzel Cookien.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 Joer"
    }
  },
  "lt": {
    "generalLabels": {
      "title": "Privatumo nustatymai",
      "details": {
        "back": "Atgal"
      },
      "description": {
        "details": "Čia rasite visų naudojamų slapukų apžvalgą. Galite sutikti su atskiromis kategorijomis arba atskirais slapukais ir gauti daugiau informacijos apie atskirus slapukus.",
        "main": "Savo svetainėje slapukus naudojame svarbiausiais tikslais, taip pat statistikos ir rinkodaros tikslais. Išorinė žiniasklaida taip pat gali naudoti slapukus."
      },
      "minimize": "Sumažinkite",
      "clearSite": "Ištrinti duomenis",
      "info": {
        "title": "Legenda",
        "text": "✓ = Priimami visi šios kategorijos slapukai\n▣ = Kai kurie šioje kategorijoje priimtini slapukai\n- = Šioje kategorijoje slapukai nepriimami"
      },
      "button": {
        "acceptAll": "Priimti visus",
        "acceptSelection": "Išsaugoti pasirinkimą"
      },
      "binarySliderLabels": {
        "accepted": "Priimtas",
        "declined": "Atmesta",
        "partial": "Iš dalies priimta"
      },
      "showCookieInformation": "Rodyti slapukų informaciją",
      "cookieDetails": "Informacija apie slapukus",
      "individualSettings": "Individualūs privatumo nustatymai",
      "requiredLinks": {
        "privacy": {
          "title": "Duomenų apsauga",
          "href": "/duomenų-apsauga"
        },
        "impress": {
          "title": "Atspaudas",
          "href": "/atspaudas"
        }
      }
    },
    "cookieLabels": {
      "accept": "Priimti",
      "name": "Pavadinimas",
      "provider": "Teikėjas",
      "purpose": "Tikslas",
      "privacy": "Privatumo politika",
      "hosts": "Host",
      "cookieName": "Slapukų pavadinimas",
      "cookieValidityPeriod": "Slapukų galiojimas",
      "links": "Nuorodos"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Susitarimas dėl slapukų",
      "provider": "Svetainės savininkas",
      "purpose": "Išsaugo atskirų slapukų patvirtinimus arba atmetimus.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 metai"
    }
  },
  "lv": {
    "generalLabels": {
      "title": "Konfidencialitātes iestatījumi",
      "details": {
        "back": "Atpakaļ"
      },
      "description": {
        "details": "Šeit atradīsiet pārskatu par visām izmantotajām sīkdatnēm. Jūs varat piekrist atsevišķām kategorijām vai atsevišķām sīkdatnēm un saņemt papildu informāciju par atsevišķām sīkdatnēm.",
        "main": "Mēs izmantojam sīkfailus savā tīmekļa vietnē būtiskiem mērķiem, kā arī statistikas un mārketinga vajadzībām. Sīkfailus var izmantot arī ārējie plašsaziņas līdzekļi."
      },
      "minimize": "Minimizēt",
      "clearSite": "Dzēst datus",
      "info": {
        "title": "Leģenda",
        "text": "✓ = Visi šīs kategorijas sīkfaili ir pieņemti\n▣ = Dažas šajā kategorijā pieņemtās sīkdatnes\n- = Šajā kategorijā sīkfaili netiek pieņemti"
      },
      "button": {
        "acceptAll": "Pieņemt visus",
        "acceptSelection": "Saglabāt atlasi"
      },
      "binarySliderLabels": {
        "accepted": "Pieņemts",
        "declined": "Noraidīts",
        "partial": "Daļēji pieņemts"
      },
      "showCookieInformation": "Rādīt sīkfailu informāciju",
      "cookieDetails": "Sīkfailu informācija",
      "individualSettings": "Individuālie konfidencialitātes iestatījumi",
      "requiredLinks": {
        "privacy": {
          "title": "Datu aizsardzība",
          "href": "/datu-aizsardziba"
        },
        "impress": {
          "title": "Imprint",
          "href": "/imprint"
        }
      }
    },
    "cookieLabels": {
      "accept": "Pieņemt",
      "name": "Nosaukums",
      "provider": "Nodrošinātājs",
      "purpose": "Mērķis",
      "privacy": "Konfidencialitātes politika",
      "hosts": "Host",
      "cookieName": "Sīkfaila nosaukums",
      "cookieValidityPeriod": "Sīkfailu derīguma termiņš",
      "links": "Saites"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Sīkfailu līgums",
      "provider": "Tīmekļa vietnes īpašnieks",
      "purpose": "Saglabājiet atsevišķu sīkfailu apstiprinājumus vai noraidījumus.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 gads"
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
      "info": {
        "title": "Legende",
        "text": "✓ = Alle cookies in deze categorie geaccepteerd\n▣ = Enkele cookies die in deze categorie worden geaccepteerd\n- = Geen cookies aanvaard in deze categorie"
      },
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
  "no": {
    "generalLabels": {
      "title": "Personverninnstillinger",
      "details": {
        "back": "Komme tilbake"
      },
      "description": {
        "details": "Her finner du en oversikt over alle informasjonskapsler som brukes. Du kan godta individuelle kategorier eller individuelle informasjonskapsler, og du kan se mer informasjon om de enkelte informasjonskapslene.",
        "main": "Vi bruker informasjonskapsler på nettsiden vår til viktige formål, så vel som for statistikk- og markedsføringsformål. Eksterne medier kan også bruke informasjonskapsler."
      },
      "minimize": "Minimer",
      "clearSite": "Slett data",
      "info": {
        "title": "Legende",
        "text": "✓ = Alle informasjonskapsler i denne kategorien akseptert\n▣ = Noen informasjonskapsler i denne kategorien akseptert\n- = Ingen informasjonskapsler i denne kategorien akseptert"
      },
      "button": {
        "acceptAll": "Alle godtar",
        "acceptSelection": "Lagre utvalg"
      },
      "binarySliderLabels": {
        "accepted": "Akseptert",
        "declined": "Avslått",
        "partial": "Delvis akseptert"
      },
      "showCookieInformation": "Vis informasjon om informasjonskapsler",
      "cookieDetails": "Informasjonskapsel-detaljer",
      "individualSettings": "Individuelle databeskyttelsesinnstillinger",
      "requiredLinks": {
        "privacy": {
          "title": "data beskyttelse",
          "href": "/data-beskyttelse"
        },
        "impress": {
          "title": "avtrykk",
          "href": "/avtrykk"
        }
      }
    },
    "cookieLabels": {
      "accept": "Aksepterer",
      "name": "Navn",
      "provider": "tilbydere",
      "purpose": "hensikt",
      "privacy": "Data beskyttelse",
      "hosts": "Host",
      "cookieName": "Informasjonskapselnavn",
      "cookieValidityPeriod": "Informasjonskapselens gyldighet",
      "links": "Venstre"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Samtykke til informasjonskapsler",
      "provider": "Nettstedseier",
      "purpose": "Lagrer godkjenningene eller avslagene til de enkelte informasjonskapslene.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 år"
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
      "info": {
        "title": "Legenda",
        "text": "✓ = Wszystkie ciasteczka w tej kategorii zaakceptowane\n▣ = Niektóre pliki cookie akceptowane w tej kategorii\n- = W tej kategorii nie akceptuje się plików cookie"
      },
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
  },
  "pt": {
    "generalLabels": {
      "title": "Definições de privacidade",
      "details": {
        "back": "Voltar"
      },
      "description": {
        "details": "Aqui encontrará uma visão geral de todos os cookies utilizados. Pode concordar com categorias individuais ou cookies individuais e ter mais informações sobre os cookies individuais exibidos.",
        "main": "Utilizamos cookies no nosso website para fins essenciais, bem como para fins estatísticos e de marketing. Os meios externos também podem utilizar cookies."
      },
      "minimize": "Minimizar",
      "clearSite": "Apagar dados",
      "info": {
        "title": "Lenda",
        "text": "✓ = Todos os cookies nesta categoria são aceites\n▣ = Alguns cookies aceites nesta categoria\n- = Não são aceites cookies nesta categoria"
      },
      "button": {
        "acceptAll": "Aceitar todos",
        "acceptSelection": "Salvar selecção"
      },
      "binarySliderLabels": {
        "accepted": "Aceite",
        "declined": "Rejeitado",
        "partial": "Parcialmente aceite"
      },
      "showCookieInformation": "Mostrar informação sobre cookies",
      "cookieDetails": "Detalhes dos bolos",
      "individualSettings": "Definições de privacidade individuais",
      "requiredLinks": {
        "privacy": {
          "title": "Protecção de dados",
          "href": "/proteccao-de-dados"
        },
        "impress": {
          "title": "Impressão",
          "href": "/impressao"
        }
      }
    },
    "cookieLabels": {
      "accept": "Aceitar",
      "name": "Nome",
      "provider": "Fornecedor",
      "purpose": "Finalidade",
      "privacy": "Política de privacidade",
      "hosts": "Host",
      "cookieName": "Nome do Cookie",
      "cookieValidityPeriod": "Validade dos bolos",
      "links": "Ligações"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Acordo de cozinheiro",
      "provider": "Proprietário do website",
      "purpose": "Guarda as aprovações ou rejeições para os cookies individuais.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 ano"
    }
  },
  "ro": {
    "generalLabels": {
      "title": "Setări de confidențialitate",
      "details": {
        "back": "Înapoi"
      },
      "description": {
        "details": "Aici veți găsi o prezentare generală a tuturor modulelor cookie utilizate. Puteți să vă dați acordul pentru categorii individuale sau pentru cookie-uri individuale și să vi se afișeze informații suplimentare despre cookie-urile individuale.",
        "main": "Utilizăm cookie-uri pe site-ul nostru web în scopuri esențiale, precum și în scopuri statistice și de marketing. Mediile externe pot utiliza, de asemenea, module cookie."
      },
      "minimize": "Minimizați",
      "clearSite": "Ștergeți datele",
      "info": {
        "title": "Legenda",
        "text": "✓ = Toate cookie-urile din această categorie sunt acceptate\n▣ = Unele cookie-uri acceptate în această categorie\n- = Nu se acceptă cookie-uri în această categorie"
      },
      "button": {
        "acceptAll": "Acceptă toate",
        "acceptSelection": "Salvați selecția"
      },
      "binarySliderLabels": {
        "accepted": "Acceptat",
        "declined": "Respins",
        "partial": "Parțial acceptat"
      },
      "showCookieInformation": "Afișați informații despre cookie-uri",
      "cookieDetails": "Detalii despre cookie-uri",
      "individualSettings": "Setări individuale de confidențialitate",
      "requiredLinks": {
        "privacy": {
          "title": "Protecția datelor",
          "href": "/protecția-datelor"
        },
        "impress": {
          "title": "Imprimare",
          "href": "/imprimare"
        }
      }
    },
    "cookieLabels": {
      "accept": "Acceptă",
      "name": "Nume",
      "provider": "Furnizor",
      "purpose": "Scop",
      "privacy": "Politica de confidențialitate",
      "hosts": "Host",
      "cookieName": "Nume cookie",
      "cookieValidityPeriod": "Valabilitatea cookie-urilor",
      "links": "Legături"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Acordul privind cookie-urile",
      "provider": "Proprietarul site-ului web",
      "purpose": "Salvează aprobările sau respingerile pentru cookie-urile individuale.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 an"
    }
  },
  "ru": {
    "generalLabels": {
      "title": "Настройки конфиденциальности",
      "details": {
        "back": "Назад"
      },
      "description": {
        "details": "Здесь вы найдете обзор всех используемых файлов cookie. Вы можете дать согласие на отдельные категории или отдельные файлы cookie и получить дополнительную информацию об отдельных файлах cookie.",
        "main": "Мы используем файлы cookie на нашем сайте для основных целей, а также для статистических и маркетинговых целей. Внешние носители также могут использовать файлы cookie."
      },
      "minimize": "Минимизировать",
      "clearSite": "Удалить данные",
      "info": {
        "title": "Легенда",
        "text": "✓ = Все печенья в этой категории приняты\n▣ = Некоторые файлы cookie, принятые в этой категории\n- = В этой категории файлы cookie не принимаются"
      },
      "button": {
        "acceptAll": "Принять все",
        "acceptSelection": "Сохранить выбор"
      },
      "binarySliderLabels": {
        "accepted": "Принято",
        "declined": "Отклонено",
        "partial": "Частично принят"
      },
      "showCookieInformation": "Показать информацию о файлах cookie",
      "cookieDetails": "Информация о файлах cookie",
      "individualSettings": "Индивидуальные настройки конфиденциальности",
      "requiredLinks": {
        "privacy": {
          "title": "Защита данных",
          "href": "/privacy"
        },
        "impress": {
          "title": "Оттиск",
          "href": "/imprint"
        }
      }
    },
    "cookieLabels": {
      "accept": "Принять",
      "name": "Имя",
      "provider": "Провайдер",
      "purpose": "Назначение",
      "privacy": "Политика конфиденциальности",
      "hosts": "Host",
      "cookieName": "Имя файла cookie",
      "cookieValidityPeriod": "Срок действия куки",
      "links": "Ссылки"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Соглашение о файлах cookie",
      "provider": "Владелец сайта",
      "purpose": "Сохраняет одобрения или отклонения для отдельных файлов cookie.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 год"
    }
  },
  "sk": {
    "generalLabels": {
      "title": "Nastavenia súkromia",
      "details": {
        "back": "Späť"
      },
      "description": {
        "details": "Tu nájdete prehľad všetkých používaných súborov cookie. Môžete odsúhlasiť jednotlivé kategórie alebo jednotlivé súbory cookie a nechať si zobraziť ďalšie informácie o jednotlivých súboroch cookie.",
        "main": "Na našej webovej stránke používame súbory cookie na základné účely, ako aj na štatistické a marketingové účely. Súbory cookie môžu používať aj externé médiá."
      },
      "minimize": "Minimalizujte",
      "clearSite": "Odstránenie údajov",
      "info": {
        "title": "Legenda",
        "text": "✓ = Všetky súbory cookie v tejto kategórii sú akceptované\n▣ = Niektoré súbory cookie akceptované v tejto kategórii\n- = V tejto kategórii nie sú akceptované žiadne súbory cookie"
      },
      "button": {
        "acceptAll": "Prijať všetky",
        "acceptSelection": "Uložiť výber"
      },
      "binarySliderLabels": {
        "accepted": "Prijaté",
        "declined": "Odmietnuté",
        "partial": "Čiastočne prijaté"
      },
      "showCookieInformation": "Zobraziť informácie o súboroch cookie",
      "cookieDetails": "Podrobnosti o súboroch cookie",
      "individualSettings": "Individuálne nastavenia ochrany osobných údajov",
      "requiredLinks": {
        "privacy": {
          "title": "Ochrana údajov",
          "href": "/ochrana-udajov"
        },
        "impress": {
          "title": "Odtlačok",
          "href": "/odtlacok"
        }
      }
    },
    "cookieLabels": {
      "accept": "Prijať",
      "name": "Názov",
      "provider": "Poskytovateľ",
      "purpose": "Účel",
      "privacy": "Zásady ochrany osobných údajov",
      "hosts": "Host",
      "cookieName": "Názov súboru cookie",
      "cookieValidityPeriod": "Platnosť súborov cookie",
      "links": "Odkazy"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Dohoda o súboroch cookie",
      "provider": "Vlastník webovej stránky",
      "purpose": "Uloží schválenia alebo zamietnutia pre jednotlivé súbory cookie.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 rok"
    }
  },
  "sl": {
    "generalLabels": {
      "title": "Nastavitve zasebnosti",
      "details": {
        "back": "Nazaj"
      },
      "description": {
        "details": "Tukaj boste našli pregled vseh uporabljenih piškotkov. Strinjate se lahko s posameznimi kategorijami ali posameznimi piškotki in prikažete dodatne informacije o posameznih piškotkih.",
        "main": "Piškotke na našem spletnem mestu uporabljamo za osnovne namene ter za statistične in trženjske namene. Piškotke lahko uporabljajo tudi zunanji mediji."
      },
      "minimize": "Minimieren",
      "clearSite": "Brisanje podatkov",
      "info": {
        "title": "Legenda",
        "text": "✓ = Sprejeti vsi piškotki v tej kategoriji\n▣ = Nekateri piškotki, sprejeti v tej kategoriji\n- = Piškotki v tej kategoriji niso sprejeti"
      },
      "button": {
        "acceptAll": "Sprejmite vse",
        "acceptSelection": "Shranjevanje izbire"
      },
      "binarySliderLabels": {
        "accepted": "Sprejeto",
        "declined": "Zavrnjeno",
        "partial": "Delno sprejeto"
      },
      "showCookieInformation": "Prikaži informacije o piškotkih",
      "cookieDetails": "Podrobnosti o piškotkih",
      "individualSettings": "Individualne nastavitve zasebnosti",
      "requiredLinks": {
        "privacy": {
          "title": "Varstvo podatkov",
          "href": "/varstvo-podatkov"
        },
        "impress": {
          "title": "Odtis",
          "href": "/odtis"
        }
      }
    },
    "cookieLabels": {
      "accept": "Sprejmite",
      "name": "Ime",
      "provider": "Ponudnik",
      "purpose": "Namen",
      "privacy": "Politika zasebnosti",
      "hosts": "Host",
      "cookieName": "Ime piškotka",
      "cookieValidityPeriod": "Veljavnost piškotkov",
      "links": "Povezave"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Sporazum o piškotkih",
      "provider": "Lastnik spletnega mesta",
      "purpose": "Shrani odobritve ali zavrnitve za posamezne piškotke.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 leto"
    }
  },
  "sq": {
    "generalLabels": {
      "title": "Kushtet e Privatësisë",
      "details": {
        "back": "Kthimi"
      },
      "description": {
        "details": "Këtu do të gjeni një përmbledhje të të gjitha cookies të përdorura. Ju mund të bini dakord për kategoritë individuale ose cookie-t individuale dhe mund të shikoni informacione të mëtejshme rreth skedarëve individualë.",
        "main": "Ne përdorim cookies në faqen tonë të internetit për qëllime thelbësore, si dhe për qëllime statistikore dhe marketingu. Mediat e jashtme mund të përdorin gjithashtu cookie."
      },
      "minimize": "Minimizoje",
      "clearSite": "Fshi të dhënat",
      "info": {
        "title": "Legjendë",
        "text": "✓ = Të gjitha cookies në këtë kategori pranuan\n▣ = Disa cookie në këtë kategori pranuan\n- = Asnjë cookie në këtë kategori nuk pranohet"
      },
      "button": {
        "acceptAll": "Të gjithë pranojnë",
        "acceptSelection": "Ruaj përzgjedhjen"
      },
      "binarySliderLabels": {
        "accepted": "Pranuar",
        "declined": "Refuzuar",
        "partial": "Pjesërisht e pranuar"
      },
      "showCookieInformation": "Shfaq informacionin e cookie-ve",
      "cookieDetails": "Cookie-Detajet",
      "individualSettings": "Cilësimet individuale të mbrojtjes së të dhënave",
      "requiredLinks": {
        "privacy": {
          "title": "mbrojtjen e të dhënave",
          "href": "/mbrojtjen-e-te-dhenave"
        },
        "impress": {
          "title": "gjurmë",
          "href": "/gjurme"
        }
      }
    },
    "cookieLabels": {
      "accept": "Pranoje",
      "name": "Emri",
      "provider": "ofruesit",
      "purpose": "qëllimi",
      "privacy": "Mbrojtja e të dhënave",
      "hosts": "Host",
      "cookieName": "Vlefshmëria e cookie-t",
      "cookieValidityPeriod": "",
      "links": "Majtas"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Pëlqimet për cookie",
      "provider": "Pronari i faqes në internet",
      "purpose": "Ruan miratimet ose refuzimet në kukit individualë.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 vit"
    }
  },
  "sv": {
    "generalLabels": {
      "title": "Inställningar för sekretess",
      "details": {
        "back": "Tillbaka"
      },
      "description": {
        "details": "Här hittar du en översikt över alla cookies som används. Du kan godkänna enskilda kategorier eller enskilda cookies och få ytterligare information om de enskilda cookies som visas.",
        "main": "Vi använder cookies på vår webbplats för viktiga ändamål samt för statistik och marknadsföring. Externa medier kan också använda cookies."
      },
      "minimize": "Zmanjšanje",
      "clearSite": "Ta bort uppgifter",
      "info": {
        "title": "Legend",
        "text": "✓ = Alla kakor i denna kategori accepteras\n▣ = Några kakor som accepteras i denna kategori\n- = Inga kakor accepteras i denna kategori"
      },
      "button": {
        "acceptAll": "Acceptera alla",
        "acceptSelection": "Spara val"
      },
      "binarySliderLabels": {
        "accepted": "Godkänd",
        "declined": "Avvisad",
        "partial": "Delvis godkänt"
      },
      "showCookieInformation": "Visa information om cookies",
      "cookieDetails": "Uppgifter om cookies",
      "individualSettings": "Individuella sekretessinställningar",
      "requiredLinks": {
        "privacy": {
          "title": "Uppgiftsskydd",
          "href": "/uppgiftsskydd"
        },
        "impress": {
          "title": "Tryck",
          "href": "/tryck"
        }
      }
    },
    "cookieLabels": {
      "accept": "Acceptera",
      "name": "Namn",
      "provider": "Leverantör",
      "purpose": "Syfte",
      "privacy": "Integritetspolicy",
      "hosts": "Host",
      "cookieName": "Cookie-namn",
      "cookieValidityPeriod": "Cookie giltighet",
      "links": "Länkar"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Avtal om kakor (cookies)",
      "provider": "Webbplatsägare",
      "purpose": "Sparar godkännanden eller avslag för enskilda kakor.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 år"
    }
  },
  "tr": {
    "generalLabels": {
      "title": "Gizlilik ayarları",
      "details": {
        "back": "Dönüş"
      },
      "description": {
        "details": "Burada kullanılan tüm çerezlerin bir özetini bulacaksınız. Bireysel kategorileri veya bireysel tanımlama bilgilerini kabul edebilir ve bireysel tanımlama bilgileri hakkında daha fazla bilgi görüntüleyebilirsiniz.",
        "main": "Web sitemizde çerezleri temel amaçlar ve ayrıca istatistiksel ve pazarlama amaçları için kullanıyoruz. Harici medya da çerezleri kullanabilir."
      },
      "minimize": "küçültmek",
      "clearSite": "Verileri sil",
      "info": {
        "title": "Efsane",
        "text": "✓ = Bu kategorideki tüm çerezler kabul edildi\n▣ = Bu kategoride kabul edilen bazı çerezler\n- = Bu kategoride çerez kabul edilmez"
      },
      "button": {
        "acceptAll": "Hepsi kabul ediyor",
        "acceptSelection": "Seçimi kaydet"
      },
      "binarySliderLabels": {
        "accepted": "Kabul edilmiş",
        "declined": "reddedildi",
        "partial": "Kısmen kabul edildi"
      },
      "showCookieInformation": "Çerez bilgilerini göster",
      "cookieDetails": "Çerez-Ayrıntılar",
      "individualSettings": "Bireysel veri koruma ayarları",
      "requiredLinks": {
        "privacy": {
          "title": "veri koruması",
          "href": "/veri-korumasi"
        },
        "impress": {
          "title": "damga",
          "href": "/damga"
        }
      }
    },
    "cookieLabels": {
      "accept": "Kabul etmek",
      "name": "İsim",
      "provider": "sağlayıcılar",
      "purpose": "amaç",
      "privacy": "Veri koruması",
      "hosts": "Host",
      "cookieName": "Çerez Adı",
      "cookieValidityPeriod": "Çerez geçerliliği",
      "links": "Sol"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Çerez İzinleri",
      "provider": "Web sitesi sahibi",
      "purpose": "Onayları veya retleri ayrı çerezlere kaydeder.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 yil"
    }
  },
  "uk": {
    "generalLabels": {
      "title": "Параметри конфіденційності",
      "details": {
        "back": "Повернення"
      },
      "description": {
        "details": "Тут ви знайдете огляд усіх використовуваних файлів cookie. Ви можете погодитися з окремими категоріями або окремими файлами cookie та можете переглянути додаткову інформацію про окремі файли cookie.",
        "main": "Ми використовуємо файли cookie на нашому веб-сайті для основних цілей, а також для статистичних і маркетингових цілей. Зовнішні носії також можуть використовувати файли cookie."
      },
      "minimize": "Звести до мінімуму",
      "clearSite": "Видалити дані",
      "info": {
        "title": "Легенда",
        "text": "✓ = Всі файли cookie цієї категорії прийняті\n▣ = Деякі файли cookie, прийняті в цій категорії\n- = У цій категорії файли cookie не приймаються"
      },
      "button": {
        "acceptAll": "Всі приймають",
        "acceptSelection": "Зберегти виділення"
      },
      "binarySliderLabels": {
        "accepted": "Прийнято",
        "declined": "Відхилено",
        "partial": "Частково прийнято"
      },
      "showCookieInformation": "Показати інформацію про файли cookie",
      "cookieDetails": "Інформація про файли cookie",
      "individualSettings": "Індивідуальні налаштування захисту даних",
      "requiredLinks": {
        "privacy": {
          "title": "захист даних",
          "href": "/privacy"
        },
        "impress": {
          "title": "відбиток",
          "href": "/imprint"
        }
      }
    },
    "cookieLabels": {
      "accept": "Прийняти",
      "name": "Ім'я",
      "provider": "постачальників",
      "purpose": "призначення",
      "privacy": "Захист даних",
      "hosts": "Host",
      "cookieName": "Ім'я файлу cookie",
      "cookieValidityPeriod": "Термін дії файлів cookie",
      "links": "Ліворуч"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Згода на використання файлів cookie",
      "provider": "Власник сайту",
      "purpose": "Зберігає схвалення або відхилення в окремих файлах cookie.",
      "cookieName": "consents",
      "cookieValidityPeriod": "1 рік"
    }
  },
  "zh": {
    "generalLabels": {
      "title": "隐私设置",
      "details": {
        "back": "溯源"
      },
      "description": {
        "details": "在这里，你会发现所有使用的cookies的概述。您可以同意个别类别或个别cookies，并有关于个别cookies的进一步信息显示。",
        "main": "我们在网站上使用cookies是为了必要的目的，也是为了统计和营销目的。外部媒体也可能使用cookies。"
      },
      "minimize": "尽量减少",
      "clearSite": "删除数据",
      "info": {
        "title": "传说",
        "text": "✓ = 接受该类别中的所有\n▣ = 该类别中接受的一些\n- = 此类别中不接受cookies"
      },
      "button": {
        "acceptAll": "接受所有",
        "acceptSelection": "保存选择"
      },
      "binarySliderLabels": {
        "accepted": "已接受",
        "declined": "被拒绝的",
        "partial": "部分接受"
      },
      "showCookieInformation": "显示cookie信息",
      "cookieDetails": "饼干详情",
      "individualSettings": "个人隐私设置",
      "requiredLinks": {
        "privacy": {
          "title": "数据保护",
          "href": "/privacy"
        },
        "impress": {
          "title": "版本说明",
          "href": "/imprint"
        }
      }
    },
    "cookieLabels": {
      "accept": "接受",
      "name": "命名",
      "provider": "供应商",
      "purpose": "宗旨",
      "privacy": "隐私政策",
      "hosts": "Host",
      "cookieName": "饼干名称",
      "cookieValidityPeriod": "Cookie的有效性",
      "links": "链接"
    },
    "metaCookieTitles": {
      "id": "meta-cookie",
      "name": "Cookie协议",
      "provider": "网站所有者",
      "purpose": "保存对个别cookies的批准或拒绝。",
      "cookieName": "consents",
      "cookieValidityPeriod": "1年"
    }
  }
}
</i18n>
