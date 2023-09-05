import {
  User as _User,
  UserPermission as _UserPermission,
} from '@prisma/client';

export type User = _User;
export type UserPermissionType = _UserPermission;
export const UserPermission = _UserPermission;
