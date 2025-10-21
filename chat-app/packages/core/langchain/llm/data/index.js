import { ChatOllama } from '@langchain/ollama';
import { PromptTemplate } from '@langchain/core/prompts';

export const llm = new ChatOllama({
    model : 'llama3.2:latest'
});

export const answerTemplate = PromptTemplate.fromTemplate(
    `Här är resultatet från verktyget: {toolResult}. Använd detta för att svara på frågan: {question}. Jag vill att dina svar skall vara ganska utförliga.`
);