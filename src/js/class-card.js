export default class Card {
  constructor(cardsContainer, cardsArr, formName, formText) {
    this.cardsContainer = cardsContainer
    this.cardsArr = cardsArr
    this.formName = formName
    this.formText = formText
  }

  create() {
    let currentCard = {
      id: '',
      name: '',
      text: '',
    }
    let currentCardId = 0

    currentCard.id = Date.now() + 1
    currentCard.name = this.formName.value
    currentCard.text = this.formText.value
    this.cardsArr.push(currentCard)
  }

  render() {
    this.cardsContainer.innerHTML = ''
    this.cardsArr.forEach((card) => {
      let cardTemplate = `
      <div class="card" data-id="${card.id}">
      <button class="button button-delete"><span></span></button>
      <div class="card-name">${card.name}</div>
      <div class="card-text">${card.text}</div>
      </div>
      `
      this.cardsContainer.insertAdjacentHTML('afterBegin', cardTemplate)
      const cardRemoveBtn = document.querySelectorAll('.button-delete')

      cardRemoveBtn.forEach((button) => {
        button.addEventListener('click', (e) => {
          e.preventDefault()
          this.remove(button)
        })
      })
    })
  }

  remove(button) {
    const currentCard = button.closest('.card')
    const currentCardID = currentCard.dataset.id
    this.cardsArr.forEach((card, index) => {
      if (currentCardID == card.id) {
        this.cardsArr.splice(index, 1)
      }
    })
    currentCard.style.marginTop = '-100px'
    setTimeout(() => {
      this.render()
      if (!this.cardsArr.length) {
        this.cardsContainer.innerHTML = `<div class="empty-cover">Создайте карточку!</div>
        `
      }
    }, 300)
  }
}
