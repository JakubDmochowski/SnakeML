import * as THREE from 'three'

class Map {
  constructor () {
    this.scene = new THREE.Scene()
    this.maxMapHeight = 20
    this.maxMapWidth = 20
    this.maxMapDepth = 20
    this.createBorders()
  }

  getMapX (x) {
    return x - this.maxMapWidth / 2
  }

  getMapY (y) {
    return y - this.maxMapHeight / 2
  }

  getMapZ (z) {
    return z - this.maxMapDepth / 2
  }

  getMapBorders () {
    return {
      x: {
        min: this.getMapX(0),
        max: this.getMapX(this.maxMapWidth)
      },
      y: {
        min: this.getMapY(0),
        max: this.getMapY(this.maxMapHeight)
      },
      z: {
        min: this.getMapZ(0),
        max: this.getMapZ(this.maxMapDepth)
      }
    }
  }

  createBorders () {
    let x = 0
    let y = 0
    let z = 0
    for (y = 0; y < this.maxMapHeight; y++) {
      for (x = 0; x < this.maxMapWidth; x++) {
        for (z = 0; z < this.maxMapDepth; z++) {
          if (!x || !y || !z || y === this.maxMapHeight - 1 || x === this.maxMapWidth - 1 || z === this.maxMapDepth - 1) {
            if (!((x + y + z) % 6)) {
              const geometry = new THREE.BoxGeometry()
              const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color(
                  x * 255 / this.maxMapWidth,
                  y * 255 / this.maxMapHeight,
                  z * 255 / this.maxMapDepth
                ),
                wireframe: true
              })
              const wall = new THREE.Mesh(geometry, material)
              wall.position.x = this.getMapX(x)
              wall.position.y = this.getMapY(y)
              wall.position.z = this.getMapZ(z)
              this.scene.add(wall)
            }
          }
        }
      }
    }
  }
}

const map = new Map()

export default map
