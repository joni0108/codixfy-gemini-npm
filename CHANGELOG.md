# CHANGELOG

## Patch v2.0.1
- Build package and removed an unused import.

## Major v2.0.0
This is our new major update, so expect incompatibility with projects made using the version v1.2, but we will let you know how to migrate.

**New Additions**
- Now you can use not only images, but all file types when using the AI. This includes image, video, audio, pdf, etc. (See notes below)
- Now you have all the actual models of the AI, including the brand new `gemini-2.0-flash-exp`. Be advised, even though you can use the model, the very new features like 2-ways streaming, screen content detector, etc are not available yet.

**Deprecated**
- The model `gemini-1.0-flash` has been deprecated on Gemini, so we removed it from our package. If you were using this model in any of your projects for any reason, please, switch to `gemini-1.0-pro`, `gemini-1.5-flash` or `gemini-2.0-flash`.

**Syntax Changes**
- The parameter used in version v1.2 to attach images was renamed from `images: []` to `files: []` to comply with the new file types. All the docs have been updated to the new version.

**Notes**
- We have disabled the new local-image upload temporarily, for the moment the package only support internet-public files, which must have an URL in order to work. Be aware that this feature will comeback as we're working to support all the file types directly from the `File` object. These are some walkarounds.

If you have a project where the user uploads the file from his device you have to:

- Upload the file to any cloud storage service like Firestore from Firebase.
- Obtain the file URL
- Use the URL as part of the `files: [url, ...]` parameter.

If you have a project where the files are already in the internet or any cloud storage, then you don't need to do anything extra, just use the link of the file as you were already doing.

## Minor v1.2.0

-   Now you can choose if you want to use a latest (non-stable) version of the model.
-   Removed unuseful files from distribution pack. You can check them out on the Github whenever you want.

## Minor v1.1.0

-   Now you can choose the model version you want to use when creating your model. See docs.
-   Added changelog file and MIT license.
-   Fixed the versions of dependencies.

## Initial v1.0.0

-   The initial version of the package.
-   You can send independent messages, which each message ignoring the previous ones. Useful for search engines or wikipedia-based projects.
-   You can send message which history is taken in account on each interaction. Useful for chat bots.
-   You can have persistency on the chat model, loading, resetting, and unloading the history at any time.
-   You can receive full async response, or data streaming.
-   You can pass initial instructions and behaviors to the model when creating.
