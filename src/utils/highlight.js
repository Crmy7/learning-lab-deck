// Coloration syntaxique légère (JS/TS) — sans dépendance externe.
// Renvoie du HTML : chaque token est enveloppé dans un <span class="…">.

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const RE = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:\\.|[^`\\])*`|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")|\b(const|let|var|function|return|new|await|async|for|while|if|else|import|from|export|default|class|this|of|in|extends|implements|interface|type|private|public|readonly|null|true|false|void|typeof|instanceof)\b|(\b[A-Z][A-Za-z0-9_]*\b)|(\b\d+\.?\d*\b)|([A-Za-z_$][\w$]*)(?=\s*\()/g

export function highlight(raw) {
  let out = ''
  let last = 0
  let m
  RE.lastIndex = 0
  while ((m = RE.exec(raw))) {
    out += esc(raw.slice(last, m.index))
    // 1 comment · 2 string · 3 keyword · 4 Type · 5 number · 6 function
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'k' : m[4] ? 't' : m[5] ? 'n' : 'f'
    out += '<span class="' + cls + '">' + esc(m[0]) + '</span>'
    last = RE.lastIndex
  }
  return out + esc(raw.slice(last))
}
