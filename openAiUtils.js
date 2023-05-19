async function useOpenaiToConvertTextToGraph(text) {
  const OPENAI_API_KEY = document.getElementById("openai-api-key").value
  const prePrompt = `Identify causal variables and relationships in the text. 
  Restrict this causal network to only 5 node variables.
  Convert variable names that have spaces and special characters to camelcase.
  The causal network should be returned in PRETTYPRINT JSON format, with the following structure: 
  {"nodes": "a string of camecase node names, separated by commas",
"edges": "a string of edges separated by commas, where each edge is a pair of camelcase node names separated by ->"}
  EXAMPLE:
  { "nodes": "nodeA,nodeB,nodeC,..."], 
  "edges": "nodeA->nodeB,
            nodeA->nodeC,
            ..."}

  Do not include any natural language, only valid JSON. 
  Check that only the 5 most important nodes are used. 
  Check nodes and edges for common sense reasoning, eliminating those that are unreasonable.
  For example,Remove edges where a dependent variable precedes an independent variable. 
 If no answer is possible, return an empty graph: {nodes: "", edges: ""}. 
 Otherwise, consistently and precisely complete the following.
 
 The formal network for the text description: 
    <START-TEXT-DESCRIPTION>`;

  const postPrompt = `
  <END-TEXT-DESCRIPTION> is in valid JSON format:
     `;
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
    const prePrompt = `Translate into natural language a causal graph and related data in the form:
    GRAPH: { "nodes": "nodeA,nodeB,nodeC,..."], 
    "edges": "nodeA->nodeB,nodeA->nodeC,..."}
    DATA: Sentences, JSON, facts. For example, nodeA and nodeB are independent, various sources
    indicate that node D is related to node E, and so on.
    
    Check that the natural language description generated is 
    consistent with causal constraints in the GRAPH and DATA. 
    For example, if DATA includes nodeC relies on nodeE,
    then the text generated should include "nodeE causes nodeC".

    Answer in three sections, as follows -
    VARIABLES: A natural language listing of the nodes of the graph.
    INDEPENDENT: Only those nodes that are independent.
    DEPENDENTS:Each dependent variable that does not cause any others on a new line.
    Describe each dependent variable as being directly caused by
    the preceding nodes in each edge, and indirectly caused by
    the nodes that preceded their prior node, and so on.
    DATA: Summarize and describe relevant data excluding GRAPH JSON.

    Check for common sense reasoning, eliminating those that are unreasonable. For example,
    remove cases where a dependent variable cannot cause an independent variable. 

    if no answer is possible, return: 
    PLEASE USE THIS FORMAT:
    { "nodes": "nodeA,nodeB,nodeC,..."], 
    "edges": "nodeA->nodeB,nodeA->nodeC,..."}

    Otherwise, return the causal graph and following data as:
        `;
  
    const postPrompt = ``
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