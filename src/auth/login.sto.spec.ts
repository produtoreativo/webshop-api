import { plainToInstance } from 'class-transformer';
import { LoginDto } from './login.dto';
import { validate } from 'class-validator';

describe('LoginDTO', () => {
  it('Should not be empty', async () => {
    const plainDto = { username: 'user@host.com', password: 'pass' };
    const dto = plainToInstance(LoginDto, plainDto);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
