// Function to copy content from one cell to another
function copyContent(sourceCellId, commonInputId, destinationCellId) {
  const sourceCell = document.getElementById(sourceCellId);
  const commonInput = document.getElementById(commonInputId);
  const destinationCell = document.getElementById(destinationCellId);
  destinationCell.value = sourceCell.value + " " + commonInput.value;
}

// Function to handle the button click for copying cell1 to cell2
async function copyCell1ToCell2() {
  const text = document.getElementById("cell1Input").value;
  const commonInput = document.getElementById("commonInput").value;
  const textToConvert = text + " " + commonInput;
  const graphJson = await useOpenaiToConvertTextToGraph(textToConvert);
  document.getElementById("cell2Input").value = JSON.stringify(graphJson);
}

// Function to handle the button click for copying cell2 to cell1
async function copyCell2ToCell1() {
  const text = document.getElementById("cell2Input").value;
  const commonInput = document.getElementById("commonInput").value;
  const textToConvert = text + " COMMON GROUND DATA:" + commonInput;
  // interpret textToConvert as a graph and convert it to text
  const informalGraphTextString = await useOpenaiToConvertGraphToText(textToConvert);
  document.getElementById("cell1Input").value = informalGraphTextString;
}

// Function to clear the content of cell1
function clearCell1() {
  document.getElementById('cell1Input').value = `
  The independent variables in the graph are 
  researchProductivity, knowledgeProduction, and humanCapacity. 
  The dependent variables are data and processOfCreation. 
  ResearchProductivity directly causes data and knowledgeProduction. 
  KnowledgeProduction directly causes processOfCreation and 
  indirectly causes data through its causal relationship with 
  researchProductivity. 
  KnowledgeProduction also indirectly causes humanCapacity through its 
  causal relationship with processOfCreation.`;
}

// Function to clear the content of cell2
function clearCell2() {
  document.getElementById('cell2Input').value = `
  {"nodes":"ResearchProductivity,KnowledgeProduction,ProcessOfCreation,Data,HumanCapacity",
  "edges":"ResearchProductivity->Data,
            ResearchProductivity->KnowledgeProduction,
            KnowledgeProduction->ProcessOfCreation,
            KnowledgeProduction->Data,
            ProcessOfCreation->HumanCapacity"}`; 
}

async function getPaper() {
  const paperId = document.getElementById("paper-id").value;
  fetch(`https://export.arxiv.org/api/query?id_list=${paperId}`)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const abstract = xmlDoc.getElementsByTagName("summary")[0].childNodes[0].nodeValue;
      document.getElementById("commonInput").innerHTML = abstract;
      processAbstract(abstract);
    })
    .catch(error => console.error(error));
}
// Function to clear the content of commonInput
function clearCommonInput() {
  document.getElementById('commonInput').innerHTML = `A causes B
  B causes C
  A causes C`;
}

