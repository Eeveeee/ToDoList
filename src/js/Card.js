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
      let cardTemplate = /*html*/ `
      <div class="card" data-id="${card.id}">
      <textarea draggable="true" class="card-name">${card.name}</textarea>
      <textarea draggable="true" class="card-text">${card.text}</textarea>
      </div>
      `
      this.cardsContainer.insertAdjacentHTML('afterbegin', cardTemplate)
    })
  }

  delete(takenCard) {
    this.cardsArr.forEach((card, index) => {
      if (`${card.id}` === takenCard?.dataset.id) {
        this.cardsArr.splice(index, 1)
        localStorage.setItem('cardsArr', JSON.stringify(this.cardsArr))
        this.cardsContainer.innerHTML = `<div class="empty-cover">Создайте карточку!</div>`
      }
    })
  }

  addEditListeners() {
    const cardNames = document.querySelectorAll('.card-name')
    const cardTexts = document.querySelectorAll('.card-text')
    cardNames.forEach((cardName) => {
      cardName.addEventListener('mousedown', this.edit.bind(this))
    })
    cardTexts.forEach((cardText) => {
      cardText.addEventListener('mousedown', this.edit.bind(this))
    })
  }
  edit(e) {
    const cardItem = e.target
    const card = cardItem.closest('.card')
    e.stopPropagation()
    const cardID = card.dataset.id
    card.removeAttribute('draggable')
    cardItem.removeAttribute('draggable')
    cardItem.addEventListener('keypress', () => {
      if (cardItem.classList.contains('card-name')) {
        this.cardsArr.forEach((card) => {
          if (`${card.id}` === cardID) {
            card.name = cardItem.value
          }
        })
      } else {
        this.cardsArr.forEach((card) => {
          if (`${card.id}` === cardID) {
            card.text = cardItem.value
          }
        })
      }
      localStorage.setItem('cardsArr', JSON.stringify(this.cardsArr))
    })
  }
}
