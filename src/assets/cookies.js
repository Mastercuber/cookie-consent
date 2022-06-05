export function readCookie(key) {
  let index = document.cookie.indexOf(key + '=')
  if (index === -1) return {}
  const s = document.cookie.substring(index)

  index = s.indexOf(';')
  if (index > -1) {
    return JSON.parse(s.substring(key.length + 1, index))
  } else {
    return JSON.parse(s.substring(key.length + 1))
  }
}

export function writeCookie(consents, sameSite = 'Lax', path = '/', secure = true) {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 1)
  document.cookie = `${window.Consents.storageConsentsKey}=${JSON.stringify(consents)};expires=${d};samesite=${sameSite};path=${path};secure=${secure}`
}

export function deleteCookie() {
  document.cookie = `${window.Consents.storageConsentsKey}=;expires=Thu, 01-Jan-70 00:00:01 GMT;`
}
