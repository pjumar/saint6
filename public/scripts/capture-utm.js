(function () {
  try {
    var STORAGE_KEY = "saint6_utm_params";
    var PARAMS = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
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
      captured._landing = location.pathname;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
    }

    // Always log when params are present
    var stored = sessionStorage.getItem(STORAGE_KEY);
    if (found || stored) {
      console.group("[UTM Tracking]");
      console.log("URL:", location.href);
      if (found) console.log("Captured now:", captured);
      if (stored) console.log("Stored in session:", JSON.parse(stored));
      console.groupEnd();
    }
  } catch (e) {
    // Silently fail
  }
})();
