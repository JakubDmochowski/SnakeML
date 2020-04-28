import SnakeElement from './SnakeElement'
import map from './Map'
import * as THREE from 'three'
import Direction from './Direction'

class Snake {
  constructor () {
    this.camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.updateProjectionMatrix()
    this.cameraHelper = new THREE.CameraHelper(this.camera)
    this.head = null
    this.tail = null
    this.size = 1
    this.maxSize = 2
    this.createSnakeElement()
    this.direction = Direction.up
    this.normal = Direction.backward
    this.targetDirection = null
    this.targetRotation = null
    this.rotation = null
    this.targetNormal = null
    this.requestedRotation = null
    this.animationSpeed = 15 / 100
  }

  createSnakeElement (matrix) {
    const geometry = new THREE.ConeGeometry(1, 2, 3)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    var mesh = new THREE.Mesh(geometry, material)
    if (matrix) {
      mesh.matrix.copy(matrix)
    }
    if (!this.head) {
      this.head = new SnakeElement(mesh)
      this.head.matrixAutoUpdate = false
      this.tail = this.head
    } else {
      this.tail.next = new SnakeElement(mesh)
      this.tail.next.matrixAutoUpdate = false
      this.tail = this.tail.next
    }
    map.scene.add(mesh)
  }

  requestRotation (rotation) {
    this.requestedRotation = {}
    switch (rotation) {
      case 'up':
        this.requestedRotation.angle = Math.PI / 2
        this.requestedRotation.perpendicular = true
        break
      case 'down':
        this.requestedRotation.angle = -Math.PI / 2
        this.requestedRotation.perpendicular = true
        break
      case 'left':
        this.requestedRotation.angle = Math.PI / 2
        this.requestedRotation.perpendicular = false
        break
      case 'right':
        this.requestedRotation.angle = -Math.PI / 2
        this.requestedRotation.perpendicular = false
        break
    }
  }

  updateTarget (rotation) {
    const { angle, perpendicular } = rotation
    const vector = perpendicular ? this.direction.clone().cross(this.normal) : this.normal
    this.rotation = new THREE.Quaternion().setFromAxisAngle(vector, angle)
    this.rotation.normalize()
    this.targetNormal = perpendicular ? this.normal.clone().applyQuaternion(this.rotation) : this.normal
    this.targetDirection = this.direction.clone().applyQuaternion(this.rotation)
    this.targetRotation = this.head.mesh.clone().applyQuaternion(this.rotation).quaternion
  }

  onLogicLoop () {
    if (this.targetDirection) {
      this.direction = this.targetDirection.clone()
      this.normal = this.targetNormal.clone()
      this.targetDirection = null
      this.targetNormal = null
      this.targetRotation = null
      this.rotation = null
    }
    if (this.requestedRotation) {
      this.updateTarget(this.requestedRotation)
      this.requestedRotation = null
    }
    var prevPosition = this.head.mesh.matrix.clone()
    var prevPositionParent = null

    this.head.mesh.position.x = this.head.mesh.position.x + this.direction.x
    this.head.mesh.position.y = this.head.mesh.position.y + this.direction.y
    this.head.mesh.position.z = this.head.mesh.position.z + this.direction.z
    var tmp = this.head.next
    while (tmp) {
      prevPositionParent = prevPosition
      prevPosition = new THREE.Vector3(
        tmp.mesh.position.x,
        tmp.mesh.position.y,
        tmp.mesh.position.z
      )
      tmp.mesh.position.x = prevPositionParent.x
      tmp.mesh.position.y = prevPositionParent.y
      tmp.mesh.position.z = prevPositionParent.z
      tmp = tmp.next
    }
    if (this.size < this.maxSize) {
      this.createSnakeElement(prevPosition)
      this.size++
    }
  }

  move () {
    if (this.targetDirection) {
      const angle = this.head.mesh.quaternion.angleTo(this.targetRotation)
      const partialRotation = (new THREE.Quaternion()).rotateTowards(this.rotation, this.animationSpeed * angle)
      this.head.mesh.applyQuaternion(partialRotation)
      this.normal.applyQuaternion(partialRotation)
      this.direction.applyQuaternion(partialRotation)
    }
  }

  updateCamera () {
    const lookAt = new THREE.Vector3(
      this.head.mesh.position.x + this.direction.x,
      this.head.mesh.position.y + this.direction.y,
      this.head.mesh.position.z + this.direction.z
    )
    console.log(JSON.stringify(this.camera.position))
    console.log(JSON.stringify(this.head.mesh.position))
    this.camera.position.lerp(this.head.mesh.position, this.animationSpeed)
    this.camera.matrix.lookAt(this.camera.position, lookAt, this.normal)
    this.camera.quaternion.setFromRotationMatrix(this.camera.matrix)

    this.cameraHelper.rotation.copy(this.camera.rotation)
    this.cameraHelper.position.copy(this.camera.position)
    this.cameraHelper.matrixAutoUpdate = true
  }

  onGraphicLoop () {
    this.move()
    this.updateCamera()
  }
}

export default Snake
