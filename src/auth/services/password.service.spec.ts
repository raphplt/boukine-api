import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    service = new PasswordService();
  });

  it('hashes a password and verifies it successfully', async () => {
    const hash = await service.hash('StrongP@ssw0rd');

    expect(hash).toBeDefined();
    expect(hash).not.toEqual('StrongP@ssw0rd');
    await expect(service.verify(hash, 'StrongP@ssw0rd')).resolves.toBe(true);
  });

  it('fails verification when password is incorrect', async () => {
    const hash = await service.hash('StrongP@ssw0rd');

    await expect(service.verify(hash, 'WrongPassword')).resolves.toBe(false);
  });

  it('returns false when hash is empty', async () => {
    await expect(service.verify('', 'StrongP@ssw0rd')).resolves.toBe(false);
  });
});
