import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import * as dat from 'dat.gui'

// Scene
const scene = new THREE.Scene()

// Debug UI
const gui = new dat.GUI()
let textureIndex = 1

const textureFolder = gui.addFolder('Texture')
const guiParameter = {
  changeTexture: 1,
}
textureFolder
  .add(guiParameter, 'changeTexture')
  .min(1)
  .max(8)
  .step(1)
  .name('name')
  .onChange(() => {
    textureIndex = guiParameter.changeTexture
    console.log(textureIndex)
  })

// Axes Helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

// Fonts
const fontLoader = new FontLoader()

// Texture
const textLoader = new THREE.TextureLoader()
const matcapTexture = textLoader.load(`/matcaps/${textureIndex}.png`)

fontLoader.load(
  '/fonts/helvetiker_regular.typeface.json',

  // onLoad callback
  (font) => {
    const textGeometry = new TextGeometry('Become™', {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 3,
    })
    // Move textGeometry in center
    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5
    // )

    // Much faster way
    textGeometry.center()

    const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
    // textMaterial.wireframe = true
    const text = new THREE.Mesh(textGeometry, material)
    scene.add(text)

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

    console.time('donuts')
    // Add Donut Geometry
    for (let i = 0; i < 100; i++) {
      const donut = new THREE.Mesh(donutGeometry, material)

      // Randomize
      donut.position.x = (Math.random() - 0.5) * 10
      donut.position.y = (Math.random() - 0.5) * 10
      donut.position.z = (Math.random() - 0.5) * 10

      donut.rotation.x = Math.random() * Math.PI
      donut.rotation.y = Math.random() * Math.PI

      const scale = Math.random()
      donut.scale.set(scale, scale, scale)

      scene.add(donut)
    }
    console.timeEnd('donuts')
  },

  // onProgress callback
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  },

  // onError callback
  (err) => {
    console.log('An error happened')
  }
)

// Sizes
const sizes = {
  width: innerWidth,
  height: innerHeight,
}
const aspectRatio = sizes.width / sizes.height

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Renderer & its Size
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Window Resize
window.addEventListener('resize', () => {
  // Update Canvas Size
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update Camera Aspect Ratio
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update Renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Animation
const tick = () => {
  // Renderer
  renderer.render(scene, camera)

  // Update Controls
  controls.update()

  window.requestAnimationFrame(tick)
}

tick()
