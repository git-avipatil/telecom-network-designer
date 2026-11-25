# Telecom Network Designer

Drag-and-drop network diagramming (MPLS, SD-WAN, transport, mobile, voice) that turns the diagram
into link, equipment and quote-line lists for a CPQ system.

## Run (Cursor / VS Code terminal)

```bash
npm install
npm run dev        # opens http://localhost:5173
```

Needs Node.js 18 or newer. `npm run build` produces a static site in `dist/`.

## Using it

- **Add components** - drag from the left palette onto the canvas (or click to add).
- **Draw links** - hover a component and drag from one connection dot to another.
  The pill at the top of the canvas sets the type used for new links.
- **Edit** - select a component or link; the right panel edits name, location, vendor, model,
  quantity, bandwidth, SLA, term, class of service, handset / subscription details.
- **Lists** - the bottom panel shows Links, Equipment & devices, and Quote lines with totals.
  Each link gets a sentence such as
  "MPLS connectivity between Mumbai and Pune with 100 Gbps bandwidth and 90% SLA".
- **CPQ Offer Mapping** - top bar. Rules map a link type (optionally a bandwidth range) or a
  component type to an offer code, name, MRC and NRC. First matching rule wins; reorder with the
  arrows. Import / export the mapping as JSON. A single item can be pinned to a specific offer
  from its properties panel.
- **Export** - PDF (diagram + lists), SVG, PNG, Excel (Summary, Links, Equipment, Quote Lines,
  Offer Mapping sheets) and a JSON payload for CPQ integration.
- **Save / Open** - saves the diagram, project details and mapping as one JSON file.
  Work is also autosaved in the browser.
- **Templates** - sample MPLS and SD-WAN networks, or a blank canvas.

## Where to change things

| What | File |
| --- | --- |
| Components, icons, link types, currencies | `src/data/catalog.js` |
| Default CPQ offers and prices (samples) | `src/data/defaultOffers.js` |
| Sample diagrams | `src/data/templates.js` |
| List / quote-line logic, offer matching | `src/lib/bom.js` |
| PDF, SVG, PNG, Excel, JSON export | `src/lib/exporters.js` |

The offer codes and prices shipped in `defaultOffers.js` are placeholders - replace them with your
CPQ catalog before using the totals.
