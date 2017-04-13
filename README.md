# _Work in progress_
# Integrating badges using a Chrome Web Extension

This project provides an API for installing a Chrome Web Extension that allows for integration of badges on several research websites and data repositories.

Based on the study project "Badges for computational geoscience containers" available at [geocontainer-badges/reproducability](https://zivgitlab.uni-muenster.de/geocontainer-badges/reproducability).

## Installation

In order to use this API, make sure that you have installed [Chrome](https://www.google.com/chrome/) and enabled extensions in Settings.

Next, clone our repository:

`git clone https://zivgitlab.uni-muenster.de/geocontainer-badges/reproducability`

Open the Chrome browser > Click the three dots in the top right corner > Settings > Extensions > Load Unpacked Extension... > Select the folder containing each 
extension in the repository. Note: only one extension can be added at a time.

### Run in Chrome
Upon succesful installation, you'll notice the applications' icon in the top-right corner next to the URL line. Navigate to your chosen website, search for the name of the research
you are interested in, and everything will happen automatically. Filter and badges are loaded and nicely integrated into the service's search results.

#### Supported research services

* [PLOS](https://www.plos.org/): Partially supported, no filter (reason: technical problems with the PLOS JS framework)
* [ScienceDirect](http://www.sciencedirect.com/): Fully supported
* [Google Scholar](https://scholar.google.de/): Partially supported, no big badges (reason: no detail page)
* [MS Academic Search](https://academic.microsoft.com/): Fully supported
* [Mendeley](https://www.mendeley.com/): Fully supported
* [DOAJ](https://www.doaj.org): Fully supported

#### Supported data repositories

* [Sciebo](https://sciebo.de)
* [Zenodo](https://zenodo.org/)


