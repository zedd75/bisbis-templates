import { it, expect } from "vitest";
import { appliquerInfos } from "./infos.js";

it.each(["javascript:alert(1)", "data:text/html,test", "/reservation", "//example.com", "https://user:pass@example.com", "https://exa\nmple.com"])("écarte le lien dangereux %s", (reservation_url) => {
  expect(appliquerInfos({ infos: {} }, { reservation_url }).reservationUrl).toBe("");
});
it.each(["https://example.com/book?date=1", "http://example.com/book", ""])("préserve un lien utilisable ou le retrait : %s", (reservation_url) => {
  expect(appliquerInfos({ infos: {} }, { reservation_url }).reservationUrl).toBe(reservation_url);
});
