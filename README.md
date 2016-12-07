# Integrating badges using a Chrome Web Extension

This project provides an API for installing a Chrome Web Extension that allows for integration of badges on several research websites.

## Installation

In order to use this API, make sure that you have installed [Chrome](https://www.google.com/chrome/) and enabled extensions in Settings.

Next, clone our repository:

`git clone https://zivgitlab.uni-muenster.de/geocontainer-badges/reproducability`

Open the Chrome browser > Click the three dots in the top right corner > Settings > Extensions > Load Unpacked Extension... > Select the folder containing each 
extension in the repository. Note: only one extension can be added at a time.

### Run in Chrome
Upon succesful installation, ou'll notice the applications' icon in the top-right corner next to the URL line. Navigate to your chosen website, search for the name of the research
you are interested in, and click the extension icon (top right corner) to assess the search results.

#### The extension in detail

[arXiv](https://arxiv.org/):  

[PLOS](https://www.plos.org/search?q=): Adding badge "Executability" to each search result and returning (to console log) the names of articles to be passed to API. 

[ScienceDirect](http://www.sciencedirect.com/): Adding badge "peer review" to each search result and returning (to console log) the names of articles to be passed to API.

[Google Scholar](https://scholar.google.de/): Adding badge "peer review" to each search result and returning (to console log) the names of articles to be passed to API. 

[MS Academic Search](https://academic.microsoft.com/): Checking external source link  

[OSF](https://osf.io/)  

[Mendeley](https://www.mendeley.com/): Checking readers  