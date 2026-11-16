export const environment = {
  production: true,
  name: 'basemap.de',
  bkgAppId: '',
  logo: 'assets/basemap-logo-text.svg',
  logo_small: 'assets/basemap-logo-text.svg',
  logoHeight: 35,
  printLogo: 'assets/logo.png',
  footerLogo1: '',
  footerLogo2: '',
  topPlusURL: 'https://sgx.geodatenzentrum.de/wms_topplus_open?bbox={bbox-epsg-3857}&service=WMS&version=1.1.0&request=GetMap&layers=web_light_grau&styles=&srs=EPSG:3857&width=256&height=256&format=image/png&transparent=true',
  metaDataURL: '',
  config: {
    styleID: 0,
    pitch: 0,
    bearing: 0,
    zoom: 6,
    lat: 51.16,
    lon: 10.45,
    saturation: 0,
    brightness: 0,
    hiddenControls: ['zoomlevel'],
    hiddenLayers: [],
    changedLayers: [],
    hiddenSubGroups: [],
    changedSubGroups: [],
    externalStyleURL: ''
  },
  dpis: [96, 100, 200, 300, 400, 500, 508, 600],
  printFormats: [
    {
      name: 'DIN A4',
      value: 'a4',
      width: 210,
      height: 297
    },
    {
      name: 'DIN A3',
      value: 'a3',
      width: 297,
      height: 420
    },
    {
      name: 'DIN A2',
      value: 'a2',
      width: 420,
      height: 594
    },
    {
      name: 'DIN A1',
      value: 'a1',
      width: 594,
      height: 841
    },
    {
      name: 'DIN A0',
      value: 'a0',
      width: 841,
      height: 1189
    }
  ],
  controls: [
    {
      name: 'Navigation',
      position: 'top-left',
      type: 'navigation',
      order: 1
    },
    {
      name: 'Standort',
      position: 'top-left',
      type: 'geolocate',
      order: 2
    },
    {
      name: 'Neigung',
      position: 'top-left',
      type: 'pitch',
      order: 3
    },
    {
      name: 'Suche',
      position: 'top-right',
      type: 'search'
    },
    {
      name: 'Maßstabsleiste',
      position: 'bottom-left',
      type: 'scale',
    },
    {
      name: 'Zoomlevel',
      position: 'bottom-right',
      type: 'zoomlevel'
    }
  ],
  basemaps: [
    {
      name: 'Relief',
      imgUrl: 'assets/basemap_hillshade.png',
      styling: 'https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/styles/bm_web_top.json',
      topPlusBg: true,
      topPlusBgBehind: 'Hintergrund',
      useMetaData: false,
      isBeta: false
    },
    {
      name: 'Welt',
      imgUrl: 'assets/basemap_colour.png',
      styling: 'https://sgx.geodatenzentrum.de/gdz_basemapworld_vektor/styles/bm_web_wld_col.json',
      topPlusBg: false,
      topPlusBgBehind: '',
      useMetaData: false,
      isBeta: false
    },
    {
      name: 'Farbe',
      imgUrl: 'assets/basemap_colour.png',
      styling: 'https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/styles/bm_web_col.json',
      topPlusBg: true,
      topPlusBgBehind: 'Hintergrund',
      useMetaData: false,
      isBeta: false
    },
    {
      name: 'Grau',
      imgUrl: 'assets/basemap_greyscale.png',
      styling: 'https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/styles/bm_web_gry.json',
      topPlusBg: true,
      topPlusBgBehind: 'Hintergrund',
      useMetaData: false,
      isBeta: false
    },
    {
      name: 'Nacht',
      imgUrl: 'assets/basemap_night.png',
      styling: 'https://basemap.de/data/produkte/web_vektor/styles/bm_web_drk.json',
      topPlusBg: true,
      topPlusBgBehind: 'Hintergrund',
      useMetaData: false,
      isBeta: true
    },
    {
      name: 'Binär',
      imgUrl: 'assets/basemap_bw.png',
      styling: 'https://basemap.de/data/produkte/web_vektor/styles/bm_web_bin.json',
      topPlusBg: true,
      topPlusBgBehind: 'Hintergrund',
      useMetaData: false,
      isBeta: true
    }
  ],
  imprint: ''
};
