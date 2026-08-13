import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ComboService } from '@/modules/combo/application/services/combo.service';
import { CreateComboDto } from '@/modules/combo/presentation/dto/create-combo.dto';

@Controller('combos')
export class ComboController {
  constructor(private readonly comboService: ComboService) {}

  @Post()
  create(@Body() createComboDto: CreateComboDto) {
    return this.comboService.create(createComboDto);
  }

  @Get()
  findAll() {
    return this.comboService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comboService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.comboService.findBySlug(slug);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comboService.remove(id);
  }
}
