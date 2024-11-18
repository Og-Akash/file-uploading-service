import { existsSync, mkdirSync } from "fs"


export function ensureDirectoryLocated (directoryPath: string){
    if(!existsSync(directoryPath)){
        mkdirSync(directoryPath, { recursive: true });
        // console.log(`Directory "${directoryPath}" created.`);
    }
    return
}
