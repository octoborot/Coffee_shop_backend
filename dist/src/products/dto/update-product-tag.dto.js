"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductTagDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_product_tag_dto_1 = require("./create-product-tag.dto");
class UpdateProductTagDto extends (0, mapped_types_1.PartialType)(create_product_tag_dto_1.CreateProductTagDto) {
}
exports.UpdateProductTagDto = UpdateProductTagDto;
//# sourceMappingURL=update-product-tag.dto.js.map