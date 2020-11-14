<template>
  <canvas ref="three"></canvas>
</template>

<script>
import * as THREE from 'three'
import Map from '../logic/Map'
import Snake from '../logic/Snake'
import Apple from '../logic/Apple'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import AI from '../logic/AI'

export default {
  data: () => ({
    renderer: null,
    map: null,
    camera: null,
    loopsPerSecond: 5,
    initialized: false,
    lastLoop: 0,
    gameover: false,
    snake: null,
    AI: null
  }),
  mounted () {
    if (!this.initialized) {
      this.initialized = true

      this.initializeGame()
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
    initializeGame () {
      this.map = new Map(7, 7, 7)
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
      this.camera.updateProjectionMatrix()
      this.snake = new Snake(this.map)
      this.apple = new Apple(this.map)
      this.AI = new AI(this.snake, this.apple)
      this.apple.relocate()
    },
    finishGame () {
      this.snake.dispose()
      this.apple.dispose()
    },
    reinitializeGame () {
      this.snake = new Snake(this.map)
      this.apple = new Apple(this.map)
    },
    resetGame () {
      this.finishGame()
      this.reinitializeGame()
      this.onLoop()
    },
    onRender (data) {
      const {
        camera
      } = data
      this.renderer.render(this.map.scene, camera)
    },
    onLoop (time) {
      console.log('Loop!')
      const currLoop = Math.floor(time / (1000 / this.loopsPerSecond))
      if (!this.gameover) {
        requestAnimationFrame(this.onLoop)
        while (this.lastLoop < currLoop) {
          this.lastLoop++
          try {
            this.AI.makeMove()
            this.snake.onLoop()
          } catch (error) {
            this.gameover = true
            console.log('GameOver!')
          }
        }
        this.snake.onRender()
        this.onRender({ camera: this.snake.camera })
      } else {
        this.onRender({ camera: this.camera })
        setTimeout(this.resetGame, 2000)
      }
    },
    handleResize () {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(
        window.innerWidth,
        window.innerHeight
      )
      this.snake.onResize()
    },
    handleKeyDown (event) {
      switch (event.keyCode) {
        case 81: // Q
          this.snake.requestRotation('L-spin')
          break
        case 69: // E
          this.snake.requestRotation('R-spin')
          break
        case 38: // up-arrow
        case 87: // W
          this.snake.requestRotation('up')
          break
        case 40: // down-arrow
        case 83: // S
          this.snake.requestRotation('down')
          break
        case 37: // left-arrow
        case 65: // A
          this.snake.requestRotation('left')
          break
        case 39: // right-arrow
        case 68: // D
          this.snake.requestRotation('right')
          break
      }
    }
  }
}
</script>

<style>
</style>
