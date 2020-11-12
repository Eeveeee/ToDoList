import '../src/scss/index.scss'
import card from './js/Card.js'
import dragNDrop from './js/DragNDrop.js'

const btnAdd = document.querySelector('.button-add')
const modalCreator = document.querySelector('.modal-creator')

const cardCreatorForm = document.querySelector('.card-creator-form'),
  cardCreatorName = document.querySelector('.card-creator-name'),
  cardCreatorText = document.querySelector('.card-creator-text'),
  cardCreatorBtn = document.querySelector('.button-create')

const cardsContainer = document.querySelector('.cards-container')
const cardsArr = JSON.parse(localStorage.getItem('cardsArr')) || []
const removeBtn = document.querySelector('.button-remove')
card.init(cardsContainer, cardsArr, cardCreatorName, cardCreatorText)
dragNDrop.init(cardsContainer, cardsArr, removeBtn)

card.render()
dragNDrop.addListeners()
card.addEditListeners()
btnAdd.addEventListener('click', (e) => {
  e.preventDefault()
  modalCreator.classList.toggle('active')
  btnAdd.classList.toggle('active')
})

cardCreatorBtn.addEventListener('click', (e) => {
  e.preventDefault()
  modalCreator.classList.toggle('active')
  btnAdd.classList.toggle('active')
  card.create()
  card.render()
  dragNDrop.addListeners()
  card.addEditListeners()
})
