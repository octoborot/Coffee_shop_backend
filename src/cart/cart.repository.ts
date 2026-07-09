import { Injectable } from '@nestjs/common';
import { ProductStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  findCartByCustomerId(customerId: string) {
    return this.prisma.cart.findUnique({
      where: { customer_id: customerId },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: {
            created_at: 'asc',
          },
        },
      },
    });
  }
  createCart(customerId: string) {
    return this.prisma.cart.create({
      data: {
        customer_id: customerId,
      },
    });
  }

  // create cart if not exists
  async findOrCreateCart(customerId: string) {
    const cart = await this.findCartByCustomerId(customerId);

    if (cart) {
      return cart;
    }

    await this.createCart(customerId);

    const createdCart = await this.findCartByCustomerId(customerId);

    if (!createdCart) {
      throw new Error('Không thể tạo giỏ hàng.');
    }

    return createdCart;
  }

  // search product
  findProductById(productId: string) {
    return this.prisma.product.findUnique({
      where: { id: productId },
    });
  }

  //search product available
  findAvailableProductById(productId: string) {
    return this.prisma.product.findFirst({
      where: {
        id: productId,
        status: ProductStatus.Available,
      },
    });
  }

  // create quatity cart_item
  createCartItem(data: {
    cart_id: string;
    product_id: string;
    quantity: number;
    options?: Record<string, string>;
  }) {
    return this.prisma.cartItem.create({
      data,
    });
  }

  // update quatity cart_item
  updateCartItem(
    itemId: string,
    data: {
      quantity?: number;
      options?: Record<string, string>;
    },
  ) {
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data,
    });
  }

  // delete cart_item
  deleteCartItem(itemId: string) {
    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  // delete all cart_items
  deleteCartItems(cartId: string) {
    return this.prisma.cartItem.deleteMany({
      where: {
        cart_id: cartId,
      },
    });
  }

  // find cart_item by id and customer_id
  findCartItemByIdAndCustomerId(itemId: string, customerId: string) {
    return this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          customer_id: customerId,
        },
      },
      include: {
        product: true,
      },
    });
  }
}
