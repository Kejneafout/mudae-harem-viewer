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
- Keys
- Claim rank
- Note
- Image


## Installation

You have two options:
1. Download and use the pre-compiled binaries in [Releases](https://github.com/Kejneafout/mudae-harem-downloader/releases/tag/v1.0.0)
2. Clone the repository and compile the app yourself:

- You need [Go](https://golang.org/doc/install) installed on your system.
- Clone this repository to your local machine.
   ```bash
   git clone https://github.com/Kejneafout/mudae-harem-viewer.git
   ```
- Navigate to the project directory.
   ```bash
   cd mudae-harem-viewer
   ```
- Install dependencies:
   ```bash
   go mod tidy
   ```
- Build the executable.
   ```bash
   go build .
   ```

## Dependencies

The Mudae Harem Viewer relies on the following packages:

- [Mux](https://github.com/gorilla/mux) v1.8.1

## Usage

1. Start the server using:

- On Linux:
```bash
./mudae-harem-viewer-linux
```

- On Windows:
```cmd
.\mudae-harem-viewer-windows.exe
```

2. Access the app in your web browser at `http://localhost:3000`
3. Follow the instructions, upload an archive or use existing data.

## License

This project is licensed under the GNU General Public License (GPL) - see the [COPYING](COPYING) file for details.
