class Card {
  constructor() {
    this.cardsContainer = null
    this.cardsArr = null
    this.formName = null
    this.formText = null
  }

  init(cardsContainer, cardsArr, formText, tasksContainer) {
    this.cardsContainer = cardsContainer
    this.cardsArr = cardsArr
    this.formText = formText
    this.tasksContainer = tasksContainer
  }

  subtasksCreatorManager() {
    this.tasksContainer.insertAdjacentHTML(
      'beforeend',
      `
                    <div class="subtask-wrapper">
                    <button class="button button-remove-subtask"></button>

                      <textarea
      class="card-creator-subtask"
      type="text"
      placeholder="Введите подпункт"
    ></textarea>
                    </div>
  `
    )
    let deleteButtons = this.tasksContainer.querySelectorAll(
      '.button-remove-subtask'
    )
    deleteButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault()
        let container = e.target.closest('.subtask-wrapper')
        container.style.width = '90%'
        setTimeout(() => {
          container.remove()
        }, 200)
      })
    })
  }

  create() {
    const currentCard = {
      id: '',
      task: '',
    }
    currentCard.id = `f${(+new Date()).toString(16)}`
    currentCard.task = this.formText.value

    const subTasks = this.tasksContainer.querySelectorAll(
      '.card-creator-subtask'
    )
    if (subTasks !== undefined) {
      subTasks.forEach((subTask) => {
        currentCard[`f${(+new Date()).toString(16)}`] = {
          subtaskText: `${subTask.value}`,
          state: false,
        }
      })
    }

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
      <textarea draggable="true" class="card-text">${card.task}</textarea>
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
      cardName.addEventListener('dragstart', this.dragBreak)
    })
    cardTexts.forEach((cardText) => {
      cardText.addEventListener('mousedown', this.edit.bind(this))
      cardText.addEventListener('dragstart', this.dragBreak)
    })
  }
  dragBreak(e) {
    e.stopPropagation()
  }
  edit(e) {
    const cardItem = e.target
    const card = cardItem.closest('.card')
    e.stopPropagation()
    const cardID = card.dataset.id
    card.removeAttribute('draggable')
    cardItem.removeAttribute('draggable')
    cardItem.addEventListener('keypress', () => {
      this.cardsArr.forEach((card) => {
        if (`${card.id}` === cardID) {
          card.task = cardItem.value
        }
      })
      localStorage.setItem('cardsArr', JSON.stringify(this.cardsArr))
    })
  }
}

const card = new Card()

export default card
