# from langchain_groq import ChatGroq
# from langchain_core.messages import SystemMessage, HumanMessage
# from core.config import settings
# from agents.state import AgentState

# # Initialize the Brain (Llama 3.3 via Groq)
# # We use the 70B model because it is much smarter at planning than the 8B model.
# llm = ChatGroq(
#     model="llama-3.3-70b-versatile", 
#     temperature=0,
#     api_key=settings.GROQ_API_KEY
# )

from langchain_perplexity import ChatPerplexity
from langchain_core.messages import SystemMessage, HumanMessage
from core.config import settings
from agents.state import AgentState

# Initialize the Brain (Perplexity Sonar Pro)
# "sonar-pro" is their smart, internet-connected model.
llm = ChatPerplexity(
    model="sonar-pro", 
    temperature=0,
    pplx_api_key=settings.PPLX_API_KEY
)

def planner_node(state: AgentState):
    """
    Agent 1: The Project Manager
    Takes a mission and breaks it down into clear steps.
    """
    print(f"\n--- PLANNER: Analyzing mission '{state['mission']}' ---")
    
    prompt = f"""
    You are a Senior Technical Architect for an autonomous system.
    
    MISSION: {state['mission']}
    
    Your goal is to create a detailed, step-by-step execution plan.
    The plan must be technical, logical, and executable.
    
    Return ONLY a numbered list of steps. 
    Do not add introductions, conclusions, or extra text.
    """
    
    messages = [
        SystemMessage(content="You are a strict, logical planner. Return ONLY a numbered list."),
        HumanMessage(content=prompt)
    ]
    
    try:
        response = llm.invoke(messages)
        
        # Clean the output to get a nice python list
        steps = [line.strip() for line in response.content.split('\n') if line.strip() and line[0].isdigit()]
        
        print(f"--- PLANNER: Created {len(steps)} steps ---")
        return {"plan": steps}
        
    except Exception as e:
        print(f"❌ Groq Error: {e}")
        return {"plan": []}
    

# ... existing imports ...
from agents.tools import web_search

# --- NEW: RESEARCHER AGENT ---
def researcher_node(state: AgentState):
    """
    Agent 2: The Researcher
    Executes ALL steps of the plan, not just the first one.
    """
    plan = state['plan']
    results = []
    
    print(f"\n--- RESEARCHER: Executing {len(plan)} tasks... ---")
    
    for task in plan:
        print(f"    🔎 Searching: {task}...")
        try:
            # Search for each step
            content = web_search(task)
            results.append(f"TOPIC: {task}\nFINDINGS: {content}\n")
        except Exception as e:
            results.append(f"TOPIC: {task}\nERROR: Could not find data.\n")
            
    # Combine all findings into one big text block
    full_research = "\n\n".join(results)
    
    print(f"--- RESEARCHER: gathered {len(full_research)} chars of data ---")
    
    return {"research_data": [full_research]}
    
    # # Save to state
    # return {"research_data": [response.content]}


# --- NEW: WRITER AGENT ---
def writer_node(state: AgentState):
    """
    Agent 3: The Writer
    Synthesizes the plan and research data into a polished report.
    """
    print(f"\n--- WRITER: Writing final report... ---")
    
    mission = state['mission']
    research_data = state['research_data']
    
    prompt = f"""
    You are a Senior Technical Writer for a major tech publication (like TechCrunch or WIRED).
    
    MISSION: {mission}
    
    RAW RESEARCH DATA:
    {research_data}
    
    Your task is to write a comprehensive, engaging, and professional report.
    
    CRITICAL INSTRUCTIONS:
    1. SYNTHESIZE: Do not just list facts. Connect the dots. Create a narrative flow.
    2. BE CONFIDENT: Never say "Based on available data" or "The search didn't return." If a detail is missing, simply omit it or write around it smoothly.
    3. STRUCTURE: Use Markdown headers (##), bullet points, and bold text for impact.
    4. TONE: Professional, authoritative, and insightful.
    
    Structure the report as:
    # [Catchy Title]
    ## Executive Summary
    ## Detailed Analysis (Break into subsections)
    ## Key Takeaways / Conclusion
    """
    
    messages = [HumanMessage(content=prompt)]
    response = llm.invoke(messages)
    
    print(f"--- WRITER: Report generated ({len(response.content)} chars) ---")
    
    return {"final_response": response.content}