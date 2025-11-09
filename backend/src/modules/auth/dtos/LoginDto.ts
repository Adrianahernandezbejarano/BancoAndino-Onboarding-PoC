import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El email es inválido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email!: string;

  @IsString({ message: 'La contraseña debe ser un texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password!: string;

  @IsOptional()
  @IsBoolean({ message: 'El valor de recordar sesión debe ser booleano' })
  rememberMe?: boolean;
}
