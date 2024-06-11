import { describe, it, expect } from "vitest"
import { Gemini, GeminiUtils } from "./gemini"

// Add your testing API key here if you want to run the tests
const API_KEY = ""
const google_logo =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png"

describe.concurrent.skip("Gemini Utils Functions/Methods", () => {
    it("Tests .mimeTypeFromImage() method", async () => {
        const mimeType = await GeminiUtils.mimeTypeFromImage(google_logo)

        expect(mimeType).toBe("image/png")
    })

    it("Tests .fileToGenerativePart() method", async () => {
        const generativePart = await GeminiUtils.fileToGenerativePart(
            google_logo
        )

        expect(generativePart.inline_data).toHaveProperty("data")
        expect(generativePart.inline_data).toHaveProperty("mime_type")
    })
})

describe.skip("Gemini Ask Method", () => {
    it("Tests .ask() method with just text", async () => {
        const gemini = new Gemini(API_KEY, {
            instructions: "You will always answer a greet with Hi.",
        })

        const response = await gemini.ask("Hi, gemini!")

        console.log(response)

        expect(response).toContain("Hi")
    })

    it("Tests .ask() method with text and image", async () => {
        const gemini = new Gemini(API_KEY, {
            instructions: "You will always answer a greet with Hi.",
        })

        const response = await gemini.ask("Is this the logo of Google?", {
            images: [google_logo],
        })

        console.log(response)

        expect(response).toContain("Yes")
    })

    it("Tests .ask() method to handle multiple images", async () => {
        const gemini = new Gemini(API_KEY, {
            instructions: "You will always answer a greet with Hi.",
        })

        const response = await gemini.ask(
            "Are these images the same? Answer with a Yes or No, please",
            {
                images: [google_logo, google_logo],
            }
        )

        console.log(response)

        expect(response).toContain("Yes")
    })

    it("Tests .ask() method with streaming", async () => {
        const gemini = new Gemini(API_KEY, {
            instructions: "You will always answer a greet with Hi.",
        })

        let streamCounter = 0

        const response = await gemini.ask(
            "Can you talk me about the company of the logo of the image",
            {
                images: [google_logo],
                stream: (response) => {
                    console.log(response)
                    streamCounter++
                },
            }
        )

        expect(response).toContain("Google")
        expect(streamCounter).toBeGreaterThan(0)
    })
})

describe.skip("Gemini Chat", () => {
    const gemini = new Gemini(API_KEY, {
        instructions: "You will always answer a greet with Hi.",
    })
    const chat = gemini.createChat()
    let history = []

    it("Should be able to mantain context", async () => {
        const response = await chat.send("Hi Gemini! My name is Codixfy")
        console.log(response)

        expect(response).toContain("Hi")

        const response2 = await chat.send("What is my name?")
        console.log(response2)

        expect(response2).toContain("Codixfy")
    })

    it("Should save the context", async () => {
        history = await chat.save()
    })

    it("Should be able to reset the context", async () => {
        await chat.reset()

        const response = await chat.send("What is my name?")
        console.log(response)

        expect(response).not.toContain("Codixfy")
    })

    it("Should be able to load the context", async () => {
        await chat.load(history)

        const response = await chat.send("What is my name?")
        console.log(response)

        expect(response).toContain("Codixfy")
    })

    it("Should be able to load history from the constructor", async () => {
        const chat2 = gemini.createChat(history)

        const response = await chat2.send("What is my name?")
        console.log(response)

        expect(response).toContain("Codixfy")
    })
})
