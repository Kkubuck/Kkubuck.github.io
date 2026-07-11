# Design Research and Decision Record

## Research objective

The brief required a contemporary, non-template visual system with professional interaction, English interface copy, and a complete framework replacement. The research therefore focused on current first-party design systems and browser capabilities rather than galleries of visually impressive sites.

Design galleries are useful for mood, but they often omit accessibility, performance, content constraints, and implementation rationale. Primary sources from product teams and platform vendors were given priority.

## Comparative reading

| Source | Durable principle | Applied here | Deliberately excluded |
|---|---|---|---|
| Apple HIG | Clarity, hierarchy, legibility, familiar behavior | Direct labels, fluid type, strong focus, reduced motion | Product-reveal cinematics and branded material imitation |
| Linear 2026 refresh | Structure should be perceived with less chrome | Shared alignment, fewer borders, row-based archive | Dense application controls inappropriate for a blog |
| Vercel Geist | Token-driven consistency and high contrast | Semantic colors, compact type scale, system themes | Pixel-for-pixel component cloning |
| Stripe Engineering | Advanced graphics require a communication purpose | Lightweight responsive signal field | WebGL/3D technology as decoration |
| Chrome platform guidance | Declarative scroll and view transitions reduce script work | CSS scroll timelines and MPA view transitions | JavaScript scroll polling for every reveal |
| W3C WCAG 2.2 | Focus, target size, contrast, semantics, controllable animation | 44px controls, focus rings, semantic landmarks, motion opt-out | Compliance as a final audit rather than a design input |

## Market patterns observed in mature 2025–2026 interfaces

The following patterns recur across well-maintained technical product sites:

- Sans-serif variable or system typography.
- Neutral palettes with one high-salience action color.
- Low border density.
- Large but not universally oversized type.
- Compact mono metadata.
- Content-led hero regions rather than stock illustrations.
- Native or near-native transitions.
- Motion tied to scroll progress or direct manipulation.
- Dark mode as a token substitution, not a separate composition.
- Documentation of accessibility and design tokens.
- Reduced dependency on client frameworks for content-heavy pages.

These are tendencies, not universal rules. The implementation adopts only patterns that support a technical archive.

## Direction explored and rejected

### 1. Product-marketing clone

A full-screen pinned sequence with image scaling, text replacement, and custom wheel timing was considered. It was rejected because the content is an archive, not a single product narrative. It would delay access, interfere with restoration and find-in-page, and produce poor value on repeat visits.

### 2. WebGL laboratory aesthetic

A Three.js particle field could create stronger visual spectacle. It was rejected because 2D topology communicates the same responsive-network idea with a much smaller payload and lower power cost.

### 3. Brutalist technical grid

A harder black/white grid with many visible lines and uppercase labels was considered. It was rejected because long Korean article bodies and English paper titles need a quieter reading environment.

### 4. Minimal white portfolio

A nearly unstyled white page would be fast and legible but would not satisfy the request for a distinctive interactive system. The selected direction retains minimal structure while adding controlled responsive behavior.

### 5. React/Next.js application shell

A React framework would make interactive composition familiar, but the site has no server state, authenticated views, complex shared client state, or application workflow. Shipping a component runtime for static Markdown would conflict with the performance and durability goals.

## Final direction: Instrumented Minimalism

The chosen concept is **Instrumented Minimalism**:

- Minimalism supplies hierarchy, quiet surfaces, and durable typography.
- Instrumentation supplies progress, filtering, topology, counters, and observable state.
- The site feels computational without using sci-fi imagery or terminal cosplay.
- Interaction is present at the edges of reading, not between the reader and the text.

## Visual QA criteria

A page is considered visually acceptable when:

- At 390px, no horizontal overflow occurs and primary controls remain at least 44px.
- At 768px, layout collapse feels intentional rather than merely stacked.
- At 1440px, text measure remains controlled and whitespace does not become empty decoration.
- The first viewport establishes purpose, action, and identity without relying on animation.
- Technical titles wrap naturally without clipping, extreme orphans, or tiny type.
- Light and dark themes preserve hierarchy and contrast.
- The canvas does not reduce text readability or dominate the hero.
- Scroll interaction remains understandable when animation is disabled.
