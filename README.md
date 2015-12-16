# metalsmith-generate

Metalsmith plugin to generate files

[![Build
Status](https://travis-ci.org/iilab/metalsmith-generate.svg?branch=master)](https://travis-ci.org/iilab/metalsmith-generate)
[![Dependency
Status](https://gemnasium.com/iilab/metalsmith-generate.svg)](https://gemnasium.com/iilab/metalsmith-generate)

## Features

This allows you to generate new files into your pipeline without having to include them in the source repository. It can be used to create indexes, file catalogs and generate them with templates.

## Installation

npm install metalsmith-generate

## CLI Usage

```
{
  "plugins": {
    "metalsmith-generate": [
      {
        "path": "/index.json",
        "metadata": { 
            "layout": "index.json",
            "otherkey": "othervalue"
        }
      }
    ,
      {
        "path": "/rss.xml"
        "contents": "path/to/file.ext"
      }
    }
    ,
      {
        "type": "metadata",
        "src": "tools.data",
        "contents": "Teaser",
        "path": "field_name",
        "ext": ".md"
      }
    }
  }
}
```

## License

MIT
