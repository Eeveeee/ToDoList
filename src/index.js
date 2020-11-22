import '../src/scss/index.scss'
import card from './js/Card.js'
import dragNDrop from './js/DragNDrop.js'

const btnAdd = document.querySelector('.button-add')
const modalCreator = document.querySelector('.modal-creator')

const cardCreatorForm = document.querySelector('.card-creator-form'),
  cardCreatorName = document.querySelector('.card-creator-name'),
  cardCreatorText = document.querySelector('.card-creator-text'),
  cardCreatorBtn = document.querySelector('.button-create'),
  cardSubtaskBtn = document.querySelector('.button-add-subtask')
const cardsContainer = document.querySelector('.cards-container')
const tasksContainer = document.querySelector('.card-tasks-container')
const cardsArr = JSON.parse(localStorage.getItem('cardsArr')) || []
const removeBtn = document.querySelector('.button-remove')
card.init(cardsContainer, cardsArr, cardCreatorText, tasksContainer)
dragNDrop.init(cardsContainer, cardsArr, removeBtn)

card.render()
dragNDrop.addListeners()
card.addEditListeners()
card.subtaskGenerator()

card.onListener('click', btnAdd, (e) => {
  e.preventDefault()
  modalCreator.classList.toggle('active')
  btnAdd.classList.toggle('active')
})

card.onListener('click', cardSubtaskBtn, (e) => {
  e.preventDefault()
  card.subtasksCreatorManager()
})

card.onListener('click', cardCreatorBtn, (e) => {
  e.preventDefault()
  modalCreator.classList.toggle('active')
  btnAdd.classList.toggle('active')
  card.create(e)
  card.render()
  dragNDrop.addListeners()
  card.addEditListeners()
  card.subtaskGenerator()
})
