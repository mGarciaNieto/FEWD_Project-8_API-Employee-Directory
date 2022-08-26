'use strict'

/*********************        @author Manuel Garcia-Nieto        *********************************/

/* DOM References
================================================================ */
let employees = []
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture, email, location, phone, dob &noinfo &nat=US`
const gridContainer = document.querySelector('.grid-container')
const overlay = document.querySelector('.overlay')
const modalContainer = document.querySelector('.modal-content')
const modalClose = document.querySelector('.modal-close')
const cardToFilter = document.getElementById('filter')

/* Variables
================================================================ */

let cardIndex
const firstCard = 0
const lastCard = 11

/* Fetch from the API
================================================================ */
fetch(urlAPI)
  .then((res) => res.json())
  .then((res) => res.results)
  .then(displayEmployees)
  .catch((err) => console.log(err))

function displayEmployees(employeeData) {
  employees = employeeData
  // store the employee HTML as we create it
  let employeeHTML = ''
  // loop through each employee and create HTML markup
  employees.forEach((employee, index) => {
    let name = employee.name
    let email = employee.email
    let city = employee.location.city
    let picture = employee.picture
    // template literals make this so much cleaner!
    employeeHTML += `
    <div class="card" data-index="${index}">
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
    <h4 class="name">${name.first} ${name.last}</h4>
    <p class="email">${email}</p>
    <p class="address">${city}</p>
    </div>
    </div>
    `
  })
  gridContainer.innerHTML = employeeHTML
}

function displayModal(index) {
  // use object destructuring make our template literal cleaner
  console.log(index)
  let {
    name,
    dob,
    phone,
    email,
    location: { city, street, state, postcode },
    picture
  } = employees[index]

  let date = new Date(dob.date)

  const modalHTML = `
        <div class="arrow">
          <button class="leftArrow">&#10094;</button>
          <button class="rightArrow">&#10095;</button>
        </div>
        <img class="avatar" src="${picture.large}" alt="${name.first} ${name.last}"/>
        <div class="text-container">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="address">${city}</p>
            <hr class="line"/>
            <p class="phone">${phone}</p>
            <p class="full-address">${street.number} ${street.name}, ${state} ${postcode}</p>
            <p class="birthday">Birthday:
            ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
        </div>
    `
  overlay.classList.remove('hidden')
  modalContainer.innerHTML = modalHTML

  document.querySelector('.leftArrow').addEventListener('click', (e) => {
    if (cardIndex > firstCard) {
      cardIndex--
      displayModal(cardIndex)
    } else if (cardIndex === firstCard) {
      displayModal(firstCard)
    }
  })

  document.querySelector('.rightArrow').addEventListener('click', (e) => {
    if (cardIndex < lastCard) {
      cardIndex++
      displayModal(cardIndex)
    } else if (cardIndex === lastCard) {
      displayModal(lastCard)
    }
  })
}

gridContainer.addEventListener('click', (e) => {
  //make sure the click is not on the gridcontainer itself
  if (e.target !== gridContainer) {
    const card = e.target.closest('.card')
    cardIndex = card.getAttribute('data-index')

    displayModal(cardIndex)
  }
})

modalClose.addEventListener('click', () => {
  overlay.classList.add('hidden')
})

cardToFilter.addEventListener('keyup', (e) => {
  const names = document.getElementsByClassName('name')
  const filter = cardToFilter.value.toUpperCase()
  const staff = [...names]
  staff.forEach((employee) => {
    if (employee.innerHTML.toUpperCase().indexOf(filter) > -1) {
      employee.closest('.card').style.display = 'flex'
    } else {
      employee.closest('.card').style.display = 'none'
    }
  })
})
