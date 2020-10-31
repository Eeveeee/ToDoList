import '../src/scss/index.scss'
import Card from '../src/js/class-card.js'
const btnAdd = document.querySelector('.button-add')
const modalCreator = document.querySelector('.modal-creator')

const cardCreatorForm = document.querySelector('.card-creator-form'),
  cardCreatorName = document.querySelector('.card-creator-name'),
  cardCreatorText = document.querySelector('.card-creator-text'),
  cardCreatorBtn = document.querySelector('.button-create')

const cardsContainer = document.querySelector('.cards-container')
const cardsArr = []

btnAdd.addEventListener('click', (e) => {
  e.preventDefault()
  modalCreator.classList.toggle('active')
  btnAdd.classList.toggle('active')
})

cardCreatorBtn.addEventListener('click', (e) => {
  e.preventDefault()
  modalCreator.classList.toggle('active')
  btnAdd.classList.toggle('active')

  const card = new Card(
    cardsContainer,
    cardsArr,
    cardCreatorName,
    cardCreatorText
  )
  card.create()
  card.render()
})
