import SnakeElement from './SnakeElement'
import map from './Map'
import * as THREE from 'three'
import Direction from './Direction'

class Snake {
  constructor () {
    this.head = null
    this.tail = null
    this.size = 1
    this.maxSize = 2
    this.direction = Direction.up
    this.requestedDirection = null
    this.createSnakeElement()
  }

  createSnakeElement (position = null) {
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    var mesh = new THREE.Mesh(geometry, material)
    if (position) {
      mesh.position.x = position.x
      mesh.position.y = position.y
      mesh.position.z = position.z
    }
    if (!this.head) {
      this.head = new SnakeElement(mesh)
      this.tail = this.head
    } else {
      this.tail.next = new SnakeElement(mesh)
      this.tail = this.tail.next
    }
    map.scene.add(mesh)
  }

  requestDirection (dir) {
    this.requestedDirection = dir
  }

  validateDirection (dir) {
    const validType = () => {
      return dir instanceof THREE.Vector2
    }
    const validLength = () => {
      return dir.length() === 1
    }
    const validDirection = () => {
      const invertedDir = new THREE.Vector2(-this.direction.x, -this.direction.y)
      return Boolean(dir.x ^ dir.y) && !(dir.x === invertedDir.x && dir.y === invertedDir.y)
    }
    return dir && validType() && validLength() && validDirection()
  }

  onLoop () {
    if (this.validateDirection(this.requestedDirection)) {
      this.direction = this.requestedDirection
    }
    var prevPosition = new THREE.Vector3(
      this.head.mesh.position.x,
      this.head.mesh.position.y,
      this.head.mesh.position.z
    )
    var prevPositionParent = null
    this.head.mesh.position.x = this.head.mesh.position.x + this.direction.x
    this.head.mesh.position.y = this.head.mesh.position.y + this.direction.y
    var tmp = this.head.next
    console.log(prevPosition)
    console.log(this.head.mesh.position)
    while (tmp) {
      prevPositionParent = prevPosition
      prevPosition = new THREE.Vector3(
        tmp.mesh.position.x,
        tmp.mesh.position.y,
        tmp.mesh.position.z
      )
      tmp.mesh.position.x = prevPositionParent.x
      tmp.mesh.position.y = prevPositionParent.y
      tmp = tmp.next
    }
    if (this.size < this.maxSize) {
      this.createSnakeElement(prevPosition)
      this.size++
    }
  }
}

export default Snake
