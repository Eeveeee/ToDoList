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
}
