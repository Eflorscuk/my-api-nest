import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let app: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = module.createNestApplication();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users = {
        data: {
          data: [{ id: 1 }, { id: 2 }],
        },
      };

      jest.spyOn(appService, 'getAllUsers').mockResolvedValue(users.data.data);

      const response = await request(app.getHttpServer())
        .get('/')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(users.data.data);
    });

    it('should throw a HttpException with HttpStatus.NOT_FOUND if users are not found', async () => {
      jest.spyOn(appService, 'getAllUsers').mockResolvedValue(null);

      await request(app.getHttpServer())
        .get('/')
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Users not found',
          error: 'Not Found',
        });
    });

    it('should throw a HttpException with HttpStatus.REQUEST_TIMEOUT if the request times out', async () => {
      jest.spyOn(appService, 'getAllUsers').mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(null);
          }, 11000); // definindo um atraso maior que o timeout (10 segundos) definido na configuração da solicitação HTTP
        });
      });

      await request(app.getHttpServer())
        .get('/')
        .expect(HttpStatus.REQUEST_TIMEOUT)
        .expect({
          statusCode: HttpStatus.REQUEST_TIMEOUT,
          message: 'Request timed out',
          error: 'Request Timeout',
        });
    });
  });
});
