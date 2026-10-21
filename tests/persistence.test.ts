import { it, expect } from "vitest";
import {
  createPreferences,
  defaults,
  type PreferenceEnvironment,
} from "../src/settings";
function environment(
  url = "https://example.test/game?other=keep#anchor",
  cookies = "",
) {
  const jar = new Map(
    cookies
      .split(";")
      .filter(Boolean)
      .map((s) => {
        const i = s.indexOf("=");
        return [s.slice(0, i).trim(), s.slice(i + 1)];
      }),
  );
  const writes: string[] = [];
  const env: PreferenceEnvironment = {
    url: () => url,
    cookies: () => [...jar].map(([k, v]) => k + "=" + v).join("; "),
    writeCookie: (value) => {
      writes.push(value);
      const [pair] = value.split(";");
      const i = pair.indexOf("=");
      jar.set(pair.slice(0, i), pair.slice(i + 1));
    },
    replaceUrl: (value) => {
      url = value;
    },
  };
  return { env, writes, jar };
}
it("resolves each key URL then cookie then default and persists explicit defaults", () => {
  const e = environment(
    "https://example.test/?ghost=show&lock=delay",
    "tetris_ghost=hide;tetris_lock=failed;tetris_preview=off;tetris_hold=off",
  );
  const p = createPreferences(e.env);
  expect(p.values).toEqual({ ...defaults, preview: "off", hold: "off" });
  expect(e.jar.get("tetris_ghost")).toBe("show");
  expect(e.jar.get("tetris_lock")).toBe("delay");
  expect(e.jar.get("tetris_preview")).toBe("off");
  expect(e.writes).toHaveLength(2);
});
it("retains saved omitted values without writing defaults", () => {
  const e = environment(undefined, "tetris_ghost=dynamic;tetris_hardDrop=off");
  const p = createPreferences(e.env);
  expect(p.values.ghost).toBe("dynamic");
  expect(p.values.hardDrop).toBe("off");
  expect(e.writes).toHaveLength(0);
});
it("treats duplicate, empty and invalid URL values as absent; malformed cookies are safe", () => {
  const e = environment(
    "https://example.test/?ghost=show&ghost=hide&hardDrop=BAD&preview=&hold=ON",
    "tetris_ghost=dynamic;tetris_hardDrop=off;tetris_preview=off;tetris_hold=%E0%A4%A",
  );
  const p = createPreferences(e.env);
  expect(p.values).toEqual({
    ...defaults,
    ghost: "dynamic",
    hardDrop: "off",
    preview: "off",
  });
  expect(e.writes).toHaveLength(0);
});
it("saves one setting without changing other query/hash fields and uses secure cookie attributes", () => {
  const e = environment();
  const p = createPreferences(e.env);
  expect(p.save("ghost", "dynamic")).toBe(true);
  expect(p.values.ghost).toBe("dynamic");
  const u = new URL(e.env.url());
  expect(u.searchParams.get("other")).toBe("keep");
  expect(u.searchParams.get("ghost")).toBe("dynamic");
  expect(u.hash).toBe("#anchor");
  expect(e.writes[0]).toBe(
    "tetris_ghost=dynamic; Path=/; SameSite=Lax; Max-Age=31536000; Secure",
  );
  expect(p.warning).toBe(false);
});
it("canonicalizes duplicate query values after a user change", () => {
  const e = environment("http://localhost/?hold=off&hold=on&other=yes");
  const p = createPreferences(e.env);
  p.save("hold", "off");
  expect(new URL(e.env.url()).searchParams.getAll("hold")).toEqual(["off"]);
  expect(e.writes[0]).not.toContain("Secure");
  expect(p.save("ghost", "bad")).toBe(false);
});
it.each(["read", "write", "url", "silent"] as const)(
  "keeps memory usable when %s persistence fails",
  (kind) => {
    const e = environment();
    if (kind === "read")
      e.env.cookies = () => {
        throw Error("blocked");
      };
    if (kind === "write")
      e.env.writeCookie = () => {
        throw Error("blocked");
      };
    if (kind === "url")
      e.env.replaceUrl = () => {
        throw Error("blocked");
      };
    if (kind === "silent") e.env.writeCookie = () => {};
    const p = createPreferences(e.env);
    expect(p.save("ghost", "hide")).toBe(true);
    expect(p.values.ghost).toBe("hide");
    expect(p.warning).toBe(true);
  },
);
