# Documentation

Start here.

| If you want to… | Read |
| --- | --- |
| Put your own name and work on it | [content.md](content.md) |
| Change colours, type, or spacing | [design-system.md](design-system.md) |
| Understand how the code is arranged | [architecture.md](architecture.md) |
| Add or change an animation | [motion.md](motion.md) |
| Know what was promised on accessibility | [accessibility.md](accessibility.md) |
| Keep it fast | [performance.md](performance.md) |
| Ship it | [deployment.md](deployment.md) |
| Work on it with someone else | [contributing.md](contributing.md) |

Higher level: [../README.md](../README.md) · [../ROADMAP.md](../ROADMAP.md) ·
[../CHANGELOG.md](../CHANGELOG.md)

---

## The short version

The site is one page, seven sections, two runtime dependencies, and one content file.

Three rules explain most decisions you will find in the code:

1. **Content is data.** Nothing a visitor reads is written inside a component. If you find
   yourself editing JSX to change a word, something has gone wrong.
2. **A rule lives in exactly one place.** Colours and sizes in `tokens.css`, shared primitives
   in `base.css`, everything else in the one component that uses it.
3. **Motion answers a question.** Where did this come from, where did it go, how far through am
   I, is this thing interactive. If an animation answers none of those, it does not ship.
