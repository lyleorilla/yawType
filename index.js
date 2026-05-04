let dataWordIndex = 0
let LetterPositionIndex = 0
let wordLength = 0
// caret moving functions, not smooth when moveing word to word
// const reduceCaret = (element) => {
//     if (LetterPositionIndex >= element.children.length) {
//         const lastLetter = element.children[element.children.length - 2]
//         console.log("lastLetter")
//         element.style.setProperty('--caret-x', `${lastLetter.offsetLeft + lastLetter.offsetWidth}px`)
//         console.log("run1")
//         console.log(lastLetter.offsetLeft)
//     } else {
//         const letter = element.children[LetterPositionIndex - 1]
//         if (!letter) {
//             return
//         }
//         element.style.setProperty('--caret-x', `${letter.offsetLeft}px`)
//         console.log("run2")
//         console.log(letter.offsetWidth)
//     }
// }


// Array of typing words

const updateCaret = (element, mainEl) => {
    let caretPosition = document.querySelector(".caret");
    if (!element) {
        // end of word, place caret after last letter
        const rect = mainEl.getBoundingClientRect()
        caretPosition.style.left = `${rect.right}px`  // right edge of last letter
        caretPosition.style.top = `${rect.top}px`
        return
    }

    const rect = element.getBoundingClientRect()
    caretPosition.style.left = `${rect.left}px`
    caretPosition.style.top = `${rect.top - 9}px`
}

const typingWords = [
    "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog",
    "mountain", "river", "forest", "bridge", "which", "monitor", "system",
    "and", "function", "variable", "syntax", "context", "science", "history",
    "future", "present", "journey", "yawto", "harmony", "balance", "nation",
    "glimmer", "shadow", "vibrant", "echo", "puzzle", "silence", "brave",
    "whisper", "thunder", "ocean", "desert", "planet", "galaxy", "nebula",
    "point", "without", "dynamic", "static", "infinite", "logic", "create"
];
for (let i = 0; i < 100; i++) {
    const wordContainer = document.createElement("div")
    wordContainer.classList.add("word")
    if (i === 0) {
        wordContainer.classList.add("active")
        const container = document.querySelector('.container')
        const caret = document.createElement("div")
        caret.classList.add("caret")
        container.appendChild(caret)
        // updateCaret(wordContainer.children[0])
    }
    wordContainer.setAttribute("word-index", i)
    const wordIndex = Math.floor(Math.random() * 50)
    const word = typingWords[wordIndex]
    if (i === 0) {
        wordLength = word.length - 1
    }
    for (let i = 0; i < word.length; i++) {
        const letter = word[i]
        const letterElement = document.createElement("letter")
        letterElement.textContent = letter
        wordContainer.appendChild(letterElement)
    }
    const container = document.querySelector('.container')
    container.appendChild(wordContainer)
}


// controller one
const element = document.querySelector(".controller-one")
element.addEventListener("click", e => {
    const clickElement = e.target
    if (clickElement.classList.contains("controller-icon")) {
        clickElement.classList.add("controller-icon-active")
        clickElement.classList.remove("controller-icon")
        console.log("active")
        return
    }
    clickElement.classList.add("controller-icon")
    clickElement.classList.remove("controller-icon-active")
    console.log("unactive")
})

//controller two
const elementTwo = document.querySelector(".controller-two")
elementTwo.addEventListener("click", e => {
    const clickElement = e.target
    if (!clickElement.classList.contains("controller-icon")) return;
    Array.from(elementTwo.children).forEach((childElement, index) => {
        childElement.classList.add("controller-icon")
        childElement.classList.remove("controller-icon-active")
    })
    clickElement.classList.remove("controller-icon")
    clickElement.classList.add("controller-icon-active")
})
const elementThree = document.querySelector(".controller-three")
elementThree.addEventListener("click", e => {
    const clickElement = e.target
    if (!clickElement.classList.contains("controller-icon")) return;
    Array.from(elementThree.children).forEach((childElement, index) => {
        childElement.classList.add("controller-icon")
        childElement.classList.remove("controller-icon-active")
    })
    clickElement.classList.remove("controller-icon")
    clickElement.classList.add("controller-icon-active")
})

document.addEventListener("keydown", (e) => {
    if (e.repeat) {
        console.log("it repeat")
        return
    };

    const targetWord = document.querySelector(`[word-index="${dataWordIndex}"]`)
    const key = e.key

    //filter unwanted keys
    switch (key) {
        case "Tab":
            return
        case "Shift":
            return
        case "Control":
            return
        case "Alt":
            return
        case "Meta":
            return
        case "Enter":
            return

    }

    // space logic
    if (key === " ") {
        // uncomment if you want to make the previous word incorrect if not fully typed
        // if (wordLength > LetterPositionIndex - 1) {
        //     Array.from(targetWord.children).forEach(el => {
        //         el.className = 'incorrect'
        //     })
        // }
        if (targetWord.querySelector(".incorrect") || wordLength > LetterPositionIndex - 1) {
            console.log("it contain incorrect")
            targetWord.classList.add("error-type")
            console.log("1")
        }
        // change active word
        targetWord.classList.remove("active")
        targetWord.nextElementSibling.classList.add("active")

        dataWordIndex++
        LetterPositionIndex = 0
        const newTargetWord = document.querySelector(`[word-index="${dataWordIndex}"]`)
        updateCaret(newTargetWord.children[LetterPositionIndex], newTargetWord)
        wordLength = document.querySelector(`[word-index="${dataWordIndex}"]`).children.length - 1
        console.log("2")
        return
    }


    // backspace logic
    if (key === "Backspace") {


        // can't reduce word index if letter position index is 0
        if (dataWordIndex === 0 && LetterPositionIndex === 0) {
            console.log('cant reduce word index')
            return
        }

        // reduce word index if letter position index is 0
        if (LetterPositionIndex === 0) {

            // change active word

            targetWord.classList.remove("active")
            targetWord.previousElementSibling.classList.add("active")
            targetWord.previousElementSibling.classList.remove("error-type")
            dataWordIndex--
            wordLength = document.querySelector(`[word-index="${dataWordIndex}"]`).children.length - 1
            const extraWord = document.querySelector(`[word-index="${dataWordIndex}"]`).querySelectorAll(".extra")
            // extra word handlling
            if (extraWord != 0) {
                console.log("extra word")
                const wordCorrect = document.querySelector(`[word-index="${dataWordIndex}"]`).querySelectorAll(".correct").length
                const wordIncorrect = document.querySelector(`[word-index="${dataWordIndex}"]`).querySelectorAll(".incorrect").length
                LetterPositionIndex = wordCorrect + wordIncorrect

                wordLength = wordLength - extraWord.length
                console.log("1")
                console.log(dataWordIndex)
                const targetWord = document.querySelector(`[word-index="${dataWordIndex}"]`)
                console.log(targetWord)
                console.log("before target word")
                updateCaret(targetWord.children[LetterPositionIndex], targetWord)
                return
            }

            // normal word handlling
            LetterPositionIndex = wordLength + extraWord
            wordLength = wordLength - extraWord;
            console.log("2")

            return
        }

        // remove the incorrect and leave the original matching word
        if (LetterPositionIndex - 1 > wordLength) {
            LetterPositionIndex--
            console.log(LetterPositionIndex, ">", wordLength)
            targetWord.lastChild.remove()
            console.log("3")
            updateCaret(targetWord.children[LetterPositionIndex], targetWord)
            return
        }

        // matching word css remove
        LetterPositionIndex--
        targetWord.children[LetterPositionIndex].classList.remove("correct")
        targetWord.children[LetterPositionIndex].classList.remove("incorrect")
        updateCaret(targetWord.children[LetterPositionIndex], targetWord)
        console.log("4")
        return
    }


    // max typing limit
    if (LetterPositionIndex > 22) {
        console.log("max typing limit reached")
        return
    }

    // over typing logic
    if (LetterPositionIndex > wordLength) {
        console.log("OverType")
        const letterElement = document.createElement("letter")
        letterElement.textContent = key
        letterElement.classList.add("incorrect")
        letterElement.classList.add("extra")
        targetWord.appendChild(letterElement)
        LetterPositionIndex++
        updateCaret(targetWord.children[LetterPositionIndex], targetWord)
    }

    // correct/incorrect logic
    // 1. First, check if we still have letters left to type
    if (LetterPositionIndex < targetWord.children.length) {

        // 2. Then check if the key is correct
        if (key === targetWord.children[LetterPositionIndex].textContent) {
            console.log("correct");
            targetWord.children[LetterPositionIndex].classList.add("correct");
            LetterPositionIndex++;
            console.log(LetterPositionIndex, "correct")

        } else {
            targetWord.children[LetterPositionIndex].classList.add("incorrect");
            LetterPositionIndex++;
            console.log(LetterPositionIndex, "incorrect")

        }
        updateCaret(targetWord.children[LetterPositionIndex], targetWord)
    }

    // if (LetterPositionIndex >= targetWord.children.length) {
    //     // end of word, place caret after last letter
    //     const lastLetter = targetWord.children[targetWord.children.length - 1]
    //     targetWord.style.setProperty('--caret-x', `${(lastLetter.offsetLeft + lastLetter.offsetWidth)}px`)
    // } else {
    //     letter = targetWord.children[LetterPositionIndex]
    //     targetWord.style.setProperty('--caret-x', `${letter.offsetLeft}px`)
    // }
    console.log(LetterPositionIndex, ">", wordLength, ":", targetWord.children[LetterPositionIndex])
})