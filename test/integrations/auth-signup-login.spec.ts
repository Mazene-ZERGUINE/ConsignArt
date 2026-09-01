import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { createDtoValidationPipe } from '../../src/core/pipes/dto-validation-options.pipe';
import { GlobalExceptionsHandlerFilter } from '../../src/core/filter/global-exception-handler.filter';
import { ApiResponseTransformationInterceptor } from '../../src/core/interceptors/api-response-transformation.interceptor';

describe('Auth (integration): signup -> login -> me', () => {
  let app: INestApplication;
  let server: unknown;
  let accessToken: string;

  const email = `collector.${Date.now()}@consignart.test`;
  const password = 'StrongPassword123!';

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1/');
    app.useGlobalPipes(createDtoValidationPipe());
    app.useGlobalFilters(new GlobalExceptionsHandlerFilter());
    app.useGlobalInterceptors(new ApiResponseTransformationInterceptor());
    await app.init();
    server = app.getHttpServer();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/signup creates a new collector account (201)', async () => {
    const res = await request(server)
      .post('/api/v1/auth/signup')
      .send({ email, password, userRole: 'collector' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('POST /auth/signup rejects a duplicate email (409, formatted error envelope)', async () => {
    const res = await request(server)
      .post('/api/v1/auth/signup')
      .send({ email, password, userRole: 'collector' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('already exists');
  });

  it('POST /auth/signup blocks public self-registration as admin (business rule)', async () => {
    const res = await request(server)
      .post('/api/v1/auth/signup')
      .send({ email: `blocked.${Date.now()}@consignart.test`, password, userRole: 'admin' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /auth/signup rejects a malformed payload via the global ValidationPipe (400)', async () => {
    const res = await request(server)
      .post('/api/v1/auth/signup')
      .send({ email: 'not-an-email', password: 'short', userRole: 'collector' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.extras).toBeDefined();
  });

  it('POST /auth/login rejects a wrong password (401)', async () => {
    const res = await request(server)
      .post('/api/v1/auth/login')
      .send({ email, password: 'WrongPassword123!', userRole: 'collector' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /auth/login authenticates with the right credentials and returns JWT tokens (200)', async () => {
    const res = await request(server)
      .post('/api/v1/auth/login')
      .send({ email, password, userRole: 'collector' });

    expect(res.status).toBe(200);
    expect(res.body.data.token.accessToken).toEqual(expect.any(String));
    expect(res.body.data.token.refreshToken).toEqual(expect.any(String));
    expect(res.body.data.user.email).toBe(email);

    accessToken = res.body.data.token.accessToken as string;
  });

  it('GET /auth/me returns the authenticated profile for a valid bearer token (200)', async () => {
    const res = await request(server)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(email);
  });

  it('GET /auth/me rejects a request without a bearer token (401)', async () => {
    const res = await request(server).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });
});
