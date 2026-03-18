(function () {
  try {
    // Read UTM params from server-set cookie (middleware captures them at the edge)
    var match = document.cookie.match(/(?:^|; )saint6_utm_params=([^;]*)/);
    var params = match ? JSON.parse(decodeURIComponent(match[1])) : null;

    // Also check URL as fallback (works when browser doesn't strip params)
    var PARAMS = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","gclid","gad_source","gad_campaignid","gbraid","s6clid","s6cid"];
    var search = new URLSearchParams(location.search);
    var urlParams = {};
    var foundInUrl = false;
    for (var i = 0; i < PARAMS.length; i++) {
      var v = search.get(PARAMS[i]);
      if (v) { urlParams[PARAMS[i]] = v; foundInUrl = true; }
    }

    console.group("[UTM Tracking]");
    console.log("URL:", location.href);
    console.log("Params in URL:", foundInUrl ? urlParams : "(none)");
    console.log("Params in cookie:", params || "(none)");
    console.log("Source:", params && params.gclid ? "google_ads" : params && params.utm_source ? params.utm_source : "organic");
    console.groupEnd();
  } catch (e) {
    // Silently fail
  }
})();
