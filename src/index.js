import '../src/scss/index.scss'
import Card from './js/Card.js'
import DragNDrop from './js/DragNDrop.js'

const btnAdd = document.querySelector('.button-add')
const modalCreator = document.querySelector('.modal-creator')

const cardCreatorForm = document.querySelector('.card-creator-form'),
  cardCreatorName = document.querySelector('.card-creator-name'),
  cardCreatorText = document.querySelector('.card-creator-text'),
  cardCreatorBtn = document.querySelector('.button-create')

const cardsContainer = document.querySelector('.cards-container')
const cardsArr = JSON.parse(localStorage.getItem('cardsArr')) || []
const removeBtn = document.querySelector('.button-remove')
const dragNDrop = new DragNDrop(
  cardsContainer,
  cardsArr,
  cardCreatorName,
  cardCreatorText,
  removeBtn
)

dragNDrop.render()
dragNDrop.addListeners()
dragNDrop.addEditListeners()
btnAdd.addEventListener('click', (e) => {
  e.preventDefault()
  modalCreator.classList.toggle('active')
  btnAdd.classList.toggle('active')
})

cardCreatorBtn.addEventListener('click', (e) => {
  e.preventDefault()
  modalCreator.classList.toggle('active')
  btnAdd.classList.toggle('active')
  dragNDrop.create()
  dragNDrop.render()
  dragNDrop.addListeners()
  dragNDrop.addEditListeners()
})
