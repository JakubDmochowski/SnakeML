import * as THREE from 'three'

class Direction {
  constructor () {
    this.up = new THREE.Vector3(0, 1, 0)
    this.down = new THREE.Vector3(0, -1, 0)
    this.left = new THREE.Vector3(-1, 0, 0)
    this.right = new THREE.Vector3(1, 0, 0)
    this.forward = new THREE.Vector3(0, 0, -1)
    this.backward = new THREE.Vector3(0, 0, 1)
  }
}
const direction = new Direction()

export default direction
