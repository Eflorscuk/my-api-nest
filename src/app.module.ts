import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

const user = 'evandroooff';
const password = 'Florscuk2021';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${user}:${password}@apicluster.5l8vbou.mongodb.net/?retryWrites=true&w=majority`,
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
