
# Configuration

The basemap.de viewer can be customized in the [environment.ts](../src/environments/environment.ts).

`name`: string

Application name.

`bkgAppId`: string

App ID for BKG geocoder service.

`logo`: string

URL to the logo for the application header.

`logoHeight`: number

Height (pixel) of the logo in the application header.

`printLogo`: string

URL of the logo to be inserted into PDF print files.

`printAttribution`: string

Atttribution to be inserted in the PDF print files.

`topPlusURL`: string 

GetMap request URL to TopPlusOpen WMS. Can be replaced by other WMS services for global map background.

`metaDataURL`: string

URL to a metadata file for customizing the layer tree, see [customize_layer_tree.md](customize_layer_tree.md).

`imprint`: string

Text for the imprint. It can contain HTML tags for formating.

## config

Initial map configuration. Only parameters that could reasonably be adjusted are described.

`styleID`: number

Index of the initially selected basemap from the _basemaps_ array.

`pitch`: number (0 - 60)

Initial pitch of the map.

`bearing`: number (0 - 359)

Initial bearing of the map.

`zoom`: number (0 - 19),

Initial zoom level of the map.

`lat`: number

Latitude of the initial center of the map

`lon`: number

Longitude of the initial center of the map

## printFormats

Page formats for printouts.

`name`: string

Label of the page format.

`value`: string - one of 'a4' | 'a3' | 'a2' | 'a1' | 'a0'

Page format value.

`width`: number

Page width in millimeters.

`height`: number

Page height in millimeters.

`padding`: number

Map padding in millimeters.

## controls

Configure the map controls

`name`: string

Label of the map control in the side menu.

`position`: string - one of 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | bottom-right'

Position of the control in the map.

`type`: string - one of 'geolocate' | 'navigation' | 'pitch' | 'scale' | 'search' | 'zoomlevel'

Type of the map control

`order`: number (optional)

Number for sorting map controls with the same _position_. A control with an lower _order_ is positioned above controls with higher _order_.

## basemaps

Configure the basemaps to be available under 'Stile' in the side menu.

`name`: string

Label for the basemap.

`imgUrl`: string

URL to the thumbnail for the basemap

`styling`: string

URL to the style file

`topPlusBg`: true | false

Include background WMS service (TopPlusOpen), defined by the parameter _topPlusURL_.

`topPlusBgBehind`: string (optional)

ID of style layer after which the service the WMS layer is to be inserted. Only necessary if _topPlusBG_ = _true_.

`useMetaData`: true | false

Use metadata file for layer grouping in the layer tree. If true, _metaDataURL_ must be defined. For more information on layer groups see [customize_layer_tree.md](customize_layer_tree.md).

`isBeta`: true | false

Add a _beta_ flag to the basemap thumbnail.
