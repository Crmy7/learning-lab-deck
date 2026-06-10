# Learning Lab — Deck Three.js (Vue 3)

Présentation de soutenance refaite en **application Vue 3 + Vite** (et non plus
en HTML statique). 18 slides, thème violet repris de la saveur « Baie Givrée »
du POC NOVA, extraits de code réels des deux POC avec coloration syntaxique
maison.

## Lancer

```bash
npm install
npm run dev      # → http://localhost:4600
npm run build    # build statique dans dist/
npm run preview  # prévisualise le build
```

## Navigation

- **← → · espace · PageUp/Down** — slide précédente / suivante
- **clic** (moitié droite / gauche), **swipe** mobile
- **Home / End** — première / dernière slide
- **F** — plein écran

## Architecture

| Fichier | Rôle |
| --- | --- |
| `src/App.vue` | Compose les 18 slides + navigation (clavier / clic / swipe) |
| `src/composables/useDeck.js` | État de navigation partagé (index courant, total, `go()`) |
| `src/utils/highlight.js` | Coloration syntaxique JS/TS sans dépendance |
| `src/data/concepts.js` | Slides « concept » 5→11, pilotées par les données |
| `src/data/flavors.js` | Palette réelle des 5 saveurs NOVA |
| `src/components/SlideShell.vue` | Enveloppe d'une slide (état actif, watermark, glow) |
| `src/components/CodeBlock.vue` | Panneau de code surligné |
| `src/components/ConceptCodeSlide.vue` | Slide concept réutilisable (explication + code) |
| `src/components/FlavorGrid.vue` | Grille des saveurs (DA des canettes) |
| `src/deck.css` | Thème violet + animations |

## À compléter avant la soutenance

- Slide 1 : remplacer **« Vos noms »**.
- Slide 18 : remplacer les **URLs des QR codes** par vos liens déployés
  (ou retirer les QR si la démo est en local).
