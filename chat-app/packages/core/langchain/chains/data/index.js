import { RunnableSequence } from "@langchain/core/runnables";
import { retriever } from '@chatapp/retriever';
import { answerTemplate } from '@chatapp/templates';
import { combineDocuments } from '@chatapp/combinedocuments';
import { llm } from '@chatapp/llm';

export const chain = RunnableSequence.from([
    async (question) => {
        console.log('test');
        const context = await retriever.invoke(question);
        console.log(context);
        console.log(combineDocuments(context));
        return { context, question };
    },
    async ({ context, question }) => {
        return await llm.invoke(
            await answerTemplate.format({ context, question })
        );
    }
]);