---
'@canvas-commons/2d': minor
'@canvas-commons/vite-plugin': patch
---

Typeset `Latex` with MathJax 4. Formulas now use New Computer Modern, which
differs slightly in glyph shapes from the previous TeX font. A new `font` prop
selects TeX Gyre Schola with `'mathjax-schola'`, and `loadLatexFont` loads a
font up front so that formulas using it never make the scene wait.
