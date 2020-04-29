import SnakeElement from './SnakeElement'
import Apple from './Apple'
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
    this.cameraHelper.layers.enableAll()
    this.cameraHelper.layers.disable(0)
    this.cameraHelper.layers.disable(1)
    this.head = null
    this.tail = null
    this.size = 1
    this.maxSize = 3
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

  createSnakeElement (matrix = null) {
    const geometry = !this.head ? new THREE.ConeGeometry(0.5, 1, 4) : new THREE.BoxGeometry(0.75, 0.75, 0.75)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    var mesh = new THREE.Mesh(geometry, material)
    if (matrix) {
      mesh.matrixAutoUpdate = false
      mesh.matrix.copy(matrix)
    }
    if (!this.head) {
      mesh.layers.set(1)
      this.head = new SnakeElement(mesh)
      this.tail = this.head
    } else {
      this.tail.next = new SnakeElement(mesh)
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

  checkCollision () {
    const pos = this.head.mesh.position.clone().add(this.direction.clone().negate())
    const raycaster = new THREE.Raycaster(pos, this.direction, 0, 1)
    const collisions = raycaster.intersectObjects(map.scene.children)
    if (collisions.length) {
      if (collisions[0].object.userData instanceof Apple) {
        collisions[0].object.userData.relocate()
        this.maxSize += 3
      } else {
        throw Error('gameOver')
      }
    }
  }

  updateTarget (rotation) {
    const { angle, perpendicular } = rotation
    const vector = perpendicular ? this.direction.clone().cross(this.normal).normalize() : this.normal
    this.rotation = new THREE.Quaternion().setFromAxisAngle(vector, angle).normalize()
    this.targetNormal = perpendicular ? this.normal.clone().applyQuaternion(this.rotation) : this.normal
    this.targetDirection = this.direction.clone().applyQuaternion(this.rotation)
    this.targetRotation = this.head.mesh.clone().applyQuaternion(this.rotation).quaternion
  }

  roundMatrix (matrix) {
    return new THREE.Matrix4().fromArray(matrix.toArray().map((value) => {
      return Math.round(value)
    }))
  }

  onLogicLoop () {
    this.checkCollision()
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
    var tmp = this.head
    var nextPos = this.roundMatrix(
      new THREE.Matrix4()
        .compose(
          tmp.mesh.position.clone().add(this.direction),
          tmp.mesh.quaternion.normalize(),
          new THREE.Vector3(1, 1, 1)
        )
    )
    var prevPos = null
    while (tmp) {
      prevPos = tmp.mesh.matrix.clone()
      tmp.mesh.matrixAutoUpdate = false
      tmp.mesh.matrix = new THREE.Matrix4()
      tmp.mesh.applyMatrix4(nextPos)
      nextPos = prevPos.clone()
      tmp = tmp.next
      if (tmp) {
      }
    }
    if (this.size < this.maxSize) {
      console.log('new Element at: ', JSON.stringify(prevPos))
      this.createSnakeElement(prevPos)
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
