const emojimap = require('../lib/emoji-map')

function getFullyQualified(emoji) {
  let m = emojimap
  let fq
  while (emoji && (m = m[emoji.charCodeAt(0)])) {
    if (m.fq) {
      fq = m.fq
    }

    emoji = emoji.slice(1)
  }

  return fq
}

function count(s, opts) {

  if (!opts) opts = {}

  function recurse(m, s) {
    if (s && (m = m[s.charCodeAt(0)])) {
      s = s.slice(1)
      const emoji = recurse(m, s)
      return emoji || m.em || undefined
    }

    return undefined
  }

  let counts = opts.counts || {}

  while(s && s.length > 0) {
    const emoji = recurse(emojimap, s)
    if (emoji) {
      let e = emoji
      if (opts.fullyQualified) {
        e = getFullyQualified(emoji)
      }
      counts[e] = (counts[e] || 0) + 1
    }
    s = s.slice((emoji || "1").length)
  }

  return counts
}

module.exports = {
  count
}
