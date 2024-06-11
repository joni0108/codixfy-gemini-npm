const {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
} = require("@google/generative-ai")
const Base64 = require("base64-js")

export type GeminiOptions = {
    model?:
        | "gemini-1.0-pro"
        | "gemini-pro-vision"
        | "gemini-1.5-pro"
        | "gemini-1.5-flash"
    safetySettings?: {
        blockDangerousContent?: boolean
        blockExplicitContent?: boolean
        blockHarassmentContent?: boolean
        blockHateContent?: boolean
    }
    instructions?: string
}

export type ContentsType = [
    {
        role: "user" | "model"
        parts: any
    }
]

export type MimeType = "image/png" | "image/jpeg" | "image/gif" | "image/webp"

export class Gemini {
    private genAI: any
    protected model: any
    private chatContext: any
    private currentModel:
        | "gemini-1.0-pro"
        | "gemini-pro-vision"
        | "gemini-1.5-pro"
        | "gemini-1.5-flash"

    constructor(apiKey: string, options?: GeminiOptions) {
        this.genAI = new GoogleGenerativeAI(apiKey)
        this.model = this.genAI.getGenerativeModel({
            model: options?.model || "gemini-1.5-flash",
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold:
                        options?.safetySettings?.blockDangerousContent === true
                            ? HarmBlockThreshold.BLOCK_ONLY_HIGH
                            : HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold:
                        options?.safetySettings?.blockExplicitContent === true
                            ? HarmBlockThreshold.BLOCK_ONLY_HIGH
                            : HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold:
                        options?.safetySettings?.blockHarassmentContent === true
                            ? HarmBlockThreshold.BLOCK_ONLY_HIGH
                            : HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold:
                        options?.safetySettings?.blockHateContent === true
                            ? HarmBlockThreshold.BLOCK_ONLY_HIGH
                            : HarmBlockThreshold.BLOCK_NONE,
                },
            ],
            systemInstruction: options?.instructions || undefined,
        })

        this.currentModel = options?.model || "gemini-1.5-flash"
        this.chatContext = null
    }

    getChatContext() {
        return this.chatContext
    }

    setChatContext(context: any) {
        this.chatContext = context
    }

    async fileToGenerativePart(image: string) {
        const mimeType: MimeType = await this.mimeTypeFromImage(image)

        const image64 = await fetch(image)
            .then((r) => r.arrayBuffer())
            .then((a) => Base64.fromByteArray(new Uint8Array(a)))

        return {
            inline_data: {
                data: image64,
                mime_type: mimeType,
            },
        }
    }

    async mimeTypeFromImage(image: string) {
        const extension = image.split(".")[image.split(".").length - 1]

        switch (extension) {
            case "jpg":
            case "jpeg":
                return "image/jpeg"
            case "png":
                return "image/png"
            case "gif":
                return "image/gif"
            case "webp":
                return "image/webp"
            default:
                throw new Error("Unsupported image type")
        }
    }

    // Used to send a message without any context
    async sendMessage(message: string, images?: string[]) {
        const partsWithImages: any = []

        if (images && images.length > 0) {
            // Check if the model supports images
            if (this.currentModel === "gemini-pro-vision") {
                throw new Error(
                    `This model does not support images. Current model: ${this.currentModel}`
                )
            }

            for (const image of images) {
                partsWithImages.push(await this.fileToGenerativePart(image))
            }
        }

        const contents: ContentsType = [
            {
                role: "user",
                parts: [
                    {
                        text: message,
                    },
                    ...partsWithImages,
                ],
            },
        ]

        const result = await this.model.generateContentStream({ contents })

        const buffer: any = []

        for await (const response of result.stream) {
            buffer.push(response.text())
        }

        return buffer.join(" ")
    }

    // Used to send a message with context -> For custom context, modify the context object
    async sendMessageWithContext(message: string, images?: string[]) {
        const partsWithImages: any = []

        if (images && images.length > 0) {
            // Check if the model supports images
            if (this.currentModel === "gemini-pro-vision") {
                throw new Error(
                    `This model does not support images. Current model: ${this.currentModel}`
                )
            }

            for (const image of images) {
                partsWithImages.push(await this.fileToGenerativePart(image))
            }
        }

        if (!this.chatContext) {
            this.chatContext = []
        }

        this.chatContext.push({
            role: "user",
            parts: [
                {
                    text: message,
                },
                ...partsWithImages,
            ],
        })

        this.setChatContext(this.chatContext)

        const contents: ContentsType = this.chatContext

        const result = await this.model.generateContentStream({ contents })

        const buffer: any = []

        for await (const response of result.stream) {
            buffer.push(response.text())
        }

        return buffer.join(" ")
    }
}
