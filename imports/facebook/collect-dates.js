(() => {
  const targetPosts = 100
  const waitMs = 1800
  const maxIdleRounds = 20
  const posts = new Map()
  let stopRequested = false

  window.stopFacebookDateCollector = () => {
    stopRequested = true
    console.log('Datumssammler wird beendet und speichert die bisherigen Ergebnisse.')
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const normalizePostUrl = (value) => {
    try {
      const url = new URL(value, location.href)
      if (url.pathname.includes('/posts/')) return `${url.origin}${url.pathname}`
      if (url.searchParams.has('story_fbid')) {
        return `${url.origin}${url.pathname}?story_fbid=${url.searchParams.get('story_fbid')}`
      }
    } catch {}

    return null
  }

  const looksLikeDate = (value) => {
    if (!value) return false
    const text = value.trim()
    const months =
      '(?:Januar|Februar|Maerz|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember|January|February|March|April|May|June|July|August|September|October|November|December)'

    return (
      /^\d+\s*(?:m|h|d|w|y|min|mins|hr|hrs|day|days|wk|wks|week|weeks|mo|mos|month|months)$/i.test(
        text,
      ) ||
      /^(?:gestern|yesterday|just now)(?:\s+(?:um|at)\s+\d{1,2}[:.]\d{2})?$/i.test(text) ||
      /^vor\s+\d+\s+(?:Minuten?|Stunden?|Tagen?|Wochen?|Monaten?|Jahren?)$/i.test(text) ||
      /^\d+\s+(?:minutes?|hours?|days?|weeks?|months?|years?)\s+ago$/i.test(text) ||
      new RegExp(`\\b\\d{1,2}\\.?\\s+${months}\\b(?:\\s+20\\d{2})?`, 'i').test(text) ||
      new RegExp(`\\b${months}\\s+\\d{1,2}(?:,\\s*20\\d{2})?\\b`, 'i').test(text) ||
      /\b\d{1,2}[./-]\d{1,2}[./-]20\d{2}\b/.test(text)
    )
  }

  const findDate = (article) => {
    const candidates = article.querySelectorAll(
      'a, time, abbr, [data-utime]',
    )

    for (const element of candidates) {
      const unixTime = element.getAttribute('data-utime')
      if (unixTime && /^\d+$/.test(unixTime)) {
        return {
          label: element.getAttribute('aria-label') || element.getAttribute('title') || '',
          timestamp: Number(unixTime),
        }
      }

      const values = [
        element.getAttribute('aria-label'),
        element.getAttribute('title'),
        element.getAttribute('datetime'),
        element.textContent?.trim(),
      ]

      const label = values.find(looksLikeDate)
      if (label) return {label, timestamp: null}
    }

    const textDate = article.innerText
      ?.split('\n')
      .map((line) => line.trim())
      .find(looksLikeDate)

    return {label: textDate || null, timestamp: null}
  }

  const findDateOnLink = (link) => {
    const unixTime = link.getAttribute('data-utime')
    if (unixTime && /^\d+$/.test(unixTime)) {
      return {
        label: link.getAttribute('aria-label') || link.getAttribute('title') || '',
        timestamp: Number(unixTime),
      }
    }

    const values = [
      link.getAttribute('aria-label'),
      link.getAttribute('title'),
      link.getAttribute('datetime'),
      link.textContent?.trim(),
    ]
    const label = values.find(looksLikeDate)
    return label ? {label, timestamp: null} : null
  }

  const findMainPostDate = (container, commentArticle) => {
    const candidates = container.querySelectorAll('a, time, abbr, [data-utime]')

    for (const element of candidates) {
      if (element.closest('[role="article"]') === commentArticle) continue
      if (/comment_id|reply_comment_id/i.test(element.getAttribute('href') || '')) continue

      const unixTime = element.getAttribute('data-utime')
      if (unixTime && /^\d+$/.test(unixTime)) {
        return {
          label: element.getAttribute('aria-label') || element.getAttribute('title') || '',
          timestamp: Number(unixTime),
        }
      }

      const values = [
        element.getAttribute('aria-label'),
        element.getAttribute('title'),
        element.getAttribute('datetime'),
        element.textContent?.trim(),
      ]
      const label = values.find(looksLikeDate)
      if (label) return {label, timestamp: null}
    }

    return null
  }

  const collectVisiblePosts = () => {
    const feedItems = document.querySelectorAll('[role="feed"] > div')

    for (const feedItem of feedItems) {
      const links = [...feedItem.querySelectorAll('a[href]')]
      const url = links.map((link) => normalizePostUrl(link.href)).find(Boolean)
      const date = url ? findDate(feedItem) : null
      if (!url || (!date?.label && !date?.timestamp)) continue

      const previous = posts.get(url)
      const text = feedItem.innerText?.trim() || ''
      posts.set(url, {
        url,
        date: date.label || previous?.date || null,
        timestamp: date.timestamp || previous?.timestamp || null,
        text: text.length >= (previous?.text?.length || 0) ? text : previous.text,
      })
    }

    const commentLinks = [...document.querySelectorAll('a[href*="/metalimdorf/posts/"]')].filter(
      (link) => /comment_id/i.test(link.href),
    )

    for (const link of commentLinks) {
      const url = normalizePostUrl(link.href)
      const commentArticle = link.closest('[role="article"]')
      if (!url || !commentArticle) continue

      let container = commentArticle.parentElement
      for (let level = 0; container && level < 18; level += 1) {
        const date = findMainPostDate(container, commentArticle)
        if (date) {
          const previous = posts.get(url)
          const text = container.innerText?.trim() || ''
          posts.set(url, {
            url,
            date: date.label || previous?.date || null,
            timestamp: date.timestamp || previous?.timestamp || null,
            text: text.length >= (previous?.text?.length || 0) ? text : previous.text,
          })
          break
        }
        container = container.parentElement
      }
    }
  }

  const offerDownload = (filename, data, message) => {
    document.getElementById('metal-im-dorf-facebook-export')?.remove()

    const panel = document.createElement('div')
    panel.id = 'metal-im-dorf-facebook-export'
    Object.assign(panel.style, {
      position: 'fixed',
      inset: '20px 20px auto auto',
      zIndex: '2147483647',
      width: 'min(380px, calc(100vw - 40px))',
      padding: '20px',
      color: '#fff',
      background: '#18191a',
      border: '2px solid #00a8bb',
      boxShadow: '0 12px 40px rgba(0,0,0,.55)',
      font: '15px/1.45 Arial, sans-serif',
    })

    const text = document.createElement('p')
    text.textContent = message
    text.style.margin = '0 0 14px'

    const button = document.createElement('button')
    button.textContent = 'Datei speichern'
    Object.assign(button.style, {
      padding: '10px 14px',
      color: '#001014',
      background: '#00a8bb',
      border: '0',
      fontWeight: '700',
      cursor: 'pointer',
    })
    button.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'})
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.append(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      button.textContent = 'Gespeichert'
    })

    panel.append(text, button)
    document.body.append(panel)
  }

  const download = () => {
    offerDownload(
      'facebook-dates.json',
      [...posts.values()],
      `${posts.size} Beitraege wurden erfasst.`,
    )
  }

  const downloadDebug = () => {
    const allLinks = [...document.querySelectorAll('a[href]')]
    const postLinks = allLinks
      .filter((link) => /\/posts\/|story_fbid|comment_id/i.test(link.href))
      .slice(0, 30)
      .map((link) => ({
        href: link.href,
        text: link.textContent?.trim() || null,
        ariaLabel: link.getAttribute('aria-label'),
        title: link.getAttribute('title'),
        closestRoles: [...Array(8)]
          .reduce((result, _, index) => {
            const element = index === 0 ? link : result.at(-1)?.element?.parentElement
            if (!element) return result
            result.push({
              element,
              tag: element.tagName,
              role: element.getAttribute?.('role'),
              pagelet: element.getAttribute?.('data-pagelet'),
              text: element.innerText?.trim().slice(0, 300) || null,
            })
            return result
          }, [])
          .map(({element: _element, ...entry}) => entry),
      }))

    const debug = {
      pageUrl: location.href,
      title: document.title,
      counts: {
        links: allLinks.length,
        postLinks: postLinks.length,
        feeds: document.querySelectorAll('[role="feed"]').length,
        feedChildren: document.querySelectorAll('[role="feed"] > div').length,
        articles: document.querySelectorAll('[role="article"]').length,
        dataPagelets: document.querySelectorAll('[data-pagelet]').length,
      },
      postLinks,
    }

    offerDownload(
      'facebook-debug.json',
      debug,
      'Keine Beitraege erkannt. Bitte die Diagnosedatei speichern.',
    )
  }

  const run = async () => {
    let idleRounds = 0
    let previousCount = 0

    console.log('Facebook-Datumssammler gestartet. Bitte den Tab geoeffnet lassen.')

    while (!stopRequested && posts.size < targetPosts && idleRounds < maxIdleRounds) {
      collectVisiblePosts()
      console.log(`${posts.size} Beitraege gefunden`)

      if (posts.size === previousCount) idleRounds += 1
      else idleRounds = 0

      if (posts.size === 0 && idleRounds >= 3) break

      previousCount = posts.size
      window.scrollBy({top: Math.max(window.innerHeight * 0.8, 700), behavior: 'smooth'})
      await sleep(waitMs)
    }

    collectVisiblePosts()
    if (posts.size === 0) {
      downloadDebug()
      console.log('Keine Beitraege gefunden. facebook-debug.json wurde gespeichert.')
    } else {
      download()
      console.log(`${posts.size} Beitraege als facebook-dates.json gespeichert.`)
    }
  }

  run().catch((error) => console.error('Datumssammler fehlgeschlagen:', error))
})()
