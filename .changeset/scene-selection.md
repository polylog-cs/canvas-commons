---
'@canvas-commons/core': minor
'@canvas-commons/editor': minor
---

Add a Scenes panel to the editor for restricting the timeline to selected
scenes. Scenes outside the selection are neither calculated nor played, so
working on one scene no longer waits for the others. `Player`, `Renderer` and
`PlaybackManager` gain a `selectScenes` method for the same purpose.
