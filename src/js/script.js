// local storage пока не будет

const main = document.querySelector('main');

// input file с аватаркой

const imgLoadWrapper = document.querySelector('.imgLoadWrapper');
const imgLoadCloseBtn = document.querySelector('.inserted-img__close-btn');

const fileInput  = document.querySelector('#file-input');

const blankImg = document.querySelector('.blank-img');
const insertedImgs = document.querySelectorAll('.inserted-img');
const cardImgs = document.querySelectorAll('.inserted-img__item');

if(main.classList.contains('main-registration_about')){

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
        }
        filereader.readAsDataURL(target.files[0]);
    })
    function imgRemove(){
        blankImg.classList.remove('hidden')
        imgLoadWrapper.classList.remove('hidden')
        insertedImgs.forEach((item)=> item.classList.add('hidden'))
    
    }
    imgLoadCloseBtn.addEventListener('click', imgRemove)
}



// placeholder для input

const placeholders = document.querySelectorAll('.input-wrapper__placeholder');
const formInputs = document.querySelectorAll('.about-form__input');
const form = document.querySelector('form');


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
    
})

// обработка радио кнопок

const eduLevelWrapper = document.querySelector('#eduLevel-radio');
const eduLevelItems = document.querySelectorAll('.edu-radio-label');
const radioButtonsInputs = document.querySelectorAll(".radio-label_input");
const radioLabels = document.querySelectorAll('.radio-label');

radioButtonsInputs.forEach((item)=>{
    item.addEventListener('change', function(){
        syncInput(item)
    })
})

radioLabels.forEach((item)=>{
    item.addEventListener('change',function(){
        const errText = item.parentNode.nextElementSibling 
        errText.innerText = ''
    })
})

if(main.classList.contains('main-registration_edu')){
    eduLevelWrapper.addEventListener('click',(e)=>{
        const target = e.target.closest('.edu-radio-label')
        if(target){
            eduLevelItems.forEach((item)=>{
                item.classList.remove('radio-active')
            })
            target.classList.add('radio-active')
        }
    
    })
}

// перенос в карточки
const inputTypes = {
    textReplace :['name','area'], 
    textNoReplace:['org'],
    radio:['gender','course']
}
const displayedInputs = document.querySelectorAll('.displayed-input');

displayedInputs.forEach((item)=>{
    item.addEventListener('input', function(){
        syncInput(this)
    })
})

function getTextBlockContainer(data){
    return `<div class="text-block__container_${data}"></div>`
}
function getTextBlockItem(data, text){
    return `<p data-input='${data}' class="text-block__${data} text-block__item">${text}</p>`
}

function syncInput(input){
    const attribute = input.getAttribute('data-input')
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

    }
}





// валидация

const textInputsForValidate = document.querySelectorAll("input[type='text'], textarea");

textInputsForValidate.forEach((item)=>{
    item.addEventListener('blur', function(){
        textValidate(this)

    })
    item.addEventListener('focus',function(){
        removeTextError(this)
    })
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

    if(main.classList.contains('main-registration_about')){
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
    

    if(validateFlag){
        window.location.href = 'profile-edu.html '
    }

})


// select не успел

// календарь не успел














