interface IMainService {
  sendToQueue(): Promise<boolean>;
  login(username: string, password: string): Promise<string>;
}

export default IMainService;
