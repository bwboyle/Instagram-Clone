// import DbConfig from "./db.config";

// describe("DBConfig", () => {
//   // Disconnect after each test
//   afterEach(async () => {
//     await DbConfig.disconnect();
//   });

//   test("should connect to test database", async () => {
//     await DbConfig.connect("test");
//     expect(DbConfig.getDbName()).toEqual("test");
//   });

//   test("should connect to dev database", async () => {
//     await DbConfig.connect("dev");
//     expect(DbConfig.getDbName()).toEqual("dev");
//   });

//   test("should not connect if given invalid database name", async () => {
//     try {
//       await DbConfig.connect("");
//     } catch (error: any) {
//       expect(error).toBeInstanceOf(Error);
//       expect(error.message).toBe("Invalid database name");
//     }
//   });
// });
test.todo("mocked");
