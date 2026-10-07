import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  BusinessStructuredData,
  businessId,
  businessStructuredData,
  hourlyVndPrice,
  serviceStructuredData,
} from "../app/lib/business-seo";

test("business identity uses the published venue and contact details across languages", () => {
  for (const locale of ["en", "vi"] as const) {
    const graph = businessStructuredData({
      locale,
      seo: {
        id: 1,
        site_name: "Saint 6 Studios",
        default_title: "Title",
        description: "Description",
      },
      footer: {
        id: 1,
        address: "Registered office must not override venue",
        phone: "0919 403 784 - 0366 668 391",
      },
      contact: {
        address_line_1: "6 Bế Văn Cấm, Tân Hưng",
        address_line_2: "TP.HCM",
        email: "studio@example.com",
      },
      social: {
        id: 1,
        facebook_url: "https://www.facebook.com/saint6studios/",
      },
    });
    assert.ok(graph);
    const business = (graph["@graph"] as Record<string, unknown>[])[0];
    assert.equal(business["@id"], businessId);
    assert.equal(business.url, `https://www.saint6.studio/${locale}`);
    assert.deepEqual(business.telephone, ["+84919403784", "+84366668391"]);
    assert.deepEqual(business.address, {
      "@type": "PostalAddress",
      streetAddress: "6 Bế Văn Cấm, Tân Hưng",
      addressLocality: "TP.HCM",
      addressCountry: "VN",
    });
    assert.ok(!JSON.stringify(graph).includes("Registered office"));
    assert.ok(!("aggregateRating" in business));
    assert.ok(!("openingHours" in business));
  }
  assert.equal(
    businessStructuredData({
      locale: "en",
      seo: null,
      footer: null,
      social: null,
    }),
    null,
  );
});

test("hourly prices reject ambiguous copy instead of publishing invented offers", () => {
  for (const price of ["400,000", "400.000", "400 000", "400000"]) {
    assert.equal(hourlyVndPrice(price), 400000);
  }
  for (const price of [
    "",
    "From 400,000",
    "400,000–800,000",
    "TBC",
    "400,000 VND/hour",
    "-400000",
    "0",
    "400.50",
    "9007199254740992",
  ]) {
    assert.equal(hourlyVndPrice(price), null, price);
  }
});

test("rental offers preserve hourly units and distinguish full venue from a continuous room", () => {
  const graph = serviceStructuredData({
    locale: "vi",
    path: "studio-rental",
    name: "Studio rental",
    description: "Visible introduction",
    currency: "VND",
    rentalOffers: [
      {
        key: "125",
        name: "125 m² booking",
        pricePerHour: "400,000",
        anchor: "rooms",
      },
      {
        key: "full-venue",
        name: "Full venue",
        description: "Exclusive use across multiple shooting zones",
        pricePerHour: "2,500,000",
        anchor: "full-studio",
      },
      {
        key: "unknown",
        name: "Unconfirmed rate",
        pricePerHour: "TBC",
        anchor: "rooms",
      },
    ],
  });
  const service = (graph["@graph"] as Record<string, unknown>[])[0];
  assert.deepEqual(service.provider, { "@id": businessId });
  const offers = service.offers as Record<string, unknown>[];
  assert.equal(offers.length, 2);
  assert.deepEqual(offers[0].priceSpecification, {
    "@type": "UnitPriceSpecification",
    price: 400000,
    priceCurrency: "VND",
    referenceQuantity: {
      "@type": "QuantitativeValue",
      value: 1,
      unitCode: "HUR",
    },
  });
  assert.equal(
    offers[1].url,
    "https://www.saint6.studio/vi/studio-rental#full-studio",
  );
  assert.ok(!JSON.stringify(graph).includes("floorSize"));
  const production = serviceStructuredData({
    locale: "en",
    path: "production",
    name: "Production",
    description: "Visible copy",
  });
  assert.ok(
    !("offers" in (production["@graph"] as Record<string, unknown>[])[0]),
  );
});

test("CMS copy cannot escape the structured-data script", () => {
  const copy = '</script><script>alert("injected")</script>';
  const html = renderToStaticMarkup(
    createElement(BusinessStructuredData, { value: { name: copy } }),
  );
  assert.equal((html.match(/<script/g) || []).length, 1);
  const serialized = html.match(/>(.*)<\/script>/)?.[1];
  assert.ok(serialized);
  assert.deepEqual(JSON.parse(serialized), { name: copy });
  assert.ok(!serialized.includes("<"));
});
