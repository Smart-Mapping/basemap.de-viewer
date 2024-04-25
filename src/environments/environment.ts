export let environment = {
  production: true,
  name: 'basemap.de',
  bkgAppId: '',
  logo: 'assets/basemap-logo-text.svg',
  logo_small: 'assets/basemap-logo-text.svg',
  logoHeight: 35,
  printLogo: 'assets/logo.png',
  printAttribution: '© 2024 basemap.de / BKG | Datenquellen: © GeoBasis-DE',
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
      styling: 'https://dev.adv-smart.de/styles/dev/bm_web_top.json',
      topPlusBg: true,
      topPlusBgBehind: 'Hintergrund',
      useMetaData: false,
      isBeta: true
    },
    {
      name: 'Farbe',
      imgUrl: 'assets/basemap_colour.png',
      styling: 'https://dev.adv-smart.de/styles/dev/bm_web_col.json',
      topPlusBg: true,
      topPlusBgBehind: 'Hintergrund',
      useMetaData: false,
      isBeta: true
    },
    {
      name: 'Grau',
      imgUrl: 'assets/basemap_greyscale.png',
      styling: 'https://dev.adv-smart.de/styles/dev/bm_web_gry.json',
      topPlusBg: true,
      topPlusBgBehind: 'Hintergrund',
      useMetaData: false,
      isBeta: true
    },
    {
      name: 'Nacht',
      imgUrl: 'assets/basemap_night.png',
      styling: 'https://dev.adv-smart.de/styles/dev/bm_web_drk.json',
      topPlusBg: true,
      topPlusBgBehind: 'Hintergrund',
      useMetaData: false,
      isBeta: true
    },
    {
      name: 'Binär',
      imgUrl: 'assets/basemap_bw.png',
      styling: 'https://dev.adv-smart.de/styles/dev/bm_web_bin.json',
      topPlusBg: true,
      topPlusBgBehind: 'Hintergrund',
      useMetaData: false,
      isBeta: true
    },
    {
      name: 'P10',
      imgUrl: 'assets/basemap_print.png',
      styling: 'https://dev.adv-smart.de/styles/dev/bm_print_col.json',
      topPlusBg: true,
      topPlusBgBehind: 'Hintergrund_FF',
      useMetaData: false,
      isBeta: true
    },
    {
      name: 'P10 (2)',
      imgUrl: 'assets/basemap_print.png',
      styling: 'https://dev.adv-smart.de/styles/dev/bm_print_col_mit_Schummerung.json',
      topPlusBg: true,
      topPlusBgBehind: 'Hintergrund_FF',
      useMetaData: false,
      isBeta: true
    },
    {
      name: 'P10 Grau',
      imgUrl: 'assets/basemap_print_gry.png',
      styling: 'https://dev.adv-smart.de/styles/dev/bm_print_gry.json',
      topPlusBg: true,
      topPlusBgBehind: 'Hintergrund_FF',
      useMetaData: false,
      isBeta: true
    },    
    {
      name: 'P50',
      imgUrl: 'assets/basemap_print.png',
      styling: 'https://dev.adv-smart.de/styles/dev/bm_print_col_P50_BW.json',
      topPlusBg: true,
      topPlusBgBehind: 'Hintergrund_FF',
      useMetaData: false,
      isBeta: true
    },    
    {
      name: 'Pxx',
      imgUrl: 'assets/basemap_print.png',
      styling: 'https://dev.adv-smart.de/styles/dev/bm_print_col_Pxx.json',
      topPlusBg: true,
      topPlusBgBehind: 'Hintergrund_FF',
      useMetaData: false,
      isBeta: true
    }
  ],
  imprint: `
  <h2>Datenschutzerklärung</h2>
  <p> Sie erhalten als Nutzer unserer Internetseite in dieser Datenschutzerklärung alle notwendigen Informationen
      darüber, wie, in welchem Umfang sowie zu welchem Zweck wir oder Drittanbieter Daten von Ihnen erheben und diese
      verwenden. Die Erhebung und Nutzung Ihrer Daten erfolgt nach den Vorgaben des Bundesdatenschutzgesetzes (BDSG)
      und des Telemediengesetzes (TMG).</p>
  <h3>Auskunft, Löschung, Sperrung</h3>
  <p> Sie erhalten jederzeit unentgeltlich Auskunft über die von uns gespeicherten personenbezogenen Daten zu Ihrer
      Person sowie zur Herkunft, dem Empfänger und dem Zweck von Datenerhebung sowie Datenverarbeitung. Außerdem haben
      Sie das Recht, die Berichtigung, die Sperrung oder Löschung Ihrer Daten zu verlangen. Ausgenommen davon sind
      Daten, die aufgrund gesetzlicher Vorschriften aufbewahrt oder zur ordnungsgemäßen Geschäftsabwicklung benötigt
      werden. Werden Daten nicht von einer gesetzlichen Archivierungspflicht erfasst, löschen wir Ihre Daten auf Ihren
      Wunsch. Greift die Archivierungspflicht, sperren wir Ihre Daten. Für alle Fragen und Anliegen zur Berichtigung,
      Sperrung oder Löschung von personenbezogenen Daten wenden Sie sich bitte an unseren Datenschutzbeauftragten
      unter den Kontaktdaten in dieser Datenschutzerklärung bzw. an die im Impressum genannte Adresse.</p>
  <h3>Server Logfiles</h3>
  <p> Bei den Server Logfiles handelt es sich um anonymisierte Daten, die bei Ihrem Zugriff auf unsere Webseite
      erfasst werden. Diese Informationen ermöglichen keine Rückschlüsse auf Sie persönlich, sind aber aus technischen
      Gründen für die Auslieferung und Darstellung unserer Inhalte unverzichtbar. Weiterhin dienen Sie unserer
      Statistik und der ständigen Optimierung unserer Inhalte. Typische Logfiles sind das Datum und die Zeit des
      Zugriffs, die Datenmenge, der für den Zugriff benutzte Browser und seine Version, das eingesetzte
      Betriebssystem, der Domainname des von Ihnen beauftragten Providers, ggf. die Seite, von der Sie zu unserem
      Angebot gekommen sind (Referrer-URL) und die IP-Adresse über die Ihr Zugriff erfolgt ist.</p>
  <h3>Cookies</h3>
  <p>Diese Seiten verwenden keine Cookies.</p>
  <h3>Haftungshinweis</h3>
  <p> Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den
      Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.</p>
  <p>Inhaltlich Verantwortlicher gemäß § 55 Abs. 2 RStV:</p>
  <p>
      <b>Arbeitsgemeinschaft der Vermessungsverwaltungen der Länder der Bundesrepublik Deutschland (AdV)</b><br>
      basemap.de: Dr. Markus Seifert<br>
      c/o Landesamt für Digitalisierung, Breitband und Vermessung
  </p>
  <p>
      Alexandrastraße 4<br>
      D-80538 München
  </p>
  <p>Telefon: +49 (0) 89 2129-1900</p>
  <p>
      <b>Inhaltlich verantwortlich:</b> Dr. Markus Seifert
  </p>
  <p>Diese Datenschutzerklärung wurde mit www.datenschutzexperte.de erstellt und angepasst.</p>
  `
};
