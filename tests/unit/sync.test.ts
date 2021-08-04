import MainService from "../../src/services/implementations/MainService";

describe("login_test", () => {
  it("should return true", async () => {
    expect(await MainService.login("mile", "passjenebitan")).toBeTruthy();
  });
});
