import { llm } from '@chatapp/llm';
import { z } from 'zod';
import { tool } from '@langchain/core/tools';
import axios from 'axios';

const getCoffeeMenu = tool(
    async ({ topic }) => {
        console.log('Topic används ej men här är den: ' + topic);
        const response = await axios.get('https://airbean-9pcyw.ondigitalocean.app/api/beans');
        return { context : response.data.menu };
    }, {
        name : 'getCoffeeMenu',
        description : "Returnerar kaffemeny från Airbean",
        schema : z.object({ topic : z.string() })
    }
);

export const tools = { getCoffeeMenu };
export const llmWithTools = llm.bindTools([ getCoffeeMenu ]);
