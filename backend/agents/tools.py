from langchain_community.tools import DuckDuckGoSearchRun

# Initialize the Search Tool
search_tool = DuckDuckGoSearchRun()

def web_search(query: str):
    """
    Real-time web search using DuckDuckGo.
    """
    print(f"    🔎 SEARCHING WEB FOR: '{query}'...")
    try:
        # Run the search
        results = search_tool.run(query)
        return results
    except Exception as e:
        return f"Error performing search: {e}"