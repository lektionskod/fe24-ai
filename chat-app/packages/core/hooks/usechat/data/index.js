import { useState, useRef } from 'react';
import { llm } from '@chatapp/llm';
import { chain } from '@chatapp/chains';

export const useChatLogic = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const question = inputRef.current.value;
        if (!question.trim()) return;

        setLoading(true);
        setMessages((prev) => [...prev, { text: question, role: 'user' }]);
        inputRef.current.value = '';
        console.log(chain);
        const answer = await chain.invoke({question});

        setMessages((prev) => [
            ...prev,
            { role: 'assistant', text: answer || 'Ingen respons.' },
        ]);

        setLoading(false);
    };

    return { messages, loading, handleSubmit, inputRef };
};
