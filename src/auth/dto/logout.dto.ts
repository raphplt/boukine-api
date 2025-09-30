import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class LogoutDto {
  @ApiProperty({ description: 'Device identifier for the session to revoke' })
  @IsString()
  @MaxLength(255)
  deviceId: string;
}
