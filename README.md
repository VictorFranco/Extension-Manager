# Extension-Manager
![Javascript](https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white&labelColor=101010)
![TypeScript](https://img.shields.io/badge/typescript-2D79C7?style=for-the-badge&logo=typescript&logoColor=white&labelColor=101010)
![ChromeExtension](https://img.shields.io/badge/extension-195228?style=for-the-badge&logo=googlechrome&logoColor=white&labelColor=101010)

A Chrome extension which manages your extensions. Extension Manager also has
support for keyboard navigation.

![Extension Manager](https://i.imgur.com/yb3YB5z.png "Extension Manager")

## How to install Extension Manager
Steps:
1. Clone this repository
2. Go to [chrome://extensions/](chrome://extensions/)
3. Enable Developer Mode
4. Click on **Load unpacked** button
5. Select repository local folder
6. Click on puzzle icon <img alt="Extension icon" src="https://i.imgur.com/Mz4oQAy.png" width="16"/> on toolbar
7. Pin the Extension Manager

In order to open the extension, you have to click on Extension Manager icon
<img alt="Extension Manager icon" src="manager.png" width="16"/>.

## Keyboard navigation
Steps to open extension:
1. Press **F10**
2. Set focus on Extension Manager icon <img alt="Extension Manager icon" src="manager.png" width="16"/> using **Tab** key
3. Press **Enter**

If you want to change the focused element, you have to press the **Tab** key.

When the focus is on any toggle button, you can press the **Space** key to
change the state of its extension.

## Screenshots
Extension enabled:

![Extension enabled](https://i.imgur.com/LCYqEXp.png "Extension enabled")

Extension disabled:

![Extension disabled](https://i.imgur.com/vBi2qEW.png "Extension disabled")

Enable/Disable all buttons

![Enable/Disable all buttons](https://i.imgur.com/lzQjdv6.png "Enable/Disable all buttons")

## Documentation of the technologies used
* [Chrome Extensions](https://developer.chrome.com/extensions/management "The chrome.management API")
* [TypeScript](https://www.typescriptlang.org/docs/ "TypeScript")
* [Grid Layout MDN](https://developer.mozilla.org/es/docs/Web/CSS/CSS_Grid_Layout "CSS")

## LICENSE
[GPLv3.0](LICENSE)
