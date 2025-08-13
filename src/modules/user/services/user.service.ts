import { S3Service } from '@aws/s3.service';
import { Status } from '@enums/status.enum';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '@user/dtos/create-user.dto';
import { QueryUsersDto } from '@user/dtos/query-users.dto';
import { UpdateUserDto } from '@user/dtos/update-user.dto';
import { User } from '@user/entities/user.entity';
import { UserRepository } from '@user/repositories/user.repository';
import { Base64Image, Email, Name, Password, PhoneNumber, ProfileImageUrl, Uuid } from '@vo/index';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private static readonly saltRounds = 10;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
  ) {}

  private async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, UserService.saltRounds);
  }

  async uploadProfileImage(id: Uuid, base64String: string): Promise<string> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const base64Image = new Base64Image(base64String);
    const key = `profile-images/${id}.jpg`;

    const { url } = await this.s3Service.uploadBase64Image(key, base64Image, base64Image.mimeType);

    user.updatedAt = new Date();

    await this.userRepository.update(user);

    return url;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findByEmail(new Email(createUserDto.email));
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);
    const passwordVo = new Password(hashedPassword, { isHashed: true });

    const now = new Date();

    const user = new User({
      id: new Uuid(uuidv4()),
      name: new Name(createUserDto.name),
      email: new Email(createUserDto.email),
      password: passwordVo,
      phone: new PhoneNumber(createUserDto.phone),
      role: createUserDto.role,
      status: Status.ACTIVE,
      createdAt: now,
      updatedAt: now,
    });

    await this.userRepository.create(user);

    if (createUserDto.profileImageBase64) {
      const base64Image = new Base64Image(createUserDto.profileImageBase64);

      const extension = base64Image.mimeType.split('/')[1];
      const originalsFolder = this.s3Service.getUsersOriginalsFolder();
      const key = `${originalsFolder}/${user.id.value}.${extension}`;

      const { url } = await this.s3Service.uploadBase64Image(
        key,
        base64Image,
        base64Image.mimeType,
      );

      user.profileImageUrl = new ProfileImageUrl(url);
      user.updatedAt = new Date();
      await this.userRepository.update(user);
    }

    return user;
  }

  async findById(id: Uuid): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: Email): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async update(id: Uuid, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email.value) {
      const emailExists = await this.findByEmail(new Email(updateUserDto.email));
      if (emailExists && emailExists.id.value !== id.value) {
        throw new BadRequestException('Email already in use');
      }
    }

    const updatedUser = new User({
      id: user.id,
      name: updateUserDto.name ? new Name(updateUserDto.name) : user.name,
      email: updateUserDto.email ? new Email(updateUserDto.email) : user.email,
      password: updateUserDto.password
        ? new Password(await this.hashPassword(updateUserDto.password), { isHashed: true })
        : user.password,
      phone: updateUserDto.phone ? new PhoneNumber(updateUserDto.phone) : user.phone,
      role: updateUserDto.role ? updateUserDto.role : user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: new Date(),
    });

    await this.userRepository.update(updatedUser);
    return updatedUser;
  }

  async softDelete(id: Uuid): Promise<void> {
    const user = await this.findById(id);

    if (user.status === Status.INACTIVE) {
      throw new BadRequestException('User is already inactive');
    }

    await this.userRepository.softDelete(id);
  }

  async findAll(query: QueryUsersDto): Promise<{ items: User[]; lastEvaluatedKey?: string }> {
    return this.userRepository.findAll(query);
  }
}
