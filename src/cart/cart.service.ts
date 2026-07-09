import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartRepository } from './cart.repository';
import { AddCartItemDto } from './dto/add-cart-item.dto';

type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async getCart(customerId: string) {
    const cart = await this.cartRepository.findOrCreateCart(customerId);
    return this.formatCart(cart);
  }

  async addItem(customerId: string, dto: AddCartItemDto) {
    const product = await this.cartRepository.findAvailableProductById(
      dto.product_id,
    );

    if (!product) {
      throw new BadRequestException('Sản phẩm không tồn tại hoặc đã hết hàng.');
    }

    const cart = await this.cartRepository.findOrCreateCart(customerId);

    const existingItem = cart.items.find((item) => {
      return (
        item.product_id === dto.product_id &&
        this.stringifyOptions(item.options) ===
          this.stringifyOptions(dto.options)
      );
    });

    if (existingItem) {
      await this.cartRepository.updateCartItem(existingItem.id, {
        quantity: existingItem.quantity + dto.quantity,
      });
    } else {
      await this.cartRepository.createCartItem({
        cart_id: cart.id,
        product_id: dto.product_id,
        quantity: dto.quantity,
        options: dto.options,
      });
    }

    return this.getCart(customerId);
  }

  async clearCart(customerId: string) {
    const cart = await this.cartRepository.findOrCreateCart(customerId);

    await this.cartRepository.deleteCartItems(cart.id);

    return this.getCart(customerId);
  }
  async updateItem(customerId: string, itemId: string, dto: UpdateCartDto) {
    const item = await this.cartRepository.findCartItemByIdAndCustomerId(
      itemId,
      customerId,
    );
    if (!item) {
      throw new NotFoundException('Sản phẩm trong giỏ hàng không tồn tại');
    }
    await this.cartRepository.updateCartItem(itemId, {
      quantity: dto.quantity,
      options: dto.options,
    });
    return this.getCart(customerId);
  }

  async removeItem(customerId: string, itemId: string) {
    const item = await this.cartRepository.findCartItemByIdAndCustomerId(
      itemId,
      customerId,
    );
    if (!item) {
      throw new NotFoundException('Sản phẩm trong giỏ hàng không tồn tại');
    }
    await this.cartRepository.deleteCartItem(itemId);
    return this.getCart(customerId);
  }
  private formatCart(cart: CartWithItems) {
    const items = cart.items.map((item) => {
      const lineTotalVnd = item.product.price_vnd * item.quantity;

      return {
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        options: item.options,
        product: {
          id: item.product.id,
          name: item.product.name,
          subname: item.product.subname,
          price_vnd: item.product.price_vnd,
          image: item.product.image,
          status: item.product.status,
        },
        line_total_vnd: lineTotalVnd,
      };
    });

    const subtotalVnd = items.reduce((sum, item) => {
      return sum + item.line_total_vnd;
    }, 0);

    return {
      id: cart.id,
      customer_id: cart.customer_id,
      items,
      subtotal_vnd: subtotalVnd,
    };
  }

  private stringifyOptions(
    options?: Prisma.JsonValue | Record<string, string>,
  ) {
    if (options == null) {
      return '{}';
    }

    if (typeof options !== 'object' || Array.isArray(options)) {
      return JSON.stringify(options);
    }

    return JSON.stringify(options, Object.keys(options).sort());
  }
}
