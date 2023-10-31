const main = document.querySelector('main');
const isMainAbout = main.classList.contains('main-registration_about')
const isMainEdu = main.classList.contains('main-registration_edu')

// local storage 

const getFormData = JSON.parse(localStorage.getItem('formData'));

function localStorageSet(name,obj){
    const stringData = JSON.stringify(obj);
    localStorage.setItem(name,stringData)
}
function inputLSSet(input){
    currentData[input.dataset.input] = input.value
    localStorageSet('formData',currentData)
}


// перенос в карточки
const inputTypes = {
    textReplace :['name','area','date'], 
    textNoReplace:['org'],
    radio:['gender','course'],
    special:['edu']
}

const currentData = {
    avatar:'',
    name:'',
    gender:'',
    date:'',
    tg:'',
    phone:'',
    area:''
}
function setAboutFormData(){ //cоздание фейкового инпута для переноса в карточки на 2 странице
    const setFormAttributes = ['name','area','date','gender']
    const inputCase = document.createElement('input')
    setFormAttributes.forEach((item)=>{
        inputCase.dataset.input = item
        inputCase.value = getFormData[item]
        syncInput(inputCase)
    })
}
if(isMainEdu){
    setAboutFormData()
}

const displayedInputs = document.querySelectorAll('.displayed-input');

displayedInputs.forEach((item)=>{
    item.addEventListener('input', function(){
        syncInput(this)
        inputLSSet(this)
    })
})

function getTextBlockContainer(data){
    return `<div class="text-block__container_${data}"></div>`
}
function getTextBlockItem(data, text){
    return `<p data-input='${data}' class="text-block__${data} text-block__item">${text}</p>`
}

function syncInput(input){   // жесть функция по переносу в карточку в зависимости от типа переноса
    const attribute = input.dataset.input
    const currentInputContainer = document.querySelector(`.text-block__container_${attribute}`);
    const currentInputItem = document.querySelector(`.text-block__${attribute}`);
    
    if(inputTypes.textReplace.indexOf(attribute) != -1){
     
        if(currentInputContainer){
            currentInputContainer.insertAdjacentHTML('afterend', getTextBlockItem(attribute,input.value))
            currentInputContainer.remove()
        } else {
            currentInputItem.innerText = input.value
        }
        if(!input.value){
            currentInputItem.insertAdjacentHTML('afterend', getTextBlockContainer(attribute))
            currentInputItem.remove()
        }
    
    } else if(inputTypes.textNoReplace.indexOf(attribute) != -1){
        currentInputContainer.innerText = input.value
    } else if(inputTypes.radio.indexOf(attribute) != -1){

        if(currentInputContainer){
            currentInputContainer.insertAdjacentHTML('afterend', getTextBlockItem(attribute,input.value))
            currentInputContainer.remove()
        } else {
            currentInputItem.innerText = input.value
        }

    } else if(inputTypes.special.indexOf(attribute) != -1){
        const selectValues = document.querySelectorAll('.select-inner__text_selected');
        let selectText = '';
        selectValues.forEach((item)=>{
            if(item.dataset.edu != 'eduProgramm'){
                selectText += ' ' +item.innerText
            }
        })
        
        if(currentInputContainer){
            currentInputContainer.insertAdjacentHTML('afterend', getTextBlockItem(attribute,selectText))
            currentInputContainer.remove()
        } else {
            currentInputItem.innerText = selectText
        }
    }
}




// input file с аватаркой

const imgLoadWrapper = document.querySelector('.imgLoadWrapper');
const imgLoadCloseBtn = document.querySelector('.inserted-img__close-btn');

const fileInput  = document.querySelector('#file-input');

const blankImg = document.querySelector('.blank-img');
const insertedImgs = document.querySelectorAll('.inserted-img');
const cardImgs = document.querySelectorAll('.inserted-img__item');

if(isMainAbout){

    fileInput.addEventListener('change',(e)=>{
        blankImg.classList.add('hidden')
        imgLoadWrapper.classList.add('hidden')
        imgLoadWrapper.classList.remove('error-file')
        insertedImgs.forEach((item)=> item.classList.remove('hidden'))
        
    
    
        const target = e.target
        const filereader = new FileReader();
        
    
        filereader.onload = function(){
            cardImgs.forEach((item)=>{
                item.src = filereader.result
            })
            currentData['avatar'] =  filereader.result
            localStorageSet('formData',currentData)
        }
        filereader.readAsDataURL(target.files[0]);
        
        
    })
    function imgRemove(){
        blankImg.classList.remove('hidden')
        imgLoadWrapper.classList.remove('hidden')
        insertedImgs.forEach((item)=> item.classList.add('hidden'))
        currentData['avatar'] = ''
        localStorageSet('formData',currentData)
    
    }
    imgLoadCloseBtn.addEventListener('click', imgRemove)
}
else if(isMainEdu){
    blankImg.classList.add('hidden')
    insertedImgs[0].classList.remove('hidden')
    cardImgs[0].src = getFormData.avatar
}
// календарь

if(isMainAbout){
    const dateInput = document.querySelector('.about-form__input_date');
    flatpickr(dateInput);

    dateInput.addEventListener('change',function(){
        const dateClone = this.cloneNode(1)
        const dateBirthday = new Date(dateClone.value)
        const currentAge = (new Date().getTime() - dateBirthday.getTime()) / (365 * 24 * 3600 * 1000)
        dateClone.value = Math.floor(currentAge) + ' лет'
        syncInput(dateClone)
        inputLSSet(dateClone)
    }) 
}


// select
const faculty = ["Факультет экономических наук" , "Высшая школа бизнеса" ," Факультет социальных наук" , "Факультет гуманитарных наук" , "Факультет права","Факультет химии","Факультет биологии"]
const eduProgramm = ['Управление бизнесом','Филология','Право','Химия','Реклама','Античность','История искусств','Управление бизнесом','Филология','Право','Химия','Реклама','Античность','История искусств']

if(isMainEdu){
    const facultyWrapper = document.querySelector('.option-wrapper_faculty');
    const eduProgrammWrapper = document.querySelector('.option-wrapper_edu-programm');
    const optionItem = (name) => `<span class="option-wrapper__item">${name}</span>`

    faculty.forEach((item)=>{
        facultyWrapper.insertAdjacentHTML('beforeend',optionItem(item))
    })
    eduProgramm.forEach((item)=>{
        eduProgrammWrapper.insertAdjacentHTML('beforeend',optionItem(item))
    })

    document.addEventListener('click',(e)=>{ 
        if(!e.target.closest('.select-inner_focused')){
            selectInnerAll.forEach((item)=>{
                item.classList.remove('select-inner_focused')
            })
        }
        
    })

}


// placeholder для input и работа select

const placeholders = document.querySelectorAll('.input-wrapper__placeholder');
const formInputs = document.querySelectorAll('.about-form__input');
const form = document.querySelector('form');

const selectInnerAll = document.querySelectorAll('.select-inner');

form.addEventListener('click',(e)=>{
    let currentInput = ''

    if(e.target.closest('.about-form__input')){
        currentInput = e.target
        e.target.previousElementSibling.classList.add('input-wrapper__placeholder_focused')
        
    }
    else if(e.target.closest('.input-wrapper__placeholder')){
        currentInput = e.target.nextElementSibling
        currentInput.focus()
        e.target.classList.add('input-wrapper__placeholder_focused')

    }
    if(currentInput != ''){
    
        currentInput.addEventListener('blur',function(){
            if(!(currentInput.value || currentInput.classList.contains('about-form__input'))){
                currentInput.previousElementSibling.classList.remove('input-wrapper__placeholder_focused')
            }
        })
    }
    // чтобы не создавать второй обраточик для формы


    if(e.target.closest('.select-inner')){
        selectInnerAll.forEach((item)=>{
            item.classList.remove('select-inner_focused')
        })
        const optionWrapper = e.target.closest('.select-inner')
        optionWrapper.classList.add('select-inner_focused')
    }
    else if(e.target.closest('.option-wrapper')){
        
        const currentSelect = e.target.closest('.option-wrapper').previousElementSibling
        const currentSelectValue = currentSelect.childNodes[1]
        currentSelectValue.innerText = e.target.closest('.option-wrapper__item').innerText
        currentSelectValue.classList.add('select-inner__text_selected')
        currentSelect.classList.remove('select-inner_focused')
        syncInput(currentSelectValue)
        
    }

    
})

// обработка радио кнопок

const eduLevelWrapper = document.querySelector('#eduLevel-radio');
const eduLevelItems = document.querySelectorAll('.edu-radio-label');
const eduLevelGraduate = document.querySelector('.edu-checkbox-label');

const radioButtonsInputs = document.querySelectorAll(".radio-label_input");
const radioLabels = document.querySelectorAll('.radio-label');

radioButtonsInputs.forEach((item)=>{
    item.addEventListener('change', function(){
        syncInput(item)
        inputLSSet(item)
    })
})

radioLabels.forEach((item)=>{
    item.addEventListener('change',function(){
        const errText = item.parentNode.nextElementSibling 
        errText.innerText = ''
    })
})

if(isMainEdu){
    const radioSelectForCard = document.querySelector('#radioSelectForCard');
    eduLevelWrapper.addEventListener('click',(e)=>{
        const target = e.target.closest('.edu-radio-label')
        if(target){
            eduLevelItems.forEach((item)=>{
                item.classList.remove('radio-active')
            })
            target.classList.add('radio-active')
            eduLevelGraduate.childNodes[1].checked = false
            radioSelectForCard.innerText = target.innerText + ' курс'
            syncInput(radioSelectForCard)
        }
    
    })
    eduLevelGraduate.addEventListener('change',function(){
        if(this.childNodes[1].checked){
            eduLevelItems.forEach((item)=>{
                item.classList.remove('radio-active')
            })
            radioSelectForCard.innerText = 'Выпускник'
            syncInput(radioSelectForCard)
        }
    })

}




// валидация

const textInputsForValidate = document.querySelectorAll("input[type='text'], textarea");


textInputsForValidate.forEach((item)=>{
    if(item.dataset.input != 'date'){
       
        item.addEventListener('blur', function(){
            textValidate(this)
            
        })
        item.addEventListener('focus',function(){
            removeTextError(this)
        })

    }
    
})

const phonePattern = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/

function textValidate(input){
    
    
    if(!input.value.length){
        input.classList.add('error-input')
        input.previousElementSibling.classList.add('error-text')
        input.nextElementSibling.innerText = 'обязательное поле'
        return 0
    }
    if(input.classList.contains('about-form__input_phone')){
        if(!phonePattern.test(input.value)){
            input.classList.add('error-input')
            input.previousElementSibling.classList.add('error-text')
            input.nextElementSibling.innerText = 'неверный формат ввода'
            return 0
        }
    }
    return 1
}

function removeTextError(input){
    input.classList.remove('error-input')
    input.previousElementSibling.classList.remove('error-text')
    input.nextElementSibling.innerText = ''
}

function fileValidate(input){
    if(input.files.length == 0){
        input.previousElementSibling.classList.add('error-file')
    }
    return input.files.length
}

function dateValidate(input){
    if(!input.value.length){

    }
}


function radioValidate(label){
    const options = document.querySelectorAll(label);
    const errText = options[0].parentNode.nextElementSibling 
    let flag = 0
    options.forEach((item)=>{
       
        if(item.childNodes[1].checked){
            flag = 1
        }
    })

    if(flag){
        return 1
    }
    errText.innerText = 'Выберите один из варинтов'
    return 0
}



const linkButton = document.querySelector('.link-button');


linkButton.addEventListener('click',()=>{
    let validateFlag = true;

    if(isMainAbout){
        if(!fileValidate(fileInput)){
            validateFlag = false
           
        }
        if(!radioValidate('#gender-radio .radio-label')){
            validateFlag = false
            
        }
        textInputsForValidate.forEach((item)=>{
            if(!textValidate(item)){
                validateFlag = false
            }
        })

    }
    if(isMainEdu){
        
        
        textInputsForValidate.forEach((item)=>{
            if(!textValidate(item)){
                validateFlag = false
            }
        })

    }
    

    if(validateFlag){
        window.location.href = 'profile-edu.html'
    }

})














