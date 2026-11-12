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
    // A newly tagged arrival is one acquisition touch. Never combine an old
    // Google click ID with a new Facebook/referral campaign.
    const captured = {};
    let found = false;

    for (let i = 0; i < PARAMS.length; i++) {
      const value = search.get(PARAMS[i]);
      if (value) {
        captured[PARAMS[i]] = value;
        found = true;
      }
    }

    if (found) {
      captured._landing = location.pathname;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
    }
  } catch {
    // Silently fail
  }
})();
