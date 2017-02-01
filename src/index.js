const emojimap = require('./emoji-map')

function parse(s, counts) {

  function recurse(m, s) {
    let x = s
    if (s && (m = m[s.charCodeAt(0)])) {
      s = s.slice(1)
      const emoji = recurse(m, s)
      return emoji || m.em || undefined
    }

    return undefined
  }

  if (counts == undefined) counts = {}

  while(s && s.length > 0) {
    const emoji = recurse(emojimap, s)
    if (emoji) {
      counts[emoji] = (counts[emoji] || 0) + 1
    }
    s = s.slice((emoji || "1").length)
  }

  return counts
}

module.exports = {
  parse
}
