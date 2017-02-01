import fs from 'mz/fs'
import agent from 'superagent'

async function generate(url) {
  if (!url) url = 'http://www.unicode.org/Public/emoji/5.0/emoji-test.txt'
  const list = (await agent.get(url)).text

  let names = {}
  for (const l of list.split('\n')) {
    const m = l.match(/^[0-9a-fA-F]+.*;\s+(\S+)\s*#\s*(\S+)\s+(.+)/)
    if (m) {
      let status = m[1]
      let emoji = m[2]
      let name = m[3]

      // There are errors in the list, here we fix them.
      if ((emoji == '🏘️') && (name == 'house')) {
        name = 'house buildings'
      }

      if (!names[name]) names[name] = {}
      if (status == 'fully-qualified') {
        if (!names[name].fq) {
          names[name].fq = emoji
        } else {
          throw new Error(`Duplicate fully-qualified emoji for ${name} ${emoji}.`)
        }
      }
      if (status != 'fully-qualified' && status != 'non-fully-qualified') {
        throw new Error(`Invalid status ${status} for ${name} ${emoji}.`)
      }
      names[name].em = (names[name].em || []).concat(emoji)
    }
  }

  let prefixes = {}
  for (const name in names) {
    for (const emoji of names[name].em) {

      let prefix = prefixes
      for (let i = 0; i < emoji.length; ++i) {
        const c = emoji.charCodeAt(i)
        if (prefix[c] == undefined) prefix[c] = {}
        prefix = prefix[c]
      }
      prefix['em'] = emoji
      prefix['fq'] = names[name].fq
      prefix['nm'] = name
    }
  }

  console.log('module.exports = ')
  console.log(JSON.stringify(prefixes))
}

generate()
