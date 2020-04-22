import * as THREE from 'three'

class Direction {
  constructor () {
    this.up = new THREE.Vector2(0, 1)
    this.down = new THREE.Vector2(0, -1)
    this.left = new THREE.Vector2(-1, 0)
    this.right = new THREE.Vector2(1, 0)
  }
}
const direction = new Direction()

export default direction
