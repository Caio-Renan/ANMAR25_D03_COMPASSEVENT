import { IsBase64Image, IsEmail, IsName, IsPassword, IsPhoneNumber } from '@decorators/index';
import { Roles } from '@enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
export class CreateUserDto {
  @ApiProperty({ example: 'James Michael', type: String })
  @IsName()
  name!: string;

  @ApiProperty({ example: 'test@example.com', type: String })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'securePassword123', type: String })
  @IsPassword()
  password!: string;

  @ApiProperty({ example: '+5511999999999', type: String })
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty({ enum: [Roles.ORGANIZER, Roles.PARTICIPANT], example: Roles.PARTICIPANT })
  @IsEnum([Roles.ORGANIZER, Roles.PARTICIPANT], {
    message: `Role must be one of the following values: ${Roles.ORGANIZER}, ${Roles.PARTICIPANT}`,
  })
  role!: Roles;

  @ApiProperty({
    description: 'User profile image encoded in base64',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  })
  @IsBase64Image()
  profileImageBase64!: string;
}
