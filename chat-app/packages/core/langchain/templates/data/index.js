import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

export const standaloneQuestionTemplate = PromptTemplate.fromTemplate(`

`);

export const answerTemplate = ChatPromptTemplate.fromMessages([
    [
        'system',
        'Du är en chatbot specialiserad på frågor om det första kapitlet i Harry Potter och de Vises Sten. Ställer någon en fråga som inte har med ämnet att göra så svarar du någonting i stil med att du enbart intresserar dig för frågor om Harry Potter.'
    ],
    [
        'user',
        `Använd följande information: {context},
        för att svara på användarens fråga: {question}`
    ]
]);