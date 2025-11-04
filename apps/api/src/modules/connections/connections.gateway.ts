import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { ConnectionsService } from './connections.service';

@WebSocketGateway({ 
  cors: {
    origin: '*',
  },
})
export class ConnectionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly connectionsService: ConnectionsService,
  ) {}

  async handleConnection(client: any) {
    await this.connectionsService.connectionHandler(client);
  }

  async handleDisconnect(client: any) {
    await this.connectionsService.disconnectionHandler(client);
  }
}
