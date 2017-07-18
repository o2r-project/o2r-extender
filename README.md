# Integrating badges using a Chrome Web Extension


The o2r-extender is part of the [o2r project](http://o2r.info) which aims to make reproduction of research results possbile:

The o2r-extender consists of a Chrome Web Extension that allows for integration of badges on several [research websites](#Supported-research-services). Additionally, it integrates buttons for the o2r project into [data repositories](#Supported-data-repositories) and [collaboration platforms](#Supported-collaboration-platforms).

Based on the study project "Badges for computational geoscience containers" available at [geocontainer-badges/reproducability](https://zivgitlab.uni-muenster.de/geocontainer-badges/reproducability).

## Installation

In order to use this API, make sure that you have installed [Chrome](https://www.google.com/chrome/) and enabled extensions in the settings.

### Web store installation

To install the extension directly from the [Chrome Web Store](https://chrome.google.com/webstore/category/extensions) open the following link and click the "Add to Chrome" button:

[https://chrome.google.com/webstore/detail/open-reproducible-researc/fhhfncpkfohlhphlcgpkbpialfhkmbil](https://chrome.google.com/webstore/detail/open-reproducible-researc/fhhfncpkfohlhphlcgpkbpialfhkmbil)

### Development installation

1) Clone this repository: `git clone https://github.com/o2r-project/o2r-extender/`

2) Add the o2r Badge Integrator extension:

    - Open `chrome://extensions/` in Chrome,
    - make sure that "Developer mode" in the top-right corner is enabled,
    - click "Load unpacked extension..."
    - and select the `o2r Badge Integrator` directory of this repository.
    
3) Start the o2r-badger to generate badges. [Installation instructions](https://github.com/o2r-project/o2r-badger#local-installation)

4) Right click the new "o2r" extension icon and select `options`. Change the `Badge endpoint` setting to the local badger address, e.g. `http://localhost:8089/api/1.0/badge/`

5) When visiting one of the supported websites make sure to allow mixed content in Chrome:

    - select "Load unsafe scripts" by clicking the shield icon in the address bar ([detailed explanation](https://pearsonnacommunity.force.com/support/s/article/ka6d00000019KVGAA2/How-to-display-mixed-content-with-Google-Chrome-Internet-Explorer-or-Firefox-1408394589290))

### Usage

Upon successful installation, you will notice the applications' icon in the top-right corner next to the URL line. Navigate to your chosen website, search for the name of the research you are interested in, and everything will happen automatically. Filter and badges are loaded and nicely integrated into the service's search results.

#### Supported research services

* [PLOS](https://www.plos.org/): Partially supported, no filter (reason: technical problems with the PLOS JS framework)
* [ScienceDirect](http://www.sciencedirect.com/): Fully supported
* [Google Scholar](https://scholar.google.de/): Partially supported, no big badges (reason: no detail page)
* [MS Academic Search](https://academic.microsoft.com/): Fully supported
* [Mendeley](https://www.mendeley.com/): Fully supported
* [DOAJ](https://www.doaj.org): Fully supported

#### Supported data repositories

* [Zenodo](https://zenodo.org/)

#### Supported collaboration platforms

* [Sciebo](https://sciebo.de)

## Development

To release a new version to the [Chrome Web Store](https://chrome.google.com/webstore/category/extensions), we use the [Web Store Upload CLI](https://github.com/DrewML/chrome-webstore-upload-cli).

```bash
npm install -g chrome-webstore-upload-cli
```

**Release process**

- add a tag matching the version from `manifest.json` prepended with `v`, e.g. `v0.1.0`
```bash
git tag v0.1.0
```
- go to directory `extension` and put keys and IDs into environment variables:
```bash
cd extension
EXTENSION_ID=fhhfncpkfohlhphlcgpkbpialfhkmbil
CLIENT_ID=<secret>
CLIENT_SECRET=<secret>
REFRESH_TOKEN=<secret>
```
- upload directory with `webstore upload --extension-id $EXTENSION_ID --client-id $CLIENT_ID --client-secret $CLIENT_SECRET --refresh-token $REFRESH_TOKEN`
- publish extension with `webstore publish --extension-id $EXTENSION_ID --client-id $CLIENT_ID --client-secret $CLIENT_SECRET --refresh-token $REFRESH_TOKEN`
- push the tag to GitHub
```bash
git push upstream master
```

## List of contributors

- Antonia van Eek
- Clara Rendel
- Lasse Einfeldt
- Laura Meierkort
- Marlena Götza
- Salman Khalid
- Shahzeib Tariq Jaswal
- Nimrod Gavish
- Matthias Mohr
- Daniel Nüst
- Lukas Lohoff

## License

This project is licensed under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).