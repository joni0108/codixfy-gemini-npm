// Example of a function that will be exported

import { SayHelloProps } from "../types"

export function sayHello({ name, age }: SayHelloProps) {
    console.log(`Hello, world! ${name}`)

    if (age) {
        console.log(`You are ${age} years old!`)
    }
}
