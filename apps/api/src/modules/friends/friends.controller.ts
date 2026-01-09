import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateFriendRequestDto } from './dto/create-friend.dto';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('request')
  @UseGuards(JwtAuthGuard)
  sendRequest(@CurrentUser() reqUser: { sub: number }, @Body() dto: CreateFriendRequestDto) {
    return this.friendsService.sendRequest(reqUser.sub, dto);
  }

  @Post('accept')
  @UseGuards(JwtAuthGuard)
  accept(@CurrentUser() reqUser: { sub: number }, @Body() dto: CreateFriendRequestDto) {
    return this.friendsService.acceptRequest(reqUser.sub, dto);
  }

  @Post('reject')
  @UseGuards(JwtAuthGuard)
  reject(@CurrentUser() reqUser: { sub: number }, @Body() dto: CreateFriendRequestDto) {
    return this.friendsService.rejectRequest(reqUser.sub, dto);
  }

  @Delete('remove')
  @UseGuards(JwtAuthGuard)
  remove(@CurrentUser() reqUser: { sub: number }, @Body() dto: CreateFriendRequestDto) {
    return this.friendsService.removeFriend(reqUser.sub, dto);
  }

  @Get('requests')
  @UseGuards(JwtAuthGuard)
  getFriendsRequests(@CurrentUser() reqUser: { sub: number }) {
    return this.friendsService.getFriendsRequests(reqUser.sub);
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  getFriends(@Param('userId', ParseIntPipe) userId: number) {
    return this.friendsService.getFriends(userId);
  }
}
