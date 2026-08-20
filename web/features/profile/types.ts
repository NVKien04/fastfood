import { z } from 'zod';
import { profileSchema } from './utils/profile.schema';
import { UserResponseDto } from '@/services/apis/main/generated/data-contracts';

export type ProfileFormValues = z.infer<typeof profileSchema>;

export type { UserResponseDto };
