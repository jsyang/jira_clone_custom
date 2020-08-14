import { Project, User } from 'entities';
import { ProjectCategory } from 'constants/projects';
import { createEntity, getAllOfEntity } from 'utils/typeorm';

// jsyang: unknown person avatar
const AVATAR_URL_UNKNOWN = 'https://i.imgur.com/WudkGQb.jpg';

const seedUsers = async (): Promise<User[]> => {
  const allUsers = await getAllOfEntity(User);

  if (allUsers.length === 0) {
    return Promise.all([
      createEntity(User, {
        email: 'jim@completed.delivery',
        name: 'Jim @ CD',
        password: 'jimcompleteddelivery',
        avatarUrl: 'https://i.ibb.co/7JM1P2r/picke-rick.jpg',
        privilegeLevel: 1,
      }),
      createEntity(User, {
        email: 'dave@completed.delivery',
        name: 'Dave @ CD',
        password: 'davecompleteddelivery',
        avatarUrl: 'https://i.ibb.co/6n0hLML/baby-yoda.jpg',
        privilegeLevel: 1,
      }),
      createEntity(User, {
        email: 'guest@end.user',
        name: 'Guest User',
        avatarUrl: AVATAR_URL_UNKNOWN,
        privilegeLevel: 0,
      }),
    ]);
  }

  return allUsers;
};

const seedProject = async (users: User[]): Promise<Project> => {
  const allProjects = await getAllOfEntity(Project);

  if (allProjects.length > 0) {
    return allProjects[0]; // jsyang: only use 1 project at the moment
  }

  return createEntity(Project, {
    name: 'singularity 1.0',
    url: 'https://completed.delivery',
    description: 'Fast iteration + Speedy code = Happy customers',
    category: ProjectCategory.SOFTWARE,
    users,
  });
};

const createGuestAccount = async (): Promise<User> => {
  const users = await seedUsers();
  await seedProject(users);

  return users.find(u => u.privilegeLevel === 0)!;
};

export default createGuestAccount;
