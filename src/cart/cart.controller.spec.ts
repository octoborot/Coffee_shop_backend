import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

const customerId = 'customer-id';
const cartResponse = {
  id: 'cart-id',
  customer_id: customerId,
  items: [],
  subtotal_vnd: 0,
};

describe('CartController', () => {
  let app: INestApplication<App>;
  const cartService = {
    getCart: jest.fn(),
    addItem: jest.fn(),
    updateItem: jest.fn(),
    removeItem: jest.fn(),
    clearCart: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    cartService.getCart.mockResolvedValue(cartResponse);
    cartService.addItem.mockResolvedValue(cartResponse);
    cartService.updateItem.mockResolvedValue(cartResponse);
    cartService.removeItem.mockResolvedValue(cartResponse);
    cartService.clearCart.mockResolvedValue(cartResponse);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: cartService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest<{
            user: { id: string };
          }>();
          req.user = { id: customerId };
          return true;
        },
      })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/v1/customer/cart returns current customer cart', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/customer/cart')
      .expect(200)
      .expect(cartResponse);

    expect(cartService.getCart).toHaveBeenCalledWith(customerId);
  });

  it('POST /api/v1/customer/cart/items adds an item to cart', async () => {
    const body = {
      product_id: 'product-id',
      quantity: 2,
      options: { size: 'M', sweetness: '50%', ice: '100%' },
    };

    await request(app.getHttpServer())
      .post('/api/v1/customer/cart/items')
      .send(body)
      .expect(201)
      .expect(cartResponse);

    expect(cartService.addItem).toHaveBeenCalledWith(customerId, body);
  });

  it('PATCH /api/v1/customer/cart/items/:id updates an item in cart', async () => {
    const body = {
      quantity: 3,
      options: { size: 'L', sweetness: '30%', ice: '50%' },
    };

    await request(app.getHttpServer())
      .patch('/api/v1/customer/cart/items/cart-item-id')
      .send(body)
      .expect(200)
      .expect(cartResponse);

    expect(cartService.updateItem).toHaveBeenCalledWith(
      customerId,
      'cart-item-id',
      body,
    );
  });

  it('DELETE /api/v1/customer/cart/items/:id removes an item from cart', async () => {
    await request(app.getHttpServer())
      .delete('/api/v1/customer/cart/items/cart-item-id')
      .expect(200)
      .expect(cartResponse);

    expect(cartService.removeItem).toHaveBeenCalledWith(
      customerId,
      'cart-item-id',
    );
  });

  it('DELETE /api/v1/customer/cart clears current customer cart', async () => {
    await request(app.getHttpServer())
      .delete('/api/v1/customer/cart')
      .expect(200)
      .expect(cartResponse);

    expect(cartService.clearCart).toHaveBeenCalledWith(customerId);
  });
});
