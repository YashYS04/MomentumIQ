import sys
import os
# Configure path to allow importing 'backend' when run from any directory level
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
from typing import Dict, Any, List
from backend.parser import get_law_section
from backend.ml_engine import MLEngine

class MCPServer:
    """
    Local Model Context Protocol (MCP) server that defines tools
    and routes tool execution requests from the Granite 3.3 2B LLM.
    """
    def __init__(self):
        self.ml_engine = MLEngine()
        self.ml_engine.load_model()
        
        # Define the MCP tool schemas
        self.tools = [
            {
                "name": "retrieve_ifab_rule",
                "description": "Retrieves the official soccer rule text from the IFAB Laws of the Game parsed via Docling. Use this for VAR, handball, offside, or penalty questions.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "The soccer rule term or law to lookup (e.g. 'handball', 'offside', 'penalty kick', 'VAR')."
                        }
                    },
                    "required": ["query"]
                }
            },
            {
                "name": "predict_pass_success",
                "description": "Calculates Expected Pass Completion (xP) using a machine learning model trained on coordinates, distance, and defender pressure.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "x": {"type": "number", "description": "Start x-coordinate (0-120 yards)"},
                        "y": {"type": "number", "description": "Start y-coordinate (0-80 yards)"},
                        "dist": {"type": "number", "description": "Length of pass in yards"},
                        "angle": {"type": "number", "description": "Angle of pass in radians (-pi to pi)"},
                        "under_pressure": {"type": "integer", "description": "1 if kicker is pressed by defender, else 0"},
                        "in_attacking_third": {"type": "integer", "description": "1 if pass starts in attacking third, else 0"}
                    },
                    "required": ["x", "y", "dist", "angle", "under_pressure", "in_attacking_third"]
                }
            }
        ]

    def list_tools(self) -> List[Dict[str, Any]]:
        """Returns the list of available MCP tools."""
        return self.tools

    def call_tool(self, name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes the specified MCP tool with arguments.
        Follows the MCP JSON-RPC standard for response envelopes.
        """
        try:
            if name == "retrieve_ifab_rule":
                query = arguments.get("query", "")
                rule_text = get_law_section(query)
                return {
                    "content": [{"type": "text", "text": rule_text}],
                    "is_error": False
                }
                
            elif name == "predict_pass_success":
                x = float(arguments.get("x", 0))
                y = float(arguments.get("y", 0))
                dist = float(arguments.get("dist", 0))
                angle = float(arguments.get("angle", 0))
                under_pressure = int(arguments.get("under_pressure", 0))
                in_attacking_third = int(arguments.get("in_attacking_third", 0))
                
                xp = self.ml_engine.predict_xp(x, y, dist, angle, under_pressure, in_attacking_third)
                return {
                    "content": [{
                        "type": "text", 
                        "text": json.dumps({
                            "expected_pass_completion_rate": f"{round(xp * 100, 1)}%",
                            "model_used": "LogisticRegressionClassifier",
                            "features_evaluated": {
                                "start_location": f"({x}, {y})",
                                "distance": f"{dist} yards",
                                "angle": f"{angle} rad",
                                "under_pressure": bool(under_pressure),
                                "in_attacking_third": bool(in_attacking_third)
                            }
                        })
                    }],
                    "is_error": False
                }
            else:
                return {
                    "content": [{"type": "text", "text": f"Error: Tool '{name}' not found."}],
                    "is_error": True
                }
        except Exception as e:
            return {
                "content": [{"type": "text", "text": f"Execution error: {str(e)}"}],
                "is_error": True
            }

if __name__ == "__main__":
    print("Initializing MCP Server...")
    mcp = MCPServer()
    print("Registered tools:")
    for tool in mcp.list_tools():
        print(f" - {tool['name']}: {tool['description']}")
        
    print("\nTesting 'retrieve_ifab_rule' tool:")
    res = mcp.call_tool("retrieve_ifab_rule", {"query": "handball"})
    print(res["content"][0]["text"][:300] + "...")
