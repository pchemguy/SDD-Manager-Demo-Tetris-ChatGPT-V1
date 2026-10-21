import { test, expect } from "@playwright/test";
test("keyboard play, pause, restart and visible canvas", async ({ page }) => {
  await page.goto("/");
  const board = page.getByRole("application", { name: "Tetris board" });
  await expect(board).toBeVisible();
  await board.focus();
  const raster = () => board.evaluate((e: HTMLCanvasElement) => e.toDataURL());
  const before = await raster();
  await page.keyboard.press("ArrowLeft");
  expect(await raster()).not.toBe(before);
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("status")).toHaveText("Paused");
  const paused = await raster();
  await page.waitForTimeout(1100);
  expect(await raster()).toBe(paused);
  await page.getByRole("button", { name: "Restart" }).click();
  await expect(page.getByTestId("status")).toHaveText("Playing");
  await expect(page.getByTestId("score")).toHaveText("0");
  await expect(board).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const colored = await board.evaluate((e: HTMLCanvasElement) => {
    const d = e.getContext("2d")!.getImageData(0, 0, e.width, e.height).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4)
      if (d[i] + d[i + 1] + d[i + 2] > 350) n++;
    return n;
  });
  expect(colored).toBeGreaterThan(1000);
  await page.screenshot({ path: test.info().outputPath("game.png") });
});
test("controls stay scoped and hidden-page handler pauses", async ({
  page,
}) => {
  await page.goto("/");
  const board = page.getByRole("application", { name: "Tetris board" });
  await page.getByRole("button", { name: "Pause", exact: true }).focus();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("status")).toHaveText("Playing");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.getByTestId("status")).toHaveText("Paused");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.getByTestId("status")).toHaveText("Paused");
  await board.focus();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("status")).toHaveText("Playing");
});
test("rotation ignores auto-repeat", async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0.5;
  });
  await page.goto("/");
  const board = page.getByRole("application", { name: "Tetris board" });
  await board.focus();
  const before = await board.evaluate((e: HTMLCanvasElement) => e.toDataURL());
  await board.dispatchEvent("keydown", { key: "ArrowUp", repeat: true });
  expect(await board.evaluate((e: HTMLCanvasElement) => e.toDataURL())).toBe(
    before,
  );
});
test("hold and hard drop are keyboard playable", async ({ page }) => {
  await page.goto("/");
  const board = page.getByRole("application", { name: "Tetris board" });
  await board.focus();
  await page.keyboard.press("c");
  await expect(page.getByTestId("held-name")).not.toHaveText("Empty");
  const held = await page.getByTestId("held-name").textContent();
  await page.keyboard.press("c");
  await expect(page.getByTestId("held-name")).toHaveText(held!);
  await page.keyboard.press("Enter");
  const bottom = await board.evaluate((e: HTMLCanvasElement) => {
    const d = e.getContext("2d")!.getImageData(0, 500, 300, 100).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4)
      if (d[i] + d[i + 1] + d[i + 2] > 350) n++;
    return n;
  });
  expect(bottom).toBeGreaterThan(1000);
});
test("six session controls apply live and retain form focus", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("combobox")).toHaveCount(6);
  await page.getByLabel("Next-piece preview").selectOption("off");
  await expect(page.getByLabel("Next piece", { exact: true })).toBeHidden();
  await page.getByLabel("Hold piece", { exact: true }).selectOption("off");
  await page.getByLabel("Hard drop", { exact: true }).selectOption("off");
  const board = page.getByRole("application", { name: "Tetris board" });
  await board.focus();
  await page.keyboard.press("c");
  await expect(page.getByTestId("held-name")).toHaveText("Empty");
  const before = await board.evaluate((e: HTMLCanvasElement) => e.toDataURL());
  await page.keyboard.press("Enter");
  expect(await board.evaluate((e: HTMLCanvasElement) => e.toDataURL())).toBe(
    before,
  );
  const ghost = page.getByLabel("Ghost visibility");
  await ghost.selectOption("hide");
  await ghost.focus();
  await page.keyboard.press("ArrowDown");
  await expect(ghost).toBeFocused();
  await expect(page.getByTestId("status")).toHaveText("Playing");
  await page.getByLabel("General locking policy").selectOption("failed");
  await page.getByLabel("Hard-drop locking policy").selectOption("immediate");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("URL defaults override cookies while omissions survive reload", async ({
  page,
  context,
}) => {
  await context.addCookies([
    { name: "tetris_ghost", value: "hide", url: "http://127.0.0.1:4173" },
    { name: "tetris_hold", value: "off", url: "http://127.0.0.1:4173" },
    { name: "tetris_lock", value: "failed", url: "http://127.0.0.1:4173" },
  ]);
  await page.goto("/?ghost=show&lock=delay&other=keep#anchor");
  await expect(page.getByLabel("Ghost visibility")).toHaveValue("show");
  await expect(page.getByLabel("Hold piece", { exact: true })).toHaveValue(
    "off",
  );
  await expect(page.getByLabel("General locking policy")).toHaveValue("delay");
  let cookies = Object.fromEntries(
    (await context.cookies()).map((c) => [c.name, c.value]),
  );
  expect(cookies.tetris_ghost).toBe("show");
  expect(cookies.tetris_lock).toBe("delay");
  await page.goto("/?other=keep#anchor");
  await expect(page.getByLabel("Hold piece", { exact: true })).toHaveValue(
    "off",
  );
  await expect(page.getByLabel("Ghost visibility")).toHaveValue("show");
  const selections = [
    ["Ghost visibility", "ghost", "dynamic"],
    ["Hard drop", "hardDrop", "off"],
    ["Next-piece preview", "preview", "off"],
    ["Hard-drop locking policy", "hardLock", "immediate"],
    ["General locking policy", "lock", "failed"],
    ["Hold piece", "hold", "on"],
  ];
  for (const [label, key, value] of selections) {
    await page.getByLabel(label, { exact: true }).selectOption(value);
    expect(new URL(page.url()).searchParams.get(key)).toBe(value);
  }
  expect(new URL(page.url()).searchParams.get("other")).toBe("keep");
  expect(new URL(page.url()).hash).toBe("#anchor");
  cookies = Object.fromEntries(
    (await context.cookies()).map((c) => [c.name, c.value]),
  );
  for (const [, key, value] of selections)
    expect(cookies["tetris_" + key]).toBe(value);
  await page.reload();
  for (const [label, , value] of selections)
    await expect(page.getByLabel(label, { exact: true })).toHaveValue(value);
});
test("invalid and duplicate URL settings fall back independently", async ({
  page,
  context,
}) => {
  await context.addCookies([
    { name: "tetris_ghost", value: "dynamic", url: "http://127.0.0.1:4173" },
    { name: "tetris_hardDrop", value: "off", url: "http://127.0.0.1:4173" },
    { name: "tetris_hold", value: "%E0%A4%A", url: "http://127.0.0.1:4173" },
  ]);
  await page.goto("/?ghost=hide&ghost=show&hardDrop=BAD&hold=");
  await expect(page.getByLabel("Ghost visibility")).toHaveValue("dynamic");
  await expect(page.getByLabel("Hard drop", { exact: true })).toHaveValue(
    "off",
  );
  await expect(page.getByLabel("Hold piece", { exact: true })).toHaveValue(
    "on",
  );
});
test("blocked cookies warn while in-memory controls and play work", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(document, "cookie", {
      configurable: true,
      get: () => "",
      set: () => {},
    }),
  );
  await page.goto("/?ghost=hide");
  await expect(page.getByRole("alert")).toContainText("could not be saved");
  await expect(page.getByLabel("Ghost visibility")).toHaveValue("hide");
  await page.getByLabel("Ghost visibility").selectOption("show");
  await expect(page.getByLabel("Ghost visibility")).toHaveValue("show");
  await page.getByRole("application", { name: "Tetris board" }).focus();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("status")).toHaveText("Paused");
});
test("ghost preference changes actual landing pixels", async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0.5;
  });
  await page.goto("/?ghost=show");
  const board = page.getByRole("application", { name: "Tetris board" });
  const outline = () =>
    board.evaluate((e: HTMLCanvasElement) => {
      const d = e.getContext("2d")!.getImageData(0, 500, 300, 100).data;
      let count = 0;
      for (let i = 0; i < d.length; i += 4)
        if (d[i] + d[i + 1] + d[i + 2] > 150) count++;
      return count;
    });
  expect(await outline()).toBeGreaterThan(50);
  await page.getByLabel("Ghost visibility").selectOption("hide");
  expect(await outline()).toBe(0);
  await page.getByLabel("Ghost visibility").selectOption("dynamic");
  expect(await outline()).toBeGreaterThan(50);
});
