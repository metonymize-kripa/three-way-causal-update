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
  document.getElementById('cell1Input').value = `We find that higher access to grocery stores, lower access to fast food, higher income and college education are independently associated with higher consumption of fresh fruits and vegetables, lower consumption of fast food and soda, and lower likelihood of being affected by overweight and obesity. However, these associations vary significantly across zip codes with predominantly Black, Hispanic or white populations.`;
}

// Function to clear the content of cell2
function clearCell2() {
  document.getElementById('cell2Input').value = `{"nodes":"grocerystoreaccess, fastfoodaccess, income, collegeeducation, FNVconsumption","edges":"grocerystoreaccess->FNVconsumption, fastfoodaccess->FNVconsumption, income->FNVconsumption, collegeeducation->FNVconsumption"}`; 
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
    })
    .catch(error => console.error(error));
}
// Function to clear the content of commonInput
function clearCommonInput() {
  document.getElementById('commonInput').innerHTML = `For instance, high grocery store access has a significantly larger association with higher fruit and vegetable consumption in zip codes with predominantly Hispanic populations (7.4% difference) and Black populations (10.2% difference) in contrast to zip codes with predominantly white populations (1.7% difference).

  zipcode	age_years	height_in_inches	bmi	fastfood_consumption	Fresh_FV	MedianFamilyIncome	lapophalfshare	no_college	higher_ed_frac	white_frac	black_frac	hispanic_frac	asian_frac	yelp_category_fastfood_frac	male_frac	soda_consumption
  1001	39.6	65.5	28.3	0.4	0.7	74627.6	0.9	0.7	0.3	0.9	0	0.1	0	0	0.2	0
  1002	33.6	66.3	26.7	0.2	0.8	92490.4	0.9	0.3	0.7	0.7	0.1	0.1	0.1	0	0.2	0`;
}

