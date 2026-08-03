import { SetMetadata } from '@nestjs/common';

export const BYPASS_KEY = 'bypass';

/**
 * Decorator @Bypass() - Bỏ qua tự động bọc ApiResponseDto.
 * Sử dụng cho các API trả về dữ liệu thô (stream file, Excel, HTML, SSE...).
 *
 * @example
 * @Get('export')
 * @Bypass()
 * async exportExcel(@Res() res: Response) { ... }
 */
export const Bypass = () => SetMetadata(BYPASS_KEY, true);
