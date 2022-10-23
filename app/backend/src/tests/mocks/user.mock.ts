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

export {
  admin,
  user
}
