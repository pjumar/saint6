(function () {
  try {
    var STORAGE_KEY = "saint6_utm_params";
    var PARAMS = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "gclid",
      "gad_source",
      "gad_campaignid",
      "gbraid",
    ];

    // Already captured from a previous page in this session
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    var search = new URLSearchParams(location.search);
    var captured = {};
    var found = false;

    for (var i = 0; i < PARAMS.length; i++) {
      var value = search.get(PARAMS[i]);
      if (value) {
        captured[PARAMS[i]] = value;
        found = true;
      }
    }

    if (found) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
    }

    // Store landing page on first visit
    if (!sessionStorage.getItem("saint6_landing_page")) {
      sessionStorage.setItem("saint6_landing_page", location.pathname);
    }

    // Always log UTM capture results to console
    var stored = sessionStorage.getItem(STORAGE_KEY);
    if (found || stored) {
      console.group("[UTM Tracking]");
      console.log("URL params:", location.search || "(none)");
      if (found) console.log("Captured now:", captured);
      if (stored) console.log("Stored in session:", JSON.parse(stored));
      console.log("Landing page:", sessionStorage.getItem("saint6_landing_page"));
      console.groupEnd();
    }
  } catch (e) {
    // Silently fail — don't break the page
  }
})();
