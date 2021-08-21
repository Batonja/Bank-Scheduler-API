interface IMainService {
  updateMyFetchingPeriod(
    username: string,
    password: string,
    fetchingPeriodInHours: number
  ): Promise<string>;
}

export default IMainService;
