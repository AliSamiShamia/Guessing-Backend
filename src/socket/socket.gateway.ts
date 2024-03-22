import { Injectable } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatsService } from 'src/chats/services/chats/chats.service';
import { RoundsService } from 'src/rounds/services/rounds/rounds.service';
import { AuthService } from 'src/users/services/auth.service';
import { UsersService } from 'src/users/services/users/users.service';

@WebSocketGateway(3002, {
  namespace: 'game-chat',
  transports: ['websocket'],
})
@Injectable()
export class SocketGateway {
  @WebSocketServer() server: Server;
  constructor(
    private readonly roundsService: RoundsService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly chatService: ChatsService,
  ) {}

  afterInit(server: Server) {
    console.log('Socket server initialized');
  }

  @SubscribeMessage('send-msg')
  async handleMessage(client: any, payload: any): Promise<void> {
    const { msg, token } = payload;
    const res = await this.authService.verifyToken(token);
    const user = await this.userService.findById(res.sub);
    if (user) {
      await this.chatService.create({ msg: msg, user: user });
    }
    const chats = await this.chatService.findAll();
    this.server.emit('chats', { chats: chats });
  }

  @SubscribeMessage('prev-chat')
  async PrevMessages(client: any, payload: any): Promise<void> {
    const chats = await this.chatService.findAll();
    this.server.emit('chats', { chats: chats });
  }

  @SubscribeMessage('round')
  async handleRound(client: any, payload: any): Promise<void> {
    const { user_id, points, multiplier, score, guess } = payload;
    const user = await this.userService.findById(user_id);
    if (user) {
      const listUser = await this.userService.findAllExpect(user.id);
      await this.roundsService.create({
        user: user,
        points: points,
        multiplier: multiplier,
        score: score,
        guess: guess,
      });
      listUser.map(async (item, key) => {
        const points = this.generateRandomValue(50, 300);
        const multiplier = this.generateRandomValue(1, 10);
        const score = this.calculateScore(points, multiplier, guess);
        await this.roundsService.create({
          user: item,
          points: points,
          multiplier: multiplier,
          score: score,
          guess: guess,
        });
      });
      if (user) {
        const rounds = await this.getResult();
        const newScore = await this.getScoresForUser(user.id);
        this.server.emit('rounds', {
          data: rounds,
          score: newScore > 0 ? newScore : 0,
        });
      }
    }
  }

  @SubscribeMessage('rounds')
  async previousRounds(client: any, payload: any): Promise<void> {
    const { user_id } = payload;
    const user = await this.userService.findById(user_id);
    if (user) {
      const rounds = await this.getResult();
      const newScore = await this.getScoresForUser(user.id);
      this.server.emit('rounds', {
        data: rounds,
        score: newScore > 0 ? newScore : 0,
      });
    }
  }

  async getResult() {
    return await this.roundsService.last4Records();
  }
  async getScoresForUser(userId: string): Promise<number> {
    const rounds = await this.roundsService.find(userId);
    let newScore = 0;
    rounds.forEach((round) => {
      newScore += round.score;
    });
    return newScore;
  }

  generateRandomValue = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  calculateScore = (
    points: number,
    multiplier: number,
    guess: number,
  ): number => {
    const actualScore = points * multiplier;
    return multiplier === guess
      ? actualScore
      : multiplier > guess
        ? 0
        : actualScore - points;
  };
}
