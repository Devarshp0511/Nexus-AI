from agents.graph import app

def run_test():
    mission = "Research the top 3 AI trends in 2025"
    
    print(f"🚀 Starting Mission: {mission}")
    
    try:
        result = app.invoke({"mission": mission})
        
        print("\n✅ MISSION COMPLETE. FINAL REPORT:\n")
        print("="*60)
        print(result.get('final_response', 'No report generated.'))
        print("="*60)
            
    except Exception as e:
        print(f"\n❌ Error running agent: {e}")

if __name__ == "__main__":
    run_test()