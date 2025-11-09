import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendVerificationDto {
  @IsEmail({}, { message: 'El email es inválido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email!: string;
}
