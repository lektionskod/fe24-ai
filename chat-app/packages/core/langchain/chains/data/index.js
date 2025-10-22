import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { retriever } from '@chatapp/retriever';
import { standaloneQuestionTemplate, answerTemplate } from '@chatapp/templates';
import { combineDocuments } from '@chatapp/combinedocuments';
import { llm } from '@chatapp/llm';
import { StringOutputParser } from "@langchain/core/output_parsers";

const standaloneQuestionChain = RunnableSequence.from([
    standaloneQuestionTemplate,
    llm,
    new StringOutputParser()
]);

const retrieverChain = RunnableSequence.from([
    (data) => {
        console.log(data);
        return data.standaloneQuestion;
    },
    retriever,
    combineDocuments
]);

const answerChain = RunnableSequence.from([
    answerTemplate,
    llm,
    new StringOutputParser()
]);

export const chain = RunnableSequence.from([
    {
        standaloneQuestion: standaloneQuestionChain,
        originalQuestion: new RunnablePassthrough(),
    },
    {
        context: retrieverChain,
        question: ({ originalQuestion }) => originalQuestion.question,
    },
    answerChain
]);