// Unlock Code Manager - Handles clue unlocking with API integration



// Track current clue index (0-4)
let currentClueIndex = 0
let currentTrailId = null
let currentClue = null

// Utility functions for showing/hiding answer section
function hideAnswerSection() {
  const answerSection = document.getElementById('answerSection')
  if (answerSection) {
    answerSection.style.display = 'none'
  }
}

function showAnswerSection() {
  const answerSection = document.getElementById('answerSection')
  if (answerSection) {
    answerSection.style.display = 'block'
  }
}

function hideUnlockSection() {
  const input = document.getElementById('numberInput')
  const button = document.querySelector('button[onclick="unlockClue()"]')
  if (input) input.style.display = 'none'
  if (button) button.style.display = 'none'
}

function showUnlockSection() {
  const input = document.getElementById('numberInput')
  const button = document.querySelector('button[onclick="unlockClue()"]')
  if (input) input.style.display = 'inline-block'
  if (button) button.style.display = 'inline-block'
}

// Initialize on page load
function initializeUnlockManager() {
  // Set initial trail ID from selector
  const gridSelector = document.getElementById('gridSelector')
  if (gridSelector) {
    currentTrailId = gridSelector.value || '0'
    gridSelector.addEventListener('change', (e) => {
      currentTrailId = e.target.value
      resetClueProgress()
    })
  }

  // Initially hide answer section
  hideAnswerSection()

  // Load initial clue
  loadNextClue()
}

// Run initialization immediately since scripts are at end of body
initializeUnlockManager()

// Reset clue progress when trail changes
function resetClueProgress() {
  currentClueIndex = 0
  currentClue = null
  document.getElementById('clueText').textContent = ''
  document.getElementById('numberInput').value = ''
  document.getElementById('answerInput').value = ''
  document.getElementById('message').textContent = ''
  hideAnswerSection()
  loadNextClue()
}

// Load the next clue by calling the unlock API
async function loadNextClue() {
  if (currentClueIndex > 4) {
    displayMessage('🎉 Congratulations! You have completed all clues for this trail!', 'success')
    hideUnlockSection()
    return
  }

  // Hide answer section until clue is unlocked
  hideAnswerSection()
  // Show the unlock input and button for the new clue
  showUnlockSection()

  try {
    const response = await fetch(`${API_URL}/api/unlock/${currentTrailId}/${currentClueIndex}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to load clue ${currentClueIndex}`)
    }

    const data = await response.json()
    const unlockCode = data.unlockCode
    const clueText = data.clue
    const clueindex = data.clueindex
    const clueAnswer = data.clueAnswer || null
    const clueRowPosition = data.clueRowPosition
    const clueColPosition = data.clueColPosition
    const clueDirection = data.clueDirection


    // Store the expected unlock code and clue positioning for this clue
    currentClue = {
      index: currentClueIndex,
      unlockCode: unlockCode,
      clueindex: clueindex,
      clue: clueText,
      trailId: currentTrailId,
      clueAnswer: clueAnswer,
      clueRowPosition: clueRowPosition,
      clueColPosition: clueColPosition,
      clueDirection: clueDirection
    }

    // Update UI to show clue is ready
    document.getElementById('clueText').textContent = `Clue ${clueindex} loaded: ${clueText}`
    document.getElementById('numberInput').value = ''
    document.getElementById('numberInput').focus()

    console.log(`Loaded clue ${currentClueIndex} for trail ${currentTrailId}, unlock code: ${unlockCode}`)
    console.log(`Clue details: ${JSON.stringify(currentClue)}`)
  } catch (error) {
    console.error('Error loading clue:', error)
    displayMessage(`Failed to load clue: ${error.message}`, 'error')
  }
}

// Handle unlock code submission
function unlockClue() {
  const enteredCode = document.getElementById('numberInput').value.trim()

  if (!enteredCode) {
    displayMessage('Please enter an unlock code.', 'error')
    return
  }

  if (!currentClue) {
    displayMessage('No clue is currently loaded.', 'error')
    return
  }

  const expectedCode = currentClue.unlockCode.toString()

  if (enteredCode === expectedCode) {
    // Correct unlock code
    clue_unlock_header.textContent = `✅ Clue ${currentClue.clueindex} Unlocked!. Now try to solve it!`
    displayMessage(`✅ Correct! Clue ${currentClueIndex + 1} unlocked.`, 'success')

    // Hide unlock code input button and textbox
    hideUnlockSection()

    // Show answer section
    showAnswerSection()

    // Update clue text to show it's unlocked and include clue_answer details
    let answerDetails = ''
    if (currentClue.clueAnswer) {
      answerDetails = `\nAnswer: ${currentClue.clueAnswer}, row ${currentClue.clueRowPosition}, col ${currentClue.clueColPosition}, dir ${currentClue.clueDirection}`
    }

    document.getElementById('clueText').textContent = `Clue ${currentClue.clueindex} : ${currentClue.clue}`

    // Focus on answer input
    setTimeout(() => {
      document.getElementById('answerInput').focus()
    }, 100)

  } else {
    // Incorrect unlock code
    displayMessage('❌ Incorrect unlock code. Please try again.', 'error')
  }
}

// Handle answer submission
async function checkAnswer() {
  const answer = document.getElementById('answerInput').value.trim()

  if (!answer) {
    displayMessage('Please enter an answer.', 'error')
    return
  }

  if (!currentClue) {
    displayMessage('No clue is currently loaded.', 'error')
    return
  }
  else {    
    console.log(`current clue details before validation: ${JSON.stringify(currentClue)}`)
  }

  try {
    // Call API to validate the answer
    const response = await fetch(`${API_URL}/api/validate/${currentClue.trailId}/${currentClueIndex}/${answer}`, {
      method: 'GET'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      displayMessage(errorData.message || '❌ Incorrect answer. Please try again.', 'error')
      return
    }

    const result = await response.json()

    if (!result.isCorrect) {
      displayMessage('❌ Incorrect answer. Please try again.', 'error')
      return
    }

    // Correct answer - proceed to next clue
    displayMessage(`✅ Correct! Answer "${answer}" accepted. Moving to next clue...`, 'success')
    
    // Fill in the grid cells for the answer
    if (currentClue.clueAnswer) {
      const answerKey = currentClue.clueAnswer
      const row = currentClue.clueRowPosition
      const col = currentClue.clueColPosition
      const dir = currentClue.clueDirection

      for (let i = 0; i < answerKey.length; i++) {
        const cellId = `cell-${dir === 'across' ? row : row + i}-${dir === 'across' ? col + i : col}`
        const cellElement = document.getElementById(cellId)
        if (cellElement) {
          cellElement.textContent = answerKey[i]
        }
      }

      console.log(`Filled answer "${answerKey}" in the grid at row ${row}, col ${col}, direction ${dir}`)
    }

    // Move to next clue
    currentClueIndex++

    document.getElementById('clue_unlock_header').textContent = `✅ Good Job. Unlock Clue ${currentClue.clueindex+1} by winning the game challenge!`

    // Clear inputs and hide answer section
    document.getElementById('numberInput').value = ''
    document.getElementById('answerInput').value = ''

    // Load next clue after a short delay
    setTimeout(() => {
      loadNextClue()
    }, 1500)
  } catch (error) {
    console.error('Error validating answer:', error)
    displayMessage(`Error validating answer: ${error.message}`, 'error')
  }
}

function resetGame() {
  currentClueIndex = 0
  currentClue = null
  localStorage.removeItem('solved')
  document.getElementById('clueText').textContent = ''
  document.getElementById('numberInput').value = ''
  document.getElementById('answerInput').value = ''
  document.getElementById('message').textContent = ''
  hideAnswerSection()
  loadNextClue()
  displayMessage('Game progress reset.', 'info')
}

function displayMessage(text, type = 'info') {
  const messageElement = document.getElementById('message')
  if (!messageElement) return

  messageElement.textContent = text
  messageElement.className = `message ${type}`
}

// Make functions globally available for HTML onclick handlers
window.unlockClue = unlockClue
window.checkAnswer = checkAnswer
window.resetGame = resetGame