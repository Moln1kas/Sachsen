import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateFriendRequestDto {
  @IsInt()
  @IsNotEmpty()
  friendId: number;
}
