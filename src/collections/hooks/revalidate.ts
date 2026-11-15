import { revalidatePath } from 'next/cache';

export const revalidateHomepage = () => {
  try {
    revalidatePath('/');
  } catch (err) {
    console.error('Failed to revalidate path /:', err);
  }
};
