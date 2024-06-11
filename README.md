<h1 align="center">Gemini AI Package</h1>
<p align="center">The easiest way to integrate Gemini AI</p>
<p align="center">
  <a aria-label="NPM Version" href="https://www.npmjs.com/package/gemini-ai">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/%40codixfy%2Fgemini?style=for-the-badge&logo=npm&logoColor=white&label=NPM%20VERSION&color=black">
  </a>
  <a aria-label="NPM Download Count" href="https://www.npmjs.com/package/gemini-ai">
    <img alt="" src="https://img.shields.io/npm/dt/%40codixfy%2Fgemini?label=Downloads&style=for-the-badge&color=27B2FF">
  </a>
</p>

## Why this package?

The word that defined this package is **`simplicity`**.

You can integrate Gemini in your project with less than 3 lines of code.

## Features

## Installation

Install the package using the following command.

```bash
npm install @codixfy/gemini
```

## Quickstart

### Simple Messages

Send a message

```ts
import { Gemini } from "@codixfy/gemini"

const gemini = new Gemini(API_KEY)

console.log(await gemini.ask("Hello Gemini!"))
```

Send a message (stream enabled)

```ts
import { Gemini } from "@codixfy/gemini"

const gemini = new Gemini(API_KEY)

gemini.ask("Hi!", {
    stream: (message) => {
        console.log(message)
    },
})
```

### Chatting With Gemini

Chat with Gemini => Keeps history of the whole conversation

```ts
import { Gemini } from "@codixfy/gemini"

const gemini = new Gemini(API_KEY)
const chat = gemini.createChat()

console.log(await chat.send("Hello, I am Codixfy!"))
console.log(await chat.send("Who am I?"))
```

Chat with Gemini => Persistent history (save)

```ts
import { Gemini } from "@codixfy/gemini"

const gemini = new Gemini(API_KEY)
const chat = gemini.createChat()

console.log(await chat.send("Hello, I am Codixfy!"))
console.log(await chat.send("Who am I?"))

// Saving the chat
const chatHistory = chat.save()
```

Chat with Gemini => Keeps history of the whole conversation

```ts
import { Gemini } from "@codixfy/gemini"

const gemini = new Gemini(API_KEY)
const chat = gemini.createChat()

console.log(await chat.send("Hello, I am Codixfy!"))
console.log(await chat.send("Who am I?"))
```

Chat with Gemini => Persistent history (load and save)

```ts
import { Gemini } from "@codixfy/gemini"

let chatHistory = [] // Import your chat history from wherever you saved it

const gemini = new Gemini(API_KEY)
const chat = gemini.createChat(chatHistory)

console.log(await chat.send("Who am I?"))

// Saving the chat
const chatHistory = chat.save()
```

### Sending Images

Sending images with your requests

```ts
import { Gemini } from "@codixfy/gemini"

const gemini = new Gemini(API_KEY)

console.log(
    await gemini.ask("What can you tell me about this image?", {
        images: [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
        ],
    })
)
```

Sending images with your requests, stream response

```ts
import { Gemini } from "@codixfy/gemini"

const gemini = new Gemini(API_KEY)

console.log(
    await gemini.ask("What can you tell me about this image?", {
        images: [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
        ],
        stream: (message) => {
            console.log(message)
        },
    })
)
```

## Complex configurations

When you create a new instance of Gemini just passing the API key as parameter, it does create an instance with default options, but you can configure these options passing an object as second parameter of the constructor.

### Initial Instructions

You can pass an initial instruction to the model so **it can behave as you need it to behave**. This is useful when creating a chatbot for a company, where you can pass it some instructions to behave as it, and answer your clients based on informations and protocols.

To do so, you can do the following:

```ts
import { Gemini } from "@codixfy/gemini"

const gemini = new Gemini(API_KEY, {
    instructions:
        "Imagine you are working for a restaurant which only takes reservations monday to friday from 9am to 5pm. No customer can reserve out of these days and hours, no matter what. Also, you should inform every customer after doing a reservation that there will be a $100 upfront charge required. For a reservation to be successful you will need the first and last name of the customer and the party size.",
})

// Now you can create a chat and it will behave based on the information and instructions provided.

const chat = gemini.createChat()

console.log(
    await chat.send(
        "Hello I would like a reservation for 5 people next wednesday at 6pm."
    )
)
```

### Harm Configurations
