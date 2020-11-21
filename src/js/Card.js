class Card {
  constructor() {
    this.cardsContainer = null
    this.cardsArr = null
    this.formName = null
    this.formText = null
    this.currentCard = null
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
      this.onListener('click', button, (e) => {
        e.preventDefault()
        let container = e.target.closest('.subtask-wrapper')
        container.style.width = '90%'
        setTimeout(() => {
          container.remove()
        }, 200)
      })
    })
  }

  creatorDefault(e) {
    const card = e.target.closest('.card-creator-form')
    const tasksContainer = card.querySelector('.card-tasks-container')
    Array.from(tasksContainer.children).forEach((child) => {
      if (child.classList.contains('card-creator-text')) {
        child.value = ''
      } else {
        child.remove()
      }
    })
  }

  create(e) {
    this.currentCard = {
      id: `f${(+new Date()).toString(16)}`,
      task: `${this.formText.value}`,
    }
    let subtasks = this.tasksContainer.querySelectorAll('.card-creator-subtask')
    if (subtasks !== undefined) {
      subtasks.forEach((subtask, index) => {
        this.currentCard[`${index + 1}`] = {
          subtaskText: `${subtask.value}`,
          state: false,
        }
      })
    }
    this.cardsArr.push(this.currentCard)
    localStorage.setItem('cardsArr', JSON.stringify(this.cardsArr))
    this.creatorDefault(e)
  }

  generateHTML(card) {
    let stateClass = ``
    let isChecked = ``
    let html = `

    `
    Object.keys(card).forEach((key) => {
      if (card[key] instanceof Object) {
        if (card[key].state === 'true') {
          stateClass = 'active'
          isChecked = 'checked'
        } else {
          stateClass = ''
          isChecked = ''
        }
        html += `<div draggable="true"  class='card-subtask ${stateClass}'>
          <input draggable="true" ${isChecked} class="subtask-checkbox" type="checkbox">
          <textarea data-number="${key}" draggable="true" class="card-subtask-text">${card[key].subtaskText}</textarea>
          <button draggable="true" class="button-card-remove-subtask"></button>
          </div>
          `
      }
    })
    return html
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
      <textarea draggable="true" class="card-text">${card.task}</textarea>
      <div class='card-subtasks'>${this.generateHTML(card)}</div>
      <button class="button button-add-card-subtask">Добавить подпункт</button>
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

  checkboxes(e) {
    const checkbox = e.target
    const checkboxWrapper = checkbox.closest('.card-subtask')
    const cardID = checkbox.closest('.card').dataset.id
    const subtaskNum = checkboxWrapper.querySelector('.card-subtask-text')
      .dataset.number
    if (checkboxWrapper.classList.contains('active')) {
      checkboxWrapper.classList.remove('active')
    } else {
      checkboxWrapper.classList.add('active')
    }
    this.cardsArr.forEach((card) => {
      if (card.id === cardID) {
        if (checkbox.checked) {
          card[subtaskNum].state = 'true'
        } else {
          card[subtaskNum].state = 'false'
        }
        localStorage.setItem('cardsArr', JSON.stringify(this.cardsArr))
      }
    })
  }

  deleteSubtask(e) {
    const subtaskWrapper = e.target.closest('.card-subtask')
    const cardID = e.target.closest('.card').dataset.id
    const subtask = subtaskWrapper.querySelector('.card-subtask-text')
    const subtaskNum = subtask.dataset.number
    this.cardsArr.forEach((card) => {
      if (card.id === cardID) {
        delete card[subtaskNum]
        localStorage.setItem('cardsArr', JSON.stringify(this.cardsArr))
      }
    })
    subtaskWrapper.remove()
  }
  addSubtaskArr(e) {
    const eventCard = e.target.closest('.card')
    const subtasks = eventCard.querySelectorAll('.card-subtask')
    const mask = '^[0-9]{1,6}(\\.\\d{1,2})?$'
    this.cardsArr.forEach((card) => {
      if (card.id === eventCard.dataset.id) {
        let subtasksCount = Object.keys(card).length - 2
        Object.keys(card).forEach((key) => {
          if (Number.isInteger(parseInt(key))) {
            subtasksCount += parseInt(key)
          }
        })
        console.log('карточка до: ', card)
        console.log(subtasksCount + 1)
        card[parseInt(subtasksCount) + 1] = {
          state: 'false',
          subtaskText: '',
        }
        subtasks.forEach((subtask) => {
          subtask.remove()
        })
        eventCard
          .querySelector('.card-subtasks')
          .insertAdjacentHTML('beforeend', `${this.generateHTML(card)}`)
      }
    })
    localStorage.setItem('cardsArr', JSON.stringify(this.cardsArr))
    console.log('карточки после: ', this.cardsArr)
    this.addEditListeners()
  }

  subtaskGenerator() {
    let addSubtaskBtns = document.querySelectorAll('.button-add-card-subtask')
    addSubtaskBtns.forEach((button) => {
      this.onListener('click', button, this.addSubtaskArr)
    })
  }
  addEditListeners() {
    const cards = document.querySelectorAll('.card')
    cards.forEach((card) => {
      Array.from(card.children, (child, i) => {
        this.dragBreak(child)
        if (child.classList.contains('card-text')) {
          this.onListener('mousedown', child, this.edit)
        } else if (child.classList.contains('card-subtasks')) {
          Array.from(child.children, (subtaskWrapper) => {
            Array.from(subtaskWrapper.children, (subtaskChild, e) => {
              this.dragBreak(subtaskChild)
              if (subtaskChild.classList.contains('card-subtask-text')) {
                this.onListener('mousedown', subtaskChild, this.edit)
              } else if (
                subtaskChild.classList.contains('button-card-remove-subtask')
              ) {
                this.onListener('click', subtaskChild, this.deleteSubtask)
              } else {
                this.onListener('click', subtaskChild, this.checkboxes)
              }
            })
          })
        }
      })
    })
  }

  onListener(listener, classes, callback) {
    classes.addEventListener(listener, callback.bind(this))
  }
  dragBreak(classes) {
    classes.addEventListener('dragstart', (e) => {
      e.preventDefault()
      e.stopPropagation()
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
      this.cardsArr.forEach((card) => {
        if (`${card.id}` === cardID) {
          if (cardItem.dataset.number) {
            let num = cardItem.dataset.number
            card[num].subtaskText = cardItem.value
          } else {
            card.task = cardItem.value
          }
        }
      })
      localStorage.setItem('cardsArr', JSON.stringify(this.cardsArr))
    })
  }
}

const card = new Card()

export default card
