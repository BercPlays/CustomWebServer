
import * as fs from 'fs/promises';
import * as decolib from "./decoration"

export async function getindex(){  
    try {
        const data = await fs.readFile('frontend/index.html', 'utf8');
        return data
    } catch (error) {
        console.log(decolib.message_formated(decolib.prefixes.Program,`Error getting index.html ❌. ${error}`));
        return "Error getting index.html ❌"
    }
}