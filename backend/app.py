from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import SystemMessage, HumanMessage, AIMessage
import os

model = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp", api_key="gemini_api_key")

app = Flask(__name__)
CORS(app)

chat_history = [SystemMessage(content='You are a helpful chatbot')]

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    query = data.get('text', '')
    
    humanmsg = HumanMessage(content=query)
    chat_history.append(humanmsg)

    try:
        response = model.invoke(chat_history)
        if hasattr(response, 'content'):
            bot_response = response.content
        else:
            bot_response = "Sorry, I couldn't understand that."
    except Exception as e:
        bot_response = str(e)
    
    aimsg = AIMessage(content=bot_response)
    chat_history.append(aimsg)

    return jsonify({"response": bot_response})

if __name__ == "__main__":
    app.run(debug=True)
