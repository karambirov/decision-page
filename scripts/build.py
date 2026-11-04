#!/usr/bin/env python3
"""Check a decision page and assemble it for publishing.

Usage:
  python3 build.py SOURCE --out DIR [--scene-js scene.js]... [--scene-css scene.css]...
                   [--template template.html] [--allow-placeholders] [--no-dash-check]

SOURCE is either a full page (a copy of assets/template.html) or a content file
that holds only what changes between pages, in sections:

  <title>…</title>
  <!--APP-->    the sidebar <aside class="side">…</aside>, then <div class="content"><main>…</main></div>
  <!--TERMS-->  the glossary JSON object
  <!--PAGE-->   window.PAGE = { composeReply: … };
  <!--STYLE-->  optional page-specific CSS

A content file is merged into the current template, so styles and the engine
always come from the skill. Writes DIR/page.html (publish this with the
Artifact tool) and DIR/preview.html (a full document with charset for the local
browser preview). Exits with code 1 when a check fails; warnings do not fail.
"""
import argparse
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

SIZE_LIMIT = 15 * 1024 * 1024
PREVIEW_HEAD = (
    '<!doctype html><html lang="ru"><head><meta charset="utf-8">'
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
    '</head><body>'
)


class Collector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.elements = []  # (tag, attrs dict)
        self.stack = []
        self.text_chunks = []  # visible text outside script/style/code/pre
        self.skip = 0
        self.terms_json = None
        self._in_terms = False
        self._terms_buf = []
        self.decision_stack = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self.elements.append((tag, a, list(self.decision_stack)))
        if tag in ('script', 'style', 'code', 'pre', 'template'):
            self.skip += 1
        if tag == 'script' and a.get('id') == 'terms':
            self._in_terms = True
        if 'decision' in (a.get('class') or '').split() and a.get('data-id'):
            self.decision_stack.append(a['data-id'])
            self.stack.append((tag, True))
        else:
            self.stack.append((tag, False))

    def handle_startendtag(self, tag, attrs):
        self.elements.append((tag, dict(attrs), list(self.decision_stack)))

    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'code', 'pre', 'template') and self.skip:
            self.skip -= 1
        if tag == 'script' and self._in_terms:
            self._in_terms = False
            self.terms_json = ''.join(self._terms_buf)
        # pop to the matching tag
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                popped = self.stack[i:]
                del self.stack[i:]
                for _, was_decision in popped:
                    if was_decision and self.decision_stack:
                        self.decision_stack.pop()
                break

    def handle_data(self, data):
        if self._in_terms:
            self._terms_buf.append(data)
        elif not self.skip:
            self.text_chunks.append(data)


def merge_content(content, template):
    """Merge a content file (sections after <!--APP-->, <!--TERMS-->, <!--PAGE-->, <!--STYLE-->) into the template."""
    parts = re.split(r'<!--(APP|MAIN|TERMS|PAGE|STYLE)-->', content)
    head, sections = parts[0], dict(zip(parts[1::2], (p.strip() for p in parts[2::2])))
    out = template
    title = re.search(r'<title>.*?</title>', head, re.S)
    if title:
        out = re.sub(r'<title>.*?</title>', lambda m: title.group(0), out, count=1, flags=re.S)
    if 'MAIN' in sections:
        raise SystemExit('error: <!--MAIN--> is the old layout without the sidebar; wrap the content as <!--APP--> '
                         '(aside.side with the question links, then div.content with main), see examples/pages')
    if 'APP' in sections:
        out = re.sub(r'<!--APP-->.*?<!--/APP-->', lambda m: '<!--APP-->\n' + sections['APP'] + '\n<!--/APP-->', out, count=1, flags=re.S)
    if 'TERMS' in sections:
        out = re.sub(r'(<script type="application/json" id="terms">).*?(</script>)',
                     lambda m: m.group(1) + '\n' + sections['TERMS'] + '\n' + m.group(2), out, count=1, flags=re.S)
    if 'PAGE' in sections:
        out = re.sub(r'window\.PAGE = \{.*?\n\};', lambda m: sections['PAGE'], out, count=1, flags=re.S)
    if 'STYLE' in sections:
        out = out.replace('/*__SCENE_CSS__*/', sections['STYLE'] + '\n/*__SCENE_CSS__*/', 1)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src')
    ap.add_argument('--out', required=True)
    ap.add_argument('--scene-js', action='append', default=[])
    ap.add_argument('--scene-css', action='append', default=[])
    ap.add_argument('--template', default=str(Path(__file__).resolve().parent.parent / 'assets' / 'template.html'))
    ap.add_argument('--allow-placeholders', action='store_true')
    ap.add_argument('--no-dash-check', action='store_true')
    args = ap.parse_args()

    src = Path(args.src).read_text(encoding='utf-8')
    if re.search(r'<!--(APP|MAIN)-->', src) and '<!--/APP-->' not in src:
        src = merge_content(src, Path(args.template).read_text(encoding='utf-8'))
    errors, warnings = [], []

    # Inline scenes. A bundle can contain "</script>" inside strings; escape it.
    js = '\n'.join(Path(p).read_text(encoding='utf-8').replace('</script', '<\\/script') for p in args.scene_js)
    css = '\n'.join(Path(p).read_text(encoding='utf-8') for p in args.scene_css)
    page = src.replace('/*__SCENE_JS__*/', js).replace('/*__SCENE_CSS__*/', css)

    c = Collector()
    c.feed(src)

    # Placeholders
    ph = re.findall(r'\{\{[^}]*\}\}', src)
    if ph and not args.allow_placeholders:
        errors.append(f'{len(ph)} placeholder(s) left, first: {ph[0]}')

    # Sidebar links and panels
    tab_targets = [a.get('data-panel') for t, a, _ in c.elements if 'q-link' in (a.get('class') or '').split() and a.get('data-panel')]
    panels = {a.get('id') for t, a, _ in c.elements if t == 'section' and 'panel' in (a.get('class') or '').split()}
    if not any('side' in (a.get('class') or '').split() for t, a, _ in c.elements if t == 'aside'):
        errors.append('no sidebar <aside class="side">: the page has no navigation')
    if len(tab_targets) != len(set(tab_targets)):
        errors.append('two sidebar links open the same panel')
    for t in tab_targets:
        if t not in panels:
            errors.append(f'sidebar link points to missing panel #{t}')
    for p in panels:
        if p not in tab_targets:
            warnings.append(f'panel #{p} has no sidebar link')
    if 'summary' not in panels:
        warnings.append('no summary panel (#summary): decisions and the reply have nowhere to collect')
    elif tab_targets and tab_targets[-1] != 'summary':
        warnings.append('the summary link should be the last one in the sidebar')

    # Decisions
    dec_ids = [a['data-id'] for t, a, _ in c.elements if 'decision' in (a.get('class') or '').split() and a.get('data-id')]
    seen = set()
    for d in dec_ids:
        if d in seen:
            errors.append(f'duplicate decision id "{d}"')
        seen.add(d)
    for d in dec_ids:
        radios = [a for t, a, ds in c.elements if t == 'input' and a.get('type') == 'radio' and ds and ds[-1] == d]
        if len(radios) < 2:
            errors.append(f'decision "{d}" has {len(radios)} option(s); needs at least 2')
        bad_names = {r.get('name') for r in radios if r.get('name') != d}
        if bad_names:
            errors.append(f'decision "{d}": radio name must equal the decision id, found {sorted(bad_names)}')
        values = [r.get('value') for r in radios]
        if 'other' in values:
            errors.append(f'decision "{d}": the value "other" is reserved, the engine adds «Другое» itself')
        if len(values) != len(set(values)):
            errors.append(f'decision "{d}": duplicate option values')
        recs = [a for t, a, ds in c.elements if 'rec' in (a.get('class') or '').split() and ds and ds[-1] == d]
        if not recs:
            warnings.append(f'decision "{d}" has no recommended option (.rec)')
    if dec_ids and not re.search(r'composeReply\s*:', src):
        warnings.append('PAGE.composeReply is missing: the reply falls back to a plain list of choices')
    for ref in set(re.findall(r"""\.choice\(\s*['"]([^'"]+)['"]\s*\)""", src)):
        if ref not in seen and ref not in ('id',):
            warnings.append(f'composeReply reads unknown decision "{ref}"')

    # Glossary
    terms = {}
    if c.terms_json is not None:
        try:
            terms = json.loads(c.terms_json)
        except json.JSONDecodeError as e:
            errors.append(f'#terms is not valid JSON: {e}')
    used_terms = {a.get('data-term') for t, a, _ in c.elements if a.get('data-term')}
    for k in sorted(used_terms - set(terms)):
        errors.append(f'term "{k}" is used but not defined in #terms')
    for k in sorted(set(terms) - used_terms):
        warnings.append(f'term "{k}" is defined but never used')

    # Scenes
    mounts = {a.get('data-mount') for t, a, _ in c.elements if a.get('data-mount')}
    if mounts and not args.scene_js and '/*__SCENE_JS__*/' in src:
        warnings.append(f'scene mount(s) {sorted(mounts)} but no --scene-js given')

    # Text: long dashes in visible text (house style of many Russian teams; skip with --no-dash-check)
    visible = ''.join(c.text_chunks)
    if not args.no_dash_check:
        dashes = [m.start() for m in re.finditer('—', visible)]
        if dashes:
            i = dashes[0]
            warnings.append(f'{len(dashes)} long dash(es) in visible text, first near: "…{visible[max(0, i - 30):i + 20].strip()}…"')

    size = len(page.encode('utf-8'))
    if size > SIZE_LIMIT:
        errors.append(f'page is {size / 1048576:.1f} MB, limit is 15 MB')

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    (out / 'page.html').write_text(page, encoding='utf-8')
    (out / 'preview.html').write_text(PREVIEW_HEAD + page + '</body></html>', encoding='utf-8')

    for w in warnings:
        print('warning:', w)
    for e in errors:
        print('error:', e)
    print(f'{len(tab_targets)} view(s), {len(dec_ids)} decision(s), {len(used_terms)} term(s), {size / 1024:.0f} KB')
    print(f'publish: {out / "page.html"}')
    print(f'preview: {out / "preview.html"}')
    sys.exit(1 if errors else 0)


if __name__ == '__main__':
    main()
