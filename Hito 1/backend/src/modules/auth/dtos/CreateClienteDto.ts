import { IsBoolean, IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateClienteDto {
  @IsEmail({}, { message: 'El email es inválido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email!: string;

  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'La contraseña debe incluir al menos una mayúscula, una minúscula y un número',
  })
  password!: string;

  @IsString({ message: 'El teléfono debe ser un texto' })
  @Matches(/^\+57[0-9]{10}$/, {
    message: 'El teléfono debe tener el formato +57XXXXXXXXXX',
  })
  telefono!: string;

  @IsBoolean({ message: 'Debe aceptar los términos y condiciones' })
  @IsNotEmpty({ message: 'Debe aceptar los términos y condiciones' })
  termsAccepted!: boolean;
}
