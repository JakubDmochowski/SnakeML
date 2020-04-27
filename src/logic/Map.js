import * as THREE from 'three'

const maxMapHeight = 20
const maxMapWidth = 20
const maxMapDepth = 20

class Map {
  constructor () {
    this.scene = new THREE.Scene()
    this.createBorders()
  }

  getMapX (x) {
    return x - maxMapWidth / 2
  }

  getMapY (y) {
    return y - maxMapHeight / 2
  }

  getMapZ (z) {
    return z - maxMapDepth / 2
  }

  createBorders () {
    let x = 0
    let y = 0
    let z = 0
    for (y = 0; y < maxMapHeight; y++) {
      for (x = 0; x < maxMapWidth; x++) {
        for (z = 0; z < maxMapDepth; z++) {
          if (!x || !y || !z || y === maxMapHeight - 1 || x === maxMapWidth - 1 || z === maxMapDepth - 1) {
            if (!((x + y + z) % 6)) {
              const geometry = new THREE.BoxGeometry()
              const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color(
                  x * 255 / maxMapWidth,
                  y * 255 / maxMapHeight,
                  z * 255 / maxMapDepth
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
