import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class EnvValidation {
  @IsEnum(['development', 'production'])
  NODE_ENV!: 'development' | 'production';

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(65535)
  SERVER_PORT!: number;

  @IsString()
  @IsNotEmpty()
  SERVER_HOST!: string;

  @IsBoolean()
  SERVER_DEBUG_MODE!: boolean;

  @IsEnum(['postgres', 'sqlite'])
  DB_DRIVER!: 'postgres' | 'sqlite';

  @IsString()
  @IsNotEmpty()
  DB_HOST!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(65535)
  DB_PORT!: number;

  @IsString()
  @IsNotEmpty()
  DB_USERNAME!: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  DB_DATABASE!: string;

  @IsBoolean()
  DB_SYNCHRONIZE!: boolean;

  @IsBoolean()
  DB_DEBUG_MODE!: boolean;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET!: string;
}
