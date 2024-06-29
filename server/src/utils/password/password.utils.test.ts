import { hashPassword, validPassword } from "./password.utils";

describe("Password Utils", () => {
  let password = "password123";

  test("should correctly hash the provided password", async () => {
    const hashed = await hashPassword(password);
    expect(hashed).not.toEqual(password);
  });

  test("should return true if password matches", async () => {
    const hashed = await hashPassword(password);
    expect(await validPassword(hashed, password)).toBeTruthy();
  });

  test("should return false if password does not match", async () => {
    const hashed = await hashPassword(password);
    expect(await validPassword(hashed, "wrongpassword")).not.toBeTruthy();
  });
});
