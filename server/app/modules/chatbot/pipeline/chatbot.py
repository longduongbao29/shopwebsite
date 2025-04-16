import json
from injector import inject
from langchain_groq import ChatGroq
from app.core.config import Config
from app.modules.products.ProductManager import ProductManager
from app.modules.chatbot.pipeline.prompts import CHAT_PROMPT, TOOL_PROMPT
from app.utils.logger import logger_setup
from app.utils.tools.datetime import getCurrentTimeTool


logger = logger_setup(__name__)

class ToolPool:
    product_search_tool = ProductManager.getSearchTool()
    current_time_tool = getCurrentTimeTool
    tools = [product_search_tool, current_time_tool]
class Chatbot:
    @inject
    def __init__(self, 
                 config:Config,
                 product_manager: ProductManager):
        self.config = config
        self.llm = ChatGroq(model=config.LLM_MODEL,api_key=config.LLM_API_KEY, temperature=config.LLM_TEMPERATURE)
        self.product_manager = product_manager

    def run(self, input):

        llm_with_tool = TOOL_PROMPT|self.llm.bind_tools(ToolPool.tools)
        analyze = llm_with_tool.invoke(input)
        context = ""
        meta_data= {}
        if "tool_calls" in analyze.additional_kwargs:
            logger.info(analyze.additional_kwargs)
            tool_calls = analyze.additional_kwargs["tool_calls"]
            for tool in tool_calls:
                func = tool["function"]
                args = json.loads(func["arguments"])
                name = func["name"]
                instant = getattr(ToolPool, name, None)
                if instant is None:
                    logger.error(f"Tool {name} not found in ToolPool.")
                    continue
                tool_result = instant.invoke(args)
                meta_data[name] = tool_result
                context += str(tool_result)
        return (CHAT_PROMPT|self.llm).invoke({"context":context,"user_input":input}).content , meta_data
