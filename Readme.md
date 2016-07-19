airCommuter
===========

This script injects public transport travel time data into AirBnB search results. For each listing, the travel time between your search location and the property is specified in minutes. Hover over the time to get route information. Click on the time to see the route on Google Maps.

The data is provided by the [Transport for London (TfL) API](https://api.tfl.gov.uk/). For this reason, this script currenlty only works for London :(

Usage
-----

  1. When searching properties on AirBnB, make sure to specify the exact address
  2. Once the search result screen has loaded, launch the script. You can do this by opening your browser's developer tools panel (F12) and pasting the contents of airCommuter.js in the console, or create a greasemonkey script.