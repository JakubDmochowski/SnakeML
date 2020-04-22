<template>
  <canvas ref="three"></canvas>
</template>

<script>
import * as THREE from 'three'
import map from '../logic/Map'
import Snake from '../logic/Snake'
import Direction from '../logic/Direction'

export default {
  data: () => ({
    renderer: null,
    map: null,
    loopsPerSecond: 2
  }),
  mounted () {
    this.map = map
    this.snake = new Snake()
    this.renderer = new THREE.WebGLRenderer({ canvas: this.$refs.three })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.onLoop()
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('keydown', this.handleKeyDown)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('keydown', this.handleKeyDown)
  },
  methods: {
    onRender (time) {
      requestAnimationFrame(this.onRender)
      this.renderer.render(this.map.scene, this.map.camera)
    },
    onLoop () {
      this.snake.onLoop()
      this.onRender()
      window.setTimeout(() => {
        this.onLoop()
      }, 1000 / this.loopsPerSecond)
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
          this.snake.requestDirection(Direction.up)
          break
        case 40:
          this.snake.requestDirection(Direction.down)
          break
        case 37:
          this.snake.requestDirection(Direction.left)
          this.loopsPerSecond = 2
          break
        case 39:
          this.snake.requestDirection(Direction.right)
          this.loopsPerSecond = 5
          break
      }
    }
  }
}
</script>

<style>
</style>
