import { httpClient } from "@/shared/lib/api/httpClient";
import type { RegisterInput, RegisterResponse } from "../types/types";

export async function register(input: RegisterInput): Promise<RegisterResponse> {
  const res = await httpClient.post('/auth/register', input)
  return res.data
}
