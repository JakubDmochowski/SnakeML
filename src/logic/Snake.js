import Apple from './Apple'
import * as THREE from 'three'
import Direction from './Direction'

class Snake {
  constructor (map) {
    this.map = () => map
    this.camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.cameraHelper = new THREE.CameraHelper(this.camera)
    this.cameraHelper.layers.enableAll()
    this.cameraHelper.layers.disable(0)
    this.cameraHelper.layers.disable(1)
    this.camera.updateProjectionMatrix()
    this.elements = []
    this.maxSize = 4
    this.createSnakeElement()
    this.direction = Direction.up
    this.normal = Direction.backward
    this.targetDirection = null
    this.targetRotation = null
    this.rotation = null
    this.targetNormal = null
    this.requestedRotation = null
    this.animationSpeed = 15 / 100
    this.normalDirectionHelper = new THREE.ArrowHelper(this.normal, this.getHead().position, 2, 0x0000ff)
    this.directionHelper = new THREE.ArrowHelper(this.direction, this.getHead().position, 2, 0x00ff00)
    this.normalDirectionHelper.traverse(function (node) { node.layers.set(1) })
    this.directionHelper.traverse(function (node) { node.layers.set(1) })
    this.map().scene.add(this.normalDirectionHelper)
    this.map().scene.add(this.directionHelper)
    this.map().scene.add(this.cameraHelper)
  }

  onResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }

  createSnakeElement (matrix = null) {
    const geometry = !this.elements.length ? new THREE.ConeGeometry(0.5, 1, 4) : new THREE.BoxGeometry(0.75, 0.75, 0.75)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    var mesh = new THREE.Mesh(geometry, material)
    mesh.userData = {
      snake: this,
      uuid: mesh.uuid
    }
    if (matrix) {
      mesh.matrixAutoUpdate = false
      mesh.matrix.copy(matrix)
    }
    if (!this.elements.length) {
      mesh.layers.disableAll()
      mesh.layers.enable(1)
      material.color = new THREE.Color(0xff0000)
    } else {
      mesh.layers.disableAll()
      mesh.layers.enable(0)
    }
    this.elements.push(mesh.uuid)
    this.map().scene.add(mesh)
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

  getHead () {
    return this.getElem(0)
  }

  getElem (index) {
    return this.map().scene.children.find(c => c.uuid === this.elements[index])
  }

  checkCollision () {
    const headPos = this.getHead().position
    const collisions = this.map().scene.children.filter(c => c.position.equals(headPos) && c.uuid !== this.elements[0])
    if (collisions.length) {
      if (collisions[0].userData instanceof Apple) {
        collisions[0].userData.relocate()
        this.maxSize += 3
      } else {
        throw Error('gameOver')
      }
    }
  }

  updateTarget (rotation) {
    const { angle, perpendicular } = rotation
    const head = this.getHead()
    const vector = perpendicular ? this.direction.clone().cross(this.normal).normalize() : this.normal
    this.rotation = new THREE.Quaternion().setFromAxisAngle(vector, angle).normalize()
    this.targetNormal = this.roundVector3(perpendicular ? this.normal.clone().applyQuaternion(this.rotation) : this.normal)
    this.targetDirection = this.roundVector3(this.direction.clone().applyQuaternion(this.rotation))
    this.targetRotation = head.clone().applyQuaternion(this.rotation).quaternion
  }

  roundMatrix (matrix) {
    return new THREE.Matrix4().fromArray(matrix.toArray().map((value) => {
      return Math.round(value)
    }))
  }

  roundVector3 (vector) {
    return new THREE.Vector3(
      Math.round(vector.x),
      Math.round(vector.y),
      Math.round(vector.z)
    )
  }

  onLoop () {
    if (this.targetDirection) {
      this.direction = this.targetDirection
      this.normal = this.targetNormal
      this.targetDirection = null
      this.targetNormal = null
      this.targetRotation = null
      this.rotation = null
    }
    if (this.requestedRotation) {
      this.updateTarget(this.requestedRotation)
      this.requestedRotation = null
    }
    const head = this.getHead()
    var nextPos = this.roundMatrix(
      new THREE.Matrix4()
        .compose(
          head.position.clone().add(this.direction),
          head.quaternion.normalize(),
          new THREE.Vector3(1, 1, 1)
        )
    )
    var prevPos = null
    let i = 0
    let elem = null
    for (i = 0; i < this.elements.length; i++) {
      elem = this.getElem(i)
      prevPos = elem.matrix.clone()
      elem.matrixAutoUpdate = false
      elem.matrix = new THREE.Matrix4()
      elem.applyMatrix4(nextPos)
      nextPos = prevPos.clone()
    }
    if (this.elements.length < this.maxSize) {
      this.createSnakeElement(prevPos)
    }
    this.checkCollision()
  }

  move () {
    if (this.targetDirection) {
      const head = this.getHead()
      const angle = head.quaternion.angleTo(this.targetRotation)
      const partialRotation = (new THREE.Quaternion()).rotateTowards(this.rotation, this.animationSpeed * angle)
      this.getHead().applyQuaternion(partialRotation)
      this.normal.applyQuaternion(partialRotation)
      this.direction.applyQuaternion(partialRotation)
    }
  }

  updateCamera () {
    const head = this.getHead()
    const lookAt = new THREE.Vector3(
      head.position.x + this.direction.x,
      head.position.y + this.direction.y,
      head.position.z + this.direction.z
    )
    this.camera.position.lerp(head.position, this.animationSpeed)
    this.camera.matrix.lookAt(this.camera.position, lookAt, this.normal)
    this.camera.quaternion.setFromRotationMatrix(this.camera.matrix)

    this.normalDirectionHelper.position.copy(head.position)
    this.directionHelper.position.copy(head.position)
    this.normalDirectionHelper.setDirection(this.normal)
    this.directionHelper.setDirection(this.direction)
    this.cameraHelper.rotation.copy(this.camera.rotation)
    this.cameraHelper.position.copy(this.camera.position)
    this.cameraHelper.matrixAutoUpdate = true
  }

  onRender () {
    this.move()
    this.updateCamera()
  }
}

export default Snake
