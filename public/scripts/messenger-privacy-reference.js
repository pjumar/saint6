// Read only an existing reference, on request. This page makes no tracking calls.
document.querySelectorAll("[data-reference-language]").forEach((button) => {
  button.addEventListener("click", () => {
    const output = document.getElementById(
      button.getAttribute("aria-controls"),
    );
    if (!output) return;
    let ref;
    try {
      ref = JSON.parse(
        sessionStorage.getItem("saint6_messenger_referral") || "null",
      )?.ref;
    } catch {
      // A blocked or expired browser session can still use the email instructions.
    }
    const isVi = button.getAttribute("data-reference-language") === "vi";
    output.textContent =
      typeof ref === "string" && /^s6_[a-f0-9]{32}$/.test(ref)
        ? ref
        : isVi
          ? "Không tìm thấy mã trong phiên này. Bạn vẫn có thể gửi yêu cầu qua email."
          : "No reference was found in this session. You can still make your request by email.";
  });
});
