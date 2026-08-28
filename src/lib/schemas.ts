import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້').trim(),
  password: z.string().min(1, 'ກະລຸນາປ້ອນລະຫັດຜ່ານ'),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'ຊື່ຜູ້ໃຊ້ຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ')
    .max(30, 'ຊື່ຜູ້ໃຊ້ຕ້ອງບໍ່ເກີນ 30 ຕົວອັກສອນ')
    .regex(/^[a-zA-Z0-9_]+$/, 'ຊື່ຜູ້ໃຊ້ສາມາດໃຊ້ໄດ້ສະເພາະ a-z, 0-9 ແລະ _')
    .trim(),
  name: z.string().min(1, 'ກະລຸນາປ້ອນຊື່ສະແດງ').max(100).trim(),
  password: z.string().min(6, 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ'),
  city: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().optional(),
  coverImage: z.string().optional(),
  interests: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  bio: z.string().max(500).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  avatar: z.string().optional(),
  coverImage: z.string().optional().nullable(),
  languages: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  settings: z
    .object({
      profileVisibility: z.enum(['public', 'friends', 'private']).optional(),
      postVisibility: z.enum(['public', 'friends', 'private']).optional(),
      whoCanSendRequests: z.enum(['everyone', 'friends_of_friends', 'none']).optional(),
      pushNotifications: z.boolean().optional(),
      messageNotifications: z.boolean().optional(),
      socialNotifications: z.boolean().optional(),
    })
    .optional(),
});

export const postCreateSchema = z.object({
  content: z.string().min(1, 'ກະລຸນາປ້ອນເນື້ອຫາໂພສ').max(5000, 'ເນື້ອຫາໂພສຍາວເກີນໄປ').trim(),
  mediaUrl: z.string().optional().nullable(),
  mediaType: z.enum(['image', 'video']).optional().nullable(),
});

export const commentCreateSchema = z.object({
  content: z.string().min(1, 'ກະລຸນາປ້ອນເນື້ອຫາຄອມເມັ້ນ').max(1000, 'ຄອມເມັ້ນຍາວເກີນໄປ').trim(),
});

export const friendRequestSchema = z.object({
  targetUserId: z.string().min(1, 'Invalid target user ID'),
});

export const messageSendSchema = z.object({
  content: z.string().min(1, 'ກະລຸນາປ້ອນຂໍ້ຄວາມ').max(5000).trim(),
  type: z.enum(['text', 'voice', 'image']).default('text'),
  mediaUrl: z.string().optional().nullable(),
  duration: z.number().int().min(0).max(600).optional().nullable(),
  replyToId: z.string().optional().nullable(),
});

export const reportCreateSchema = z.object({
  targetType: z.enum(['user', 'post', 'comment', 'message']),
  targetId: z.string().min(1),
  reason: z.string().min(1, 'ກະລຸນາລະບຸເຫດຜົນ').max(200),
  details: z.string().max(1000).optional().nullable(),
});
