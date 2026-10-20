# Architecture Report Format

Produce one static HTML file. Use inline CSS and HTML/SVG diagrams so the report works offline without CDNs, packages, a server, or a particular browser plugin. This adapts Matt Pocock's visual report format to Krill.

## Content

The header names the repository, date, analyzed scope, evidence inspected, and any limits of the survey. Include a compact diagram legend when needed.

Each candidate gets an `<article>` with:

- **Title and strength**: `Strong`, `Worth exploring`, or `Speculative`. Label uncertainty explicitly; never dress a guess as an observed defect.
- **Files and evidence**: concrete paths, line references, and a representative caller, test, or change that demonstrates the friction.
- **Problem and direction**: concise explanation of the current coordination cost and what a deepening would concentrate or remove. No detailed interface proposal yet.
- **Before / After**: side-by-side diagrams, marking the after view as proposed. Use domain names; depict callers, leaked coordination, and the smaller interface rather than just fewer boxes.
- **Benefits**: locality, leverage, and how tests would improve, expressed as concrete consequences.
- **Costs and risks**: affected contracts, migration or compatibility concerns, validation needs, and what still requires confirmation.
- **ADR conflict**, when applicable: the exact decision and the observed friction that could justify revisiting it. An unexplained contradiction is not a recommendation.

End with a **Top recommendation** linked to its card and a short reason based on expected benefit versus cost. If all candidates are speculative, say there is no firm recommendation. If there are no justified candidates, omit the cards and recommendation and say so explicitly.

## Scaffold

Replace placeholders, repeat the candidate article as needed, and draw the diagrams for the actual evidence. Escape repository text and code snippets as HTML text, including `&`, `<`, `>`, and quotes; never insert them as executable markup. Do not include secrets or sensitive data.

```html
<!doctype html>
<html lang="{{language}}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Architecture review — {{repository}}</title>
    <style>
      :root { color-scheme: light; font-family: system-ui, sans-serif; color: #172033; background: #f5f5f2; }
      * { box-sizing: border-box; }
      body { margin: 0; }
      main { max-width: 1100px; margin: auto; padding: 32px 20px; }
      article, .recommendation { background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 24px; margin: 24px 0; }
      .comparison { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
      .diagram { border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; }
      svg { width: 100%; height: auto; }
      .module { fill: #f1f5f9; stroke: #475569; }
      .deep { fill: #d1fae5; stroke: #047857; stroke-width: 3; }
      .seam { stroke-dasharray: 5 4; }
      .leak { stroke: #b91c1c; stroke-width: 2; }
      .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: .85rem; }
      .strong { background: #d1fae5; color: #065f46; }
      .explore { background: #fef3c7; color: #78350f; }
      .speculative { background: #e2e8f0; color: #334155; }
      .warning { padding: 12px; border-left: 4px solid #b45309; background: #fffbeb; }
      dt { font-weight: 600; margin-top: 12px; }
      dd { margin: 4px 0; }
      code { overflow-wrap: anywhere; }
      @media (max-width: 720px) { .comparison { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <main>
      <header>
        <h1>Architecture review — {{repository}}</h1>
        <p>{{date}} · {{scope}}</p>
        <p>{{evidence inspected and limitations}}</p>
      </header>
      <article id="candidate-1">
        <h2>{{candidate title}}</h2>
        <span class="badge {{strength class}}">{{strength}}</span>
        <p><strong>Files:</strong> <code>{{paths and line references}}</code></p>
        <div class="comparison">
          <section class="diagram" aria-labelledby="before-1">
            <h3 id="before-1">Before</h3>
            {{HTML or inline SVG showing observed coordination}}
          </section>
          <section class="diagram" aria-labelledby="after-1">
            <h3 id="after-1">After — proposed</h3>
            {{HTML or inline SVG showing the deepening}}
          </section>
        </div>
        <dl>
          <dt>Evidence</dt><dd>{{representative caller, test, or repeated change}}</dd>
          <dt>Problem</dt><dd>{{current friction}}</dd>
          <dt>Direction</dt><dd>{{proposed concentration or removal of complexity}}</dd>
          <dt>Benefits</dt><dd>{{locality, leverage, and test improvements}}</dd>
          <dt>Costs and risks</dt><dd>{{contracts, migration, validation, uncertainty}}</dd>
        </dl>
        <!-- Include an ADR warning only when an actual conflict exists. -->
      </article>
      <section class="recommendation">
        <h2>Top recommendation</h2>
        <p><a href="#candidate-1">{{candidate title}}</a> — {{benefit versus cost}}</p>
      </section>
    </main>
  </body>
</html>
```

## Visual guidance

Use a call graph for scattered coordination, a sequence for ordering, or a cross-section for several shallow indirections. Prefer a few readable labels to a dense graph. Pair SVG diagrams with accessible titles or text descriptions, and give repeated elements unique IDs. Keep before and after comparable and the after view visibly hypothetical. A smaller box count alone is not evidence of an improvement.

Use concise prose in the user's language, generous spacing, and color sparingly. Keep important labels and strength badges understandable without relying on color. The artifact is a proposal report, not a second task file or execution ledger.
