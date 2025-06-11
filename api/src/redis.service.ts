import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class RedisService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: 'redis',
        port: 6379,
      },
    });
  }

 public publishMessage(eventName: string, {
      id,
      body,
    }: { id: string, body: any }): void {
    const pattern = eventName;
    const data = { id, body };
    this.client.emit(pattern, data);
  }
}
