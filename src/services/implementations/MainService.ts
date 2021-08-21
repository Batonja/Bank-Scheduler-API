import axios from "axios";
import IMainService from "../interfaces/IMainService";
import config from "../../../config.json";
import amqp from "amqplib/callback_api";
import BasicError from "../../errors/BasicError";
import { subHours } from "date-fns";
import QueueData from "../../dtos/QueueData";

class MainService implements IMainService {
  public async updateMyFetchingPeriod(
    username: string,
    password: string,
    fetchingPeriodInHours: number
  ): Promise<string> {
    const url: string = config.baseURL + config.loginURL;

    const res = await axios.post(`${url}`, {
      username,
      password,
    });

    const token: string = res.data.token;

    this.sendToQueue(token, fetchingPeriodInHours);
    this.consumeFromQueue();

    return token;
  }

  public async sendAllScheduledRequests(): Promise<boolean> {
    const dataFromQueue: QueueData[] = await this.consumeFromQueue();

    for (const data of dataFromQueue) {
      const shouldISendRequest = this.sendRequestIfItsTime(
        data.lastFetchedDate,
        data.fetchingPeriodInHours,
        data.token
      );
    }
  }

  private async sendRequestForRandomStatement(token: string): Promise<boolean> {
    const url: string = config.baseURL + config.getStatementURL;
    const res = axios.get(url, {
      headers: { authorization: `Bearer ${token}` },
    });
  }

  private async sendRequestIfItsTime(
    lastFetchedDate: Date,
    fetchingPeriodInHours: number,
    token: string
  ): Promise<boolean> {
    const timeOfNextFetch = subHours(new Date(), fetchingPeriodInHours);
    let res;
    if (timeOfNextFetch <= lastFetchedDate) {
      res = await this.sendRequestForRandomStatement(token);
      return true;
    }

    return false;
  }

  private async consumeFromQueue(): Promise<QueueData[]> {
    const dataFromQueue: QueueData[] = [];
    amqp.connect("amqp://localhost", function (error, connection) {
      if (error) {
        throw error;
      }
      connection.createChannel(function (error, channel) {
        if (error) {
          throw error;
        }
        var queue = "theQueue";

        channel.assertQueue(queue, {
          durable: false,
        });

        channel.consume(
          queue,
          (data) => {
            const receivedObject = JSON.parse(
              data ? data.content.toString() : ""
            );

            dataFromQueue.push(receivedObject);
          },
          { noAck: true }
        );
      });
    });

    return dataFromQueue;
  }

  public async sendToQueue(
    token: string,
    fetchingPeriodInHours: number
  ): Promise<boolean> {
    amqp.connect("amqp://localhost", (error, connection) => {
      if (error) {
        const connectingError: BasicError = new BasicError(error.message, 500);
        throw connectingError;
      }

      connection.createChannel((error, channel) => {
        if (error) {
          const connectingError: BasicError = new BasicError(
            error.message,
            500
          );
          throw connectingError;
        }

        const queue = "theQueue";

        const data: QueueData = {
          token,
          fetchingPeriodInHours,
          lastFetchedDate: new Date(),
        };

        channel.assertQueue(queue, { durable: false });

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
      });
    });

    return true;
  }
}

export default new MainService();
