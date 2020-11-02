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
      <div class="card" data-id="${card.id}">
      <button class="button button-delete"><span></span></button>
      <div class="card-name">${card.name}</div>
      <div class="card-text">${card.text}</div>
      </div>
      `
      this.cardsContainer.insertAdjacentHTML('afterbegin', cardTemplate)
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
      localStorage.setItem('cardsArr', JSON.stringify(this.cardsArr))
      this.render()
      if (!this.cardsArr.length) {
        this.cardsContainer.innerHTML = `<div class="empty-cover">Создайте карточку!</div>
        `
      }
    }, 300)
  }
}
