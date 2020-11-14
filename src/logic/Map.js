import * as THREE from 'three'
import Wall from './Wall'

class Map {
  constructor (width, height, depth) {
    this.scene = new THREE.Scene()
    this.maxMapWidth = width
    this.maxMapHeight = height
    this.maxMapDepth = depth
    this.createBorders()
  }

  getMapX (x) {
    return Math.floor(x - this.maxMapWidth / 2)
  }

  getMapY (y) {
    return Math.floor(y - this.maxMapHeight / 2)
  }

  getMapZ (z) {
    return Math.floor(z - this.maxMapDepth / 2)
  }

  getMapBorders () {
    return {
      x: {
        min: this.getMapX(1),
        max: this.getMapX(this.maxMapWidth - 1)
      },
      y: {
        min: this.getMapY(1),
        max: this.getMapY(this.maxMapHeight - 1)
      },
      z: {
        min: this.getMapZ(1),
        max: this.getMapZ(this.maxMapDepth - 1)
      }
    }
  }

  getSize () {
    return new THREE.Vector3(this.maxMapWidth, this.maxMapHeight, this.maxMapDepth)
  }

  createBorders () {
    let x = 1
    let y = 1
    let z = 1
    for (y = 1; y < this.maxMapHeight; y++) {
      for (x = 1; x < this.maxMapWidth; x++) {
        for (z = 1; z < this.maxMapDepth; z++) {
          if (x === 1 || y === 1 || z === 1 || y === this.maxMapHeight - 1 || x === this.maxMapWidth - 1 || z === this.maxMapDepth - 1) {
            if (!((x + y + z) % 6)) {
              this.scene.add(
                new Wall(
                  new THREE.Color(
                    x * this.maxMapWidth / 255,
                    y * this.maxMapHeight / 255,
                    z * this.maxMapDepth / 255
                  ),
                  this.getMapX(x),
                  this.getMapY(y),
                  this.getMapZ(z)
                ).getMesh()
              )
            }
          }
        }
      }
    }
  }
}

export default Map
