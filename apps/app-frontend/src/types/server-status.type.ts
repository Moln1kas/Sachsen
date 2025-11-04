export default interface ServerStatus {
  online: boolean;
  players: {
    online: number;
    max: number;
  }
}