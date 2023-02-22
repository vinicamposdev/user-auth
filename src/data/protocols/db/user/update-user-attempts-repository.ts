export interface UpdateUserAttemptsRepository {
  updateAttempts: (id: string, attempts: number) => Promise<void>
}
