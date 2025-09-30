import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString, MaxLength } from 'class-validator';

export class RefreshDto {
  @ApiProperty({
    description: 'Refresh token obtained during login or rotation'
  })
  @IsJWT()
  refreshToken: string;

  @ApiProperty({ description: 'Device identifier bound to the session' })
  @IsString()
  @MaxLength(255)
  deviceId: string;
}
