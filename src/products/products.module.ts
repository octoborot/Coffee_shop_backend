import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { CloudinaryService } from './cloudinary.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, CloudinaryService],
})
export class ProductsModule {}
