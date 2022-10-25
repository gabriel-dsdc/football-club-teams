const admin = {
    validAdmin: {
      id: 1,
      username: 'Admin',
      role: 'admin',
      email: 'admin@admin.com',
      password: 'secret_admin',
    },
    invalidAdmin: {
      id: 1,
      username: 'Admin',
      role: 'undefined',
      email: 'admin@xablau.com',
      password: 'senha_invalida',
    },
  };

const user = {
    dbUser: {
      id: 2,
      username: 'User',
      role: 'user',
      email: 'user@user.com',
      password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO', // secret_user
    },
    validUser: {
      email: 'user@user.com',
      password: 'secret_user', // secret_user
    },
    invalidUser: {
      email: 'user@xablau.com',
      password: 'senha_invalida',
    },
  };

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJVc2VyIiwicm9sZSI6InVzZXIiLCJlbWFpbCI6InVzZXJAdXNlci5jb20iLCJwYXNzd29yZCI6IiQyYSQwOCRZOEFiaThqWHZzWHlxbS5ybXAwQi51UUJBNXFVejdUNkdobGcvQ3ZWci9nTHhZajVVQVpWTyIsImlhdCI6MTY2NjY3NzM5M30.EFPexx1S_0KPSoDBuOAY-ThxQX3UvJbIkJvN3EhUaj0';

export {
  admin,
  user,
  token
}
