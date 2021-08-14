import axios from "axios";
import IMainService from "../interfaces/IMainService";
import config from "../../../config.json";
import amqp from "amqplib/callback_api";
import BasicError from "../../errors/BasicError";

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

    const token: string = res.data;

    this.sendToQueue(token, fetchingPeriodInHours);
    this.consumeFromQueue();

    return token;
  }

  public async consumeFromQueue(): Promise<boolean> {
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
            console.log(`Received: ${data?.content.toString("base64")}`);
          },
          { noAck: true }
        );
      });
    });

    return true;
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

        const data = { token, fetchingPeriodInHours };

        channel.assertQueue(queue, { durable: false });

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(data), "base64"));
      });
    });

    return true;
  }
}

export default new MainService();
