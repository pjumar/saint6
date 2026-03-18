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

    var alreadyStored = sessionStorage.getItem(STORAGE_KEY);

    // Only save if we found new params and nothing stored yet
    if (found && !alreadyStored) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
    }

    // Store landing page on first visit
    if (!sessionStorage.getItem("saint6_landing_page")) {
      sessionStorage.setItem("saint6_landing_page", location.pathname);
    }

    // Always log — helps debug whether params arrive or get stripped
    console.group("[UTM Tracking]");
    console.log("Full URL:", location.href);
    console.log("Search params:", location.search || "(empty)");
    console.log("Params found in URL:", found ? captured : "(none)");
    console.log("Stored in session:", alreadyStored ? JSON.parse(alreadyStored) : "(empty)");
    console.log("Landing page:", sessionStorage.getItem("saint6_landing_page"));
    console.groupEnd();
  } catch (e) {
    // Silently fail — don't break the page
  }
})();
