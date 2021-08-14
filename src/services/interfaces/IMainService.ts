interface IMainService {
  sendToQueue(token: string, fetchingPeriodInHours: number): Promise<boolean>;
  updateMyFetchingPeriod(
    username: string,
    password: string,
    fetchingPeriodInHours: number
  ): Promise<string>;
}

export default IMainService;
