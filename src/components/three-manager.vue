<template>
  <canvas ref="three"></canvas>
</template>

<script>
import * as THREE from 'three'
import map from '../logic/Map'
import Snake from '../logic/Snake'
import Apple from '../logic/Apple'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default {
  data: () => ({
    renderer: null,
    map: null,
    camera: null,
    loopsPerSecond: 5,
    initialized: false,
    lastLoop: 0,
    gameover: false
  }),
  mounted () {
    if (!this.initialized) {
      this.initialized = true

      this.map = map
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        2,
        1000
      )
      this.camera.position.z = 8
      this.camera.position.y = 7
      this.camera.position.x = 3
      this.camera.layers.enableAll()
      this.snake = new Snake()
      this.apple = new Apple()
      this.apple.relocate()
      this.map.scene.add(this.snake.cameraHelper)
      this.renderer = new THREE.WebGLRenderer({ canvas: this.$refs.three })
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      window.addEventListener('resize', this.handleResize)
      window.addEventListener('keydown', this.handleKeyDown)
      this.onLoop()
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('keydown', this.handleKeyDown)
  },
  methods: {
    onRender (data) {
      const {
        camera
      } = data
      this.renderer.render(this.map.scene, camera)
    },
    onLoop (time) {
      requestAnimationFrame(this.onLoop)
      if (!this.gameover) {
        const currLoop = Math.floor(time / (1000 / this.loopsPerSecond))
        while (this.lastLoop < currLoop) {
          this.lastLoop++
          try {
            this.snake.onLogicLoop()
          } catch (error) {
            this.gameover = true
            console.log(error)
          }
        }
        this.snake.onGraphicLoop()
        this.onRender({ camera: this.snake.camera })
      } else {
        this.onRender({ camera: this.camera })
      }
    },
    handleResize () {
      this.renderer.setSize(
        window.innerWidth,
        window.innerHeight
      )
    },
    handleKeyDown (event) {
      switch (event.keyCode) {
        case 38:
          this.snake.requestRotation('up')
          break
        case 40:
          this.snake.requestRotation('down')
          break
        case 37:
          this.snake.requestRotation('left')
          break
        case 39:
          this.snake.requestRotation('right')
          break
      }
    }
  }
}
</script>

<style>
</style>
