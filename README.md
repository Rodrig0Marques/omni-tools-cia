<div align="center">
        <img src="src/assets/logo.png" width="220" />
        <br /><br />
<a href="https://trendshift.io/repositories/13055" target="_blank"><img src="https://trendshift.io/api/badge/repositories/13055" alt="iib0011%2Fomni-tools | Trendshift" style="width: 200px;" width="200"/></a>
   <br /><br />
<a href="https://github.com/iib0011/omni-tools/releases">
          <img src="https://img.shields.io/badge/version-0.6.0-blue?style=for-the-badge" />
        </a>
        <a href="https://hub.docker.com/r/iib0011/omni-tools">
          <img src="https://img.shields.io/docker/pulls/iib0011/omni-tools?style=for-the-badge&logo=docker" />
        </a>
        <a href="https://github.com/iib0011">
          <img src="https://img.shields.io/github/stars/iib0011/omni-tools?style=for-the-badge&logo=github" />
        </a>
        <a href="https://github.com/iib0011/omni-tools/blob/main/LICENSE">
          <img src="https://img.shields.io/github/license/iib0011/omni-tools?style=for-the-badge" />
        </a>
        <a href="https://discord.gg/SDbbn3hT4b">
          <img src="https://img.shields.io/discord/1342971141823664179?label=Discord&style=for-the-badge" />
        </a>
        <br /><br />
</div>

Welcome to OmniTools, a self-hosted web app offering a variety of online tools to simplify everyday tasks.
Whether you are coding, manipulating images/videos, PDFs or crunching numbers, OmniTools has you covered. Please don't
forget to
star the repo to support us.
Here is the [demo](https://omnitools.app) website.

All files are processed entirely on the client side: nothing ever leaves your device.
Plus, the Docker image is super lightweight at just 28MB, making it fast to deploy and easy to self-host.

![img.png](docs-images/img.png)

## Table of Contents

- [Features](#features)
- [Self-host](#self-hostrun)
- [Contribute](#contribute)
- [Contact](#contact)
- [License](#license)

## Features

We strive to offer a variety of tools, including:

### **Image/Video/Audio Tools**

- Image Resizer
- Image Converter
- Image Editor
- Video Trimmer
- Video Reverser
- And more...

### **PDF Tools**

- PDF Splitter
- PDF Merger
- PDF Editor
- And more...

### **Text/List Tools**

- Case Converters
- List Shuffler
- Text Formatters
- And more...

### **Date and Time Tools**

- Date Calculators
- Time Zone Converters
- And more...

### **Math Tools**

- Generate Prime Numbers
- Calculate voltage, current, or resistance
- And more...

### **Data Tools**

- JSON Tools
- CSV Tools
- XML Tools
- And more...

Stay tuned as we continue to expand and improve our collection!

### Finding tools

Find tools from any page with **Ctrl+K** (or **Cmd+K** on macOS). Use the bookmark button on a tool to add it to the **Favorites** tab on the home page. The interface supports light, dark, and system themes, plus a compact navigation menu on mobile.

### Saved tool configurations

Use **Save configuration** in a tool's options to name and save its settings. Select a saved configuration and click **Apply** to reuse it, or **Restore defaults** to reset the options while keeping the current input. Saving with the same name updates the configuration; the delete button removes it.

Configurations stay in the current browser and are separate for each tool. Uploaded files, source text, QR code contents, and passwords are not saved.

### Clearing results and downloading files

Use **Clear output** below a result to clear its text, file previews, or batch ZIP while keeping the input and options. Edit the input/options or import a file again to generate a new result. Downloads already started continue after the preview is cleared.

Background removal runs in a dedicated worker so the interface remains responsive during image processing. The first run downloads the model and runtime; a progress message is shown while these resources load. Replacing or clearing the input cancels an active job, and clearing its output or leaving the tool releases the worker.

## Self-host/Run

### Docker

```bash
docker run -d --name omni-tools --restart unless-stopped -p 8080:80 iib0011/omni-tools:latest
```

### Docker Compose

```yaml
services:
  omni-tools:
    image: iib0011/omni-tools:latest
    container_name: omni-tools
    restart: unless-stopped
    ports:
      - '8080:80'
```

## Contribute

This is a React Project with Typescript Material UI. We use icons from [Iconify](https://icon-sets.iconify.design)

### Project setup

```bash
git clone https://github.com/iib0011/omni-tools.git
cd omni-tools
npm i
npm run dev
```

### Create a new tool

```bash
npm run script:create:tool my-tool-name folder1 # npm run script:create:tool split pdf
```

For tools located under multiple nested directories, use:

```bash
npm run script:create:tool my-tool-name folder1/folder2 # npm run script:create:tool compress image/png
```

Use `folder1\folder2` on Windows.

Tools using `ToolContent` get saved configurations for their scalar options automatically. If form values include source data, provide an explicit `presetFields` list containing only reusable settings. Use `presetFields={false}` to disable the controls. Applying configurations and restoring defaults preserve fields outside this list. Keep file objects and nested input data outside saved options.

### Run tests

```bash
npm run test
```

- For e2e tests

```bash
npm run test:e2e
```

### i18n (Translations)

The translation files are [here](public/locales). Only edit these if you are a developer. For non developers, use [Locize](https://www.locize.app/register?invitation=YOIH0Dyz3KHh3uQFCGYe9v1QOUoq8W5ySgmlwjX9cSypeJmt8F40brDtVbXb71fK).

<img src="https://api.star-history.com/svg?repos=iib0011/omni-tools&type=Date"/>

## 🤝 Looking to contribute?

We welcome contributions! You can help by:

- Reporting bugs
- Suggesting new features in GitHub issues or [here](https://tally.so/r/nrkkx2)
- Translating in [Locize project](https://www.locize.app/register?invitation=YOIH0Dyz3KHh3uQFCGYe9v1QOUoq8W5ySgmlwjX9cSypeJmt8F40brDtVbXb71fK).
- Improving documentation
- Submitting pull requests

You can also join our [Discord server](https://discord.gg/SDbbn3hT4b)

## 🧡 Sponsors

<div align="center">
  <a href="https://www.locize.com/" target="_blank">
    <img src="docs-images/locizeSponsor.svg" alt="Locize" width="200"/>
  </a>
</div>

Thanks to [Locize](https://www.locize.com) for sponsoring OmniTools and supporting localization efforts.
They make translation management simple and developer-friendly.

## Contributors

<a href="https://github.com/iib0011/omni-tools/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=iib0011/omni-tools" />
</a>

## Contact

For any questions or suggestions, feel free to open an issue or contact me at:
[ibracool99@gmail.com](mailto:ibracool99@gmail.com)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
