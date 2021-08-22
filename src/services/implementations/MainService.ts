import axios from "axios";
import IMainService from "../interfaces/IMainService";
import config from "../../../config.json";
import amqp from "amqplib/callback_api";
import BasicError from "../../errors/BasicError";
import { subHours } from "date-fns";
import QueueData from "../../dtos/QueueData";
import { ITransaction } from "../../model/Transaction";
import TransactionRepo from "../../repository/implementations/TransactionRepo";
import SyncronizationRepo from "../../repository/implementations/SyncronizationRepo";
import { ISynchronization } from "../../model/Syncronization";
import fs from "fs";

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

    const shouldISendToQueue = await MainService.sendRequestForRandomStatement(
      token
    );
    if (shouldISendToQueue)
      MainService.sendToQueue(token, fetchingPeriodInHours);

    return token;
  }

  public static async sendAllScheduledRequests(
    dataFromQueue: QueueData
  ): Promise<boolean> {
    const dataToReturnToQueue: QueueData[] = [];

    const shouldIReturnThisToQueue = await MainService.sendRequestIfItsTime(
      dataFromQueue.lastFetchedDate,
      dataFromQueue.fetchingPeriodInHours,
      dataFromQueue.token
    );

    if (shouldIReturnThisToQueue) {
      MainService.sendToQueue(
        dataFromQueue.token,
        dataFromQueue.fetchingPeriodInHours
      );
    }

    return true;
  }

  private static async sendRequestIfItsTime(
    lastFetchedDate: Date,
    fetchingPeriodInHours: number,
    token: string
  ): Promise<boolean> {
    const timeSinceLastFetch =
      new Date().getTime() - new Date(lastFetchedDate).getTime();
    const hoursSinceLastFetch = new Date(timeSinceLastFetch).getHours();

    let res;
    if (hoursSinceLastFetch >= fetchingPeriodInHours) {
      res = await this.sendRequestForRandomStatement(token);
      return res;
    }

    return true;
  }

  private static async sendRequestForRandomStatement(
    token: string
  ): Promise<boolean> {
    const url: string = config.baseURL + config.getStatementURL;

    let transaction: ITransaction = {} as ITransaction;
    let syncronization: ISynchronization = {} as ISynchronization;
    try {
      const res = await axios.get(url, {
        headers: { authorization: `Bearer ${token}` },
      });

      transaction = res.data;
      syncronization.performedAt = new Date();
      syncronization.successful = true;

      TransactionRepo.create(transaction);
      SyncronizationRepo.create(syncronization);
    } catch (error) {
      const response = error.response;
      syncronization.performedAt = new Date();
      syncronization.successful = false;
      syncronization.errorMessage = error.message;

      SyncronizationRepo.create(syncronization);

      if (response.status === 409) return false;
      else if (response.status === 500) {
        const message = response.data.message;
        const errorMessageToWrite: string = `${message} at ${new Date()}\r\n`;
        this.writeToAFile(errorMessageToWrite);
      }
    }

    return true;
  }

  private static async writeToAFile(message: string): Promise<boolean> {
    fs.appendFile(config.errorFilePath, message, (err) => {
      if (err) throw err;

      console.log("File error.txt has been updated");
    });

    return true;
  }

  public async consumeFromQueue(): Promise<QueueData[]> {
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
            MainService.sendAllScheduledRequests(receivedObject);
          },
          { noAck: true }
        );
      });
    });

    return dataFromQueue;
  }

  public static sendToQueue(
    token: string,
    fetchingPeriodInHours: number
  ): boolean {
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
          fetchingPeriodInHours: fetchingPeriodInHours
            ? fetchingPeriodInHours
            : 1,
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
