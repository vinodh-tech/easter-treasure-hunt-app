// Grid Loader - Fetch and display grid design from API based on grid ID

const API_URL = 'http://localhost:3000'

// Load grid by ID from API
async function loadGridDesign(gridId) {
  try {
    const response = await fetch(`${API_URL}/api/crossword/grid/${gridId}/design`)
    
    if (!response.ok) {
      throw new Error(`Failed to load grid ${gridId}: ${response.statusText}`)
    }
    
    const data = await response.json()
    const gridDesign = data.grid_design
    
    if (!gridDesign || !Array.isArray(gridDesign)) {
      throw new Error('Invalid grid design format')
    }
    
    // Display the grid
    displayGrid(gridDesign)
    console.log(`Loaded grid ${gridId} successfully`)
    
    return gridDesign
  } catch (error) {
    console.error('Error loading grid:', error)
    displayErrorMessage(`Failed to load grid: ${error.message}`)
    return null
  }
}

// Display grid design in the HTML
function displayGrid(gridDesign) {
  const gridContainer = document.getElementById('grid')
  
  if (!gridContainer) {
    console.error('Grid container element not found')
    return
  }
  
  // Clear existing grid
  gridContainer.innerHTML = ''
  
  // Create grid rows
  gridDesign.forEach((row, rowIndex) => {
    const rowDiv = document.createElement('div')
    rowDiv.className = 'grid-row'
    
    // Create grid cells
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const cell = row[colIndex]
      const cellDiv = document.createElement('div')
      cellDiv.className = 'grid-cell'
      
      if (cell === '#') {
        cellDiv.classList.add('blocked')
      } else {
        cellDiv.classList.add('cell')
        // cellDiv.textContent = cell
        cellDiv.textContent = '' // Start with empty cells
        cellDiv.id = `cell-${rowIndex}-${colIndex}`
      }
      
      rowDiv.appendChild(cellDiv)
    }
    
    gridContainer.appendChild(rowDiv)
  })
}

// Display error message
function displayErrorMessage(message) {
  const messageElement = document.getElementById('message')
  if (messageElement) {
    messageElement.textContent = message
    messageElement.style.color = 'red'
  }
}

// Load grid on page load (default to grid 0)
document.addEventListener('DOMContentLoaded', () => {
  const gridId = sessionStorage.getItem('selectedGridId') || '0'
  loadGridDesign(gridId)
})

// Utility function to switch grids
function switchGrid(gridId) {
  sessionStorage.setItem('selectedGridId', gridId)
  loadGridDesign(gridId)
}
