import * as THREE from 'three'
import map from './Map'
import { Vector3 } from 'three'

class Apple {
  constructor () {
    this.geometry = new THREE.SphereGeometry(0.5, 16, 16)
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    map.scene.add(this.mesh)
  }

  relocateApple () {
    const newX = Math.random() * map.maxMapWidth
    const newY = Math.random() * map.maxMapHeight
    const newZ = Math.random() * map.maxMapDepth
    this.mesh.position = new Vector3(newX, newY, newZ)
  }

  onTrigger () {
    // snake.maxSize++
    this.relocateApple()
  }
}

export default Apple
