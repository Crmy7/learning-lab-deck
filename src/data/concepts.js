// Slides « concept » (5 → 11) pilotées par les données.
// `code` contient le code BRUT (le surlignage est appliqué à l'affichage).
// `bullets[].html` est injecté via v-html (peut contenir <b>, <code class="inl">…).
// Règle d'écriture : on vulgarise les explications (le jury n'est pas
// forcément 3D) ; les vrais termes restent mais sont toujours expliqués.

export const CONCEPTS = [
  {
    wm: '06',
    kicker: '06 · Concepts 1 → 3',
    titleHtml: 'Scène · Caméra · Renderer',
    bullets: [
      { ic: '1', html: '<b>La scène</b> — le « décor » : tout ce qu’on affiche (objets, lumières) y est rangé.' },
      { ic: '2', html: '<b>La caméra</b> — le point de vue, comme l’œil du spectateur : on choisit l’angle de vue et la position.' },
      { ic: '3', html: '<b>Le renderer</b> — le « peintre » : il dessine la scène, image par image, dans la page.' },
    ],
    file: 'lib/three/engine.ts',
    lang: 'three.js',
    code: `// CONCEPT №1 — La scène : un arbre d'objets & de lumières
this.scene = new THREE.Scene()

// CONCEPT №2 — La caméra (fov, ratio, near, far)
this.camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 50)
this.camera.position.set(1.15, 0.72, 1.35)

// CONCEPT №3 — Le renderer : dessine dans le <canvas>
this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
this.renderer.setSize(w, h)
this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
this.renderer.toneMapping = THREE.ACESFilmicToneMapping`,
  },
  {
    wm: '07',
    kicker: '07 · Concept',
    titleHtml: 'Un mesh = une forme + une « peau »',
    bullets: [
      { ic: '▰', html: '<b>La forme</b> (geometry) — la silhouette de l’objet. Ici, elle vient du modèle de canette.' },
      { ic: '◐', html: '<b>La matière</b> (material) — sa « peau ». Elle réagit à la lumière comme dans la vraie vie : on règle son côté <b>métallique</b> et sa <b>rugosité</b>.' },
      { ic: '↻', html: 'On <b>parcourt</b> le modèle pour habiller chaque pièce avec la bonne matière.' },
    ],
    file: 'utils/createCan.js · NOVA',
    lang: 'three.js',
    code: `// La « peau » aluminium poli de la canette
const aluminum = new THREE.MeshStandardMaterial({
  color: 0xf0f2f5,
  metalness: 0.9,       // très métallique
  roughness: 0.26,      // poli → reflets nets
  envMapIntensity: 1.8, // capte l'environnement
})

// On habille chaque mesh du modèle importé
gltfScene.traverse((o) => {
  if (o.isMesh) o.material = aluminum
})`,
  },
  {
    wm: '08',
    kicker: '08 · Concept 5',
    titleHtml: 'Mettre en lumière la scène',
    bullets: [
      { ic: '☀', html: 'On utilise une <b>photo de studio à 360°</b> (une « HDRI ») comme <b>source de lumière</b>. C’est ce qui rend les reflets et le velours crédibles.' },
      { ic: '▮', html: 'On ajoute un <b>projecteur</b> orienté — le seul à dessiner l’<b>ombre portée</b> au sol.' },
      { ic: '⚑', html: 'Petite touche : dans NOVA, la lumière <b>change de couleur selon la saveur</b>.' },
    ],
    file: 'lib/three/engine.ts',
    lang: 'three.js',
    code: `// CONCEPT №5 — Une vraie HDRI éclaire les matériaux PBR
const env = await new RGBELoader().loadAsync('/hdri/studio.hdr')
const pmrem = new THREE.PMREMGenerator(this.renderer)
this.scene.environment = pmrem.fromEquirectangular(env).texture

// + une key light directionnelle pour l'ombre portée
this.keyLight = new THREE.DirectionalLight(0xffffff, 1.6)
this.keyLight.position.set(1.8, 2.6, 1.4)
this.keyLight.castShadow = true
this.scene.add(this.keyLight)`,
  },
  {
    wm: '09',
    kicker: '09 · Concept 7',
    titleHtml: 'La boucle d’animation',
    bullets: [
      { ic: '↺', html: 'Le navigateur nous redonne la main <b>~60 fois par seconde</b>, pile au rythme de l’écran.' },
      { ic: '⊙', html: 'À chaque image : on <b>met à jour</b> (position, rotation…) <b>puis on redessine</b>.' },
      { ic: '⏱', html: 'Un petit <b>chronomètre</b> donne le temps écoulé — la base de toutes les animations.' },
    ],
    file: 'lib/three/engine.ts',
    lang: 'three.js',
    code: `// CONCEPT №7 — La boucle de rendu
tick = () => {
  this.frameId = requestAnimationFrame(this.tick)
  const t = this.clock.getElapsedTime()

  // 1. mettre à jour
  this.controls.update()        // inertie + auto-rotation
  // 2. rendre une image
  this.renderer.render(this.scene, this.camera)
}`,
  },
  {
    wm: '10',
    kicker: '10 · Concept 6',
    titleHtml: 'Tourner autour de l’objet',
    bullets: [
      { ic: '⟲', html: 'On fait <b>pivoter la caméra autour de l’objet</b> en glissant, et on <b>zoome</b> à la molette.' },
      { ic: '≈', html: 'Une <b>inertie douce</b> prolonge le mouvement après le glissement — l’effet « premium ».' },
      { ic: '⊓', html: 'On <b>limite</b> le zoom et l’angle pour ne jamais passer sous le sol.' },
    ],
    file: 'lib/three/engine.ts',
    lang: 'addons',
    code: `// CONCEPT №6 — OrbitControls : caméra orbitale
this.controls = new OrbitControls(this.camera, canvas)
this.controls.target.set(0, 0.32, 0)
this.controls.enableDamping = true   // inertie
this.controls.dampingFactor = 0.06
this.controls.minDistance = 0.8      // zoom min
this.controls.maxDistance = 3.5      // zoom max
this.controls.maxPolarAngle = Math.PI / 2 - 0.03 // pas sous le sol`,
  },
  {
    wm: '11',
    kicker: '11 · Concept 8',
    titleHtml: 'Savoir quel objet on a cliqué',
    bullets: [
      { ic: '⌖', html: 'On traduit la <b>position du clic</b> à l’écran en repère que la 3D comprend.' },
      { ic: '➶', html: 'On <b>lance un rayon</b> depuis la caméra à travers ce point — comme un laser.' },
      { ic: '◎', html: 'Le <b>1<sup>er</sup> objet touché</b> par le rayon, c’est la pièce que l’utilisateur veut modifier.' },
    ],
    file: 'lib/three/engine.ts · configurateur',
    lang: 'three.js',
    code: `// CONCEPT №8 — Quel objet a-t-on cliqué ?
// 1. pixel → coordonnées normalisées [-1, 1]
this.pointer.x = (e.clientX / rect.width) * 2 - 1
this.pointer.y = -(e.clientY / rect.height) * 2 + 1

// 2. un rayon depuis la caméra à travers ce pixel
this.raycaster.setFromCamera(this.pointer, this.camera)
const hits = this.raycaster.intersectObjects(group.children, true)

// 3. le 1er objet touché = la pièce sélectionnée
const part = hits[0]?.object.userData.partId ?? null`,
  },
  {
    wm: '12',
    kicker: '12 · Concept 4',
    titleHtml: 'glTF — « le JPEG de la 3D »',
    bullets: [
      { ic: '📦', html: 'Un fichier <code class="inl">.glb</code> contient <b>tout l’objet</b> : sa forme, ses images de surface et ses matériaux, préparés par un designer.' },
      { ic: '⤓', html: 'Le chargement prend un instant : on l’<b>attend</b> avant d’afficher la scène.' },
      { ic: '↻', html: 'On <b>parcourt</b> le modèle pour ranger chaque pièce (assise, bois, métal) — utile pour le clic.' },
    ],
    file: 'lib/three/product.ts',
    lang: 'three.js',
    code: `// CONCEPT №4 — Charger un modèle 3D réel (.glb)
const gltf = await new GLTFLoader().loadAsync('/models/chair.glb')

// Ranger les meshes par pièce, pour le raycasting
gltf.scene.traverse((obj) => {
  if (!(obj instanceof THREE.Mesh)) return
  obj.castShadow = true
  const part = ['fabric', 'wood', 'metal']
    .find((p) => obj.name.toLowerCase().includes(p))
  if (part) meshesByPart[part].push(obj)
})`,
  },
]
