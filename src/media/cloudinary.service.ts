import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  uploadProductImage(file: Express.Multer.File) {
    return this.uploadImage(file, {
      folder: 'coffee-shop/products',
      transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
    });
  }

  uploadVoucherImage(file: Express.Multer.File) {
    return this.uploadImage(file, {
      folder: 'coffee-shop/vouchers',
      transformation: [{ width: 1600, height: 900, crop: 'limit' }],
    });
  }

  async deleteVoucherImage(publicId: string) {
    if (!publicId.startsWith('coffee-shop/vouchers/')) {
      throw new BadRequestException('Public ID của ảnh voucher không hợp lệ.');
    }
    this.ensureConfigured();
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true,
    });
  }

  private uploadImage(
    file: Express.Multer.File,
    options: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    if (!file) throw new BadRequestException('Vui lòng chọn ảnh.');
    this.ensureConfigured();

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto',
          ...options,
        },
        (error, result) => {
          if (error || !result) {
            reject(
              new InternalServerErrorException(
                'Không thể tải ảnh lên Cloudinary.',
              ),
            );
            return;
          }
          resolve(result);
        },
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  private ensureConfigured() {
    if (
      !this.configService.get<string>('CLOUDINARY_CLOUD_NAME') ||
      !this.configService.get<string>('CLOUDINARY_API_KEY') ||
      !this.configService.get<string>('CLOUDINARY_API_SECRET')
    ) {
      throw new InternalServerErrorException(
        'Cloudinary chưa được cấu hình trên máy chủ.',
      );
    }
  }
}
