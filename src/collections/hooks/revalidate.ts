import { revalidatePath } from 'next/cache';

export const revalidateHomepage = () => {
  try {
    revalidatePath('/');
  } catch {
    // Invariant when called outside Next.js request context (e.g. CLI import/build)
  }
};
