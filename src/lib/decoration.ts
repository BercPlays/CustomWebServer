export function square_brackets(message:string) {
    return `[${message}]`
}

export function message_formated(caller:string,message:string){
    return `${square_brackets(caller)} ${message}`
}

export let prefixes = {
    "Program":"Main process 👤",
    "Worker": "Worker 🦺",
    "Worker_Plural": "Workers 🦺"

}
