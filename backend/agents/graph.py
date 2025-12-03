from langgraph.graph import StateGraph, END
from agents.state import AgentState
from agents.nodes import planner_node, researcher_node, writer_node

# 1. Initialize
workflow = StateGraph(AgentState)

# 2. Add Nodes
workflow.add_node("planner", planner_node)
workflow.add_node("researcher", researcher_node)
workflow.add_node("writer", writer_node)

# 3. Define Edges (The Logic Flow)
workflow.set_entry_point("planner")

workflow.add_edge("planner", "researcher")
workflow.add_edge("researcher", "writer")
workflow.add_edge("writer", END)

# 4. Compile
app = workflow.compile()