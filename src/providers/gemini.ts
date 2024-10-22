// Imports
const {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
} = require("@google/generative-ai")
const Base64 = require("base64-js")

// Types
/**
 * Represents the various models available in the Gemini series.
 * The different model types include standard, professional, vision, and flash versions.
 *
 * Available models:
 * - "gemini-1.0-pro": Gemini version 1.0 professional model.
 * - "gemini-pro-vision": Vision series in the professional model.
 * - "gemini-1.5-pro": Gemini version 1.5 professional model.
 * - "gemini-1.5-flash": Flash series model in the Gemini version 1.5.
 * - "gemini-1.0-pro-latest": Latest variant of the Gemini version 1.0 professional model.
 * - "gemini-pro-vision-latest": Latest variant of the professional vision series.
 * - "gemini-1.5-pro-latest": Latest variant of the Gemini version 1.5 professional model.
 * - "gemini-1.5-flash-latest": Latest variant in the flash series for Gemini version 1.5.
 */
export type Models =
    | "gemini-1.0-pro"
    | "gemini-pro-vision"
    | "gemini-1.5-pro"
    | "gemini-1.5-flash"
    | "gemini-1.0-pro-latest"
    | "gemini-pro-vision-latest"
    | "gemini-1.5-pro-latest"
    | "gemini-1.5-flash-latest"

/**
 * Configuration options for Gemini service.
 */
export type GeminiOptions = {
    model?: Models
    safetySettings?: {
        blockDangerousContent?: boolean
        blockExplicitContent?: boolean
        blockHarassmentContent?: boolean
        blockHateContent?: boolean
    }
    instructions?: string
    useLatestModel?: boolean
}

/**
 * Represents the type definition for contents, which includes an array of objects.
 * Each object contains a `role` indicating the source of the content,
 * and `parts`, which can be any type.
 *
 * @typedef {Object} ContentsType
 * @property {"user" | "model"} role - The role of the content's source,
 *                                    either "user" or "model".
 * @property {any} parts - The content itself, which can be of any type.
 */
export type ContentsType = [
    {
        role: "user" | "model"
        parts: any
    }
]

/**
 * MimeType is a union type representing a set of common image MIME types.
 *
 * - "image/png": Indicates that the image file is in PNG format.
 * - "image/jpeg": Indicates that the image file is in JPEG format.
 * - "image/gif": Indicates that the image file is in GIF format.
 * - "image/webp": Indicates that the image file is in WebP format.
 */
export type MimeType = "image/png" | "image/jpeg" | "image/gif" | "image/webp"

// Handles the messaging without context
/**
 * Class representing the Gemini model for generating AI content.
 */
export class Gemini {
    private genAI: any
    protected model: any
    private currentModel: Models

    constructor(apiKey: string, options?: GeminiOptions) {
        this.genAI = new GoogleGenerativeAI(apiKey)

        this.currentModel = "gemini-1.5-flash"

        if (options?.model) {
            this.currentModel = options.model

            if (options?.useLatestModel) {
                this.currentModel += "-latest"
            }
        }

        this.model = this.genAI.getGenerativeModel({
            model: this.currentModel,
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
    }

    // Used to send a message without any context
    async ask(
        message: string,
        extra?: {
            images?: string[]
            stream?: (data: string) => void
        }
    ) {
        const partsWithImages: any = []

        if (extra?.images && extra.images.length > 0) {
            // Check if the model supports images
            if (this.currentModel === "gemini-pro-vision") {
                throw new Error(
                    `This model does not support images. Current model: ${this.currentModel}`
                )
            }

            for (const image of extra.images) {
                partsWithImages.push(
                    await GeminiUtils.fileToGenerativePart(image)
                )
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
            if (extra?.stream) {
                extra.stream(response.text())
            }
        }

        return buffer.join(" ")
    }

    createChat(chartContext?: any) {
        return new GeminiChat(
            this.model,
            chartContext === null ? [] : chartContext,
            this.currentModel
        )
    }
}

// Handles the chat context -> Non Exportable as it needs to be used internally
/**
 * GeminiChat class is responsible for managing and interacting with a chat-based model.
 * It can send messages, manage the chat context, and handle image processing for certain models.
 */
class GeminiChat {
    model: any
    chatContext: any
    currentModel: Models

    constructor(model: any, chatContext: any, currentModel: Models) {
        this.model = model
        this.chatContext = chatContext
        this.currentModel = currentModel
    }

    async send(
        message: string,
        extra?: {
            images?: string[]
            stream?: (data: string) => void
        }
    ) {
        const partsWithImages: any = []

        if (extra?.images && extra.images.length > 0) {
            // Check if the model supports images
            if (this.currentModel === "gemini-pro-vision") {
                throw new Error(
                    `This model does not support images. Current model: ${this.currentModel}`
                )
            }

            for (const image of extra.images) {
                partsWithImages.push(
                    await GeminiUtils.fileToGenerativePart(image)
                )
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

        const contents: ContentsType = this.chatContext

        const result = await this.model.generateContentStream({ contents })

        const buffer: any = []

        for await (const response of result.stream) {
            buffer.push(response.text())
            if (extra?.stream) {
                extra.stream(response.text())
            }
        }

        return buffer.join(" ")
    }

    async reset() {
        this.chatContext = []
    }

    async save() {
        return this.chatContext
    }

    async load(context: any) {
        this.chatContext = context
    }
}

/**
 * GeminiUtils class provides utility methods related to image processing.
 */
export class GeminiUtils {
    static async fileToGenerativePart(image: string) {
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

    static async mimeTypeFromImage(image: string) {
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
}
