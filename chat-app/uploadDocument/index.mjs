import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OllamaEmbeddings } from "@langchain/ollama";
import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import "dotenv/config";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

try {
    const text = await readFile(`${process.cwd()}/potter.txt`, 'utf-8');

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize : 600,
        separators : ["\n\n", "\n", " ", ""],
        chunkOverlap : 50
    });

    const splittedText = await textSplitter.createDocuments([text]);
    
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY);

    await SupabaseVectorStore.fromDocuments(
        splittedText,
        new OllamaEmbeddings({
            model : "llama3.2:latest"
        }), {
            client : supabaseClient, 
            tableName : 'documents'
        }
    );
} catch(error) {
    console.log('ERROR:', error.message);
    
}