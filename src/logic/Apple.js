import * as THREE from 'three'
import { Vector3 } from 'three'

class Apple {
  constructor (map) {
    this._typename = 'Apple'
    this.map = () => map
    const geometry = new THREE.SphereGeometry(0.5, 16, 16)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.userData = this
    this.object = mesh
    this.uuid = mesh.uuid
    map.scene.add(mesh)
  }

  getElem () {
    return this.map().scene.children.find(e => e.uuid === this.uuid)
  }

  dispose () {
    const apple = this.map().scene.children.find(c => c.uuid === this.uuid)
    apple.geometry.dispose()
    apple.material.dispose()
    this.map().scene.remove(apple)
  }

  relocate () {
    const borders = this.map().getMapBorders()
    let newPosition = null
    do {
      const newX = Math.round(THREE.MathUtils.lerp(borders.x.min + 1, borders.x.max - 1, Math.random()))
      const newY = Math.round(THREE.MathUtils.lerp(borders.y.min + 1, borders.y.max - 1, Math.random()))
      const newZ = Math.round(THREE.MathUtils.lerp(borders.z.min + 1, borders.z.max - 1, Math.random()))
      newPosition = new Vector3(newX, newY, newZ)
    } while (this.map().scene.children.find(c => c.uuid !== this.uuid && c.position.equals(newPosition)))
    this.getElem().position = newPosition
  }
}

export default Apple
