export default class Card {
  constructor(cardsContainer, cardsArr, formName, formText, removeBtn) {
    this.cardsContainer = cardsContainer
    this.cardsArr = cardsArr
    this.formName = formName
    this.formText = formText
    this.removeBtn = removeBtn
  }

  create() {
    let currentCard = {
      id: '',
      name: '',
      text: '',
    }

    currentCard.id = Date.now() + 1
    currentCard.name = this.formName.value
    currentCard.text = this.formText.value
    this.cardsArr.push(currentCard)
    localStorage.setItem('cardsArr', JSON.stringify(this.cardsArr))
  }

  render() {
    this.cardsContainer.innerHTML = ''
    if (!this.cardsArr.length) {
      this.cardsContainer.innerHTML = `          <div class="empty-cover">Создайте карточку!</div>
      `
    }
    this.cardsArr.forEach((card) => {
      let cardTemplate = `
      <div class="card" draggable="true" data-id="${card.id}">
      <div class="card-name">${card.name}</div>
      <div class="card-text">${card.text}</div>
      </div>
      `
      this.cardsContainer.insertAdjacentHTML('afterbegin', cardTemplate)
      this.remove()
    })
  }

  remove() {
    const cards = document.querySelectorAll('.card')
    let cardN = null
    const dragDrop = () => {
      this.removeBtn.style.background = `url("../src/img/header/trash.svg") center no-repeat`
      this.removeBtn.style.backgroundSize = 'contain'
      this.cardsArr.forEach((arrCard, index) => {
        if (`${arrCard.id}` === cardN?.dataset.id) {
          this.cardsArr.splice(index, 1)
          localStorage.setItem('cardsArr', JSON.stringify(this.cardsArr))
          this.cardsContainer.innerHTML = `<div class="empty-cover">Создайте карточку!</div>`
        }
      })
      this.render()
    }
    const cardsContainer = cards.forEach((card) => {
      this.removeBtn.addEventListener('dragover', (e) => {
        this.removeBtn.style.background = `url("../src/img/header/garbage-opened.svg") center no-repeat`
        this.removeBtn.style.backgroundSize = 'contain'

        e.preventDefault()
      })
      this.removeBtn.addEventListener('dragleave', (e) => {
        this.removeBtn.style.background = `url("../src/img/header/trash.svg") center no-repeat`
        this.removeBtn.style.backgroundSize = 'contain'
        e.preventDefault()
      })
      card.addEventListener('dragstart', dragStart)
      card.addEventListener('dragend', dragEnd)
    })

    this.removeBtn.addEventListener('drop', dragDrop)
    function dragEnd() {
      cardN = null
      this.style.display = 'flex'
    }
    function dragStart() {
      cardN = this
      setTimeout(() => {
        this.style.display = 'none'
      }, 0)
    }
  }
}
