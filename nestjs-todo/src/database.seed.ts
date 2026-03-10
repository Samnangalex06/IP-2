import { DataSource } from 'typeorm';
import { User } from './modules/user/user.entity';

export async function seedDatabase(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  // Check if default user exists
  const existingUser = await userRepository.findOne({ where: { id: 1 } });

  if (!existingUser) {
    const defaultUser = userRepository.create({
      username: 'default',
      email: 'default@example.com',
      password: 'password123', // In production, this should be hashed
    });
    await userRepository.save(defaultUser);
    console.log('Default user created');
  }
}
