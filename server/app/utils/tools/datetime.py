from datetime import datetime
from langchain.tools import tool
import pytz


@tool(name_or_callable="current_time_tool", description="Use this tool when need information about current time, current events...")
def getCurrentTimeTool() -> str:
    """
    Returns the current date and time as a string. 
    """
    utc_time = datetime.now(pytz.utc)
    utc_plus_7 = utc_time.astimezone(pytz.timezone("Asia/Ho_Chi_Minh"))
    return "Current time: " + utc_plus_7.strftime("%Y-%m-%d %H:%M:%S")
