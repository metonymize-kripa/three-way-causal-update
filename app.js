// Function to copy content from one cell to another
function copyContent(sourceCellId, commonInputId, destinationCellId) {
  const sourceCell = document.getElementById(sourceCellId);
  const commonInput = document.getElementById(commonInputId);
  const destinationCell = document.getElementById(destinationCellId);
  destinationCell.value = sourceCell.value + " " + commonInput.value;
}

// Function to handle the button click for copying cell1 to cell2
function copyCell1ToCell2() {
  copyContent('cell1Input', 'commonInput', 'cell2Input');
}

// Function to handle the button click for copying cell2 to cell1
function copyCell2ToCell1() {
  copyContent('cell2Input', 'commonInput', 'cell1Input');
}

