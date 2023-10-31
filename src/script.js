import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import * as dat from 'dat.gui'
import { Mesh } from 'three'

// Scene
const scene = new THREE.Scene()

// Initialize Texture Index
let textureIndex = 1

// Texture
const textLoader = new THREE.TextureLoader()
let matcapTexture = textLoader.load(`/matcaps/${textureIndex}.png`)

// Debug UI
const gui = new dat.GUI()

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
  .onFinishChange(() => {
    textureIndex = guiParameter.changeTexture
    console.log(textureIndex)

    // Update Texture
    matcapTexture = textLoader.load(`/matcaps/${textureIndex}.png`)

    // Destroy everything
    for (let i = scene.children.length - 1; i >= 0; i--) {
      if (scene.children[i].type === 'Mesh') scene.remove(scene.children[i])
    }

    // Update Loaded Font
    loadFontRandomDonuts()
  })

// Axes Helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

// Fonts
const fontLoader = new FontLoader()

const loadFontRandomDonuts = () => {
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
      console.time('donuts')

      const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
      // textMaterial.wireframe = true
      const text = new THREE.Mesh(textGeometry, material)
      scene.add(text)

      // Import 3D Modal
      // let becomeMonogram
      // const gltfLoader = new GLTFLoader()
      // gltfLoader.load(
      //   'become_monogram.glb',
      //   (glb) => {
      //     console.log(glb)
      //     becomeMonogram = glb.scene
      //     // Assuming 'object' is the loaded 3D model
      //     becomeMonogram.traverse(function (child) {
      //       console.log(child)
      //       if (child instanceof THREE.Mesh) {
      //         child.material.map = matcapTexture
      //         // child.material.color.set('#ffffff')
      //       }
      //     })
      //     becomeMonogram.scale.set(0.5, 0.5, 0.5)

      //     matcapTexture.wrapS = THREE.RepeatWrapping
      //     matcapTexture.wrapT = THREE.RepeatWrapping
      //     matcapTexture.repeat.set(2, 2) // Repeat the matcapTexture 2x2 times
      //     matcapTexture.offset.set(0.5, 0.5) // Offset the texture

      //     scene.add(becomeMonogram)
      //   },
      //   (xhr) => {
      //     console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      //   },
      //   (error) => {
      //     console.log('An error occured' + error)
      //   }
      // )

      // Become Logo
      // const becomeLogoGroup = new THREE.Group()
      // scene.add(becomeLogoGroup)
      // const becomeMonogramBox = new THREE.Mesh(
      //   new THREE.BoxGeometry(1, 1, 1),
      //   new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
      // )
      // const becomeMonogramOpenEnd = new THREE.Mesh(
      //   new THREE.PlaneGeometry(1, 1),
      //   new THREE.MeshMatcapMaterial({
      //     matcap: matcapTexture,
      //     side: DoubleSide,
      //   })
      // )
      // becomeMonogramOpenEnd.position.set(-0.5, 1, 0)
      // becomeMonogramOpenEnd.rotation.y = Math.PI / 2
      // becomeLogoGroup.position.set(-2, 0, 0)
      // becomeLogoGroup.scale.set(0.5, 0.5, 0.5)
      // becomeLogoGroup.rotation.set(0.7, 0, -0.3)
      // gui.add(becomeLogoGroup.rotation, 'x').min(-1).max(1).step(0.001)
      // gui.add(becomeLogoGroup.rotation, 'y').min(-1).max(1).step(0.001)
      // gui.add(becomeLogoGroup.rotation, 'z').min(-1).max(1).step(0.001)
      // becomeLogoGroup.add(becomeMonogramBox, becomeMonogramOpenEnd)

      // Load SVG
      const svgLoader = new SVGLoader()
      svgLoader.load(
        'become-monogram.svg',
        (data) => {
          const paths = data.paths
          const becomeLogoGroup = new THREE.Group()
          scene.add(becomeLogoGroup)
          paths.forEach((path) => {
            const shapes = path.toShapes(true)

            shapes.forEach(function (shape) {
              const extrudeSettings = {
                depth: 55,
                bevelEnabled: true,
                bevelSize: 0.02,
                bevelSegments: 3,
                bevelThickness: 0.01,
              }

              const shapeGeometry = new THREE.ExtrudeGeometry(
                shape,
                extrudeSettings
              )
              const mesh = new THREE.Mesh(
                shapeGeometry,
                new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
              ) // Set your desired material here
              becomeLogoGroup.add(mesh)
              becomeLogoGroup.scale.set(0.004, 0.004, 0.004)
              becomeLogoGroup.rotation.x = Math.PI
              becomeLogoGroup.position.set(-2.35, 0.6, 0.11)
            })
          })
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% SVG loaded')
        },
        (error) => {
          console.error('Error loading SVG:', error)
        }
      )

      const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

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
}

// Initial load
loadFontRandomDonuts()

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
controls.minDistance = 2
controls.maxDistance = 9
controls.zoomSpeed = 1
controls.dampingFactor = 0.01

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
