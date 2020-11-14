import Apple from './Apple'

class AI {
  constructor (snake, apple) {
    this._typename = 'AI'
    this.snake = snake
    this.apple = apple
    this.map = () => this.snake.map()
    this.possibleMoves = [
      null,
      // 'L-spin',
      // 'R-spin',
      'up',
      'down',
      'left',
      'right'
    ]
    this.virtualSnake = this.snake.clone()
  }

  makeMove () {
    const move = this.chooseMove()
    if (move) {
      this.snake.requestRotation(move)
    }
  }

  evaluatePosition (snake) {
    const positionCoefficient = 1 - (snake.getHead().position.clone().sub(this.apple.object.position).manhattanLength() / this.map().getSize().manhattanLength()) * snake.gains.Apple
    // const tempHead = snake.getHead().clone()
    // tempHead.lookAt(this.apple.object.position)
    // const appleDirection = tempHead.quaternion
    // const rotationCoefficient = (1 - snake.getHead().quaternion.angleTo(appleDirection) / 2 * Math.PI) / 1000
    // tempHead.geometry.dispose()
    // tempHead.material.dispose()
    const value = snake.getMaxSize() + positionCoefficient
    const collisions = snake.getCollisions().filter(c => !(
      c.userData._typename === 'Snake' &&
      c.userData.snake.uuid !== snake.getHead().userData.snake.uuid
    ))
    return collisions.length && !(collisions[0].userData instanceof Apple) ? -Infinity : value
  }

  chooseMove () {
    // return this.makeRandomMove()
    // return this.makeBestMove()
    return null
  }

  makeRandomMove () {
    const moveIndex = Math.floor(Math.random() * this.possibleMoves.length)
    return this.possibleMoves[moveIndex]
  }

  makeBestMove () {
    const moveEvaluation = this.possibleMoves.map(move => {
      this.virtualSnake.copy(this.snake)
      if (move) {
        this.virtualSnake.requestRotation(move)
      }
      this.virtualSnake.updateRotation()
      this.virtualSnake.move()
      const currValue = this.evaluatePosition(this.virtualSnake)
      this.virtualSnake.updateRotation()
      this.virtualSnake.move()
      const value = this.evaluatePosition(this.virtualSnake)
      this.virtualSnake.dispose()
      return {
        move: move,
        value: value + currValue / 2
      }
    })
    const viableMoves = moveEvaluation.reduce((acc, curr) => {
      if (curr.value > acc.best) {
        acc.best = curr.value
        acc.array = [curr.move]
      } else if (curr.value === acc.best) {
        acc.array.push(curr.move)
      }
      return acc
    }, {
      best: 0,
      array: []
    })
    if (viableMoves.array.includes(null)) return null
    const moveIndex = Math.floor(Math.random() * viableMoves.array.length)
    return viableMoves.array[moveIndex]
  }
}

export default AI
