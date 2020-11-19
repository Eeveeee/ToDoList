import card from '../js/Card'

class DragNDrop {
  constructor() {
    this.takenCard = null
    this.cardsArr = null
    this.removeBtn = null
  }
  init(cardsContainer, cardsArr, removeBtn) {
    this.cardsContainer = cardsContainer
    this.cardsArr = cardsArr
    this.removeBtn = removeBtn
  }
  setDrag(e) {
    e.target.setAttribute('draggable', true)
  }
  unsetDrag(e) {
    e.target.removeAttribute('draggable')
  }
  addListeners() {
    const cardsInContainer = document.querySelectorAll('.card')
    cardsInContainer.forEach((card) => {
      card.addEventListener('mousedown', this.setDrag)
    })
    if (cardsInContainer.length > 0) {
      cardsInContainer.forEach((card) => {
        card.addEventListener('dragstart', this.dragStart.bind(this))
        card.addEventListener('dragend', this.dragEnd.bind(this))
      })
      this.removeBtn.addEventListener('dragover', this.dragOver.bind(this))
      this.removeBtn.addEventListener('dragleave', this.dragLeave.bind(this))
      this.removeBtn.addEventListener('drop', this.dragDrop.bind(this))
    }
  }
  dragStart(e) {
    e.stopPropagation()
    this.takenCard = e.target
    setTimeout(() => {
      this.takenCard.style.display = 'none'
    }, 0)
  }
  dragEnd() {
    if (this.takenCard) {
      this.takenCard.style.display = 'flex'
    }
  }
  dragLeave(e) {
    e.preventDefault()
    this.removeBtn.style.background = `url("../src/img/header/trash.svg") center no-repeat`
    this.removeBtn.style.backgroundSize = 'contain'
  }
  dragOver(e) {
    e.preventDefault()
    this.removeBtn.style.background = `url("../src/img/header/garbage-opened.svg") center no-repeat`
    this.removeBtn.style.backgroundSize = 'contain'
  }
  dragDrop() {
    this.removeBtn.style.background = `url("../src/img/header/trash.svg") center no-repeat`
    this.removeBtn.style.backgroundSize = 'contain'
    card.delete(this.takenCard)
    card.render()
    this.addListeners()
    card.addEditListeners()
    card.subtaskGenerator()
  }
}
const dragNDrop = new DragNDrop()
export default dragNDrop
