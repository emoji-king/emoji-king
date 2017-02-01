import fs from 'mz/fs'
import agent from 'superagent'

async function generate(url) {
  if (!url) url = 'http://www.unicode.org/Public/emoji/5.0/emoji-test.txt'

  const list = (await agent.get(url)).text

  let emojis = {}
  for (const l of list.split('\n')) {
    const m = l.match(/^[0-9a-fA-F]+.*;.*#\s+(\S+)/)
    if (m) {
      const emoji = m[1]
      let map = emojis
      for (let i = 0; i < emoji.length; ++i) {
        const c = emoji.charCodeAt(i)
        if (map[c] == undefined) map[c] = {}
        map = map[c]
      }
      map['em'] = emoji
    }
  }

  console.log('module.exports = ')
  console.log(JSON.stringify(emojis))
}

generate()
