import Card from '../js/Card'

export default class DragNDrop extends Card {
  constructor(cardsContainer, cardsArr, formName, formText, removeBtn) {
    super(cardsContainer, cardsArr, formName, formText, removeBtn)
    this.cardsContainer = cardsContainer
    this.cardsArr = cardsArr
    this.removeBtn = removeBtn
    this.takenCard = null
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
    this.takenCard = e.target
    setTimeout(() => {
      this.takenCard.style.display = 'none'
    }, 0)
  }
  dragEnd() {
    this.takenCard.style.display = 'flex'
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
    this.delete(this.takenCard)
    this.render()
    this.addListeners()
  }
}
