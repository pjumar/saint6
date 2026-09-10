(() => {
  try {
    const STORAGE_KEY = "saint6_utm_params";
    const PARAMS = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "gclid",
      "dclid",
      "gbraid",
      "wbraid",
      "gad_source",
      "gad_campaignid",
    ];

    const search = new URLSearchParams(location.search);
    let stored = sessionStorage.getItem(STORAGE_KEY);
    const captured = stored ? JSON.parse(stored) : {};
    let found = false;

    for (let i = 0; i < PARAMS.length; i++) {
      const value = search.get(PARAMS[i]);
      if (value) {
        captured[PARAMS[i]] = value;
        found = true;
      }
    }

    if (found) {
      if (!captured._landing) captured._landing = location.pathname;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
    }

    // Always log when params are present
    stored = sessionStorage.getItem(STORAGE_KEY);
    if (found || stored) {
      console.group("[UTM Tracking]");
      console.log("URL:", location.href);
      if (found) console.log("Captured now:", captured);
      if (stored) console.log("Stored in session:", JSON.parse(stored));
      console.groupEnd();
    }
  } catch {
    // Silently fail
  }
})();
