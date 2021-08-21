import BasicError from "../../src/errors/BasicError";
import MainService from "../../src/services/implementations/MainService";

describe("updateMyFetchingPeriod_successful_login", () => {
  it("should return true", async () => {
    expect(
      await MainService.updateMyFetchingPeriod("mile", "passjenebitan", 3)
    ).toBeTruthy();
  });
});

describe("updateMyFetchingPeriod_failed_login", () => {
  it("should return error", async () => {
    try {
      await MainService.updateMyFetchingPeriod("mile", "wrong", 2);
    } catch (error) {
      expect(error).toEqual(
        new BasicError("Request failed with status code 400", 400)
      );
    }
  });
});
