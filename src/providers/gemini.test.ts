import { describe, it, expect } from "vitest"
import { Gemini } from "./gemini"

describe.concurrent("Gemini Utils Functions/Methods", () => {
    it("Should give the mime type of an image based on its path", async () => {
        const gemini = new Gemini("")

        const image = "image.jpg"

        const mimeType = await gemini.mimeTypeFromImage(image)

        expect(mimeType).toBe("image/jpeg")
    })

    it("Should give the part following the structure of the generative-ai library", async () => {
        const gemini = new Gemini("")

        const image =
            "https://www.finder.com/finder-us/wp-uploads/2017/09/GeminiLogo_Supplied_250x250-150x150.png"

        const part = await gemini.fileToGenerativePart(image)

        expect(part.inline_data).toHaveProperty("mime_type")
        expect(part.inline_data).toHaveProperty("data")
    })
})

describe.concurrent("Gemini Service", () => {
    const API_KEY = "AIzaSyAfTjzcrJNHHDPaburm9YYGMFtbeZNBG8o"

    it("Testing sending simple plain text message", async () => {
        const gemini = new Gemini(API_KEY)

        const response = await gemini.sendMessage("Hello!")

        console.log(response)

        expect(response).toContain("Hello")
    })

    it("Testing sending an image and asking for a simple question", async () => {
        const gemini = new Gemini(API_KEY)

        const response = await gemini.sendMessage(
            "Does this image have the Gemini icon on it? Answer yes or no, please",
            [
                "https://www.finder.com/finder-us/wp-uploads/2017/09/GeminiLogo_Supplied_250x250-150x150.png",
            ]
        )

        console.log(response)

        expect(response).toContain("Yes")
    })

    it("Basic comparison between 2 images", async () => {
        const gemini = new Gemini(API_KEY)

        const response = await gemini.sendMessage(
            "Do these images have different background colors? Answer yes or no, please",
            [
                "https://www.finder.com/finder-us/wp-uploads/2017/09/GeminiLogo_Supplied_250x250-150x150.png",
                "https://guardinvest.com/gmedia/2022/02/gemini-3-2.png",
            ]
        )

        console.log(response)

        expect(response).toContain("Yes")
    })

    it("Should get have a conversation with context", async () => {
        const gemini = new Gemini(API_KEY)

        const response = await gemini.sendMessageWithContext(
            "Hello, My name is Jonathan. I am a full stack developer, and I am 22 years old. Please, when greeting me, doing it with Hi, instead of Hello."
        )

        console.log(response)

        expect(response).toContain("Hi")

        const response2 = await gemini.sendMessageWithContext(
            "I am currently working on a project that involves creating an npm package working with the generative-ai library. I am using the Gemini model for this project. The project name is @codixfy/gemini."
        )

        console.log(response2)

        const response3 = await gemini.sendMessageWithContext(
            "Please, answer the following questions: What is my name? What is my age? The project I am working on, involves artificial intelligence?"
        )

        console.log(response3)

        expect(response3).toContain("Jonathan")
        expect(response3).toContain("22")
        expect(response3).toContain("codixfy/gemini")
    })

    it("Testing with instructions passed to the model, it should answer the question based on the instructions provided on each request", async () => {
        const gemini = new Gemini(API_KEY, {
            instructions:
                "You are a bot that can only answer with yes or no in lowercase to the questions asked.",
        })

        const response = await gemini.sendMessage(
            "Do these images have different background colors?",
            [
                "https://www.finder.com/finder-us/wp-uploads/2017/09/GeminiLogo_Supplied_250x250-150x150.png",
                "https://guardinvest.com/gmedia/2022/02/gemini-3-2.png",
            ]
        )

        console.log(response)

        expect(response).toContain("yes")
    })
})
