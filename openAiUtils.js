async function useOpenaiToConvertTextToGraph(text) {
  const OPENAI_API_KEY = document.getElementById("openai-api-key").value
  const prePrompt = `Identify causal variables and relationships in the text. 
  Restrict this causal network to only 5 most important node variables.
  Convert variable names that have spaces and special characters to camelcase.
  The causal network should be returned in JSON format, with the following structure: 
  {"nodes": "a string of camecase node names, separated by commas",
"edges": "a string of edges separated by commas, where each edge is a pair of camelcase node names separated by ->"}
  EXAMPLE:
  { "nodes": "nodeA,nodeB,nodeC,..."], 
  "edges": "nodeA->nodeB,nodeA->nodeC,..."}

  Do not include any natural language, only JSON. 
  Restrict the graph to the 5 most important nodes where data is likely to be available.
  Remove edges where a dependent variable precedes an independent variable.
  Check nodes and edges for common sense reasoning, eliminating those that are unreasonable.

  if no answer is possible, return an empty graph: {nodes: "", edges: ""}
	   
	Answer: The formal network for the text description: 
    <START-TEXT-DESCRIPTION>`;

  const postPrompt = `
  <END-TEXT-DESCRIPTION> is:
     { "nodes": "..."
     "edges": "..." }`;
  const prompt = prePrompt + text + postPrompt;

  console.log("PROMPT:",prompt);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + OPENAI_API_KEY
    },
    body: JSON.stringify({
    "model": "gpt-3.5-turbo",
    messages: [{role: "user", content: prompt}],
	})});

    const data = await response.json();
    const graphJsonString = data.choices[0].message["content"];
    console.log("GRAPH JSON STRING:",graphJsonString);
    const graphJsonObject = JSON.parse(graphJsonString);
    return graphJsonObject;
  }

  async function useOpenaiToConvertGraphToText(graph) {
    const OPENAI_API_KEY = document.getElementById("openai-api-key").value
    const prePrompt = `Translate into natural language a causal graph of the form: 
    { "nodes": "nodeA,nodeB,nodeC,..."], 
    "edges": "nodeA->nodeB,nodeA->nodeC,..."}
    Start by listing the independent variables.
    Then describe dependent variables as being directly caused by
    the preceding nodes in each edge, and indirectly caused by
    the nodes that preceded the prior causes, and so on.
    Check nodes and edges for common sense reasoning, eliminating those that are unreasonable.
  
    if no answer is possible, return: nodes: PLEASE USE FOLLOWING FORMAT:
    { "nodes": "nodeA,nodeB,nodeC,..."], 
    "edges": "nodeA->nodeB,nodeA->nodeC,..."}
         
      Answer: The informal description for the graph:
        <START-GRAPH-DESCRIPTION>`;
  
    const postPrompt = `
    <END-GRAPH-DESCRIPTION> is:
       "The independent variables are: ...
       The dependent variables are: ..."`
    const prompt = prePrompt + graph + postPrompt;
  
    console.log("PROMPT:",prompt);
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENAI_API_KEY
      },
      body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      messages: [{role: "user", content: prompt}],
      })});
  
      const data = await response.json();
      const informalGraphTextString = data.choices[0].message["content"];
      console.log("INFORMAL GRAPH TEXT STRING:",informalGraphTextString);
      return informalGraphTextString;
    }