<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useDeck } from './composables/useDeck'
import { CONCEPTS } from './data/concepts'
import SlideShell from './components/SlideShell.vue'
import CodeBlock from './components/CodeBlock.vue'
import ConceptCodeSlide from './components/ConceptCodeSlide.vue'
import FlavorGrid from './components/FlavorGrid.vue'

const { current, total, go, setTotal } = useDeck()

// Index de départ des slides « concept » (après les 5 premières :
// titre, pourquoi, histoire, fondamentaux, repère 3D).
const CONCEPT_BASE = 5
const TOTAL = CONCEPT_BASE + CONCEPTS.length + 7 // 5 + 7 + 7 = 19
setTotal(TOTAL)

const pad = (n) => String(n).padStart(2, '0')
const counter = computed(() => `${pad(current.value + 1)} / ${pad(total.value)}`)
const progress = computed(() => `${((current.value + 1) / total.value) * 100}%`)

// Index des slides bespoke qui suivent le bloc concepts.
const i = {
  roadmap: CONCEPT_BASE + CONCEPTS.length, // 11
  novaIntro: CONCEPT_BASE + CONCEPTS.length + 1, // 12
  novaDA: CONCEPT_BASE + CONCEPTS.length + 2, // 13
  config: CONCEPT_BASE + CONCEPTS.length + 3, // 14
  bridge: CONCEPT_BASE + CONCEPTS.length + 4, // 15
  bilan: CONCEPT_BASE + CONCEPTS.length + 5, // 16
  thanks: CONCEPT_BASE + CONCEPTS.length + 6, // 17
}

// --- Code embarqué dans les slides ---
const cameraCode = `// La caméra est juste un point dans l'espace…
camera.position.set(1.15, 0.72, 1.35) // x, y, z

// …qui regarde un endroit précis
camera.lookAt(0, 0, 0)                 // l'origine`

const novaCode = `// L'étiquette est PEINTE puis posée comme texture
const texture = new THREE.CanvasTexture(canvas)
labelBaseMat.map = makeLabelTexture(flavor)

// Changement de saveur = crossfade (GSAP)
gsap.to(labelFadeMat, { opacity: 1, duration: 0.7 })
gsap.to(rimLight.color, { ...pick(flavor.rim) })`

const configCode = `// Variante teintée : texture grise + couleur multipliée
function tinted(base, grayMap, hex) {
  const material = base.clone()  // garde normalMap, sheen…
  material.map = grayMap
  material.color.set(hex)        // la teinte choisie
  if (material.sheen > 0)
    material.sheenColor.set(hex) // reflet velours assorti
  return material
}

// Clic sur une pièce → matériau réassigné en direct
applyVariant('fabric', variants.fabric[fabricId])`

const bridgeCode = `// Vue gère l'ÉTAT · Three.js gère les PIXELS
onMounted(() => {
  engine = new ConfiguratorEngine(canvas, onSelectPart)
})
onUnmounted(() => engine.dispose()) // libère le GPU

// Chaque état Vue → un appel d'API du moteur 3D
watch(() => state.value.fabric, (f) => engine.setFabric(f))
watch(() => state.value.wood,   (w) => engine.setWood(w))`

// --- Navigation : clavier, clic, swipe ---
function onKey(e) {
  if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(e.key)) { e.preventDefault(); go(current.value + 1) }
  if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); go(current.value - 1) }
  if (e.key === 'Home') go(0)
  if (e.key === 'End') go(total.value - 1)
  if (e.key === 'f' || e.key === 'F') document.documentElement.requestFullscreen?.()
}

function onClick(e) {
  if (e.target.closest('a, img, pre, .code')) return
  go(e.clientX > window.innerWidth / 2 ? current.value + 1 : current.value - 1)
}

let tx = 0
const onTouchStart = (e) => { tx = e.touches[0].clientX }
const onTouchEnd = (e) => {
  const dx = e.changedTouches[0].clientX - tx
  if (Math.abs(dx) > 50) go(dx < 0 ? current.value + 1 : current.value - 1)
}

onMounted(() => {
  document.addEventListener('keydown', onKey)
  addEventListener('touchstart', onTouchStart, { passive: true })
  addEventListener('touchend', onTouchEnd, { passive: true })
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  removeEventListener('touchstart', onTouchStart)
  removeEventListener('touchend', onTouchEnd)
})
</script>

<template>
  <div class="progress" :style="{ width: progress }" />
  <div class="deck" @click="onClick">

    <!-- 1 — TITRE -->
    <SlideShell :index="0">
      <div class="kicker">Learning Lab · Soutenance M2</div>
      <h1><span class="accent">Three.js</span><br>Des expériences 3D temps réel</h1>
      <p class="lead">De la canette manipulable au configurateur de mobilier — la 3D interactive directement dans une page web, <span class="hl">sans rien installer.</span></p>
      <div class="meta">
        <span><b>Projet</b> · 2 POC déployés en production</span>
        <span><b>Vos noms</b> · Équipe Learning Lab</span>
        <span><b>2026</b></span>
      </div>
    </SlideShell>

    <!-- 2 — POURQUOI THREE.JS -->
    <SlideShell :index="1" wm="02">
      <div class="kicker">02 · Le choix technologique</div>
      <h2>Pourquoi <span style="color:var(--accent)">Three.js</span> ?</h2>
      <div class="cols">
        <div>
          <ul class="clean">
            <li><span class="ic">↗</span><span><b>La 3D web explose</b> — e-commerce, configurateurs produits, portfolios, data viz.</span></li>
            <li><span class="ic">⚙</span><span><b>WebGL existe dans tous les navigateurs, mais c'est très technique</b> — des centaines de lignes de code pour afficher un simple cube.</span></li>
            <li><span class="ic">◎</span><span><b>Three.js simplifie WebGL</b> — on place un décor, une caméra et des lumières, comme sur un plateau de tournage, au lieu d'écrire des calculs complexes.</span></li>
          </ul>
          <div class="pill-row" style="margin-top:1.8rem">
            <span class="pill">Open source · MIT</span>
            <span class="pill">~100k ★ GitHub</span>
            <span class="pill">React Three Fiber · drei</span>
            <span class="pill">Cohérent avec notre stack JS</span>
          </div>
        </div>
        <div>
          <div class="card">
            <span class="tag">Alternatives écartées</span>
            <ul class="clean reject" style="gap:.85rem">
              <li><span class="ic">✕</span><span><b>Babylon.js</b> — complet mais orienté jeu vidéo, plus lourd, communauté + petite.</span></li>
              <li><span class="ic">✕</span><span><b>WebGL pur</b> — trop bas niveau pour un module court.</span></li>
              <li><span class="ic">✕</span><span><b>Unity WebGL</b> — export lourd (dizaines de Mo), pas « web léger ».</span></li>
              <li><span class="ic">✕</span><span><b>Spline / no-code</b> — rapide mais on n'apprend pas à coder, intégration limitée.</span></li>
            </ul>
          </div>
        </div>
      </div>
    </SlideShell>

    <!-- 3 — HISTOIRE -->
    <SlideShell :index="2" wm="03">
      <div class="kicker">03 · Petite histoire</div>
      <h2>15 ans d'open source</h2>
      <div class="timeline">
        <div class="tl-item">
          <div class="tl-year">2010</div>
          <p>Création par Ricardo Cabello, alias <b>« Mr.doob »</b> — d'abord en ActionScript (Flash), puis porté en JavaScript.</p>
        </div>
        <div class="tl-item">
          <div class="tl-year">2011</div>
          <p>WebGL arrive dans Chrome &amp; Firefox. Three.js devient la porte d'entrée naturelle vers la 3D web.</p>
        </div>
        <div class="tl-item">
          <div class="tl-year">2013 — 2015</div>
          <p>Adoption massive : Chrome Experiments, clips interactifs, sites primés aux Awwwards.</p>
        </div>
        <div class="tl-item">
          <div class="tl-year">Aujourd'hui</div>
          <p>Releases mensuelles (r170+), support <b>WebGPU</b> en cours (successeur de WebGL), écosystème React Three Fiber. L'un des projets open source les plus actifs de GitHub.</p>
        </div>
      </div>
    </SlideShell>

    <!-- 4 — CONCEPTS OVERVIEW -->
    <SlideShell :index="3" wm="04">
      <div class="kicker">04 · Les fondamentaux</div>
      <h2>La métaphore du plateau de tournage</h2>
      <div class="flow">
        <div class="flow-node"><div class="fn-t">Scene</div><div class="fn-d">le plateau · tous les objets</div></div>
        <div class="flow-arrow">→</div>
        <div class="flow-node"><div class="fn-t">Camera</div><div class="fn-d">l'œil du spectateur</div></div>
        <div class="flow-arrow">→</div>
        <div class="flow-node accent"><div class="fn-t">Renderer</div><div class="fn-d">filme &amp; dessine le &lt;canvas&gt;</div></div>
      </div>
      <div class="cols-3" style="grid-template-columns:repeat(4,1fr)">
        <div class="card"><h3><span class="dot">›</span> Camera</h3><p>Le point de vue : on choisit l'angle et l'endroit d'où on regarde la scène.</p></div>
        <div class="card"><h3><span class="dot">›</span> Mesh</h3><p><b>Une forme + une « peau »</b> — la silhouette et son apparence (couleur, matière, reflets).</p></div>
        <div class="card"><h3><span class="dot">›</span> Lumières</h3><p>Ambiante, projecteur, photo d'environnement. Sans lumière, les objets restent noirs.</p></div>
        <div class="card"><h3><span class="dot">›</span> Boucle d'animation</h3><p>Le navigateur <b>redessine ~60 fois par seconde</b>. C'est là que tout bouge.</p></div>
      </div>
      <p class="lead" style="margin-top:1.6rem;font-size:1rem">Les slides suivantes déroulent ces concepts <span class="hl">avec le code réel de nos deux POC</span> — chaque brique est balisée <code class="inl">CONCEPT №x</code> dans nos fichiers source.</p>
    </SlideShell>

    <!-- 5 — LE REPÈRE 3D (x, y, z) -->
    <SlideShell :index="4" wm="05">
      <div class="kicker">05 · Le repère 3D</div>
      <h2>Se repérer dans l'espace : <span style="color:var(--accent)">x, y, z</span></h2>
      <div class="split">
        <div>
          <ul class="clean tight">
            <li><span class="ic">⤢</span><span>Chaque objet a une position dans <b>3 directions</b> : <b style="color:#FF8FA3">X</b> (gauche ↔ droite), <b style="color:#86E7B0">Y</b> (bas ↔ haut), <b style="color:#79C7FF">Z</b> (avant ↔ arrière).</span></li>
            <li><span class="ic">◉</span><span>L'<b>origine</b> <code class="inl">(0, 0, 0)</code> est le centre du monde — souvent là où on pose l'objet.</span></li>
            <li><span class="ic">🎥</span><span>La caméra n'est qu'un <b>point dans cet espace</b> : on lui donne une position et on lui dit quoi regarder.</span></li>
          </ul>
          <CodeBlock file="lib/three/engine.ts" lang="three.js" :code="cameraCode" style="margin-top:1.2rem" />
        </div>
        <div class="axes-wrap">
          <svg viewBox="0 0 600 430" role="img" aria-label="Repère 3D x y z en vue de face et plongée : X horizontal, Y vertical, Z en profondeur, avec la caméra en hauteur qui regarde l'objet vers le bas">
            <defs>
              <marker id="axr" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto-start-reverse"><path d="M0,0 L9,4.5 L0,9 Z" fill="#FF8FA3"/></marker>
              <marker id="axg" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto-start-reverse"><path d="M0,0 L9,4.5 L0,9 Z" fill="#86E7B0"/></marker>
              <marker id="axb" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto-start-reverse"><path d="M0,0 L9,4.5 L0,9 Z" fill="#79C7FF"/></marker>
              <radialGradient id="obj" cx="38%" cy="32%" r="72%">
                <stop offset="0" stop-color="#ECD6FF"/>
                <stop offset="55%" stop-color="#A974E6"/>
                <stop offset="100%" stop-color="#5B3A8C"/>
              </radialGradient>
            </defs>

            <!-- sol (plan XZ) vu de dessous : contre-plongée → le fond remonte -->
            <polygon points="237,196 537,196 363,330 63,330" fill="rgba(211,140,255,.05)" stroke="rgba(211,140,255,.14)" stroke-width="1"/>

            <!-- AXES (double flèche = les 2 sens). Vue de face : X horizontal, Y vertical, Z en profondeur -->
            <line x1="180" y1="356" x2="420" y2="168" stroke="#79C7FF" stroke-width="2.4" marker-start="url(#axb)" marker-end="url(#axb)"/>
            <line x1="80" y1="262" x2="520" y2="262" stroke="#FF8FA3" stroke-width="2.4" marker-start="url(#axr)" marker-end="url(#axr)"/>
            <line x1="300" y1="388" x2="300" y2="72" stroke="#86E7B0" stroke-width="2.4" marker-start="url(#axg)" marker-end="url(#axg)"/>

            <!-- objet à l'origine -->
            <ellipse cx="300" cy="286" rx="15" ry="4.5" fill="rgba(0,0,0,.28)"/>
            <circle cx="300" cy="262" r="15" fill="url(#obj)" stroke="#C9A6FF" stroke-width=".6"/>
            <circle cx="295" cy="256" r="3.4" fill="#fff" opacity=".7"/>

            <!-- caméra EN HAUTEUR (plongée) : un point (position) orienté vers l'objet en contrebas -->
            <polygon points="158,128 300,238 264,288" fill="rgba(211,140,255,.07)" stroke="rgba(211,140,255,.26)" stroke-width="1" stroke-dasharray="4 4"/>
            <line x1="158" y1="128" x2="300" y2="262" stroke="#D38CFF" stroke-width="1.4" stroke-dasharray="5 4" opacity=".75"/>
            <g transform="translate(140,112) rotate(43.2)">
              <rect x="-20" y="-14" width="28" height="28" rx="5" fill="#1b0f2e" stroke="#D38CFF" stroke-width="2"/>
              <rect x="-13" y="-21" width="12" height="8" rx="2" fill="#1b0f2e" stroke="#D38CFF" stroke-width="2"/>
              <polygon points="8,-9 24,-14 24,14 8,9" fill="#2a1840" stroke="#D38CFF" stroke-width="2"/>
              <circle cx="19" cy="0" r="4" fill="#D38CFF"/>
            </g>

            <!-- labels axes : lettre (sens +) + sens opposé -->
            <text x="312" y="76" font-family="Archivo Black, sans-serif" font-size="22" fill="#86E7B0">Y</text>
            <text x="312" y="94" font-family="Space Grotesk, sans-serif" font-size="13" fill="#86E7B0" opacity=".85">haut</text>
            <text x="312" y="392" font-family="Space Grotesk, sans-serif" font-size="13" fill="#86E7B0" opacity=".55">bas</text>

            <text x="528" y="258" font-family="Archivo Black, sans-serif" font-size="22" fill="#FF8FA3">X</text>
            <text x="528" y="276" font-family="Space Grotesk, sans-serif" font-size="13" fill="#FF8FA3" opacity=".85">droite</text>
            <text x="72" y="256" text-anchor="end" font-family="Space Grotesk, sans-serif" font-size="13" fill="#FF8FA3" opacity=".55">gauche</text>

            <text x="150" y="360" text-anchor="end" font-family="Archivo Black, sans-serif" font-size="22" fill="#79C7FF">Z</text>
            <text x="150" y="378" text-anchor="end" font-family="Space Grotesk, sans-serif" font-size="13" fill="#79C7FF" opacity=".85">vers vous</text>
            <text x="426" y="164" font-family="Space Grotesk, sans-serif" font-size="13" fill="#79C7FF" opacity=".55">arrière</text>

            <!-- annotations -->
            <text x="206" y="248" text-anchor="end" font-family="Space Grotesk, sans-serif" font-size="13" fill="#A9A0B8">objet (0, 0, 0)</text>
            <text x="140" y="84" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-weight="600" font-size="15" fill="#F4EEFA">caméra</text>
            <text x="190" y="116" font-family="Space Grotesk, sans-serif" font-size="12" fill="#A9A0B8">position</text>
            <text x="214" y="172" font-family="Space Grotesk, sans-serif" font-size="12" fill="#D38CFF">orientation</text>
          </svg>
        </div>
      </div>
    </SlideShell>

    <!-- 6 → 12 — CONCEPTS (data-driven) -->
    <ConceptCodeSlide
      v-for="(c, idx) in CONCEPTS"
      :key="c.wm"
      :index="CONCEPT_BASE + idx"
      :concept="c"
    />

    <!-- 12 — ROADMAP -->
    <SlideShell :index="i.roadmap" wm="13">
      <div class="kicker">13 · Notre démarche</div>
      <h2>Roadmap d'apprentissage</h2>
      <div class="phases">
        <div class="phase"><div class="ph-n">Phase 1</div><h4>Veille &amp; comparaison</h4><p>Benchmark des technos 3D, lecture de la doc, périmètre du POC.</p></div>
        <div class="phase"><div class="ph-n">Phase 2</div><h4>Fondamentaux</h4><p>threejs.org, Three.js Journey (Bruno Simon), YouTube, Discord.</p></div>
        <div class="phase"><div class="ph-n">Phase 3</div><h4>Prototypes</h4><p>Cube qui tourne, OrbitControls, import glTF/GLB.</p></div>
        <div class="phase"><div class="ph-n">Phase 4</div><h4>POC réels</h4><p>Deux cas d'usage : marketing immersif + configurateur e-commerce.</p></div>
        <div class="phase"><div class="ph-n">Phase 5</div><h4>Optimisation</h4><p>Compression Draco, perfs mobile, déploiement Vercel.</p></div>
      </div>
      <div class="card hi" style="margin-top:2.2rem">
        <span class="tag">Difficultés rencontrées</span>
        <p style="color:var(--text)">L'éclairage qui change tout le rendu · le poids des modèles 3D · la gestion des performances · le repère 3D (axes x/y/z) au début.</p>
      </div>
    </SlideShell>

    <!-- 13 — POC NOVA INTRO -->
    <SlideShell :index="i.novaIntro" wm="14">
      <div class="kicker">14 · POC n°1</div>
      <h2><span style="color:var(--accent)">NOVA</span> — la canette 3D</h2>
      <div class="cols">
        <div>
          <p class="lead" style="margin-bottom:1.6rem">Landing page produit pour une boisson énergisante. <span class="hl">Canette 3D manipulable</span> — 5 saveurs, glisser pour faire tourner, la texture et l'ambiance colorée changent en direct.</p>
          <ul class="clean">
            <li><span class="ic">↳</span><span><b>Le cas réel :</b> pages produit immersives type Apple, Red Bull — la 3D au service du storytelling de marque.</span></li>
          </ul>
          <div class="demo-flag"><span class="live" /> Démo live</div>
        </div>
        <div class="card">
          <span class="tag">Ce que ça nous a appris</span>
          <ul class="clean" style="gap:.85rem">
            <li><span class="ic">·</span><span>Import &amp; texturing d'un modèle de canette (GLB)</span></li>
            <li><span class="ic">·</span><span>Rotation par interaction souris / touch + inertie</span></li>
            <li><span class="ic">·</span><span>Transitions douces entre les saveurs (fondu enchaîné)</span></li>
            <li><span class="ic">·</span><span>Le texte de la page change en même temps que la canette</span></li>
            <li><span class="ic">·</span><span>460 bulles qui s'écartent quand on passe la souris</span></li>
          </ul>
        </div>
      </div>
    </SlideShell>

    <!-- 14 — POC NOVA · DA + CODE -->
    <SlideShell :index="i.novaDA" wm="15">
      <div class="kicker">15 · POC n°1</div>
      <h2>Une étiquette <span style="color:var(--accent)">peinte en code</span></h2>
      <p class="lead" style="font-size:1rem;max-width:80ch;margin-bottom:.4rem">Chaque saveur pilote une <span class="hl">palette complète</span> — canette, accent, fond, glow, particules. « Baie Givrée » <span style="color:var(--accent)">#a32cf0</span> a inspiré le thème violet de cette présentation.</p>
      <FlavorGrid />
      <div class="split" style="margin-top:1.6rem">
        <div>
          <ul class="clean tight">
            <li><span class="ic">🖌</span><span>L'étiquette n'est pas une image toute faite : elle est <b>dessinée par le code</b> (dégradé, logo, infos), puis « collée » sur la canette.</span></li>
            <li><span class="ic">⟂</span><span>Changer de saveur = un <b>fondu enchaîné</b> entre deux étiquettes ; la lumière d'ambiance suit.</span></li>
          </ul>
        </div>
        <CodeBlock file="utils/createCan.js" lang="canvas + gsap" :code="novaCode" />
      </div>
    </SlideShell>

    <!-- 15 — POC CONFIGURATEUR -->
    <SlideShell :index="i.config" wm="16">
      <div class="kicker">16 · POC n°2</div>
      <h2>Le configurateur mobilier</h2>
      <div class="split">
        <div>
          <p class="lead" style="font-size:1.05rem;margin-bottom:1.2rem">Configurateur de fauteuil — l'utilisateur change <span class="hl">matériaux, couleurs et finitions en temps réel.</span></p>
          <ul class="clean tight">
            <li><span class="ic">$</span><span><b>LE cas d'usage e-commerce</b> de Three.js — IKEA, configurateurs auto. La 3D réduit les retours et augmente la conversion.</span></li>
            <li><span class="ic">⇄</span><span><b>Complémentaire à NOVA :</b> immersif marketing d'un côté, fonctionnel orienté conversion de l'autre.</span></li>
            <li><span class="ic">◐</span><span><b>L'astuce :</b> on part d'une seule matière en gris et on la <b>recolore</b> à la volée → le relief, les plis et le velours sont gardés.</span></li>
          </ul>
          <div class="demo-flag"><span class="live" /> Démo live</div>
        </div>
        <CodeBlock file="lib/three/product.ts" lang="three.js" :code="configCode" />
      </div>
    </SlideShell>

    <!-- 16 — PONT VUE / THREE -->
    <SlideShell :index="i.bridge" wm="17">
      <div class="kicker">17 · Architecture</div>
      <h2>Le pont <span style="color:var(--accent)">Vue ⇄ Three.js</span></h2>
      <div class="split">
        <div>
          <ul class="clean tight">
            <li><span class="ic">◧</span><span><b>Vue gère l'interface</b>, <b>Three.js gère l'image 3D</b> — chacun son rôle, jamais l'inverse.</span></li>
            <li><span class="ic">↪</span><span>Quand l'utilisateur change une option, Vue prévient le moteur 3D, qui met à jour la scène.</span></li>
            <li><span class="ic">♻</span><span>En quittant la page, on <b>libère la mémoire de la carte graphique</b> — sinon elle s'accumule.</span></li>
          </ul>
        </div>
        <CodeBlock file="components/SceneViewport.vue" lang="nuxt + three.js" :code="bridgeCode" />
      </div>
    </SlideShell>

    <!-- 17 — BILAN -->
    <SlideShell :index="i.bilan" wm="18">
      <div class="kicker">18 · Bilan &amp; perspectives</div>
      <h2>De zéro à deux POC en prod</h2>
      <div class="cols">
        <div class="card">
          <span class="tag">Ce qu'on a appris</span>
          <ul class="clean" style="gap:.85rem">
            <li><span class="ic">✓</span><span>Les 9 concepts fondamentaux de Three.js</span></li>
            <li><span class="ic">✓</span><span>Pipeline 3D web : modèle → optimisation → intégration → déploiement</span></li>
            <li><span class="ic">✓</span><span><b>Montée en compétence autonome</b> sur une techno inconnue — la vraie compétence R&amp;D évaluée.</span></li>
          </ul>
        </div>
        <div class="card hi">
          <span class="tag">Et après ?</span>
          <ul class="clean" style="gap:.85rem">
            <li><span class="ic">→</span><span><b>React Three Fiber</b> pour l'intégration dans des apps modernes</span></li>
            <li><span class="ic">→</span><span><b>WebGPU</b> pour les perfs futures</span></li>
            <li><span class="ic">→</span><span><b>AR / WebXR</b> — essayer le canapé dans son salon</span></li>
            <li><span class="ic">→</span><span>Application en contexte pro / alternance</span></li>
          </ul>
        </div>
      </div>
      <p class="lead" style="margin-top:2rem;max-width:74ch"><span class="hl">« La 3D web n'est plus réservée aux studios spécialisés</span> — c'est une compétence qu'on peut désormais proposer en entreprise. »</p>
    </SlideShell>

    <!-- 18 — MERCI -->
    <SlideShell :index="i.thanks" center>
      <div class="kicker">Merci</div>
      <h1 style="font-size:clamp(3rem,7vw,6rem)">Questions ?</h1>
      <div class="qr-row">
        <div class="qr">
          <div class="box"><img alt="QR NOVA" src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://nova-poc.vercel.app"></div>
          <span>POC · NOVA</span>
        </div>
        <div class="qr">
          <div class="box"><img alt="QR Configurateur" src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://configurateur-poc.vercel.app"></div>
          <span>POC · Configurateur</span>
        </div>
      </div>
    </SlideShell>

  </div>

  <div class="pagefoot">
    <span class="brand-sm">Learning Lab</span>
    <span>{{ counter }}</span>
  </div>
  <div class="nav-hint">← → · espace · pour naviguer</div>
</template>
