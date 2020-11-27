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

                      <span contenteditable
      class="card-creator-subtask"
      type="text"
      placeholder="Введите подпункт"
    ></span>
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
        child.textContent = ''
      } else {
        child.remove()
      }
    })
  }

  create(e) {
    const subtasks = this.tasksContainer.querySelectorAll(
      '.card-creator-subtask'
    )
    const subtaskID = `s${(+new Date()).toString(16)}`
    this.currentCard = {
      id: `f${(+new Date()).toString(16)}`,
      task: `${this.formText.textContent}`,
    }
    if (subtasks !== undefined) {
      subtasks.forEach((subtask, index) => {
        this.currentCard[`${subtaskID + index}`] = {
          subtaskText: `${subtask.textContent}`,
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
          <span contenteditable='true' data-number="${key}" draggable="true" class="card-subtask-text">${card[key].subtaskText}</span>
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
<div class="card-tasks-wrapper">
        <span contenteditable='true' draggable="true" class="card-text">${
          card.task
        }</span>
        <div class='card-subtasks'>${this.generateHTML(card)}</div>
</div>
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

  checkboxesInit(e) {
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
  addSubtaskListeners(subtaskWrapper) {
    const checkbox = subtaskWrapper.querySelector('.subtask-checkbox')
    const deleteBtn = subtaskWrapper.querySelector(
      '.button-card-remove-subtask'
    )
    const subtask = subtaskWrapper.querySelector('.card-subtask-text')
    this.onListener('click', checkbox, this.checkboxesInit)
    this.onListener('click', deleteBtn, this.deleteSubtask)
    this.onListener('input', subtask, this.edit)
  }
  addDragBreakListeners() {
    const cards = document.querySelectorAll('.card')
    cards.forEach((card) => {
      let childrens = [...card.children]
      childrens.forEach((child) => {
        this.dragBreak(child)
        if (child.children.length) {
          const siblingsChildrens = [...child.children]
          siblingsChildrens.forEach((sibling) => {
            this.dragBreak(sibling)
          })
        }
      })
    })
  }
  initListeners() {
    this.addEditListeners()
    this.addCheckboxListeners()
    this.addRemoveSubtaskListeners()
    this.addDragBreakListeners()
  }
  addEditListeners() {
    const inputs = []
    const cards = document.querySelectorAll('.card')
    cards.forEach((card) => {
      inputs.push(
        ...card.querySelectorAll('.card-subtask-text'),
        card.querySelector('.card-text')
      )
    })
    inputs.forEach((input) => {
      this.onListener('click', input, this.edit)
    })
  }
  addRemoveSubtaskListeners() {
    const subtasks = document.querySelectorAll('.button-card-remove-subtask')
    subtasks.forEach((subtask) => {
      this.onListener('click', subtask, this.deleteSubtask)
    })
  }
  addCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.subtask-checkbox')
    checkboxes.forEach((checkbox) => {
      this.onListener('click', checkbox, this.checkboxesInit)
    })
  }

  addSubtaskArr(e) {
    const eventCard = e.target.closest('.card')
    let subtaskID = `s${(+new Date()).toString(16) + 1}`
    const subtasksContainer = eventCard.querySelector('.card-subtasks')
    this.cardsArr.forEach((card, index) => {
      if (card.id === eventCard.dataset.id) {
        subtaskID += index
        card[subtaskID] = {
          subtaskText: '',
          state: 'false',
        }
      }
    })
    subtasksContainer.insertAdjacentHTML(
      'beforeend',
      `<div draggable="true"  class='card-subtask'>
                    <input draggable="true" class="subtask-checkbox" type="checkbox">
                    <span contenteditable='true' data-number=${subtaskID} draggable="true" class="card-subtask-text"></span>
                    <button draggable="true" class="button-card-remove-subtask"></button>
                    </div>`
    )
    localStorage.setItem('cardsArr', JSON.stringify(this.cardsArr))
    const childrens = [...subtasksContainer.children]
    const newSubtask = childrens[childrens.length - 1]
    this.addSubtaskListeners(newSubtask)
  }

  subtaskGenerator() {
    let addSubtaskBtns = document.querySelectorAll('.button-add-card-subtask')
    addSubtaskBtns.forEach((button) => {
      this.onListener('click', button, this.addSubtaskArr)
    })
  }

  onListener(listener, classes, callback) {
    if (callback === this.checkboxes) {
    }
    classes.addEventListener(listener, callback.bind(this))
  }
  dragBreak(classes) {
    this.onListener('dragstart', classes, (e) => {
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
    this.onListener('input', cardItem, () => {
      this.cardsArr.forEach((card) => {
        if (`${card.id}` === cardID) {
          if (cardItem.dataset.number) {
            let num = cardItem.dataset.number
            card[num].subtaskText = cardItem.textContent
          } else {
            card.task = cardItem.textContent
          }
          localStorage.setItem('cardsArr', JSON.stringify(this.cardsArr))
        }
      })
    })
  }
}

const card = new Card()

export default card
