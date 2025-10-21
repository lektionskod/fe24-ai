import { useState, useRef } from 'react';
import { llm, answerTemplate } from '@chatapp/llm';
import { tools, llmWithTools } from '@chatapp/tools';

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

        const result = await llmWithTools.invoke(question);
        console.log(result);

        let finalAnswer = '';

        if (!result.content && result.tool_calls?.length > 0) {
            const tool = result.tool_calls[0];
            console.log(tools[tool.name]);

            const toolResult = await tools[tool.name].invoke(tool.args);
            console.log(toolResult);

            finalAnswer = await llm.invoke(
                await answerTemplate.format({ toolResult, question })
            );
            console.log(finalAnswer);
        } else {
            finalAnswer = result;
        }

        setMessages((prev) => [
            ...prev,
            { role: 'assistant', text: finalAnswer.content || 'Ingen respons.' },
        ]);

        setLoading(false);
    };

    return { messages, loading, handleSubmit, inputRef };
};
