import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { ConnectionsService } from './connections.service';

@WebSocketGateway({ 
  cors: {
    origin: '*',
  },
})
export class ConnectionsGateway implements OnGatewayConnection, OnGatewayDisconnect/*, OnGatewayInit*/ {
  constructor(
    private readonly connectionsService: ConnectionsService,
  ) {}

  // async afterInit(server: any) {
  //   await this.connectionsService.registerMiddleware(server);
  // }

  async handleConnection(client: any) {
    await this.connectionsService.connectionHandler(client);
  }

  async handleDisconnect(client: any) {
    await this.connectionsService.disconnectionHandler(client);
  }
}
