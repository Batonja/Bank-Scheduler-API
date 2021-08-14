import MainService from "../../src/services/implementations/MainService";

describe("login_test", () => {
  it("should return true", async () => {
    expect(
      await MainService.updateMyFetchingPeriod("mile", "passjenebitan", 3)
    ).toBeTruthy();
  });
});
