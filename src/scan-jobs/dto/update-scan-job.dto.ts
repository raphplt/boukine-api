import { PartialType } from '@nestjs/mapped-types';
import { CreateScanJobDto } from './create-scan-job.dto';

export class UpdateScanJobDto extends PartialType(CreateScanJobDto) {}
