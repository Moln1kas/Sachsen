import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway({ 
  cors: {
    origin: '*',
  },
})
export class BlogsGateway {
  @WebSocketServer()
  server: Server;

  async notifyBlogChanged(blog): Promise<void> {
    await this.server.emit('blogs:update', blog);
    console.log('Updated');
  }
}
