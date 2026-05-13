let dataWordIndex = 0
let LetterPositionIndex = 0
let wordLength = 0
let isTyping = false;
let correctAccCount = 0
let totalAccCount = 0
let wpmCorrectCount = 0
let wpmScore = 0
let settingToggle = false

// control container toggle
const controllerBtn = document.querySelector(".setting-controller")
controllerBtn.addEventListener("click", () => {
    if (settingToggle) {
        document.querySelector(".modal-container").style.display = "none";
        settingToggle = false
    } else {
        document.querySelector(".modal-container").style.display = "flex";
        settingToggle = true
    }
})

// exit modal setting
const settingModal = document.querySelector(".modal-container")
settingModal.addEventListener("click", (e) => {
    const clickElement = e.target
    if (clickElement.classList.contains("modal-container")) {
        settingModal.style.display = "none";
        settingToggle = false
    }
})



// Array of typing words
const updateCaret = (element, mainEl) => {
    // remove previous word on screen when active word on third line
    const container = document.querySelector(".container").getBoundingClientRect()
    const letter = mainEl?.getBoundingClientRect()
    if (letter.bottom > container.bottom) {
        let prev = document.querySelector(".active")
        while (prev) {
            const prevSibling = prev.previousElementSibling
            if (container.top === prev.getBoundingClientRect().top) {
                prev.remove()
            }
            prev = prevSibling
        }
    }

    let caretPosition = document.querySelector(".caret");
    if (!element) {
        const rect = mainEl.getBoundingClientRect()
        caretPosition.style.left = `${rect.right}px`  // right edge of last letter
        caretPosition.style.top = `${rect.top}px`
        return
    }

    const rect = element.getBoundingClientRect()
    caretPosition.style.left = `${rect.left}px`
    caretPosition.style.top = `${rect.top - 9}px`
}

const nextTest = () => {
    correctAccCount = 0
    totalAccCount = 0
    dataWordIndex = 0
    LetterPositionIndex = 0
    wordLength = 0
    wpmCorrectCount = 0
    wpmScore = 0
    isTyping = false
    document.querySelector(".container").innerHTML = ""
    createWord()
    document.querySelector(".stats-container").style.display = "flex";
    document.querySelector(".container").style.display = "flex";
    document.querySelector(".result-container").style.display = "none";
    document.querySelector(".timer-countdown").style.visibility = "hidden"
    document.querySelector(".wpm").style.visibility = "visible"
    document.querySelector(".controller-container").style.visibility = "visible";
    document.querySelector(".setting-controller").style.visibility = "visible";
}

const countdownTimer = () => {
    let time = document.querySelector(".controller-three .controller-icon-active").textContent
    time = parseInt(time)
    const timeLimit = time
    let wpmTime = 0

    document.querySelector(".timer-countdown").textContent = time
    countdown = setInterval(() => {
        document.querySelector(".timer-countdown").textContent = time - 1
        if (wpmTime < timeLimit) {
            wpmTime++
            const liveWpm = Math.round((wpmCorrectCount / 5) / (wpmTime / 60))
            document.querySelector(".live-wpm-count").textContent = `${liveWpm == 0 ? "0" : liveWpm}`
        }

        if (time === 1) {
            isTyping = false
            document.querySelector(".live-wpm-count").style.display = "none"
            document.querySelector(".container").style.display = "none";
            document.querySelector(".stats-container").style.display = "none";
            document.querySelector(".result-container").style.display = "flex";
            document.querySelector(".acc-value").textContent = `${Math.round(correctAccCount / totalAccCount * 100)}%`
            document.querySelector(".wpm-value-result").textContent = `${Math.round((wpmCorrectCount / 5) / (wpmTime / 60))}`
            document.querySelector(".avg-wpm").textContent = `avg: ${Math.round((wpmCorrectCount / 5) / (wpmTime / 60))} wpm`

            console.log(document.querySelector(".wpm-value-result"))
            clearInterval(countdown)
            return
        }
        time--
    }, 1000)
}

const typingWords = [
    "the", "quick", "brown", "fox", "jump", "over", "lazy", "dog",
    "mountain", "river", "forest", "at", "which", "monitor", "system",
    "and", "function", "variable", "syntax", "what", "science", "history",
    "future", "present", "journey", "yawto", "frame", "on", "nation",
    "glimmer", "shadow", "eat", "echo", "puzzle", "puta", "brave",
    "whisper", "thunder", "ocean", "desert", "planet", "sigma", "gago",
    "point", "without", "like", "static", "infinite", "logic", "in"
];


// handle change word when resizing window screen
window.addEventListener("resize", () => {
    const container = document.querySelector(".container").getBoundingClientRect()
    const letter = document.querySelector(`[word-index="${dataWordIndex}"]`)?.getBoundingClientRect()
    if (letter.bottom > container.bottom) {
        let prev = document.querySelector(".active")
        while (prev) {
            const prevSibling = prev.previousElementSibling
            if (container.top === prev.getBoundingClientRect().top) {
                prev.remove()
            }
            prev = prevSibling
        }
    }
    updateCaret(document.querySelector(`[word-index="${dataWordIndex}"]`).children[LetterPositionIndex], document.querySelector(`[word-index="${dataWordIndex}"]`))

})

const createWord = () => {
    let currentIndexWord = null
    for (let i = 0; i < 100; i++) {
        const wordContainer = document.createElement("div")
        wordContainer.classList.add("word")
        if (i === 0) {
            wordContainer.classList.add("active")
            const container = document.querySelector('.container')
            const caret = document.createElement("div")
            caret.classList.add("caret")
            container.appendChild(caret)
        }
        wordContainer.setAttribute("word-index", i)
        let wordIndex = Math.floor(Math.random() * 50)
        let word = ""
        while (wordIndex === currentIndexWord) {
            console.log("multiple word occur")
            wordIndex = Math.floor(Math.random() * 50)
        }
        currentIndexWord = wordIndex
        word = typingWords[wordIndex]

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
}
createWord()

// controller one
const element = document.querySelectorAll(".controller-one")
element.forEach(el => {
    el.addEventListener("click", e => {
        const clickElement = e.target
        const group = clickElement.attributes["data-group"].value
        document.querySelectorAll(`[data-group="${group}"]`).forEach(el => {
            if (el.classList.contains("controller-icon")) {
                el.classList.add("controller-icon-active")
                el.classList.remove("controller-icon")
                return
            }
            el.classList.add("controller-icon")
            el.classList.remove("controller-icon-active")
        })

    })
})

//controller two
const elementTwo = document.querySelectorAll(".controller-two")
elementTwo.forEach(elNode => {
    elNode.addEventListener("click", e => {
        const clickElement = e.target.closest("[data-group]")
        const group = clickElement.attributes["data-group"].value
        document.querySelectorAll(`[data-group=${group}]`).forEach(el => {
            if (!el.classList.contains("controller-icon")) return;
            Array.from(el.parentElement.children).forEach((childElement, index) => {
                childElement.classList.add("controller-icon")
                childElement.classList.remove("controller-icon-active")
            })
            el.classList.remove("controller-icon")
            el.classList.add("controller-icon-active")
        })
    })
})

//controller three
const elementThree = document.querySelectorAll(".controller-three")
elementThree.forEach(elNode => {
    elNode.addEventListener("click", e => {
        const clickElement = e.target.closest("[data-group]")
        const group = clickElement.attributes["data-group"].value
        document.querySelectorAll(`[data-group="${group}"]`).forEach(el => {
            if (!el.classList.contains("controller-icon")) return;
            Array.from(el.parentElement.children).forEach((childElement, index) => {
                childElement.classList.add("controller-icon")
                childElement.classList.remove("controller-icon-active")
            })
            el.classList.remove("controller-icon")
            el.classList.add("controller-icon-active")
        })
    })
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
    if (!isTyping && dataWordIndex === 0) {

        isTyping = true
        document.querySelector(".setting-controller").style.visibility = "none"
        document.querySelector(".live-wpm-count").style.display = "flex"
        document.querySelector(".controller-container").style.visibility = "hidden"
        document.querySelector(".timer-countdown").style.visibility = "visible"
        document.querySelector(".wpm").style.visibility = "hidden"
        document.querySelector(".setting-controller").style.visibility = "hidden"
        countdownTimer()

    }
    // space logic
    if (key === " ") {
        //if first word and index 0, do nothing 
        if (LetterPositionIndex === 0 && dataWordIndex >= 0) return

        correctAccCount++
        totalAccCount++
        wpmCorrectCount++
        console.log(`correct: ${wpmCorrectCount}`)

        // if word contain incorrect or wrong length, add error class
        if (targetWord.querySelector(".incorrect") || wordLength > LetterPositionIndex - 1) {
            targetWord.classList.add("error-type")
            const correctWords = targetWord.querySelectorAll(".correct").length
            wpmCorrectCount -= correctWords
            console.log("test 5")
            console.log(`WpmCorrect: ${wpmCorrectCount}`)
        }
        // change active word
        targetWord.classList.remove("active")
        targetWord.nextElementSibling.classList.add("active")


        dataWordIndex++
        LetterPositionIndex = 0
        const newTargetWord = document.querySelector(`[word-index="${dataWordIndex}"]`)
        updateCaret(newTargetWord.children[LetterPositionIndex], newTargetWord)
        wordLength = document.querySelector(`[word-index="${dataWordIndex}"]`).children.length - 1
        return
    }

    // backspace logic
    if (key === "Backspace") {

        // can't reduce word index if letter position index is 0
        if (dataWordIndex === 0 && LetterPositionIndex === 0) return

        // reduce word index if letter position index is 0
        if (LetterPositionIndex === 0) {

            // handle if previous word was correct
            const prevWord = document.querySelector(`[word-index="${dataWordIndex - 1}"]`)
            // make sure previous word does not have any incorrect word
            if (!prevWord.classList.contains("error-type")) return

            // change active word

            targetWord.classList.remove("active")
            targetWord.previousElementSibling.classList.add("active")
            targetWord.previousElementSibling.classList.remove("error-type")
            dataWordIndex--
            wordLength = document.querySelector(`[word-index="${dataWordIndex}"]`).children.length - 1
            const extraWord = document.querySelector(`[word-index="${dataWordIndex}"]`).querySelectorAll(".extra")
            // extra word handlling
            if (extraWord != 0) {
                const wordCorrect = document.querySelector(`[word-index="${dataWordIndex}"]`).querySelectorAll(".correct").length
                const wordIncorrect = document.querySelector(`[word-index="${dataWordIndex}"]`).querySelectorAll(".incorrect").length
                LetterPositionIndex = wordCorrect + wordIncorrect
                wordLength = wordLength - extraWord.length
                const targetWord = document.querySelector(`[word-index="${dataWordIndex}"]`)
                updateCaret(targetWord.children[LetterPositionIndex], targetWord)
                return
            }

            // normal word handlling

            LetterPositionIndex = wordLength + extraWord
            wordLength = wordLength - extraWord;
            return
        }

        // remove the incorrect and leave the original matching word
        if (LetterPositionIndex - 1 > wordLength) {
            console.log(`WpmCorrect: ${wpmCorrectCount}, backspace Logic no increase decrease`)
            console.log("test 1")
            LetterPositionIndex--
            targetWord.lastChild.remove()
            updateCaret(targetWord.children[LetterPositionIndex], targetWord)
            return
        }

        // matching word css remove
        wpmCorrectCount--

        console.log(`WpmCorrect: ${wpmCorrectCount} backspace Logic`)
        console.log("test 4")
        LetterPositionIndex--
        updateCaret(targetWord.children[LetterPositionIndex], targetWord)
        targetWord.children[LetterPositionIndex].classList.remove("correct")
        targetWord.children[LetterPositionIndex].classList.remove("incorrect")
        return
    }

    // max typing limit
    if (LetterPositionIndex > 22) return

    // over typing logic
    if (LetterPositionIndex > wordLength) {
        totalAccCount++
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
            targetWord.children[LetterPositionIndex].classList.add("correct");
            correctAccCount++
            totalAccCount++
            wpmCorrectCount++

            console.log(`WpmCorrect: ${wpmCorrectCount}`)
            LetterPositionIndex++;
        } else {
            targetWord.children[LetterPositionIndex].classList.add("incorrect");
            totalAccCount++

            console.log(`WpmCorrect: ${wpmCorrectCount}`)
            LetterPositionIndex++;
        }
        updateCaret(targetWord.children[LetterPositionIndex], targetWord)
    }
})