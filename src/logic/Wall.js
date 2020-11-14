import * as THREE from 'three'

class Wall {
  constructor (color, x, y, z) {
    this._typename = 'Wall'
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true
    })
    this.object = new THREE.Mesh(geometry, material)
    this.object.position.x = x
    this.object.position.y = y
    this.object.position.z = z
    this.object.userData = this
  }

  getMesh () {
    return this.object
  }
}

export default Wall
