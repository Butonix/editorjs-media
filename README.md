![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Media Browser Tool

Media Browser Block for the [Editor.js](https://editorjs.io).

## Features

- Allows adding custom media (images, videos and files) from an external media library

## Installation

### Install via NPM

Get the package

```shell
npm i --save-dev @illumini/editorjs-media
```

Include module at your application

```javascript
import MediaBrowser from '@illumini/editorjs-media';
```

### Other methods

#### Manual downloading and connecting

1. Upload folder `dist` from repository
2. Add `dist/bundle.js` file to your page.

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
import MediaBrowser from '@illumini/editorjs-media';

var editor = EditorJS({
  ...

  tools: {
    ...
    media: {
      class: MediaBrowser,
      config: {
        onSelectMedia: done => {
          const mediaUrl = openMediaLibrary();
          done(mediaUrl);
        },
      },
    },
  },
  ...
});
```

## Config Params

Image Tool supports these configuration parameters:

| Field         | Type              | Description                                                                   |
| ------------- | ----------------- | ----------------------------------------------------------------------------- |
| onSelectMedia | `func(done(url))` | Function for invoking external media library and returning selected media URL |
| buttonContent | `string`          | Allows to override HTML content of «Browse Media Library» button              |

## Output data

This Tool returns `data` with following format

| Field | Type     | Description                                           |
| ----- | -------- | ----------------------------------------------------- |
| media | `object` | The selected media. Always contain the `url` property |

```json
{
  "type": "media",
  "data": {
    "media": {
      "url": "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg"
    }
  }
}
```
