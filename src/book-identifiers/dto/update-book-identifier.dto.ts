import { PartialType } from '@nestjs/mapped-types';
import { CreateBookIdentifierDto } from './create-book-identifier.dto';

export class UpdateBookIdentifierDto extends PartialType(CreateBookIdentifierDto) {}
