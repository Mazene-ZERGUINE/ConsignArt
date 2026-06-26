/**
 * Throws an exception when the database driver is not supported only uses (sqlite or postgres)
 */

export class UnsupportedDatabaseTypeException extends Error {
  constructor(driver: string) {
    super(`Unsupported database driver: ${driver} app only support postgres and sqlite`);
  }
}
