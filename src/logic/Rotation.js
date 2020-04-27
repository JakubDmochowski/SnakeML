import * as THREE from 'three'

class Direction {
  constructor () {
    this.up = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-1, 0, 0))
    this.down = new THREE.Vector3(0, -1, 0)
    this.left = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-1, 0, 0))
    this.right = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 1, 0))
  }
}

const direction = new Direction()

export default direction
