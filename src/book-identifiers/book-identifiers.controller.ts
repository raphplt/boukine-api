import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookIdentifiersService } from './book-identifiers.service';
import { CreateBookIdentifierDto } from './dto/create-book-identifier.dto';
import { UpdateBookIdentifierDto } from './dto/update-book-identifier.dto';

@Controller('book-identifiers')
export class BookIdentifiersController {
  constructor(private readonly bookIdentifiersService: BookIdentifiersService) {}

  @Post()
  create(@Body() createBookIdentifierDto: CreateBookIdentifierDto) {
    return this.bookIdentifiersService.create(createBookIdentifierDto);
  }

  @Get()
  findAll() {
    return this.bookIdentifiersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookIdentifiersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookIdentifierDto: UpdateBookIdentifierDto) {
    return this.bookIdentifiersService.update(+id, updateBookIdentifierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookIdentifiersService.remove(+id);
  }
}
