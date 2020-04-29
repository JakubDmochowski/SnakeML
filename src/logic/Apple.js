import * as THREE from 'three'
import map from './Map'
import { Vector3 } from 'three'

class Apple {
  constructor () {
    this.geometry = new THREE.SphereGeometry(0.5, 16, 16)
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.userData = this
    map.scene.add(this.mesh)
  }

  relocate () {
    const borders = map.getMapBorders()
    const newX = Math.round(THREE.MathUtils.lerp(borders.x.min + 1, borders.x.max - 1, Math.random()))
    const newY = Math.round(THREE.MathUtils.lerp(borders.y.min + 1, borders.y.max - 1, Math.random()))
    const newZ = Math.round(THREE.MathUtils.lerp(borders.z.min + 1, borders.z.max - 1, Math.random()))
    this.mesh.position = new Vector3(newX, newY, newZ)
  }
}

export default Apple
