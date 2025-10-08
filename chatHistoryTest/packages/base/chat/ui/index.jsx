import { useRef, useState, useEffect } from 'react';
import './index.css';
import { Message } from '@chatbot/message';
import { ChatOllama } from '@langchain/ollama';
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';

const llm = new ChatOllama({
    model : 'llama3.2:latest'
});

const memory = new BufferMemory({ returnMessages : true });
const chain = new ConversationChain({ 
    llm : llm, 
    memory : memory 
});

export const Chat = () => {
    
    const [messages, setMessages] = useState([]);
    const inputRef = useRef();

    useEffect(() => {
        const savedChatHistory = localStorage.getItem('chatHistory');
        if(savedChatHistory) {
            const chatHistory = JSON.parse(savedChatHistory);
            setMessages(chatHistory);

            chatHistory.forEach(message => {
                if(message.role === 'user') {
                    memory.chatHistory.addUserMessage(message.text);
                } else {
                    memory.chatHistory.addAIChatMessage(message.text);
                }
            });
        }
    }, []);

    const getChatHistory = async () => {
        const historyMessages = await memory.chatHistory.getMessages();
        console.log(historyMessages);
        return historyMessages.map(message => {
            return {
                text : message.content,
                role : message.getType() === 'human' ? 'user' : 'assistant'
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const question = inputRef.current.value;

        setMessages((prevState) => {
            return [...prevState, { text : question, role : "user" }];
        });
        inputRef.current.value = '';

        const answer = await chain.call({ input : question });
        console.log(answer);

        const chatHistory = await getChatHistory();
        setMessages(chatHistory);

        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }

    
    const messageComponents = messages.map((message, index) => {
        return <Message text={ message.text } role={ message.role } key={ index } />
    });
    
    return (
        <section className="chat">
            <section className="chat__messages">
                { messageComponents }
            </section>
            <form className="chat__form">
                <input type="text" className="chat__input" ref={ inputRef } />
                <button onClick={handleSubmit} className="chat__btn">Skicka</button>
            </form>
        </section>
    )
}

// const handleSubmit = async (e) => {
//     e.preventDefault();
//     const question = inputRef.current.value;
//     const updatedMessages = [
//         ...messages.map(msg => 
//             msg.role === 'user' 
//             ? new HumanMessage(msg.text) 
//             : new AIMessage(msg.text)
//         ),
//         new HumanMessage(question)
//     ];

//     setMessages((prevState) => {
//         return [...prevState, { text : question, role : 'user' }];
//     });
//     const answer = await llm.invoke(updatedMessages);
    
//     setMessages((prevState) => {
//         return [...prevState, { text : answer.content, role : 'assistant' }];
//     });
// }