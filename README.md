# NPM package (w/ ts) Boilerplate

This is a boilerplate for creating an npm package using `typescript`.

## 👀 What Features does it Include?

-   🛠️ **Typescript**: Types based code, so you can detect the errors during coding time, not at run-time.
-   🧪 **Testing**: It includes Vitest testing library for testing your package.
-   ✨ **ESlint**: For clean and consistent codebase styling habits.
-   🚀 **Github Actions**: Automated commands ran on github with each push/pull request, to make sure the code meets the standards.

## Get Started

1. Fork and clone the repository or download the files to your machine.
2. Configure the `package.json` with your project information.
3. Add `tsconfig.json` and `tsup.config.ts` to your `.gitignore` file as you won't needed on the main branch.
4. Start working...

## Scripts

These are the available scripts you can run with `npm run <script>`:

-   **build** - Builds your package ready to be deployed.
-   **test** - Runs all the test suits you have in your project.
-   **test:watch** - Runs all the test suits you have in your project, but expecting file changes `--watch`.
-   **lint** - Checks for your code errors.
-   **lint:fix** - Fixes all your lint errors.

### How to deploy to NPM

This is only if you want your package to be deployed to NPM.

1. Create and NPM account and verify the email.
2. On your terminal, run `npm adduser`
3. CTRL + Click on the link shown on the terminal, and login on the browser.
4. Run `npm woami` to see if everything is setup. You should see your npm username.
5. Run `npm publish` to publish your package at NPM.
