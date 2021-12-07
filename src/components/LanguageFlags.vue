<template>
  <div class="language-indicator-container">
      <span v-for="(lang, index) in langs" :key="lang.locale" class="language-indicator" @click="setLang(lang.locale , index === (langs.length - 1))" :title="lang.title">
        <span v-html="lang.flag"></span>
      </span>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

const langs = [
  {
    locale: 'de',
    flag: '&#127465&#127466',
    title: 'Germany'
  },
  {
    locale: 'en',
    flag: '&#127468&#127463',
    title: 'English'
  },
  {
    locale: 'dk',
    flag: '&#127465&#127472',
    title: 'Denmark'
  },
  {
    locale: 'nl',
    flag: '&#127475&#127473',
    title: 'Netherlands'
  },
  {
    locale: 'lu',
    flag: '&#127473&#127482',
    title: 'Luxembourg'
  },
  {
    locale: 'ro',
    flag: '&#127479&#127476',
    title: 'Romania'
  },
  {
    locale: 'hu',
    flag: '&#127469&#127482',
    title: 'Hungary'
  },
  {
    locale: 'fr',
    flag: '&#127467&#127479',
    title: 'France'
  },
  {
    locale: 'pl',
    flag: '&#127477&#127473',
    title: 'Poland'
  },
  {
    locale: 'cz',
    flag: '&#127464&#127487',
    title: 'Czechia'
  },
  {
    locale: 'it',
    flag: '&#127470&#127481',
    title: 'Italy'
  },
  {
    locale: 'hr',
    flag: '&#127469&#127479',
    title: 'Croatia'
  },
  {
    locale: 'si',
    flag: '&#127480&#127470',
    title: 'Slovenia'
  },
  {
    locale: 'sk',
    flag: '&#127480&#127472',
    title: 'Slovakia'
  },
  {
    locale: 'es',
    flag: '&#127466&#127480',
    title: 'Spain'
  },
  {
    locale: 'pt',
    flag: '&#127477&#127481',
    title: 'Portugal'
  },
  {
    locale: 'ee',
    flag: '&#127466&#127466',
    title: 'Estonia'
  },
  {
    locale: 'lv',
    flag: '&#127473&#127483',
    title: 'Latvia'
  },
  {
    locale: 'lt',
    flag: '&#127473&#127481',
    title: 'Lithuania'
  },
  {
    locale: 'no',
    flag: '&#127475&#127476',
    title: 'Norway'
  },
  {
    locale: 'sw',
    flag: '&#127480&#127466',
    title: 'Sweden'
  },
  {
    locale: 'fi',
    flag: '&#127467&#127470',
    title: 'Finland'
  },
  {
    locale: 'ru',
    flag: '&#127479&#127482',
    title: 'Russia'
  },
  {
    locale: 'ua',
    flag: '&#127482&#127462',
    title: 'Ukraine'
  },
  {
    locale: 'gr',
    flag: '&#127468&#127479',
    title: 'Greece'
  },
  {
    locale: 'tr',
    flag: '&#127481&#127479',
    title: 'Turkey'
  },
  {
    locale: 'bg',
    flag: '&#127463&#127468',
    title: 'Bulgaria'
  },
  {
    locale: 'al',
    flag: '&#127462&#127473',
    title: 'Albania'
  },
  {
    locale: 'am',
    flag: '&#127462&#127474',
    title: 'Armenia'
  },
  {
    locale: 'cn',
    flag: '&#127464&#127475',
    title: 'China'
  },
  {
    locale: 'in',
    flag: '&#127470&#127475',
    title: 'India (Hindi)'
  },
  {
    locale: 'ae',
    flag: '&#127462&#127466',
    title: 'United Arab Emirates'
  },
  {
    locale: 'gb',
    flag: '&#8634;',
    title: 'Reset'
  }
]

function setLang(l = 'en', reset = false) {
  console.log(reset)
  if (reset) {
    Consents.clear()
    location.href = '/'
    window.location = '/'
  }

  locale.value = l
}

</script>

<style>
  @import "/src/assets/css/global/common.css";
</style>

<style scoped>

  @media all and (max-width: 600px) {
    .language-indicator-container {
      width: max(80px, 10vw);
      opacity: 0.65;
      height: 100vh;
    }
  }
  @media all and (max-width: 1300px) {
    .language-indicator-container {
      opacity: 0.65;
    }
  }

  .language-indicator-container .language-indicator:last-child span {
    width: 100%;
    height: 100%;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 4px 0px;
  }

  .language-indicator-container {
    position: absolute;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 2;
    width: 30vw;
  }

  .language-indicator {
    width: 60px;
    height: 60px;
    position: relative;
    display: inline-block;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    background: lightblue;
    cursor: pointer;
    padding: 9px 7px;
    margin: 4px;
    font-weight: bold;
    font-size: 40px;
    user-select: none;
  }
</style>
