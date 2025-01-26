<h1 align="center">Gemini AI Package</h1>
<p align="center">The easiest way to integrate Gemini AI</p>
<p align="center">
  <a aria-label="NPM Version" href="https://www.npmjs.com/package/@codixfy/gemini?activeTab=readme">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/%40codixfy%2Fgemini?style=for-the-badge&logo=npm&logoColor=white&label=NPM%20VERSION&color=black">
  </a>
</p>

## Why this package?

The word that defined this package is **`simplicity`**.

You can integrate Gemini in your project with less than 3 lines of code.

## Features

**IMPORTANT**

If you were using the version 1.2 of the package, read the changelog on our github carefully to know how to migrate to this new version to avoid errors on your projects. It is a major update, so expect slightly syntax change.

### TODO (v2.x)
- [ ] Add support to image generation (powered by 'Imagen 3' by Gemini)
- [ ] Add support to 2-ways streaming, which will allow to make projects like the Gemini Studio, where live video/audio is processed in real time.
- [ ] Add token information and token limits.

Current token usage based on Gemini Guides:
- Images: Fixed rate of 258 tokens per file
- Video: Fixed rate of 263 tokens per second
- Audio: Fixed rate of 32 tokens per second

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

### Sending Files (Images, Audios, Videos, PDFs)

From the version 2 and above, you will be able to use files in your prompts. At the moment it only must be links, so if the image to be used is being uploaded by the user, you can upload it to a cloud service like Firebase, and get the link from it in order to be used, then delete it (or keep it).

```ts
import { Gemini } from "@codixfy/gemini"

const gemini = new Gemini(API_KEY)

console.log(
    await gemini.ask("What can you tell me about this image?", {
        files: [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
        ],
    })
)
```

Sending files with your requests, stream response

```ts
import { Gemini } from "@codixfy/gemini"

const gemini = new Gemini(API_KEY)

console.log(
    await gemini.ask("What can you tell me about this image?", {
        files: [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
        ],
        stream: (message) => {
            console.log(message)
        },
    })
)
```

**IMPORTANT**
1. The syntax has slightly change from the version 1 to the version 2, so instead of using `images: []` now you have to use `files: []` in the parameter.
2. For this initial 2.0 version we're not supporting the images the same way we did, now they must be a link in the internet, we will allow you to use `File` type directly on the arguments in future updates, but for now, this is the way it is.
3. We will be implementing all the features from the new `2.0-flash` model in future updates, which include 2-ways streaming, screen content access, and other features available on the `Gemini Studio` on the web, but for now, it is not yet available.

## Model Configurations

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

By default, all the harm configurations of the models are set off (to NONE), but you can customize each of them to be activated when creating the instance.

```ts
safetySettings?: {
        blockDangerousContent?: boolean
        blockExplicitContent?: boolean
        blockHarassmentContent?: boolean
        blockHateContent?: boolean
    }
```

Example, if you want to model to block the explicit content, you can do it the following way:

```ts
import { Gemini } from "@codixfy/gemini"

const gemini = new Gemini(API_KEY, {
    safetySettings: {
        blockExplicitContent: true,
    },
})
```

And you can do so with each of the categories.

### Model Selection

Since version 1.1.0 you can choose the model you are using the folloing way:

```ts
import { Gemini } from "@codixfy/gemini"

const gemini = new Gemini(API_KEY, {
    model: "The model to use...",
})
```

You can choose between the following models:

-   **[DEPRECATED] gemini-1.0-pro**: The basic version, only does support text
-   **gemini-1.5-pro**: Multimodal
-   **gemini-1.5-flash**: Multimodal, but quicker than the pro version (default selection)
-   **gemini-pro-vision**: Multimodal
- **gemini-2.0-flash**: The latest and most powerful model. Multimodal.

You can now choose the lastest not stable model by adding:

```ts
import { Gemini } from "@codixfy/gemini"

const gemini = new Gemini(API_KEY, {
    mode: "gemini-pro-vision"
    useLatestModel: true,
})
```

Remember, if you ignore the `model` property, it will use `gemini-1.5-flash` or `gemini-1.5-flash-latest` respectively, depending on the `useLatestModel` value toi be true | false | undefined.

## Contributing

Feel free to contribute as you want with the project, if you want so, just open an issue, or make a pull request to the `dev` branch at the [repository](https://github.com/joni0108/Codixfy-Gemini-Npm/tree/dev).

## CHANGELOG

See the changelog by clicking [here](https://github.com/joni0108/Codixfy-Gemini-Npm/blob/main/CHANGELOG.md).

### Notes

This project was inpired by different npm packages, most being [gemini-ai](https://github.com/EvanZhouDev/gemini-ai). This project uses the package `@google/generative-ai` under the hood which is a different approach, being our goal make easier the work with Gemini AI.
