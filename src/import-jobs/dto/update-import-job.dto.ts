import { PartialType } from '@nestjs/mapped-types';
import { CreateImportJobDto } from './create-import-job.dto';

export class UpdateImportJobDto extends PartialType(CreateImportJobDto) {}
