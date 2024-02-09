# Mudae Harem Viewer

The Mudae Harem Viewer is a web application designed to display and interact with exports from [Mudae Harem Downloader](https://github.com/Kejneafout/mudae-harem-downloader)

This project allows users to simulate the behavior of the `$mm` command.

## Features

- Upload a zip archive containing character data and images.
- View a list of characters from the Mudae bot's harem.
- Display detailed information about each character.
- View associated images for each character.
- View existing character data without re-uploading.

You can view the following information about characters:
- Name
- Series
- Value
- Claim rank
- Note
- Image


## Installation

1. Install Node.js on your system, preferably using [nvm](https://github.com/nvm-sh/nvm) for Linux or [nvm-windows](https://github.com/coreybutler/nvm-windows) for Windows

2. Clone the repository:

   ```bash
   git clone https://github.com/Kejneafout/mudae-harem-viewer.git
   ```

3. Navigate to the project directory:

   ```bash
   cd mudae-harem-viewer
   ```

4. Install dependencies:

   ```bash
   npm install
   ```

## Dependencies

The Mudae Harem Viewer relies on the following npm packages:

- [Express.js](https://www.npmjs.com/package/express): Web framework for Node.js.
- [Multer](https://www.npmjs.com/package/multer): Middleware for handling file uploads.
- [Adm-zip](https://www.npmjs.com/package/adm-zip): Library for extracting zip archives.
- [Serve-index](https://www.npmjs.com/package/serve-index): Middleware for serving directory listings.

## Usage

1. Start the server using `npm run start`.
2. Access the application in your web browser at `http://localhost:3000`.

## License

This project is licensed under the GNU General Public License (GPL) - see the [LICENSE](LICENSE) file for details.
